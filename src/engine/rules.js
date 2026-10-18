/**
 * Core Rule Engine for Terraforming Mars: Ares Expedition
 * Rigid validation, state transitions, parameter tracks and scoring.
 */

import { PHASES, GLOBAL_PARAMS, STANDARD_ACTIONS } from './types.js';
import { PROJECT_CARDS } from '../data/cards.js';
import { CORPORATIONS } from '../data/corporations.js';

export class GameEngine {
  constructor(options = {}) {
    this.deck = this.shuffle([...PROJECT_CARDS]);
    this.discardPile = [];
    this.logs = [];

    this.round = 1;
    this.global = {
      temperature: GLOBAL_PARAMS.TEMPERATURE.min, // -30
      oxygen: GLOBAL_PARAMS.OXYGEN.min,           // 0
      oceansFlipped: 0,
      oceanTiles: GLOBAL_PARAMS.OCEANS.tiles.map(t => ({ ...t, flipped: false }))
    };

    this.players = [];
    this.activePhases = [];
    this.currentPhaseIndex = 0; // index in activePhases
    this.step = 'setup'; // 'setup', 'planning', 'resolution', 'round_end', 'game_over'
    this.isGameOver = false;
    this.finalScores = null;

    // Phase resolution state
    this.phaseResolution = {
      phaseId: null,
      playerDone: false,
      botDone: false,
      cardPlaysRemaining: {},
      actionsUsed: {}, // player: { cardId: count }
      researchOffered: {} // player: { cards: [], keepCount: 1 }
    };

    if (options.autoInit !== false) {
      this.initGame(options);
    }
  }

  log(msg) {
    this.logs.unshift({
      id: Math.random().toString(36).substring(2, 9),
      round: this.round,
      text: msg,
      time: new Date().toLocaleTimeString()
    });
    if (this.logs.length > 200) this.logs.pop();
  }

  shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  drawCard() {
    if (this.deck.length === 0) {
      if (this.discardPile.length === 0) return null;
      this.deck = this.shuffle(this.discardPile);
      this.discardPile = [];
      this.log('Mazzo rimescolato dagli scarti.');
    }
    return this.deck.pop();
  }

  drawCards(player, count) {
    const drawn = [];
    for (let i = 0; i < count; i++) {
      const c = this.drawCard();
      if (c) {
        player.hand.push(c);
        drawn.push(c);
      }
    }
    return drawn;
  }

  initGame({ playerCorpId = null, botCorpId = null } = {}) {
    const availableCorps = this.shuffle([...CORPORATIONS]);
    const p1Corp = playerCorpId 
      ? CORPORATIONS.find(c => c.id === playerCorpId) 
      : availableCorps.pop();
    const botCorp = botCorpId 
      ? CORPORATIONS.find(c => c.id === botCorpId) 
      : availableCorps.pop();

    this.players = [
      this.createPlayer('player', 'Comandante', false, p1Corp),
      this.createPlayer('bot', 'Ares Bot', true, botCorp)
    ];

    // Deal 8 cards each
    for (const p of this.players) {
      this.drawCards(p, 8);
    }

    this.log(`Partita iniziata! ${this.players[0].name} gioca con ${p1Corp.name}.`);
    this.log(`${this.players[1].name} gioca con ${botCorp.name}.`);

    this.step = 'planning';
  }

  createPlayer(id, name, isAI, corporation) {
    const p = {
      id,
      name,
      isAI,
      corporation,
      tr: 5, // Official Ares Expedition baseline
      forestTokens: 0,
      resources: {
        mc: corporation.startingMC,
        heat: corporation.startingResources.heat || 0,
        plants: corporation.startingResources.plants || 0,
        steel: corporation.startingResources.steel || 0,
        titanium: corporation.startingResources.titanium || 0
      },
      production: {
        mc: corporation.startingProduction.mc || 0,
        heat: corporation.startingProduction.heat || 0,
        plants: corporation.startingProduction.plants || 0,
        cards: corporation.startingProduction.cards || 0
      },
      hand: [],
      playedCards: [],
      cardTokens: {}, // e.g. { c019: 2 }
      selectedPhase: null,
      lastSelectedPhase: null
    };
    return p;
  }

