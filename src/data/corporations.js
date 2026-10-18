/**
 * Corporations for Terraforming Mars: Ares Expedition
 */

export const CORPORATIONS = [
  {
    id: 'credicor',
    name: 'CrediCor',
    subtitle: 'Gigante Finanziario Globale',
    startingMC: 57,
    startingProduction: { mc: 0, heat: 0, plants: 0, cards: 0 },
    startingResources: { heat: 0, plants: 0, steel: 0, titanium: 0 },
    tags: ['earth'],
    description: 'Effetto Passivo: Ogni volta che giochi una carta con costo base di 20 MC o superiore, ricevi immediatamente 4 MC.',
    onCardPlayed: (card, player, engine) => {
      if (card.cost >= 20) {
        player.resources.mc += 4;
        engine.log(`${player.name} (CrediCor) riceve 4 MC per aver giocato una carta costosa (${card.name}).`);
      }
    }
  },
  {
    id: 'ecoline',
    name: 'Ecoline',
    subtitle: 'Pionieri della Bio-Ingegneria',
    startingMC: 36,
    startingProduction: { mc: 0, heat: 0, plants: 3, cards: 0 },
    startingResources: { heat: 0, plants: 4, steel: 0, titanium: 0 },
    tags: ['plant', 'plant'],
    customStandardActionCosts: { forestPlants: 7 },
    description: 'Effetto Passivo: Inizi con 3 Produzione Piante e 4 Piante. L\'Azione Standard Foresta richiede solo 7 Piante anziché 8.'
  },
  {
    id: 'helion',
    name: 'Helion',
    subtitle: 'Energia Solare e Termica',
    startingMC: 42,
    startingProduction: { mc: 0, heat: 3, plants: 0, cards: 0 },
    startingResources: { heat: 4, plants: 0, steel: 0, titanium: 0 },
    tags: ['space'],
    heatAsMC: true,
    description: 'Effetto Passivo: Inizi con 3 Produzione Calore. Puoi spendere Calore come se fosse MC per qualsiasi pagamento.'
  },
  {
    id: 'mining_guild',
    name: 'Mining Guild',
    subtitle: 'Consorzio Minerario Asteroidale',
    startingMC: 34,
    startingProduction: { mc: 1, heat: 0, plants: 0, cards: 0 },
    startingResources: { heat: 0, plants: 0, steel: 5, titanium: 2 },
    steelValueBonus: 1, // Steel counts as 3 MC discount instead of 2!
    tags: ['building', 'building'],
    description: 'Effetto Passivo: Inizi con 5 Acciaio e 2 Titanio. Il tuo Acciaio vale 3 MC di sconto per tag Edificio anziché 2.'
  },
  {
    id: 'teractor',
    name: 'Teractor',
    subtitle: 'Colosso Terrestre di Import-Export',
    startingMC: 55,
    startingProduction: { mc: 0, heat: 0, plants: 0, cards: 0 },
    startingResources: { heat: 0, plants: 0, steel: 0, titanium: 0 },
    tags: ['earth'],
    tagDiscounts: { earth: 3 },
    description: 'Effetto Passivo: Tutte le tue carte con tag Terra (Earth) costano 3 MC in meno.'
  },
  {
    id: 'inventrix',
    name: 'Inventrix',
    subtitle: 'Ricerca e Sviluppo Avanzato',
    startingMC: 45,
    startingProduction: { mc: 0, heat: 0, plants: 0, cards: 1 },
    startingResources: { heat: 0, plants: 0, steel: 0, titanium: 0 },
    tags: ['science'],
    requirementBuffer: 2, // +/- 2 step requirements
    description: 'Effetto Passivo: Inizi con +1 Produzione Carte. I requisiti globali (Temperatura, Ossigeno, Oceani) per giocare le tue carte sono flessibili di +/- 2 passi.'
  },
  {
    id: 'thorgate',
    name: 'Thorgate',
    subtitle: 'Dominio Energetico',
    startingMC: 48,
    startingProduction: { mc: 0, heat: 1, plants: 0, cards: 0 },
    startingResources: { heat: 0, plants: 0, steel: 0, titanium: 0 },
    tags: ['power'],
    tagDiscounts: { power: 3 },
    description: 'Effetto Passivo: Inizi con +1 Produzione Calore. Tutte le carte con tag Energia costano 3 MC in meno.'
  },
  {
    id: 'phobolog',
    name: 'PhoboLog',
    subtitle: 'Operazioni Spaziali Pesanti',
    startingMC: 38,
    startingProduction: { mc: 0, heat: 0, plants: 0, cards: 0 },
    startingResources: { heat: 0, plants: 0, steel: 0, titanium: 6 },
    titaniumValueBonus: 1, // Titanium counts as 4 MC discount instead of 3!
    tags: ['space'],
    description: 'Effetto Passivo: Inizi con 6 Titanio. Il tuo Titanio vale 4 MC di sconto per tag Spazio anziché 3.'
  }
];
