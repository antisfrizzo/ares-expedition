/**
 * Project Cards Database for Terraforming Mars: Ares Expedition
 * Fully typed and structured schema ready for 208+ cards expansion.
 */

export const PROJECT_CARDS = [
  // --- GREEN CARDS (Automated / Production) ---
  {
    id: 'c001',
    number: 1,
    name: 'Algae Farms',
    nameIt: 'Coltivazioni di Alghe',
    type: 'green',
    cost: 10,
    tags: ['plant', 'building'],
    requirements: { minOceans: 2 },
    effects: {
      plants: 1,
      production: { plants: 2 }
    },
    vp: 1,
    description: 'Richiede 2 Oceani. Guadagna 1 Pianta e +2 Produzione Piante.'
  },
  {
    id: 'c002',
    number: 2,
    name: 'Strip Mine',
    nameIt: 'Miniera a Cielo Aperto',
    type: 'green',
    cost: 25,
    tags: ['building'],
    effects: {
      steel: 4,
      titanium: 2,
      production: { mc: 2 }
    },
    vp: 1,
    description: 'Guadagna 4 Acciaio, 2 Titanio e +2 Produzione MC.'
  },
  {
    id: 'c003',
    number: 3,
    name: 'Solar Power',
    nameIt: 'Centrale Solare',
    type: 'green',
    cost: 11,
    tags: ['power', 'building'],
    effects: {
      heat: 2,
      production: { heat: 1 }
    },
    vp: 1,
    description: 'Guadagna 2 Calore e +1 Produzione Calore.'
  },
  {
    id: 'c004',
    number: 4,
    name: 'Geothermal Power',
    nameIt: 'Energia Geotermica',
    type: 'green',
    cost: 11,
    tags: ['power', 'building'],
    effects: {
      production: { heat: 2 }
    },
    vp: 0,
    description: '+2 Produzione Calore.'
  },
  {
    id: 'c005',
    number: 5,
    name: 'Research Outpost',
    nameIt: 'Avamposto di Ricerca',
    type: 'green',
    cost: 18,
    tags: ['science', 'building'],
    effects: {
      cards: 1,
      production: { cards: 1, mc: 1 }
    },
    permanentDiscounts: { all: 1 },
    vp: 1,
    description: 'Pesca 1 carta. +1 Produzione Carte, +1 Produzione MC. Tutte le tue carte costano 1 MC in meno.'
  },
  {
    id: 'c006',
    number: 6,
    name: 'Farming',
    nameIt: 'Agricoltura',
    type: 'green',
    cost: 16,
    tags: ['plant'],
    requirements: { minTemperature: -4 },
    effects: {
      plants: 2,
      production: { plants: 2, mc: 2 }
    },
    vp: 2,
    description: 'Richiede Temp >= -4°C. +2 Piante, +2 Produzione Piante, +2 Produzione MC.'
  },
  {
    id: 'c007',
    number: 7,
    name: 'Sub-Crust Measurements',
    nameIt: 'Misure Sub-Crostali',
    type: 'green',
    cost: 8,
    tags: ['science'],
    effects: {
      production: { cards: 1 }
    },
    vp: 0,
    description: '+1 Produzione Carte.'
  },
  {
    id: 'c008',
    number: 8,
    name: 'Deep Well Pumping',
    nameIt: 'Pompaggio Pozzi Profondi',
    type: 'green',
    cost: 17,
    tags: ['building'],
    effects: {
      ocean: 1,
      production: { heat: 1 }
    },
    vp: 0,
    description: 'Gira 1 tessera Oceano (+1 TR + bonus). +1 Produzione Calore.'
  },
  {
    id: 'c009',
    number: 9,
    name: 'Nuclear Zone',
    nameIt: 'Zona Nucleare',
    type: 'green',
    cost: 10,
    tags: ['earth'],
    effects: {
      temperature: 2
    },
    vp: 0,
    description: 'Alza la Temperatura di 2 passi (+2 TR).'
  },
  {
    id: 'c010',
    number: 10,
    name: 'Tropical Resort',
    nameIt: 'Resort Tropicale',
    type: 'green',
    cost: 13,
    tags: ['building'],
    requirements: { minOceans: 3 },
    effects: {
      production: { mc: 3 }
    },
    vp: 2,
    description: 'Richiede 3 Oceani. +3 Produzione MC.'
  },
  {
    id: 'c011',
    number: 11,
    name: 'Micro-Mills',
    nameIt: 'Micro-Mulini',
    type: 'green',
    cost: 3,
    tags: ['building'],
    effects: {
      production: { heat: 1 }
    },
    vp: 0,
    description: '+1 Produzione Calore.'
  },
  {
    id: 'c012',
    number: 12,
    name: 'Lichen',
    nameIt: 'Licheni',
    type: 'green',
    cost: 7,
    tags: ['plant'],
    requirements: { minTemperature: -24 },
    effects: {
      production: { plants: 1 }
    },
    vp: 0,
    description: 'Richiede Temp >= -24°C. +1 Produzione Piante.'
  },
  {
    id: 'c013',
    number: 13,
    name: 'Nitrogen-Rich Asteroid',
    nameIt: 'Asteroide Ricco di Azoto',
    type: 'green',
    cost: 29,
    tags: ['space'],
    effects: {
      temperature: 1,
      production: { plants: 1 },
      plants: 3,
      tr: 2
    },
    vp: 2,
    description: 'Alza la Temp di 1 passo. +2 TR aggiuntivi. +3 Piante e +1 Produzione Piante.'
  },
  {
    id: 'c014',
    number: 14,
    name: 'Space Mirrors',
    nameIt: 'Specchi Spaziali',
    type: 'green',
    cost: 14,
    tags: ['power', 'space'],
    effects: {
      production: { heat: 3 }
    },
    vp: 0,
    description: '+3 Produzione Calore.'
  },
  {
    id: 'c015',
    number: 15,
    name: 'Toll Station',
    nameIt: 'Stazione di Pedaggio Orbitale',
    type: 'green',
    cost: 12,
    tags: ['space'],
    effects: {
      productionPerTag: { tag: 'space', resource: 'mc', amount: 1 }
    },
    vp: 0,
    description: 'Aumenta la Produzione MC di 1 per ogni tag Spazio che possiedi (inclusa questa).'
  },
  {
    id: 'c016',
    number: 16,
    name: 'Earth Office',
    nameIt: 'Ufficio Terrestre',
    type: 'green',
    cost: 1,
    tags: ['earth'],
    permanentDiscounts: { earth: 3 },
    vp: 0,
    description: 'Tutte le carte con tag Terra ti costano 3 MC in meno.'
  },

  // --- BLUE CARDS (Active / Ongoing) ---
  {
    id: 'c017',
    number: 17,
    name: 'Ironworks',
    nameIt: 'Ferriere',
    type: 'blue',
    cost: 11,
    tags: ['building'],
    action: {
      name: 'Spendi 4 Calore -> +1 Acciaio e +1 Ossigeno (+1 TR)',
      cost: { heat: 4 },
      effect: (player, engine) => {
        player.resources.steel = (player.resources.steel || 0) + 1;
        engine.raiseOxygen(1, player);
      }
    },
    vp: 0,
    description: 'Azione: Spendi 4 Calore per guadagnare 1 Acciaio e alzare l\'Ossigeno di 1 passo (+1 TR).'
  },
  {
    id: 'c018',
    number: 18,
    name: 'Water Splitting Plant',
    nameIt: 'Impianto di Scissione dell\'Acqua',
    type: 'blue',
    cost: 12,
    tags: ['building'],
    requirements: { minOceans: 2 },
    action: {
      name: 'Spendi 3 MC -> Alza l\'Ossigeno (+1 TR)',
      cost: { mc: 3 },
      effect: (player, engine) => {
        engine.raiseOxygen(1, player);
      }
    },
    vp: 0,
    description: 'Richiede 2 Oceani. Azione: Spendi 3 MC per alzare l\'Ossigeno di 1 passo (+1 TR).'
  },
  {
    id: 'c019',
    number: 19,
    name: 'Birds',
    nameIt: 'Uccelli',
    type: 'blue',
    cost: 10,
    tags: ['animal'],
    requirements: { minOxygen: 11 },
    resourceOnCard: 'animal',
    action: {
      name: 'Aggiungi 1 Animale su questa carta',
      cost: {},
      effect: (player) => {
        player.cardTokens = player.cardTokens || {};
        player.cardTokens['c019'] = (player.cardTokens['c019'] || 0) + 1;
      }
    },
    vpCalculator: (player) => player.cardTokens?.['c019'] || 0,
    vp: 0,
    description: 'Richiede 11% Ossigeno. Azione: Aggiungi 1 Animale su questa carta. Vale 1 PV per ogni Animale su questa carta.'
  },
  {
    id: 'c020',
    number: 20,
    name: 'Regolith Eaters',
    nameIt: 'Mangiatori di Regolite',
    type: 'blue',
    cost: 13,
    tags: ['microbe', 'science'],
    resourceOnCard: 'microbe',
    action: {
      name: 'Aggiungi 1 Microbo O spendi 2 Microbi per alzare l\'Ossigeno (+1 TR)',
      cost: {},
      options: [
        {
          label: '+1 Microbo',
          canUse: () => true,
          execute: (player) => {
            player.cardTokens = player.cardTokens || {};
            player.cardTokens['c020'] = (player.cardTokens['c020'] || 0) + 1;
          }
        },
        {
          label: 'Spendi 2 Microbi -> +1 Ossigeno (+1 TR)',
          canUse: (player) => (player.cardTokens?.['c020'] || 0) >= 2,
          execute: (player, engine) => {
            player.cardTokens['c020'] -= 2;
            engine.raiseOxygen(1, player);
          }
        }
      ]
    },
    vp: 0,
    description: 'Azione: Aggiungi 1 Microbo OPPURE spendi 2 Microbi su questa carta per alzare l\'Ossigeno di 1 passo (+1 TR).'
  },
  {
    id: 'c021',
    number: 21,
    name: 'Electro Catapult',
    nameIt: 'Catapulta Elettromagnetica',
    type: 'blue',
    cost: 17,
    tags: ['building'],
    action: {
      name: 'Spendi 1 Pianta o 1 Acciaio -> Guadagna 7 MC',
      cost: {},
      options: [
        {
          label: 'Spendi 1 Pianta -> +7 MC',
          canUse: (player) => player.resources.plants >= 1,
          execute: (player) => {
            player.resources.plants -= 1;
            player.resources.mc += 7;
          }
        },
        {
          label: 'Spendi 1 Acciaio -> +7 MC',
          canUse: (player) => (player.resources.steel || 0) >= 1,
          execute: (player) => {
            player.resources.steel -= 1;
            player.resources.mc += 7;
          }
        }
      ]
    },
    vp: 1,
    description: 'Azione: Spendi 1 Pianta o 1 Acciaio per guadagnare 7 MC.'
  },
  {
    id: 'c022',
    number: 22,
    name: 'Rover Construction',
    nameIt: 'Costruzione Rover',
    type: 'blue',
    cost: 8,
    tags: ['building'],
    trigger: {
      event: 'cardPlayed',
      condition: (card) => card.tags && card.tags.includes('building'),
      effect: (player, engine, card) => {
        player.resources.mc += 2;
        engine.log(`${player.name} riceve 2 MC da Rover Construction per aver giocato ${card.name}.`);
      }
    },
    vp: 1,
    description: 'Effetto Passivo: Ogni volta che giochi una carta con tag Edificio, guadagni 2 MC.'
  },
  {
    id: 'c023',
    number: 23,
    name: 'Media Archives',
    nameIt: 'Archivi Multimediali',
    type: 'blue',
    cost: 8,
    tags: ['earth'],
    action: {
      name: 'Guadagna 1 MC per ogni carta Evento (Rossa) che hai giocato',
      cost: {},
      effect: (player) => {
        const eventCount = (player.playedCards || []).filter(c => c.type === 'red' || (c.tags && c.tags.includes('event'))).length;
        player.resources.mc += eventCount;
      }
    },
    vp: 1,
    description: 'Azione: Guadagna 1 MC per ogni carta Evento (Rossa) giocata in partita.'
  },
  {
    id: 'c024',
    number: 24,
    name: 'Tardigrades',
    nameIt: 'Tardigradi',
    type: 'blue',
    cost: 4,
    tags: ['microbe'],
    resourceOnCard: 'microbe',
    action: {
      name: 'Aggiungi 1 Microbo su questa carta',
      cost: {},
      effect: (player) => {
        player.cardTokens = player.cardTokens || {};
        player.cardTokens['c024'] = (player.cardTokens['c024'] || 0) + 1;
      }
    },
    vpCalculator: (player) => Math.floor((player.cardTokens?.['c024'] || 0) / 3),
    vp: 0,
    description: 'Azione: Aggiungi 1 Microbo su questa carta. Vale 1 PV ogni 3 Microbi su questa carta.'
  },
  {
    id: 'c025',
    number: 25,
    name: 'Solar Wind Power',
    nameIt: 'Energia dal Vento Solare',
    type: 'blue',
    cost: 11,
    tags: ['power', 'space'],
    effects: {
      titanium: 2
    },
    action: {
      name: 'Spendi 1 Titanio -> +6 MC',
      cost: {},
      canUse: (player) => (player.resources.titanium || 0) >= 1,
      effect: (player) => {
        player.resources.titanium -= 1;
        player.resources.mc += 6;
      }
    },
    vp: 1,
    description: 'All\'entrata: +2 Titanio. Azione: Spendi 1 Titanio per guadagnare 6 MC.'
  },
  {
    id: 'c026',
    number: 26,
    name: 'Space Station',
    nameIt: 'Stazione Spaziale',
    type: 'blue',
    cost: 10,
    tags: ['space'],
    permanentDiscounts: { space: 2 },
    vp: 1,
    description: 'Effetto Passivo: Tutte le tue carte con tag Spazio costano 2 MC in meno.'
  },
  {
    id: 'c027',
    number: 27,
    name: 'Olympus Conference',
    nameIt: 'Conferenza dell\'Olimpo',
    type: 'blue',
    cost: 10,
    tags: ['science', 'earth'],
    trigger: {
      event: 'cardPlayed',
      condition: (card) => card.tags && card.tags.includes('science'),
      effect: (player, engine, card) => {
        engine.drawCards(player, 1);
        engine.log(`${player.name} pesca 1 carta grazie alla Conferenza dell'Olimpo.`);
      }
    },
    vp: 1,
    description: 'Effetto Passivo: Ogni volta che giochi una carta con tag Scienza, pesca 1 carta.'
  },
  {
    id: 'c028',
    number: 28,
    name: 'GHG Factories',
    nameIt: 'Fabbriche di Gas Serra',
    type: 'blue',
    cost: 11,
    tags: ['building'],
    action: {
      name: 'Spendi 4 Calore -> +1 Produzione Calore',
      cost: { heat: 4 },
      effect: (player) => {
        player.production.heat += 1;
      }
    },
    vp: 0,
    description: 'Azione: Spendi 4 Calore per aumentare di 1 la tua Produzione Calore.'
  },

  // --- RED CARDS (Events / Immediate) ---
  {
    id: 'c029',
    number: 29,
    name: 'Asteroid',
    nameIt: 'Asteroide',
    type: 'red',
    cost: 14,
    tags: ['space', 'event'],
    effects: {
      temperature: 1,
      titanium: 2
    },
    vp: 0,
    description: 'Alza la Temperatura di 1 passo (+1 TR) e guadagna 2 Titanio.'
  },
  {
    id: 'c030',
    number: 30,
    name: 'Comet',
    nameIt: 'Cometa',
    type: 'red',
    cost: 21,
    tags: ['space', 'event'],
    effects: {
      temperature: 1,
      ocean: 1,
      plants: 2
    },
    vp: 0,
    description: 'Alza la Temperatura di 1 passo (+1 TR), gira 1 tessera Oceano (+1 TR + bonus) e ottieni 2 Piante.'
  },
  {
    id: 'c031',
    number: 31,
    name: 'Giant Solar Collector',
    nameIt: 'Collettore Solare Gigante',
    type: 'red',
    cost: 32,
    tags: ['space', 'power', 'event'],
    effects: {
      temperature: 2,
      production: { heat: 2 }
    },
    vp: 2,
    description: 'Alza la Temperatura di 2 passi (+2 TR) e ottieni +2 Produzione Calore.'
  },
  {
    id: 'c032',
    number: 32,
    name: 'Flooding',
    nameIt: 'Alluvione',
    type: 'red',
    cost: 15,
    tags: ['event'],
    effects: {
      ocean: 1,
      mc: 4
    },
    vp: 0,
    description: 'Gira 1 tessera Oceano (+1 TR + bonus) e guadagna 4 MC.'
  },
  {
    id: 'c033',
    number: 33,
    name: 'Imported GHG',
    nameIt: 'Importazione di Gas Serra',
    type: 'red',
    cost: 7,
    tags: ['space', 'event'],
    effects: {
      heat: 4,
      production: { heat: 1 }
    },
    vp: 0,
    description: 'Guadagna 4 Calore e +1 Produzione Calore.'
  },
  {
    id: 'c034',
    number: 34,
    name: 'Deimos Down',
    nameIt: 'Caduta di Deimos',
    type: 'red',
    cost: 31,
    tags: ['space', 'event'],
    effects: {
      temperature: 3,
      steel: 4
    },
    vp: 0,
    description: 'Alza la Temperatura di 3 passi (+3 TR) e guadagna 4 Acciaio.'
  },
  {
    id: 'c035',
    number: 35,
    name: 'Great Dam',
    nameIt: 'Grande Diga Idroelettrica',
    type: 'red',
    cost: 12,
    tags: ['power', 'building', 'event'],
    requirements: { minOceans: 4 },
    effects: {
      production: { heat: 2, mc: 2 }
    },
    vp: 1,
    description: 'Richiede 4 Oceani. +2 Produzione Calore e +2 Produzione MC.'
  },
  {
    id: 'c036',
    number: 36,
    name: 'Local Heat Trapping',
    nameIt: 'Intrappolamento Locale del Calore',
    type: 'red',
    cost: 1,
    tags: ['event'],
    effects: {
      plants: 4
    },
    vp: 0,
    description: 'Guadagna immediatamente 4 Piante.'
  },
  {
    id: 'c037',
    number: 37,
    name: 'Technology Demonstration',
    nameIt: 'Dimostrazione Tecnologica',
    type: 'red',
    cost: 5,
    tags: ['science', 'space', 'event'],
    effects: {
      cards: 2
    },
    vp: 0,
    description: 'Pesca immediatamente 2 carte.'
  },
  {
    id: 'c038',
    number: 38,
    name: 'Small Animals',
    nameIt: 'Piccoli Animali',
    type: 'green',
    cost: 6,
    tags: ['animal'],
    requirements: { minOxygen: 6 },
    effects: {
      production: { mc: 1 }
    },
    vp: 1,
    description: 'Richiede 6% Ossigeno. +1 Produzione MC.'
  },
  {
    id: 'c039',
    number: 39,
    name: 'Colonizer Training Camp',
    nameIt: 'Campo Addestramento Coloni',
    type: 'green',
    cost: 8,
    tags: ['building', 'jovian'],
    requirements: { maxOxygen: 5 },
    effects: {
      production: { mc: 2 }
    },
    vp: 2,
    description: 'Richiede max 5% Ossigeno. +2 Produzione MC.'
  },
  {
    id: 'c040',
    number: 40,
    name: 'Saturn Systems',
    nameIt: 'Sistemi Saturniani',
    type: 'green',
    cost: 13,
    tags: ['space', 'jovian'],
    effects: {
      production: { mc: 2, titanium: 1 }
    },
    vpCalculator: (player) => {
      const jovians = (player.playedCards || []).filter(c => c.tags && c.tags.includes('jovian')).length +
        (player.corporation?.tags?.includes('jovian') ? 1 : 0);
      return Math.floor(jovians / 2);
    },
    vp: 1,
    description: '+2 Prod MC, +1 Titanio. Vale 1 PV ogni 2 tag Gioviano posseduti.'
  },
  {
    id: 'c041',
    number: 41,
    name: 'Kelp Harvesting',
    nameIt: 'Raccolta di Alghe Giganti',
    type: 'green',
    cost: 17,
    tags: ['plant'],
    requirements: { minOceans: 3 },
    effects: {
      plants: 3,
      production: { plants: 3, mc: 2 }
    },
    vp: 1,
    description: 'Richiede 3 Oceani. +3 Piante, +3 Produzione Piante, +2 Produzione MC.'
  },
  {
    id: 'c042',
    number: 42,
    name: 'Trees',
    nameIt: 'Alberi',
    type: 'green',
    cost: 13,
    tags: ['plant'],
    requirements: { minTemperature: -4 },
    effects: {
      plants: 1,
      production: { plants: 3 }
    },
    vp: 1,
    description: 'Richiede Temp >= -4°C. +1 Pianta, +3 Produzione Piante.'
  },
  {
    id: 'c043',
    number: 43,
    name: 'Moss',
    nameIt: 'Muschio',
    type: 'green',
    cost: 4,
    tags: ['plant'],
    requirements: { minOceans: 3 },
    effects: {
      production: { plants: 1 }
    },
    vp: 0,
    description: 'Richiede 3 Oceani. +1 Produzione Piante.'
  },
  {
    id: 'c044',
    number: 44,
    name: 'Carbonate Processing',
    nameIt: 'Lavorazione dei Carbonati',
    type: 'green',
    cost: 6,
    tags: ['building'],
    effects: {
      production: { heat: 3 }
    },
    vp: 0,
    description: '+3 Produzione Calore.'
  },
  {
    id: 'c045',
    number: 45,
    name: 'Aerobraked Ammonia Asteroid',
    nameIt: 'Asteroide con Aerofrenaggio',
    type: 'red',
    cost: 26,
    tags: ['space', 'event'],
    effects: {
      temperature: 2,
      production: { heat: 3, plants: 1 }
    },
    vp: 0,
    description: 'Alza la Temperatura di 2 passi (+2 TR). +3 Prod Calore, +1 Prod Piante.'
  }
];

/**
 * Validates any card object against the Ares Expedition schema.
 * Useful for loading third-party or extended JSON decks.
 */
export function validateCardSchema(card) {
  if (!card.id || typeof card.id !== 'string') return false;
  if (!card.name || typeof card.name !== 'string') return false;
  if (!['green', 'blue', 'red'].includes(card.type)) return false;
  if (typeof card.cost !== 'number' || card.cost < 0) return false;
  if (!Array.isArray(card.tags)) return false;
  return true;
}

/**
 * Helper to import additional cards dynamically from JSON
 */
export function importDeck(newCards) {
  const validCards = [];
  for (const card of newCards) {
    if (validateCardSchema(card)) {
      validCards.push(card);
    } else {
      console.warn('Invalid card skipped:', card);
    }
  }
  return validCards;
}