  // --- PARAMETER BUMPS & BONUSES ---

  raiseTemperature(steps = 1, player) {
    let actualSteps = 0;
    for (let s = 0; s < steps; s++) {
      if (this.global.temperature >= GLOBAL_PARAMS.TEMPERATURE.max) break;
      this.global.temperature += GLOBAL_PARAMS.TEMPERATURE.step;
      actualSteps++;
      if (player) player.tr += 1;

      // Check threshold bonuses
      const bonus = GLOBAL_PARAMS.TEMPERATURE.bonuses[String(this.global.temperature)];
      if (bonus) {
        if (bonus.heatProd && player) {
          player.production.heat += bonus.heatProd;
          this.log(`Bonus Soglia Temperatura: ${player.name} riceve +${bonus.heatProd} Prod Calore.`);
        }
        if (bonus.ocean) {
          this.flipOcean(player);
        }
      }
    }
    if (actualSteps > 0 && player) {
      this.log(`${player.name} alza la Temperatura di ${actualSteps * 2}°C (ora a ${this.global.temperature}°C). +${actualSteps} TR.`);
    }
    this.checkGameEndCondition();
    return actualSteps;
  }

  raiseOxygen(steps = 1, player) {
    let actualSteps = 0;
    for (let s = 0; s < steps; s++) {
      if (this.global.oxygen >= GLOBAL_PARAMS.OXYGEN.max) break;
      this.global.oxygen += GLOBAL_PARAMS.OXYGEN.step;
      actualSteps++;
      if (player) player.tr += 1;

      // Check threshold bonuses
      const bonus = GLOBAL_PARAMS.OXYGEN.bonuses[String(this.global.oxygen)];
      if (bonus) {
        if (bonus.temperature) {
          this.log(`Bonus Soglia Ossigeno: Passo Temperatura gratuito!`);
          this.raiseTemperature(1, player);
        }
      }
    }
    if (actualSteps > 0 && player) {
      this.log(`${player.name} alza l'Ossigeno di ${actualSteps}% (ora a ${this.global.oxygen}%). +${actualSteps} TR.`);
    }
    this.checkGameEndCondition();
    return actualSteps;
  }

  flipOcean(player) {
    if (this.global.oceansFlipped >= GLOBAL_PARAMS.OCEANS.total) return null;
    const tile = this.global.oceanTiles.find(t => !t.flipped);
    if (!tile) return null;

    tile.flipped = true;
    this.global.oceansFlipped += 1;
    if (player) {
      player.tr += 1;
      // Apply tile bonus
      if (tile.bonus.plants) player.resources.plants += tile.bonus.plants;
      if (tile.bonus.mc) player.resources.mc += tile.bonus.mc;
      if (tile.bonus.heat) player.resources.heat += tile.bonus.heat;
      if (tile.bonus.plantProd) player.production.plants += tile.bonus.plantProd;
      if (tile.bonus.heatProd) player.production.heat += tile.bonus.heatProd;
      if (tile.bonus.card) this.drawCards(player, tile.bonus.card);

      this.log(`${player.name} gira una tessera Oceano (${this.global.oceansFlipped}/${GLOBAL_PARAMS.OCEANS.total}) ottenendo ${tile.label} e +1 TR.`);
    }
    this.checkGameEndCondition();
    return tile;
  }

  checkGameEndCondition() {
    const oceansDone = this.global.oceansFlipped >= GLOBAL_PARAMS.OCEANS.total;
    const tempDone = this.global.temperature >= GLOBAL_PARAMS.TEMPERATURE.max;
    const oxygenDone = this.global.oxygen >= GLOBAL_PARAMS.OXYGEN.max;

    if (oceansDone && tempDone && oxygenDone && !this.isGameOver) {
      this.log('ATTENZIONE: Marte è completamente terraformato! Il gioco terminerà alla fine di questo round.');
    }
  }

  // --- CARD PLAY VALIDATION & CALCULATION ---

  getPlayerTags(player) {
    const tags = {};
    // From corporation
    if (player.corporation && player.corporation.tags) {
      for (const t of player.corporation.tags) {
        tags[t] = (tags[t] || 0) + 1;
      }
    }
    // From played cards
    for (const c of player.playedCards) {
      if (c.tags) {
        for (const t of c.tags) {
          tags[t] = (tags[t] || 0) + 1;
        }
      }
    }
    return tags;
  }

