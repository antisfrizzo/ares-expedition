/**
 * Ares Expedition Rules & Logic Automated Test Suite
 */

import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { GameEngine } from '../src/engine/rules.js';
import { AresBot } from '../src/engine/ai.js';
import { GLOBAL_PARAMS } from '../src/engine/types.js';

describe('Terraforming Mars: Ares Expedition Engine Tests', () => {
  let engine;

  beforeEach(() => {
    engine = new GameEngine({ playerCorpId: 'credicor', botCorpId: 'ecoline' });
  });

  test('Game initialization sets baseline state according to Ares rules', () => {
    const player = engine.players[0];
    const bot = engine.players[1];

    // Starting TR must be 5
    assert.strictEqual(player.tr, 5);
    assert.strictEqual(bot.tr, 5);

    // Initial hand size must be 8
    assert.strictEqual(player.hand.length, 8);
    assert.strictEqual(bot.hand.length, 8);

    // Initial global parameters
    assert.strictEqual(engine.global.temperature, -30);
    assert.strictEqual(engine.global.oxygen, 0);
    assert.strictEqual(engine.global.oceansFlipped, 0);
    assert.strictEqual(engine.round, 1);
  });

  test('Phase selection disallows choosing the same phase in consecutive rounds', () => {
    const player = engine.players[0];

    // Round 1: choose phase 1
    engine.setPhaseChoice(player.id, 1);
    assert.strictEqual(player.selectedPhase, 1);

    // Simulate round end
    player.lastSelectedPhase = 1;
    player.selectedPhase = null;

    // In next round, picking phase 1 must throw an error
    assert.throws(() => {
      engine.setPhaseChoice(player.id, 1);
    }, /due volte consecutive/);

    // But picking another phase like 2 must succeed
    assert.doesNotThrow(() => {
      engine.setPhaseChoice(player.id, 2);
    });
  });

  test('Global parameter bumps reward TR and trigger threshold bonuses', () => {
    const player = engine.players[0];
    const initialTR = player.tr;

    // Raise temperature from -30 to -24 (3 steps: -28, -26, -24)
    engine.raiseTemperature(3, player);
    assert.strictEqual(engine.global.temperature, -24);
    assert.strictEqual(player.tr, initialTR + 3);

    // At -24°C, player gets +1 Heat production bonus!
    assert.strictEqual(player.production.heat, 1);

    // Raise oxygen to 8%
    engine.raiseOxygen(8, player);
    assert.strictEqual(engine.global.oxygen, 8);
    // 8 steps of oxygen (+8 TR) + 1 bonus step of temperature at 8% (+1 TR)!
    // So TR increased by 9, and temperature is now -22°C
    assert.strictEqual(engine.global.temperature, -22);
  });

  test('Ocean tile flipping grants tile bonus and +1 TR', () => {
    const player = engine.players[0];
    const initialTR = player.tr;
    const initialPlants = player.resources.plants;

    // Flip first ocean tile (tile 1 bonus is +2 plants)
    const tile = engine.flipOcean(player);
    assert.ok(tile.flipped);
    assert.strictEqual(engine.global.oceansFlipped, 1);
    assert.strictEqual(player.tr, initialTR + 1);
    assert.strictEqual(player.resources.plants, initialPlants + 2);
  });

  test('Standard actions deduct correct resources and advance parameters', () => {
    const player = engine.players[0];
    player.resources.plants = 16;
    player.resources.heat = 8;
    const initialTR = player.tr;

    // Execute standard forest (8 plants -> +1 forest token, +1 oxygen, +1 TR)
    engine.executeStandardAction('forest_plants', player);
    assert.strictEqual(player.resources.plants, 8);
    assert.strictEqual(player.forestTokens, 1);
    assert.strictEqual(engine.global.oxygen, 1);
    assert.strictEqual(player.tr, initialTR + 1);

    // Execute standard temperature (8 heat -> +1 temp, +1 TR)
    engine.executeStandardAction('temp_heat', player);
    assert.strictEqual(player.resources.heat, 0);
    assert.strictEqual(engine.global.temperature, -28);
    assert.strictEqual(player.tr, initialTR + 2);
  });

  test('Phase I discount (-3 MC) applies when player is the chooser', () => {
    const player = engine.players[0];
    player.selectedPhase = 1;

    // Fake a green card costing 10 MC
    const greenCard = { id: 'test_green', name: 'Test Green', type: 'green', cost: 10, tags: [] };
    const costCalc = engine.calculateCardCost(greenCard, player, 1);

    // 10 MC - 3 MC bonus = 7 MC
    assert.strictEqual(costCalc.effectiveCost, 7);
  });

  test('Ares Bot can choose valid phase and take turn', () => {
    const bot = engine.players[1];
    const botAgent = new AresBot(bot, engine);

    const chosenPhase = botAgent.choosePhase();
    assert.ok(chosenPhase >= 1 && chosenPhase <= 5);
    assert.strictEqual(bot.selectedPhase, chosenPhase);
  });

  test('Game end is detected when all three global parameters are maxed out', () => {
    const player = engine.players[0];

    // Max out temperature (+8°C)
    engine.raiseTemperature(19, player);
    assert.strictEqual(engine.global.temperature, 8);

    // Max out oxygen (14%)
    engine.raiseOxygen(14, player);
    assert.strictEqual(engine.global.oxygen, 14);

    // Max out oceans (9 tiles)
    for (let i = 0; i < 9; i++) {
      engine.flipOcean(player);
    }
    assert.strictEqual(engine.global.oceansFlipped, 9);

    // Trigger end round
    engine.endRound();
    assert.strictEqual(engine.isGameOver, true);
    assert.strictEqual(engine.step, 'game_over');
    assert.ok(engine.finalScores);
    assert.strictEqual(engine.finalScores.length, 2);
  });

  test('Phase II Construction lead bonus allows drawing 1 card instead of playing 2nd card', () => {
    const player = engine.players[0];
    const bot = engine.players[1];

    // Player chooses Phase II (Construction)
    engine.setPhaseChoice(player.id, 2);
    engine.setPhaseChoice(bot.id, 4);

    engine.startResolution();
    assert.strictEqual(engine.phaseResolution.phaseId, 2);
    // Player is chooser: starts with 2 plays remaining and bonus unclaimed
    assert.strictEqual(engine.phaseResolution.cardPlaysRemaining[player.id], 2);
    assert.strictEqual(engine.phaseResolution.bonusClaimed[player.id], false);

    const initialHandSize = player.hand.length;

    // Player claims the draw bonus
    const drawn = engine.claimConstructionDrawBonus(player);
    assert.ok(drawn);
    assert.strictEqual(player.hand.length, initialHandSize + 1);
    assert.strictEqual(engine.phaseResolution.bonusClaimed[player.id], true);
    // Card plays remaining drops from 2 to 1 (base play remains)
    assert.strictEqual(engine.phaseResolution.cardPlaysRemaining[player.id], 1);
  });

  test('Ares Bot demonstrates diverse strategic phase selection based on board state', () => {
    const bot = engine.players[1];
    const botAgent = new AresBot(bot, engine);

    // State A: Bot has abundant plants (>= 8) -> Action Phase (Phase 3) should be highly rated
    bot.resources.plants = 10;
    bot.resources.mc = 15;
    const scorePhase3 = botAgent.evaluatePhase(3);
    assert.ok(scorePhase3 > 30, 'Phase 3 should score high when plants are ready for forest conversion');

    // State B: Bot has almost no MC (< 5) and cards in hand -> Production (Phase 4) should be highly rated
    bot.resources.plants = 0;
    bot.resources.mc = 2;
    const scorePhase4 = botAgent.evaluatePhase(4);
    assert.ok(scorePhase4 > 30, 'Phase 4 should score high when MC is critically low');

    // State C: Bot has empty hand (<= 1 card) and abundant MC -> Research (Phase 5) should be highly rated
    bot.resources.mc = 25;
    bot.hand = [];
    const scorePhase5 = botAgent.evaluatePhase(5);
    assert.ok(scorePhase5 > 35, 'Phase 5 should score high when hand is depleted');
  });
});
