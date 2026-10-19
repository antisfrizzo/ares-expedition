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
    const corp = this.player.corporation;
    const played = this.player.playedCards;
    const round = this.engine.round || 1;
    const global = this.engine.global;

    switch (phaseId) {
      case 1: { // Development (Green cards)
        const greenCards = hand.filter(c => c.type === 'green');
        if (greenCards.length === 0) {
          score = 0;
          break;
        }

        // Check playable cards factoring in Phase 1 discount (-3 MC)
        const playableGreen = greenCards.filter(c => this.engine.canPlayCard(c, this.player, 1).canPlay);
        const almostPlayableGreen = greenCards.filter(c => {
          if (playableGreen.includes(c)) return false;
          const costCalc = this.engine.calculateCardCost(c, this.player, 1);
          return (res.mc + 3) >= costCalc.minPayableMC;
        });

        if (playableGreen.length > 0 || almostPlayableGreen.length > 0) {
          // Base motivation to build economic engine
          score += 26;

          // Value of best green card
          const allOptions = [...playableGreen, ...almostPlayableGreen];
          let bestCardScore = 0;
          for (const card of allOptions) {
            const cardVal = this.scoreCardForPlay(card);
            if (cardVal > bestCardScore) bestCardScore = cardVal;
          }
          score += Math.min(25, bestCardScore * 0.45);

          // Early game engine building bonus (Rounds 1-6)
          if (round <= 6) score += 12;

          // Corporation synergies
          if (corp?.id === 'ecoline') score += 10;
          if (corp?.id === 'mining_guild') score += 8;
        } else {
          score = 4;
        }
        break;
      }

      case 2: { // Construction (Blue & Red cards)
        const blueRedCards = hand.filter(c => c.type === 'blue' || c.type === 'red');
        if (blueRedCards.length === 0) {
          score = 0;
          break;
        }

        const playableBlueRed = blueRedCards.filter(c => this.engine.canPlayCard(c, this.player, 2).canPlay);
        const almostPlayable = blueRedCards.filter(c => {
          if (playableBlueRed.includes(c)) return false;
          const costCalc = this.engine.calculateCardCost(c, this.player, 2);
          return (res.mc + 3) >= costCalc.minPayableMC;
        });

        if (playableBlueRed.length >= 2) {
          // Play 2 cards in one round with lead bonus!
          score += 40;
          for (const c of playableBlueRed.slice(0, 2)) {
            score += Math.min(15, this.scoreCardForPlay(c) * 0.35);
          }
        } else if (playableBlueRed.length === 1) {
          // Play 1 card + DRAW 1 bonus card! Very strong human play
          score += 32 + Math.min(15, this.scoreCardForPlay(playableBlueRed[0]) * 0.35);
        } else if (almostPlayable.length > 0) {
          score += 20;
        } else {
          score = 5;
        }

        // Corporation synergies
        if (corp?.id === 'phobolog') score += 10;
        if (corp?.id === 'teractor') score += 8;
        break;
      }

      case 3: { // Action
        score = 0;
        // 1. Plant conversion (Forest = +1 Oxygen, +1 TR, +1 Forest VP tile)
        const plantCost = this.player.customStandardActionCosts?.forestPlants || 8;
        if (res.plants >= plantCost) {
          score += 36;
          if (res.plants >= plantCost * 2) score += 20;
        }

        // 2. Heat conversion (8 heat -> +1 Temp = +1 TR, +MC income)
        if (res.heat >= 8 && global.temperature < GLOBAL_PARAMS.TEMPERATURE.max) {
          score += 32;
          if (res.heat >= 16) score += 18;
        }

        // 3. Blue cards in play with actions
        const blueCardsWithActions = played.filter(c => c.action);
        if (blueCardsWithActions.length > 0) {
          score += blueCardsWithActions.length * 12;
          // Phase 3 lead bonus allows reactivating 1 blue card a second time
          score += 10;
        }

        // 4. Standard action Ocean with MC
        if (res.mc >= 25 && global.oceansFlipped < GLOBAL_PARAMS.OCEANS.total) {
          score += 16;
        }

        // Corporation synergies
        if (corp?.id === 'ecoline' && res.plants >= 5) score += 8;
        if (corp?.id === 'helion' && res.heat >= 6) score += 8;
        break;
      }

      case 4: { // Production
        score = 0;
        // Need for cash: prioritize if money is actually low
        if (res.mc < 6) {
          score += 38;
        } else if (res.mc < 12) {
          score += 26;
        } else if (res.mc < 20) {
          score += 14;
        } else {
          // Sitting on 20+ MC: choosing production is inefficient when you have cards to play!
          score -= 16;
        }

        // Value of current production engine
        const productiveOutput = prod.mc + (prod.heat * 1.2) + (prod.plants * 1.5) + (prod.cards * 4);
        score += Math.min(18, productiveOutput * 1.2);

        // Lead bonus gives +4 MC
        score += 6;
        break;
      }

      case 5: { // Research
        score = 0;
        const handSize = hand.length;
        if (handSize <= 1) {
          score += 45; // Critical need for cards
        } else if (handSize <= 3) {
          score += 28;
        } else if (handSize <= 5) {
          score += 14;
        } else {
          // Hand already has 6+ cards: avoid spamming research
          score -= 14;
        }

        // Round 1 digging for strategy
        if (round === 1) score += 6;

        // If high MC but no playable cards in hand, research is needed to find playable cards
        const playableCardsCount = hand.filter(c => 
          this.engine.canPlayCard(c, this.player, 1).canPlay || 
          this.engine.canPlayCard(c, this.player, 2).canPlay
        ).length;
        if (res.mc >= 20 && playableCardsCount === 0) {
          score += 22;
        }
        break;
      }
    }

    // Small random jitter (+/- 2.5) to break close ties and create realistic variation
    return score + (Math.random() * 5 - 2.5);
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

    // In Phase 2: If bot is chooser and has unused play, claim the draw bonus!
    if (phaseId === 2 && this.player.selectedPhase === 2 && !this.engine.phaseResolution.bonusClaimed?.[this.player.id]) {
      const playsLeft = this.engine.phaseResolution.cardPlaysRemaining[this.player.id] || 0;
      if (playsLeft > 0) {
        try {
          this.engine.claimConstructionDrawBonus(this.player);
        } catch (e) {
          // ignore
        }
      }
    }

    this.engine.botPassPhase();
  }

  playCardsInPhase(phaseId) {
    let playsLeft = this.engine.phaseResolution.cardPlaysRemaining[this.player.id] || 0;

    while (playsLeft > 0) {
      let playable = this.player.hand
        .map(card => ({ card, check: this.engine.canPlayCard(card, this.player, phaseId) }))
        .filter(item => item.check.canPlay)
        .sort((a, b) => this.scoreCardForPlay(b.card) - this.scoreCardForPlay(a.card));

      // Human-like card selling: If short by 1 to 3 MC for a high-priority card, sell 1 weak card
      if (playable.length === 0 && this.player.hand.length >= 3) {
        const potentialCards = this.player.hand.filter(c => {
          if (phaseId === 1 && c.type !== 'green') return false;
          if (phaseId === 2 && c.type !== 'blue' && c.type !== 'red') return false;
          const costCalc = this.engine.calculateCardCost(c, this.player, phaseId);
          return (this.player.resources.mc + 3) >= costCalc.minPayableMC;
        }).sort((a, b) => this.scoreCardForPlay(b) - this.scoreCardForPlay(a));

        if (potentialCards.length > 0) {
          const targetCard = potentialCards[0];
          const disposable = this.player.hand
            .filter(c => c.id !== targetCard.id)
            .sort((a, b) => this.scoreCardForPlay(a) - this.scoreCardForPlay(b))[0];

          if (disposable && this.scoreCardForPlay(targetCard) > this.scoreCardForPlay(disposable) + 8) {
            this.engine.sellCard(disposable.id, this.player);
            playable = this.player.hand
              .map(card => ({ card, check: this.engine.canPlayCard(card, this.player, phaseId) }))
              .filter(item => item.check.canPlay)
              .sort((a, b) => this.scoreCardForPlay(b.card) - this.scoreCardForPlay(a.card));
          }
        }
      }

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