  calculateCardCost(card, player, phaseId) {
    let cost = card.cost;

    // Phase I bonus: 3 MC discount if played in Phase I and player selected it
    if (phaseId === 1 && player.selectedPhase === 1) {
      cost = Math.max(0, cost - 3);
    }

    // Permanent tag discounts
    const tags = card.tags || [];
    for (const c of player.playedCards) {
      if (c.permanentDiscounts) {
        if (c.permanentDiscounts.all) cost -= c.permanentDiscounts.all;
        for (const tag of tags) {
          if (c.permanentDiscounts[tag]) cost -= c.permanentDiscounts[tag];
        }
      }
    }
    // Corporation discounts
    if (player.corporation?.tagDiscounts) {
      for (const tag of tags) {
        if (player.corporation.tagDiscounts[tag]) {
          cost -= player.corporation.tagDiscounts[tag];
        }
      }
    }
    cost = Math.max(0, cost);

    // Calculate maximum applicable metal discounts
    let steelVal = 2 + (player.corporation?.steelValueBonus || 0);
    let titaniumVal = 3 + (player.corporation?.titaniumValueBonus || 0);

    let maxSteelDiscount = 0;
    if (tags.includes('building') && (player.resources.steel || 0) > 0) {
      let neededSteel = Math.ceil(cost / steelVal);
      let steelToUse = Math.min(neededSteel, player.resources.steel);
      maxSteelDiscount = steelToUse * steelVal;
    }

    let maxTitaniumDiscount = 0;
    if (tags.includes('space') && (player.resources.titanium || 0) > 0) {
      let remainingAfterSteel = Math.max(0, cost - maxSteelDiscount);
      let neededTi = Math.ceil(remainingAfterSteel / titaniumVal);
      let tiToUse = Math.min(neededTi, player.resources.titanium);
      maxTitaniumDiscount = tiToUse * titaniumVal;
    }

    let minPayableMC = Math.max(0, cost - maxSteelDiscount - maxTitaniumDiscount);

    return {
      baseCost: card.cost,
      effectiveCost: cost,
      maxSteelDiscount,
      maxTitaniumDiscount,
      minPayableMC,
      steelVal,
      titaniumVal
    };
  }

  canPlayCard(card, player, phaseId) {
    // 1. Phase type check
    const phase = Object.values(PHASES).find(p => p.id === phaseId);
    if (!phase || !phase.allowedCardTypes.includes(card.type)) {
      return { canPlay: false, reason: `Tipo carta ${card.type} non consentito nella Fase ${phase?.nameIt || phaseId}` };
    }

    // 2. Plays remaining in this phase
    const playsLeft = this.phaseResolution.cardPlaysRemaining[player.id] ?? 0;
    if (playsLeft <= 0) {
      return { canPlay: false, reason: 'Nessuna giocata di carte rimasta per questa fase.' };
    }

    // 3. Global Requirements check
    const buffer = player.corporation?.requirementBuffer || 0;
    if (card.requirements) {
      const { minTemperature, maxTemperature, minOxygen, maxOxygen, minOceans, maxOceans, requiredTags } = card.requirements;
      if (minTemperature !== undefined && this.global.temperature < minTemperature - (buffer * 2)) {
        return { canPlay: false, reason: `Temperatura richiesta: >= ${minTemperature}°C` };
      }
      if (maxTemperature !== undefined && this.global.temperature > maxTemperature + (buffer * 2)) {
        return { canPlay: false, reason: `Temperatura massima consentita: <= ${maxTemperature}°C` };
      }
      if (minOxygen !== undefined && this.global.oxygen < minOxygen - buffer) {
        return { canPlay: false, reason: `Ossigeno richiesto: >= ${minOxygen}%` };
      }
      if (maxOxygen !== undefined && this.global.oxygen > maxOxygen + buffer) {
        return { canPlay: false, reason: `Ossigeno massimo consentito: <= ${maxOxygen}%` };
      }
      if (minOceans !== undefined && this.global.oceansFlipped < minOceans - buffer) {
        return { canPlay: false, reason: `Oceani richiesti: >= ${minOceans}` };
      }
      if (maxOceans !== undefined && this.global.oceansFlipped > maxOceans + buffer) {
        return { canPlay: false, reason: `Oceani massimi consentiti: <= ${maxOceans}` };
      }
      if (requiredTags) {
        const playerTags = this.getPlayerTags(player);
        for (const [tag, count] of Object.entries(requiredTags)) {
          if ((playerTags[tag] || 0) < count) {
            return { canPlay: false, reason: `Tag richiesti: ${count} ${tag}` };
          }
        }
      }
    }

    // 4. Resource / Cost check
    const costCalc = this.calculateCardCost(card, player, phaseId);
    const availableFunds = player.resources.mc + (player.corporation?.heatAsMC ? player.resources.heat : 0);
    if (availableFunds < costCalc.minPayableMC) {
      return { canPlay: false, reason: `MC insufficienti (Servono ${costCalc.minPayableMC} MC dopo sconti, hai ${availableFunds})` };
    }

    return { canPlay: true, costCalc };
  }

