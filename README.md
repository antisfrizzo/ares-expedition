# Terraforming Mars: Ares Expedition - Edizione Digitale Web

Versione digitale giocabile da browser del celebre gioco da tavolo **Terraforming Mars: Ares Expedition**, realizzata con architettura 100% client-side (HTML5, Vanilla ES Modules, Tailwind CSS, Web Audio API).

---

## 🚀 Come Giocare Subito

L'applicazione è completamente autonoma e non richiede dipendenze pesanti o installazioni di pacchetti:

### Metodo 1: Tramite server locale Python (Consigliato)
Apri un terminale nella cartella del progetto:
```bash
cd /home/luca/.gemini/antigravity/scratch/ares-expedition
python3 -m http.server 3000
```
Poi apri il tuo browser all'indirizzo:
👉 **[http://localhost:3000](http://localhost:3000)**

### Metodo 2: Apertura diretta del file
Puoi anche fare doppio clic o aprire direttamente il file:
👉 `/home/luca/.gemini/antigravity/scratch/ares-expedition/index.html`

---

## 🎮 Funzionalità e Regolamento Ufficiale Implementato

1. **Modalità Single Player vs Ares Bot:**
   * Un'intelligenza artificiale euristica seleziona le fasi in modo strategico, valuta le carte in mano, calcola gli sconti di metalli/titanio, attiva le azioni delle carte blu e sfrutta le azioni standard.
   * Registro di bordo in tempo reale con tutte le azioni del bot e del giocatore.

2. **Le 5 Fasi di Gioco e Bonus di Guida:**
   * **Fase I – Sviluppo:** Gioca 1 carta Verde (motore/produzione). *Bonus:* Sconto immediato di 3 MC.
   * **Fase II – Costruzione:** Gioca 1 carta Blu o Rossa. *Bonus:* Pesca 1 carta O gioca una seconda carta.
   * **Fase III – Azioni:** Attiva le abilità azione delle carte blu in gioco + Azioni Standard illimitate. *Bonus:* Riattiva una carta blu una seconda volta.
   * **Fase IV – Produzione:** Incassa MC (pari a TR + Prod MC), Calore, Piante e pesca carte per Prod Carte. *Bonus:* +4 MC aggiuntivi.
   * **Fase V – Ricerca:** Pesca 2 carte e tienine 1. *Bonus:* Pesca 5 carte e tienine 2.
   * **Regola di consecutività:** Non è possibile selezionare la fase scelta nel round precedente.

3. **Parametri Globali e Traguardi:**
   * **Temperatura:** da -30°C a +8°C a passi di 2°C (+1 TR per passo). Bonus soglia a -24°C (+1 Prod Calore), -20°C (+1 Prod Calore) e 0°C (Tessera Oceano gratuita).
   * **Ossigeno:** da 0% a 14% (+1 TR per passo). Bonus soglia all'8% (+1 passo Temperatura gratuito).
   * **Oceani:** 9 tessere con bonus immediati specifici (+2 Piante, +2 MC, +4 MC, +1 Carta, +1 Prod Piante, +1 Prod Calore, ecc.) e +1 TR.

4. **Validazione Rigida delle Regole:**
   * Calcolo automatico degli sconti di **Acciaio** (2 MC per tag Edificio) e **Titanio** (3 MC per tag Spazio).
   * Verifica automatica dei requisiti di temperatura, ossigeno, oceani e tag posseduti prima di consentire la giocata di una carta.
   * Vendita brevetti: Scarta qualsiasi carta dalla mano in qualsiasi momento per incassare 3 MC.
   * Abilità speciali delle Corporazioni (es. *CrediCor* riceve 4 MC per carte da 20+ MC; *Ecoline* paga solo 7 Piante per la foresta; *Helion* può spendere Calore come MC; *Inventrix* ha flessibilità +/- 2 passi sui requisiti).

---

## 📥 Estensione del Mazzo Completo (208+ Carte)

L'architettura è interamente modulare e basata su schema dati JSON/JS. Per importare nuove carte:
1. Clicca sul pulsante **"Importa Mazzo"** in alto nell'applicazione.
2. Incolla il JSON delle carte conformi allo schema:

```json
[
  {
    "id": "c100",
    "number": 100,
    "name": "Nome Carta",
    "nameIt": "Nome in Italiano",
    "type": "green",
    "cost": 14,
    "tags": ["building", "plant"],
    "requirements": {
      "minTemperature": -10,
      "minOceans": 2
    },
    "effects": {
      "plants": 2,
      "production": { "plants": 1, "mc": 1 }
    },
    "vp": 1,
    "description": "Richiede Temp >= -10°C e 2 Oceani. +2 Piante, +1 Prod Piante, +1 Prod MC."
  }
]
```

Tutte le carte importate vengono validate al volo dalla funzione `validateCardSchema` e mescolate nel mazzo!

---

## 🧪 Esecuzione dei Test Automatizzati

Il motore di regole include una suite di test completa eseguibile con il test runner nativo di Node.js:
```bash
node --test tests/rules.test.js
```
