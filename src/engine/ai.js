/**
 * Ares Expedition AI Agent
 * Evaluates board state, chooses strategic phases, plays cards and triggers actions.
 */

import { PHASES, GLOBAL_PARAMS } from './types.js';

export class AresBot {
  constructor(player, engine) {
    this.player = player;
    this.engine = engine;
  }

  /**
   * Decide which phase to select during Planning Step
   */
  choosePhase() {
    const validPhases = [1, 2, 3, 4, 5].filter(p => p !== this.player.lastSelectedPhase);
    const scores = {};

    for (const phaseId of validPhases) {
      scores[phaseId] = this.evaluatePhase(phaseId);
    }

    // Pick highest scored phase
    let bestPhase = validPhases[0];
    let maxScore = -Infinity;
    for (const phaseId of validPhases) {
      if (scores[phaseId] > maxScore) {
        maxScore = scores[phaseId];
        bestPhase = phaseId;
      }
    }

    this.player.selectedPhase = bestPhase;
    return bestPhase;
  }

  evaluatePhase(phaseId) {
    let score = 0;
    const hand = this.player.hand;
    const res = this.player.resources;
    const prod = this.player.production;

    switch (phaseId) {
      case 1: { // Development (Green)
        const playableGreen = hand.filter(c => c.type === 'green' && this.engine.canPlayCard(c, this.player, 1).canPlay);
        score = playableGreen.length * 15;
        // Bonus discount makes cards easier to play
        if (playableGreen.length > 0) score += 10;
        break;
      }
      case 2: { // Construction (Blue/Red)
        const playableBlueRed = hand.filter(c => (c.type === 'blue' || c.type === 'red') && this.engine.canPlayCard(c, this.player, 2).canPlay);
        score = playableBlueRed.length * 14;
        if (playableBlueRed.length >= 2) score += 15; // Can use Phase II bonus to play 2 cards!
        break;
      }
      case 3: { // Action
        // Blue cards in play with actions
        const blueCardsWithActions = this.player.playedCards.filter(c => c.action);
        score += blueCardsWithActions.length * 12;
        // Heat conversion (8 heat -> +1 temp)
        if (res.heat >= 8 && this.engine.global.temperature < GLOBAL_PARAMS.TEMPERATURE.max) score += 14;
        // Plant conversion (8 plants -> +1 forest)
        const plantCost = this.player.customStandardActionCosts?.forestPlants || 8;
        if (res.plants >= plantCost) score += 16;
        // Abundant MC for standard actions
        if (res.mc >= 15 && this.engine.global.oceansFlipped < GLOBAL_PARAMS.OCEANS.total) score += 8;
        break;
      }
      case 4: { // Production
        const totalProductionVal = prod.mc + prod.heat + prod.plants + (prod.cards * 3) + this.player.tr;
        score = totalProductionVal * 0.8;
        // Phase bonus gives +4 MC
        score += 8;
        // If low on MC, production is urgent
        if (res.mc < 10) score += 12;
        break;
      }
      case 5: { // Research
        const handSize = hand.length;
        if (handSize <= 2) score += 25;
        else if (handSize <= 4) score += 15;
        else score += 5;
        // Bonus allows keeping 2 out of 5 cards
        score += 10;
        break;
      }
    }

    // Add slight random jitter to prevent deterministic loops
    return score + (Math.random() * 2);
  }

  /**
   * Execute bot actions during active phase
   */
  takeTurnInPhase() {
    const phaseId = this.engine.phaseResolution.phaseId;

    if (phaseId === 1 || phaseId === 2) {
      this.playCardsInPhase(phaseId);
    } else if (phaseId === 3) {
      this.executeActionPhase();
    } else if (phaseId === 5) {
      this.executeResearchPhase();
    }

    this.engine.botPassPhase();
  }

  playCardsInPhase(phaseId) {
    let playsLeft = this.engine.phaseResolution.cardPlaysRemaining[this.player.id] || 0;

    while (playsLeft > 0) {
      const playable = this.player.hand
        .map(card => ({ card, check: this.engine.canPlayCard(card, this.player, phaseId) }))
        .filter(item => item.check.canPlay)
        .sort((a, b) => this.scoreCardForPlay(b.card) - this.scoreCardForPlay(a.card));

      if (playable.length === 0) break;

      const chosen = playable[0].card;
      try {
        this.engine.playCard(chosen.id, this.player);
      } catch (err) {
        break;
      }
      playsLeft = this.engine.phaseResolution.cardPlaysRemaining[this.player.id] || 0;
    }
  }

  scoreCardForPlay(card) {
    let val = 10;
    // Parameter raising is top priority
    if (card.effects?.temperature) val += card.effects.temperature * 15;
    if (card.effects?.oxygen) val += card.effects.oxygen * 15;
    if (card.effects?.ocean) val += card.effects.ocean * 18;
    if (card.effects?.tr) val += card.effects.tr * 14;

    // Production value
    if (card.effects?.production) {
      const p = card.effects.production;
      val += (p.mc || 0) * 4;
      val += (p.heat || 0) * 5;
      val += (p.plants || 0) * 6;
      val += (p.cards || 0) * 7;
    }

    // VP value
    if (card.vp) val += card.vp * 8;
    // Discounts
    if (card.permanentDiscounts) val += 12;

    return val;
  }

  executeActionPhase() {
    // 1. Activate Standard Actions
    // Plants -> Forest
    const plantCost = this.player.customStandardActionCosts?.forestPlants || 8;
    while (this.player.resources.plants >= plantCost) {
      this.engine.executeStandardAction('forest_plants', this.player);
    }

    // Heat -> Temperature
    while (this.player.resources.heat >= 8 && this.engine.global.temperature < GLOBAL_PARAMS.TEMPERATURE.max) {
      this.engine.executeStandardAction('temp_heat', this.player);
    }

    // Ocean with MC if ample funds
    if (this.player.resources.mc >= 25 && this.engine.global.oceansFlipped < GLOBAL_PARAMS.OCEANS.total) {
      this.engine.executeStandardAction('ocean_mc', this.player);
    }

    // 2. Activate Blue Card Actions
    for (const card of this.player.playedCards) {
      if (card.action) {
        const usesKey = `${this.player.id}_${card.id}`;
        const maxUses = (this.player.selectedPhase === 3) ? 2 : 1;
        let current = this.engine.phaseResolution.actionsUsed[usesKey] || 0;

        while (current < maxUses) {
          try {
            this.engine.activateCardAction(card.id, this.player);
            current++;
          } catch (e) {
            break;
          }
        }
      }
    }
  }

  executeResearchPhase() {
    const offer = this.engine.phaseResolution.researchOffered[this.player.id];
    if (!offer) return;

    // Rank offered cards
    const sorted = [...offer.cards].sort((a, b) => this.scoreCardForPlay(b) - this.scoreCardForPlay(a));
    const kept = sorted.slice(0, offer.keepCount).map(c => c.id);

    this.engine.completeResearch(this.player, kept);
  }
}