  playCard(cardId, player, { steelUsed = null, titaniumUsed = null } = {}) {
    const cardIndex = player.hand.findIndex(c => c.id === cardId);
    if (cardIndex === -1) throw new Error('Carta non presente nella mano del giocatore.');
    const card = player.hand[cardIndex];

    const validation = this.canPlayCard(card, player, this.phaseResolution.phaseId);
    if (!validation.canPlay) {
      throw new Error(`Impossibile giocare la carta: ${validation.reason}`);
    }

    const costCalc = validation.costCalc;
    let remainingCost = costCalc.effectiveCost;

    // Calculate steel to deduct
    let actualSteelUsed = 0;
    if (card.tags?.includes('building') && (player.resources.steel || 0) > 0) {
      let maxSteel = Math.min(player.resources.steel, Math.ceil(remainingCost / costCalc.steelVal));
      actualSteelUsed = steelUsed !== null ? Math.min(steelUsed, maxSteel) : maxSteel;
      let steelDiscount = actualSteelUsed * costCalc.steelVal;
      remainingCost = Math.max(0, remainingCost - steelDiscount);
      player.resources.steel -= actualSteelUsed;
    }

    // Calculate titanium to deduct
    let actualTiUsed = 0;
    if (card.tags?.includes('space') && (player.resources.titanium || 0) > 0) {
      let maxTi = Math.min(player.resources.titanium, Math.ceil(remainingCost / costCalc.titaniumVal));
      actualTiUsed = titaniumUsed !== null ? Math.min(titaniumUsed, maxTi) : maxTi;
      let tiDiscount = actualTiUsed * costCalc.titaniumVal;
      remainingCost = Math.max(0, remainingCost - tiDiscount);
      player.resources.titanium -= actualTiUsed;
    }

    // Deduct MC (or Heat if Helion)
    if (player.resources.mc >= remainingCost) {
      player.resources.mc -= remainingCost;
    } else if (player.corporation?.heatAsMC) {
      let diff = remainingCost - player.resources.mc;
      player.resources.mc = 0;
      player.resources.heat -= diff;
    }

    // Remove from hand and add to played cards
    player.hand.splice(cardIndex, 1);
    player.playedCards.push(card);
    this.phaseResolution.cardPlaysRemaining[player.id] -= 1;

    this.log(`${player.name} gioca ${card.name} (Costo effettivo: ${remainingCost} MC, Acciaio: ${actualSteelUsed}, Titanio: ${actualTiUsed}).`);

    // Apply immediate effects
    if (card.effects) {
      const eff = card.effects;
      if (eff.mc) player.resources.mc += eff.mc;
      if (eff.heat) player.resources.heat += eff.heat;
      if (eff.plants) player.resources.plants += eff.plants;
      if (eff.steel) player.resources.steel = (player.resources.steel || 0) + eff.steel;
      if (eff.titanium) player.resources.titanium = (player.resources.titanium || 0) + eff.titanium;
      if (eff.tr) player.tr += eff.tr;

      if (eff.production) {
        if (eff.production.mc) player.production.mc += eff.production.mc;
        if (eff.production.heat) player.production.heat += eff.production.heat;
        if (eff.production.plants) player.production.plants += eff.production.plants;
        if (eff.production.cards) player.production.cards += eff.production.cards;
      }

      if (eff.productionPerTag) {
        const tag = eff.productionPerTag.tag;
        const res = eff.productionPerTag.resource;
        const count = this.getPlayerTags(player)[tag] || 0;
        player.production[res] = (player.production[res] || 0) + (count * eff.productionPerTag.amount);
      }

      if (eff.cards) this.drawCards(player, eff.cards);
      if (eff.temperature) this.raiseTemperature(eff.temperature, player);
      if (eff.oxygen) this.raiseOxygen(eff.oxygen, player);
      if (eff.ocean) this.flipOcean(player);
    }

    // Triggers from corporation & played blue cards
    if (player.corporation?.onCardPlayed) {
      player.corporation.onCardPlayed(card, player, this);
    }
    for (const pc of player.playedCards) {
      if (pc.trigger && pc.trigger.event === 'cardPlayed' && pc.id !== card.id) {
        if (pc.trigger.condition(card)) {
          pc.trigger.effect(player, this, card);
        }
      }
    }

    return card;
  }

