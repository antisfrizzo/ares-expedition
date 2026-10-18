/**
 * Terraforming Mars: Ares Expedition - Engine Types & Constants
 */

export const PHASES = {
  I: {
    id: 1,
    name: 'Development',
    nameIt: 'Sviluppo',
    color: '#10b981', // green
    description: 'Gioca 1 carta Progetto Verde (produzione).',
    bonusDescription: 'Sconto di 3 MC sulla carta giocata.',
    allowedCardTypes: ['green'],
    defaultCardPlays: 1,
    bonusCardPlays: 1,
    bonusDiscount: 3
  },
  II: {
    id: 2,
    name: 'Construction',
    nameIt: 'Costruzione',
    color: '#3b82f6', // blue
    description: 'Gioca 1 carta Progetto Blu (azione/passiva) o Rossa (evento).',
    bonusDescription: 'Pesca 1 carta O gioca una seconda carta Blu o Rossa.',
    allowedCardTypes: ['blue', 'red'],
    defaultCardPlays: 1,
    bonusCardPlays: 2,
    bonusCanDraw: true
  },
  III: {
    id: 3,
    name: 'Action',
    nameIt: 'Azione',
    color: '#f59e0b', // amber
    description: 'Attiva le abilità Azione delle tue carte blu ed esegui Azioni Standard.',
    bonusDescription: 'Riattiva l\'abilità Azione di una carta blu una seconda volta.',
    canActivateCards: true,
    bonusExtraAction: true
  },
  IV: {
    id: 4,
    name: 'Production',
    nameIt: 'Produzione',
    color: '#8b5cf6', // purple
    description: 'Produci risorse (MC = TR + Prod MC, Calore, Piante, Carte).',
    bonusDescription: 'Guadagna +4 MC aggiuntivi.',
    bonusMC: 4
  },
  V: {
    id: 5,
    name: 'Research',
    nameIt: 'Ricerca',
    color: '#ec4899', // pink
    description: 'Pesca 2 carte progetto, tienine 1 e scarta l\'altra.',
    bonusDescription: 'Pesca 5 carte progetto, tienine 2 e scarta le altre 3.',
    baseDraw: 2,
    baseKeep: 1,
    bonusDraw: 5,
    bonusKeep: 2
  }
};

export const TAGS = {
  building: { id: 'building', name: 'Edificio', color: 'bg-amber-700', icon: '🏗️' },
  space: { id: 'space', name: 'Spazio', color: 'bg-slate-800', icon: '🚀' },
  plant: { id: 'plant', name: 'Pianta', color: 'bg-emerald-600', icon: '🌿' },
  microbe: { id: 'microbe', name: 'Microbo', color: 'bg-lime-700', icon: '🦠' },
  animal: { id: 'animal', name: 'Animale', color: 'bg-cyan-700', icon: '🐾' },
  science: { id: 'science', name: 'Scienza', color: 'bg-sky-600', icon: '🔬' },
  power: { id: 'power', name: 'Energia', color: 'bg-yellow-500', icon: '⚡' },
  earth: { id: 'earth', name: 'Terra', color: 'bg-blue-600', icon: '🌍' },
  jovian: { id: 'jovian', name: 'Gioviano', color: 'bg-orange-700', icon: '🪐' },
  event: { id: 'event', name: 'Evento', color: 'bg-red-600', icon: '⚡' }
};

export const GLOBAL_PARAMS = {
  TEMPERATURE: {
    min: -30,
    max: 8,
    step: 2,
    bonuses: {
      '-24': { heatProd: 1, label: '+1 Prod Calore' },
      '-20': { heatProd: 1, label: '+1 Prod Calore' },
      '0': { ocean: 1, label: '1 Tessera Oceano' }
    }
  },
  OXYGEN: {
    min: 0,
    max: 14,
    step: 1,
    bonuses: {
      '8': { temperature: 1, label: '+1 Passo Temp' }
    }
  },
  OCEANS: {
    total: 9,
    tiles: [
      { id: 1, bonus: { plants: 2 }, label: '+2 Piante' },
      { id: 2, bonus: { mc: 2 }, label: '+2 MC' },
      { id: 3, bonus: { card: 1 }, label: '+1 Carta' },
      { id: 4, bonus: { heat: 2 }, label: '+2 Calore' },
      { id: 5, bonus: { plants: 2 }, label: '+2 Piante' },
      { id: 6, bonus: { mc: 4 }, label: '+4 MC' },
      { id: 7, bonus: { card: 1 }, label: '+1 Carta' },
      { id: 8, bonus: { heatProd: 1 }, label: '+1 Prod Calore' },
      { id: 9, bonus: { plantProd: 1 }, label: '+1 Prod Piante' }
    ]
  }
};

export const STANDARD_ACTIONS = [
  {
    id: 'forest_plants',
    name: 'Foresta (Piante)',
    costType: 'plants',
    cost: 8,
    effect: 'Piazza una Foresta (+1 PV), alza l\'Ossigeno di 1 passo (+1 TR)',
    canExecute: (player, global) => player.resources.plants >= (player.customStandardActionCosts?.forestPlants || 8)
  },
  {
    id: 'temp_heat',
    name: 'Temperatura (Calore)',
    costType: 'heat',
    cost: 8,
    effect: 'Alza la Temperatura di 1 passo (+1 TR)',
    canExecute: (player, global) => global.temperature < GLOBAL_PARAMS.TEMPERATURE.max && player.resources.heat >= 8
  },
  {
    id: 'ocean_mc',
    name: 'Oceano (15 MC)',
    costType: 'mc',
    cost: 15,
    effect: 'Gira 1 tessera Oceano (+ bonus tessera e +1 TR)',
    canExecute: (player, global) => global.oceansFlipped < GLOBAL_PARAMS.OCEANS.total && player.resources.mc >= 15
  },
  {
    id: 'temp_mc',
    name: 'Temperatura (14 MC)',
    costType: 'mc',
    cost: 14,
    effect: 'Alza la Temperatura di 1 passo (+1 TR)',
    canExecute: (player, global) => global.temperature < GLOBAL_PARAMS.TEMPERATURE.max && player.resources.mc >= 14
  },
  {
    id: 'forest_mc',
    name: 'Foresta (20 MC)',
    costType: 'mc',
    cost: 20,
    effect: 'Piazza una Foresta (+1 PV), alza l\'Ossigeno di 1 passo (+1 TR)',
    canExecute: (player, global) => player.resources.mc >= 20
  }
];