  sellCard(cardId, player) {
    const idx = player.hand.findIndex(c => c.id === cardId);
    if (idx === -1) throw new Error('Carta non trovata nella mano.');
    const card = player.hand.splice(idx, 1)[0];
    this.discardPile.push(card);
    player.resources.mc += 3;
    this.log(`${player.name} scarta ${card.name} e guadagna 3 MC.`);
    return card;
  }

  // --- STANDARD ACTIONS (PHASE III) ---

  executeStandardAction(actionId, player) {
    const act = STANDARD_ACTIONS.find(a => a.id === actionId);
    if (!act) throw new Error('Azione standard sconosciuta.');
    if (!act.canExecute(player, this.global)) {
      throw new Error(`Risorse insufficienti o parametro al massimo per ${act.name}.`);
    }

    switch (actionId) {
      case 'forest_plants': {
        const cost = player.customStandardActionCosts?.forestPlants || 8;
        player.resources.plants -= cost;
        player.forestTokens += 1;
        this.log(`${player.name} usa Azione Standard Foresta (-${cost} piante, +1 Tessera Foresta PV).`);
        this.raiseOxygen(1, player);
        break;
      }
      case 'temp_heat': {
        player.resources.heat -= 8;
        this.log(`${player.name} usa Azione Standard Temperatura (-8 calore).`);
        this.raiseTemperature(1, player);
        break;
      }
      case 'ocean_mc': {
        player.resources.mc -= 15;
        this.log(`${player.name} usa Azione Standard Oceano (-15 MC).`);
        this.flipOcean(player);
        break;
      }
      case 'temp_mc': {
        player.resources.mc -= 14;
        this.log(`${player.name} usa Azione Standard Temperatura con MC (-14 MC).`);
        this.raiseTemperature(1, player);
        break;
      }
      case 'forest_mc': {
        player.resources.mc -= 20;
        player.forestTokens += 1;
        this.log(`${player.name} usa Azione Standard Foresta con MC (-20 MC, +1 Tessera Foresta PV).`);
        this.raiseOxygen(1, player);
        break;
      }
    }
  }

  // --- BLUE CARD ACTIONS (PHASE III) ---

  activateCardAction(cardId, player, optionIndex = 0) {
    const card = player.playedCards.find(c => c.id === cardId);
    if (!card || !card.action) throw new Error('Carta con azione non trovata.');

    const usesKey = `${player.id}_${cardId}`;
    const maxUses = (player.selectedPhase === 3) ? 2 : 1; // Bonus for choosing Phase III
    const currentUses = this.phaseResolution.actionsUsed[usesKey] || 0;

    if (currentUses >= maxUses) {
      throw new Error(`Azione di ${card.name} già attivata il massimo consentito (${currentUses}/${maxUses}).`);
    }

    const act = card.action;
    if (act.cost) {
      if (act.cost.mc && player.resources.mc < act.cost.mc) throw new Error('MC insufficienti per attivare l\'azione.');
      if (act.cost.heat && player.resources.heat < act.cost.heat) throw new Error('Calore insufficiente.');
      if (act.cost.plants && player.resources.plants < act.cost.plants) throw new Error('Piante insufficienti.');
      if (act.cost.steel && (player.resources.steel || 0) < act.cost.steel) throw new Error('Acciaio insufficiente.');
      if (act.cost.titanium && (player.resources.titanium || 0) < act.cost.titanium) throw new Error('Titanio insufficiente.');

      if (act.cost.mc) player.resources.mc -= act.cost.mc;
      if (act.cost.heat) player.resources.heat -= act.cost.heat;
      if (act.cost.plants) player.resources.plants -= act.cost.plants;
      if (act.cost.steel) player.resources.steel -= act.cost.steel;
      if (act.cost.titanium) player.resources.titanium -= act.cost.titanium;
    }

    if (act.options) {
      const opt = act.options[optionIndex];
      if (!opt || (opt.canUse && !opt.canUse(player, this.global))) {
        throw new Error('Opzione azione non valida.');
      }
      opt.execute(player, this);
    } else if (act.effect) {
      act.effect(player, this);
    }

    this.phaseResolution.actionsUsed[usesKey] = currentUses + 1;
    this.log(`${player.name} attiva l'azione di ${card.name}.`);
  }

  // --- ROUND & PHASE MANAGEMENT ---

  setPhaseChoice(playerId, phaseId) {
    const player = this.players.find(p => p.id === playerId);
    if (!player) throw new Error('Giocatore non trovato.');

    if (player.lastSelectedPhase === phaseId) {
      throw new Error(`Non puoi scegliere la stessa fase (${phaseId}) due volte consecutive.`);
    }

    player.selectedPhase = phaseId;
  }

  startResolution() {
    // Gather chosen phases
    const selected = new Set();
    for (const p of this.players) {
      if (p.selectedPhase) selected.add(p.selectedPhase);
    }
    this.activePhases = Array.from(selected).sort((a, b) => a - b);
    this.currentPhaseIndex = 0;
    this.step = 'resolution';

    const p1 = this.players[0];
    const bot = this.players[1];
    this.log(`Fasi rivelate! ${p1.name}: Fase ${p1.selectedPhase} (${PHASES[Object.keys(PHASES)[p1.selectedPhase - 1]].nameIt}). ${bot.name}: Fase ${bot.selectedPhase} (${PHASES[Object.keys(PHASES)[bot.selectedPhase - 1]].nameIt}).`);
    this.log(`Fasi attive per questo round: ${this.activePhases.map(ph => 'Fase ' + ph).join(', ')}.`);

    this.setupCurrentPhase();
  }

  setupCurrentPhase() {
    if (this.currentPhaseIndex >= this.activePhases.length) {
      this.endRound();
      return;
    }

    const phaseId = this.activePhases[this.currentPhaseIndex];
    this.phaseResolution = {
      phaseId,
      playerDone: false,
      botDone: false,
      cardPlaysRemaining: {},
      actionsUsed: {},
      researchOffered: {}
    };

    const phaseConfig = Object.values(PHASES).find(p => p.id === phaseId);
    this.log(`--- Inizio Risoluzione FASE ${phaseId}: ${phaseConfig.nameIt.toUpperCase()} ---`);

    // Setup each player for this phase
    for (const p of this.players) {
      const isChooser = p.selectedPhase === phaseId;

      if (phaseId === 1) { // Development
        this.phaseResolution.cardPlaysRemaining[p.id] = 1;
      } else if (phaseId === 2) { // Construction
        this.phaseResolution.cardPlaysRemaining[p.id] = isChooser ? 2 : 1;
        // In Ares Expedition, Construction bonus gives EITHER 1 extra play OR draw 1 card.
        // We initialize with 2 plays if chooser, and allow drawing 1 card as an action option
      } else if (phaseId === 4) { // Production
        // Instant resolution of production
        this.resolveProduction(p, isChooser);
      } else if (phaseId === 5) { // Research
        const drawCount = isChooser ? 5 : 2;
        const keepCount = isChooser ? 2 : 1;
        const drawn = [];
        for (let i = 0; i < drawCount; i++) {
          const c = this.drawCard();
          if (c) drawn.push(c);
        }
        this.phaseResolution.researchOffered[p.id] = { cards: drawn, keepCount };
      }
    }

    if (phaseId === 4) {
      // Production resolves instantly for both
      this.nextPhase();
    }
  }

  resolveProduction(player, isChooser) {
    const mcEarned = player.tr + player.production.mc + (isChooser ? 4 : 0);
    const heatEarned = player.production.heat;
    const plantsEarned = player.production.plants;
    const cardsDrawn = player.production.cards;

    player.resources.mc += mcEarned;
    player.resources.heat += heatEarned;
    player.resources.plants += plantsEarned;
    if (cardsDrawn > 0) this.drawCards(player, cardsDrawn);

    this.log(`${player.name} produce: +${mcEarned} MC (${player.tr} TR + ${player.production.mc} Prod ${isChooser ? '+4 Bonus' : ''}), +${heatEarned} Calore, +${plantsEarned} Piante, +${cardsDrawn} Carte.`);
  }

  completeResearch(player, keptCardIds) {
    const offer = this.phaseResolution.researchOffered[player.id];
    if (!offer) throw new Error('Nessuna ricerca attiva per questo giocatore.');

    if (keptCardIds.length !== offer.keepCount) {
      throw new Error(`Devi tenere esattamente ${offer.keepCount} carte.`);
    }

    for (const card of offer.cards) {
      if (keptCardIds.includes(card.id)) {
        player.hand.push(card);
      } else {
        this.discardPile.push(card);
      }
    }

    this.log(`${player.name} completa la Ricerca tenendo ${offer.keepCount} carte.`);
    delete this.phaseResolution.researchOffered[player.id];

    if (player.id === 'player') {
      this.phaseResolution.playerDone = true;
    } else {
      this.phaseResolution.botDone = true;
    }
    this.checkPhaseCompletion();
  }

  playerPassPhase() {
    this.phaseResolution.playerDone = true;
    this.checkPhaseCompletion();
  }

  botPassPhase() {
    this.phaseResolution.botDone = true;
    this.checkPhaseCompletion();
  }

  checkPhaseCompletion() {
    if (this.phaseResolution.playerDone && this.phaseResolution.botDone) {
      this.nextPhase();
    }
  }

  nextPhase() {
    this.currentPhaseIndex += 1;
    this.setupCurrentPhase();
  }

  endRound() {
    this.log(`--- Fine Round ${this.round} ---`);

    // Check if end game triggered
    const oceansDone = this.global.oceansFlipped >= GLOBAL_PARAMS.OCEANS.total;
    const tempDone = this.global.temperature >= GLOBAL_PARAMS.TEMPERATURE.max;
    const oxygenDone = this.global.oxygen >= GLOBAL_PARAMS.OXYGEN.max;

    if (oceansDone && tempDone && oxygenDone) {
      this.step = 'game_over';
      this.isGameOver = true;
      this.calculateFinalScores();
      return;
    }

    // Prepare next round
    for (const p of this.players) {
      p.lastSelectedPhase = p.selectedPhase;
      p.selectedPhase = null;
    }

    this.round += 1;
    this.step = 'planning';
    this.log(`Inizio Round ${this.round}! Seleziona la tua fase.`);
  }

  calculateFinalScores() {
    this.finalScores = this.players.map(p => {
      let cardVp = 0;
      for (const c of p.playedCards) {
        if (typeof c.vp === 'number') cardVp += c.vp;
        if (typeof c.vpCalculator === 'function') cardVp += c.vpCalculator(p);
      }

      const total = p.tr + p.forestTokens + cardVp;
      return {
        playerId: p.id,
        name: p.name,
        corporation: p.corporation.name,
        tr: p.tr,
        forestVp: p.forestTokens,
        cardVp,
        totalVp: total,
        mc: p.resources.mc
      };
    });

    // Sort by Total VP, tiebreak by MC
    this.finalScores.sort((a, b) => b.totalVp - a.totalVp || b.mc - a.mc);
    const winner = this.finalScores[0];
    this.log(`PARTITA TERMINATA! Vincitore: ${winner.name} con ${winner.totalVp} Punti Vittoria!`);
  }
}
