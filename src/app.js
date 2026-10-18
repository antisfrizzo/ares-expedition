/**
 * Main Application Orchestrator for Terraforming Mars: Ares Expedition
 * Featuring Main Menu, Authentic Board Game Fonts, Corporation Selection,
 * and Bulletproof Round & Phase Planning Flow.
 */

import { GameEngine } from './engine/rules.js';
import { AresBot } from './engine/ai.js';
import { PHASES, GLOBAL_PARAMS, STANDARD_ACTIONS } from './engine/types.js';
import { 
  renderMarsBoard, 
  renderPlayerDashboard, 
  renderBotDashboard, 
  renderCard, 
  renderPhaseSelectionModal, 
  renderResearchModal, 
  renderGameOverModal 
} from './ui/components.js';
import { 
  renderMainMenu, 
  renderCorporationSelectModal, 
  renderSettingsModal 
} from './ui/menu.js';
import { sounds } from './ui/sounds.js';
import { PROJECT_CARDS, importDeck } from './data/cards.js';
import { CORPORATIONS } from './data/corporations.js';

class AresApp {
  constructor() {
    this.appScreen = 'menu'; // 'menu', 'corp_select', 'game'
    this.settings = {
      soundEnabled: true,
      botDifficulty: 'standard'
    };

    // Engine initialized on demand when game starts
    this.engine = new GameEngine({ autoInit: false });
    this.botAgent = null;

    this.currentTab = 'hand'; // 'hand', 'green', 'blue', 'red'
    this.selectedPhaseCandidate = null;
    this.selectedResearchCards = new Set();
    this.corpChoices = [];

    this.initDOM();
    this.bindEvents();
    this.renderScreen();
  }

  initDOM() {
    this.menuOverlayEl = document.getElementById('menu-overlay');
    this.modalOverlayEl = document.getElementById('modal-overlay');
    this.marsBoardEl = document.getElementById('mars-board-container');
    this.playerDashboardEl = document.getElementById('player-dashboard-container');
    this.botDashboardEl = document.getElementById('bot-dashboard-container');
    this.cardsContainerEl = document.getElementById('cards-container');
    this.phaseBannerEl = document.getElementById('phase-banner');
    this.roundIndicatorEl = document.getElementById('round-indicator');
    this.gameLogEl = document.getElementById('game-log-list');
  }

  bindEvents() {
    // Top Bar Main Menu button
    const openMenuBtn = document.getElementById('open-menu-btn');
    if (openMenuBtn) {
      openMenuBtn.addEventListener('click', () => {
        sounds.click();
        this.appScreen = 'menu';
        this.renderScreen();
      });
    }

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.dataset.tab;
        this.switchTab(tab);
      });
    });

    // Sound toggle
    const soundToggleBtn = document.getElementById('sound-toggle-btn');
    if (soundToggleBtn) {
      soundToggleBtn.addEventListener('click', () => {
        this.toggleSound();
      });
    }

    // Rules modal toggle
    const rulesBtn = document.getElementById('rules-btn');
    const rulesModal = document.getElementById('rules-modal');
    const closeRulesBtn = document.getElementById('close-rules-btn');
    if (rulesBtn && rulesModal) {
      rulesBtn.addEventListener('click', () => {
        sounds.click();
        rulesModal.classList.remove('hidden');
      });
      closeRulesBtn?.addEventListener('click', () => {
        sounds.click();
        rulesModal.classList.add('hidden');
      });
    }

    // Import Deck modal toggle
    const importDeckBtn = document.getElementById('import-deck-btn');
    const importModal = document.getElementById('import-deck-modal');
    const closeImportBtn = document.getElementById('close-import-btn');
    const executeImportBtn = document.getElementById('execute-import-btn');
    const importTextarea = document.getElementById('import-json-textarea');

    if (importDeckBtn && importModal) {
      importDeckBtn.addEventListener('click', () => {
        sounds.click();
        importModal.classList.remove('hidden');
      });
      closeImportBtn?.addEventListener('click', () => {
        sounds.click();
        importModal.classList.add('hidden');
      });
      executeImportBtn?.addEventListener('click', () => {
        try {
          const raw = JSON.parse(importTextarea.value);
          if (Array.isArray(raw)) {
            const added = importDeck(raw);
            this.engine.deck.push(...this.engine.shuffle(added));
            this.engine.log(`Importate con successo ${added.length} nuove carte nel mazzo!`);
            alert(`Importate ${added.length} carte con successo!`);
            importModal.classList.add('hidden');
            this.render();
          }
        } catch (err) {
          alert('Errore nel formato JSON: ' + err.message);
        }
      });
    }

    // Global Delegated Click Handler for Cards, Actions & Modals
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-action]');
      if (!target) return;

      const action = target.dataset.action;

      if (action === 'play_card') {
        const cardId = target.dataset.cardId;
        this.onPlayCard(cardId);
      } else if (action === 'sell_card') {
        const cardId = target.dataset.cardId;
        this.onSellCard(cardId);
      } else if (action === 'activate_card_action') {
        const cardId = target.dataset.cardId;
        this.onActivateCardAction(cardId);
      } else if (action === 'standard') {
        const actionId = target.dataset.actionId;
        this.onStandardAction(actionId);
      } else if (action === 'open_planning_modal') {
        this.openPlanningModal();
      } else if (action === 'close_planning_modal') {
        sounds.click();
        this.modalOverlayEl.classList.add('hidden');
      } else if (action === 'open_research_modal') {
        this.openResearchModal();
      } else if (action === 'pass_phase') {
        this.onPlayerPassPhase();
      }
    });
  }

  toggleSound() {
    this.settings.soundEnabled = !this.settings.soundEnabled;
    sounds.enabled = this.settings.soundEnabled;
    const soundToggleBtn = document.getElementById('sound-toggle-btn');
    if (soundToggleBtn) {
      soundToggleBtn.textContent = sounds.enabled ? '🔊 Audio ON' : '🔇 Audio OFF';
      soundToggleBtn.classList.toggle('text-amber-400', sounds.enabled);
      soundToggleBtn.classList.toggle('text-slate-500', !sounds.enabled);
    }
  }

  // --- SCREEN MANAGEMENT ---

  renderScreen() {
    if (this.appScreen === 'menu') {
      this.menuOverlayEl.innerHTML = renderMainMenu();
      this.menuOverlayEl.classList.remove('hidden');
      this.modalOverlayEl.classList.add('hidden');
      this.bindMenuEvents();
    } else if (this.appScreen === 'corp_select') {
      this.menuOverlayEl.innerHTML = renderCorporationSelectModal(this.corpChoices);
      this.menuOverlayEl.classList.remove('hidden');
      this.modalOverlayEl.classList.add('hidden');
      this.bindCorpSelectEvents();
    } else if (this.appScreen === 'game') {
      this.menuOverlayEl.classList.add('hidden');
      this.render();
    }
  }

  bindMenuEvents() {
    // Start Game -> Triggers official setup with 2 dealt corporations
    document.getElementById('menu-start-game-btn')?.addEventListener('click', () => {
      sounds.click();
      const shuffledCorps = this.engine.shuffle([...CORPORATIONS]);
      this.corpChoices = [shuffledCorps[0], shuffledCorps[1]];
      this.appScreen = 'corp_select';
      this.renderScreen();
    });

    // Settings
    document.getElementById('menu-settings-btn')?.addEventListener('click', () => {
      sounds.click();
      this.modalOverlayEl.innerHTML = renderSettingsModal(this.settings);
      this.modalOverlayEl.classList.remove('hidden');

      document.getElementById('settings-audio-toggle')?.addEventListener('click', () => {
        this.toggleSound();
        const btn = document.getElementById('settings-audio-toggle');
        if (btn) {
          btn.textContent = sounds.enabled ? 'ATTIVO' : 'DISATTIVATO';
          btn.className = `px-3.5 py-1.5 rounded-lg font-bold text-xs border ${
            sounds.enabled 
              ? 'bg-emerald-950 text-emerald-300 border-emerald-600' 
              : 'bg-slate-900 text-slate-500 border-slate-700'
          }`;
        }
      });

      const closeSettings = () => {
        sounds.click();
        this.modalOverlayEl.classList.add('hidden');
      };
      document.getElementById('close-settings-btn')?.addEventListener('click', closeSettings);
      document.getElementById('save-settings-btn')?.addEventListener('click', closeSettings);
    });

    // Rules from menu
    document.getElementById('menu-rules-btn')?.addEventListener('click', () => {
      sounds.click();
      document.getElementById('rules-modal')?.classList.remove('hidden');
    });

    // Deck import from menu
    document.getElementById('menu-deck-btn')?.addEventListener('click', () => {
      sounds.click();
      document.getElementById('import-deck-modal')?.classList.remove('hidden');
    });
  }

  bindCorpSelectEvents() {
    document.querySelectorAll('[data-select-corp]').forEach(btn => {
      btn.addEventListener('click', () => {
        const chosenCorpId = btn.dataset.selectCorp;
        sounds.victory();

        // Bot gets another corporation
        const remainingCorps = CORPORATIONS.filter(c => c.id !== chosenCorpId);
        const botCorp = this.engine.shuffle(remainingCorps)[0];

        // Init game engine with chosen corps
        this.engine.initGame({ playerCorpId: chosenCorpId, botCorpId: botCorp.id });
        this.botAgent = new AresBot(this.engine.players[1], this.engine);

        this.appScreen = 'game';
        this.renderScreen();

        // Immediately open Planning Modal for Round 1
        setTimeout(() => {
          this.openPlanningModal();
        }, 150);
      });
    });
  }

  switchTab(tab) {
    this.currentTab = tab;
    sounds.click();
    document.querySelectorAll('.tab-btn').forEach(btn => {
      const isActive = btn.dataset.tab === tab;
      btn.classList.toggle('border-amber-400', isActive);
      btn.classList.toggle('text-amber-400', isActive);
      btn.classList.toggle('text-slate-400', !isActive);
      btn.classList.toggle('border-transparent', !isActive);
    });
    this.renderCardsArea();
  }

  onPlayCard(cardId) {
    try {
      const card = this.engine.playCard(cardId, this.engine.players[0]);
      sounds.cardPlay();
      this.render();
    } catch (err) {
      alert(err.message);
    }
  }

  onSellCard(cardId) {
    try {
      this.engine.sellCard(cardId, this.engine.players[0]);
      sounds.click();
      this.render();
    } catch (err) {
      alert(err.message);
    }
  }

  onActivateCardAction(cardId) {
    try {
      this.engine.activateCardAction(cardId, this.engine.players[0]);
      sounds.paramUp();
      this.render();
    } catch (err) {
      alert(err.message);
    }
  }

  onStandardAction(actionId) {
    try {
      this.engine.executeStandardAction(actionId, this.engine.players[0]);
      if (actionId.includes('temp') || actionId.includes('forest')) {
        sounds.paramUp();
      } else if (actionId.includes('ocean')) {
        sounds.oceanFlip();
      }
      this.render();
    } catch (err) {
      alert(err.message);
    }
  }

  onPlayerPassPhase() {
    sounds.click();

    // In Phase 5, prevent passing if player has not picked cards yet
    const phaseId = this.engine.phaseResolution?.phaseId;
    if (phaseId === 5 && this.engine.phaseResolution?.researchOffered?.['player']) {
      alert('Devi prima selezionare le carte da tenere per completare la Fase di Ricerca!');
      this.openResearchModal();
      return;
    }

    // Bot takes turn in current phase if not already done
    if (!this.engine.phaseResolution.botDone) {
      this.botAgent.takeTurnInPhase();
    }

    this.engine.playerPassPhase();
    this.render();

    // If step advanced to planning (new round!), open Planning modal automatically!
    if (this.engine.step === 'planning') {
      setTimeout(() => {
        this.openPlanningModal();
      }, 200);
    }
  }

  // --- MODAL CONTROLLERS ---

  openPlanningModal() {
    if (this.engine.step !== 'planning') return;

    this.modalOverlayEl.innerHTML = renderPhaseSelectionModal(this.engine.players[0], this.engine.round);
    this.modalOverlayEl.classList.remove('hidden');

    const options = document.querySelectorAll('.phase-card-option');
    const confirmBtn = document.getElementById('confirm-phase-btn');
    const hint = document.getElementById('selected-phase-hint');
    this.selectedPhaseCandidate = null;

    options.forEach(opt => {
      opt.addEventListener('click', () => {
        const phaseId = parseInt(opt.dataset.phaseId);
        if (phaseId === this.engine.players[0].lastSelectedPhase) return;

        sounds.click();
        this.selectedPhaseCandidate = phaseId;

        options.forEach(o => o.classList.remove('ring-4', 'ring-amber-400', 'bg-amber-950/40'));
        opt.classList.add('ring-4', 'ring-amber-400', 'bg-amber-950/40');

        const cfg = Object.values(PHASES).find(p => p.id === phaseId);
        hint.innerHTML = `Selezionata: <strong class="text-amber-400">Fase ${phaseId} - ${cfg.nameIt}</strong>. Clicca su Conferma.`;
        confirmBtn.removeAttribute('disabled');
      });
    });

    confirmBtn?.addEventListener('click', () => {
      if (!this.selectedPhaseCandidate) return;
      this.engine.setPhaseChoice('player', this.selectedPhaseCandidate);

      // Bot selects phase
      this.botAgent.choosePhase();

      // Start resolution
      this.engine.startResolution();
      sounds.phaseAdvance();

      this.selectedPhaseCandidate = null;
      this.modalOverlayEl.classList.add('hidden');
      this.render();
    });
  }

  openResearchModal() {
    const researchOffer = this.engine.phaseResolution?.researchOffered?.['player'];
    if (!researchOffer) return;
    this.modalOverlayEl.innerHTML = renderResearchModal(researchOffer);
    this.modalOverlayEl.classList.remove('hidden');
    this.bindResearchModalEvents(researchOffer);
  }

  bindResearchModalEvents(researchOffer) {
    const cardChoices = document.querySelectorAll('.research-card-choice');
    const confirmBtn = document.getElementById('confirm-research-btn');
    const counterEl = document.getElementById('research-selection-counter');
    this.selectedResearchCards.clear();

    cardChoices.forEach(choice => {
      choice.addEventListener('click', () => {
        const cardId = choice.dataset.researchCardId;
        const checkbox = choice.querySelector('.research-checkbox');

        if (this.selectedResearchCards.has(cardId)) {
          this.selectedResearchCards.delete(cardId);
          if (checkbox) checkbox.checked = false;
          choice.classList.remove('ring-2', 'ring-pink-500', 'bg-pink-950/40');
        } else {
          if (this.selectedResearchCards.size >= researchOffer.keepCount) return;
          this.selectedResearchCards.add(cardId);
          if (checkbox) checkbox.checked = true;
          choice.classList.add('ring-2', 'ring-pink-500', 'bg-pink-950/40');
        }

        sounds.click();
        if (counterEl) counterEl.textContent = `Selezionate: ${this.selectedResearchCards.size} / ${researchOffer.keepCount}`;
        if (confirmBtn) {
          if (this.selectedResearchCards.size === researchOffer.keepCount) {
            confirmBtn.removeAttribute('disabled');
          } else {
            confirmBtn.setAttribute('disabled', 'true');
          }
        }
      });
    });

    confirmBtn?.addEventListener('click', () => {
      const kept = Array.from(this.selectedResearchCards);
      this.engine.completeResearch(this.engine.players[0], kept);
      sounds.cardPlay();

      // Bot executes its research
      if (this.engine.phaseResolution?.researchOffered?.['bot']) {
        this.botAgent.executeResearchPhase();
      }

      this.modalOverlayEl.classList.add('hidden');
      this.render();

      // If completing research also ends round -> advance to planning modal for new round!
      if (this.engine.step === 'planning') {
        setTimeout(() => {
          this.openPlanningModal();
        }, 200);
      }
    });
  }

  bindInlineResearchEvents(researchOffer) {
    const choices = this.cardsContainerEl.querySelectorAll('.research-card-choice');
    const confirmBtn = document.getElementById('confirm-research-btn-inline');
    const counterEl = document.getElementById('research-selection-counter-inline');
    this.selectedResearchCards.clear();

    choices.forEach(choice => {
      choice.addEventListener('click', () => {
        const cardId = choice.dataset.researchCardId;
        const checkbox = choice.querySelector('.research-checkbox');

        if (this.selectedResearchCards.has(cardId)) {
          this.selectedResearchCards.delete(cardId);
          if (checkbox) checkbox.checked = false;
          choice.classList.remove('ring-2', 'ring-pink-500', 'bg-pink-950/40');
        } else {
          if (this.selectedResearchCards.size >= researchOffer.keepCount) return;
          this.selectedResearchCards.add(cardId);
          if (checkbox) checkbox.checked = true;
          choice.classList.add('ring-2', 'ring-pink-500', 'bg-pink-950/40');
        }

        sounds.click();
        if (counterEl) counterEl.textContent = `Selezionate: ${this.selectedResearchCards.size} / ${researchOffer.keepCount}`;
        if (confirmBtn) {
          if (this.selectedResearchCards.size === researchOffer.keepCount) {
            confirmBtn.removeAttribute('disabled');
          } else {
            confirmBtn.setAttribute('disabled', 'true');
          }
        }
      });
    });

    confirmBtn?.addEventListener('click', () => {
      const kept = Array.from(this.selectedResearchCards);
      this.engine.completeResearch(this.engine.players[0], kept);
      sounds.cardPlay();

      // Bot research
      if (this.engine.phaseResolution?.researchOffered?.['bot']) {
        this.botAgent.executeResearchPhase();
      }

      this.render();

      if (this.engine.step === 'planning') {
        setTimeout(() => {
          this.openPlanningModal();
        }, 200);
      }
    });
  }

  // --- RENDER GAME DASHBOARD ---

  render() {
    if (this.appScreen !== 'game') return;

    const player = this.engine.players[0];
    const bot = this.engine.players[1];

    // Update Round Indicator
    if (this.roundIndicatorEl) {
      this.roundIndicatorEl.textContent = `Round ${this.engine.round}`;
    }

    // Render Mars Board
    if (this.marsBoardEl) {
      this.marsBoardEl.innerHTML = renderMarsBoard(this.engine.global);
    }

    // Render Player Dashboard
    const standardActionsEnabled = this.engine.step === 'resolution' && this.engine.phaseResolution.phaseId === 3;
    if (this.playerDashboardEl) {
      this.playerDashboardEl.innerHTML = renderPlayerDashboard(player, true, standardActionsEnabled);
    }

    // Render Bot Dashboard
    if (this.botDashboardEl) {
      this.botDashboardEl.innerHTML = renderBotDashboard(bot);
    }

    // Render Phase Banner
    this.renderPhaseBanner();

    // Render Cards in current tab
    this.renderCardsArea();

    // Render Game Logs
    this.renderLogs();

    // Handle Modals
    this.renderModals();
  }

  renderPhaseBanner() {
    if (!this.phaseBannerEl) return;

    if (this.engine.step === 'planning') {
      this.phaseBannerEl.innerHTML = `
        <div class="flex flex-wrap items-center justify-between gap-3 w-full">
          <div class="flex items-center gap-3">
            <span class="w-10 h-10 rounded-xl bg-amber-500/20 border-2 border-amber-400 text-amber-300 flex items-center justify-center font-black text-lg animate-pulse">
              🎯
            </span>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-black text-sm text-white font-orbitron uppercase tracking-wider">Passo 1: Pianificazione Simultanea</span>
                <span class="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  Round ${this.engine.round}
                </span>
              </div>
              <p class="text-xs text-slate-300 mt-0.5">
                Scegli segretamente una delle tue 5 fasi. Premi il pulsante a destra per aprire la selezione.
              </p>
            </div>
          </div>

          <button 
            data-action="open_planning_modal"
            class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs uppercase font-orbitron tracking-wider transition shadow-lg shadow-amber-500/30 animate-bounce flex items-center gap-2"
          >
            <span>🎯</span>
            <span>Scegli Carta Fase (Round ${this.engine.round})</span>
          </button>
        </div>
      `;
    } else if (this.engine.step === 'resolution') {
      const phaseId = this.engine.phaseResolution.phaseId;
      const phaseConfig = Object.values(PHASES).find(p => p.id === phaseId);
      const player = this.engine.players[0];
      const bot = this.engine.players[1];
      const isChooser = player.selectedPhase === phaseId;
      const playsLeft = this.engine.phaseResolution.cardPlaysRemaining[player.id] || 0;
      const researchOffer = this.engine.phaseResolution?.researchOffered?.['player'];

      // Active phases timeline
      const phaseTimelineHTML = this.engine.activePhases.map(pid => {
        const cfg = Object.values(PHASES).find(p => p.id === pid);
        const isCurrent = pid === phaseId;
        return `
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold font-mono border transition ${
            isCurrent 
              ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/30' 
              : 'bg-slate-950/70 text-slate-400 border-slate-800'
          }">
            <span>${pid}</span>
            <span>${cfg.nameIt}</span>
            ${isCurrent ? '<span class="text-[10px] bg-slate-900 text-amber-300 px-1 rounded uppercase">Attiva</span>' : ''}
          </span>
        `;
      }).join('<span class="text-slate-600 font-bold">➔</span>');

      this.phaseBannerEl.innerHTML = `
        <div class="flex flex-col gap-3 w-full">
          <!-- Timeline row -->
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-[11px] text-slate-400 font-mono uppercase font-bold">Sequenza Fasi Round ${this.engine.round}:</span>
              <div class="flex items-center gap-1.5 flex-wrap">
                ${phaseTimelineHTML}
              </div>
            </div>

            <div class="text-[11px] text-slate-400">
              Scelta Tua: <strong class="text-amber-400">Fase ${player.selectedPhase}</strong> | Bot: <strong class="text-slate-300">Fase ${bot.selectedPhase}</strong>
            </div>
          </div>

          <!-- Phase details row -->
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <span class="w-10 h-10 rounded-xl flex items-center justify-center font-black text-slate-950 font-mono text-base shadow-lg" style="background-color: ${phaseConfig.color}">
                ${phaseId}
              </span>
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="font-black text-base text-white uppercase tracking-wider font-orbitron">${phaseConfig.nameIt} (${phaseConfig.name})</h3>
                  ${isChooser ? `
                    <span class="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                      Tuo Bonus di Guida Attivo!
                    </span>
                  ` : `
                    <span class="bg-slate-800 text-slate-400 text-[10px] px-2.5 py-0.5 rounded-full">
                      Azione Base (Fase scelta dal Bot)
                    </span>
                  `}
                </div>
                <p class="text-xs text-slate-300 mt-0.5">
                  ${phaseConfig.description} ${isChooser ? `<span class="text-amber-300 font-semibold">• ${phaseConfig.bonusDescription}</span>` : ''}
                </p>
              </div>
            </div>

            <!-- Contextual action buttons -->
            <div class="flex items-center gap-2">
              ${(phaseId === 1 || phaseId === 2) ? `
                <span class="text-xs bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-300 font-mono">
                  Giocate rimaste: <strong class="text-amber-400">${playsLeft}</strong>
                </span>
              ` : ''}

              ${phaseId === 5 && researchOffer ? `
                <button 
                  data-action="open_research_modal"
                  class="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-black text-xs uppercase tracking-wider transition shadow-lg shadow-pink-600/40 animate-pulse flex items-center gap-2 font-orbitron"
                >
                  <span>🃏</span>
                  <span>Scegli Carte Ricerca (${researchOffer.cards.length} Pescate)</span>
                </button>
              ` : ''}

              <button 
                data-action="pass_phase"
                class="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase font-orbitron tracking-wider transition shadow-lg shadow-amber-500/20"
              >
                ${phaseId === 5 && researchOffer ? 'Completa Ricerca' : 'Passa / Concludi Fase'}
              </button>
            </div>
          </div>

          <!-- Helper hint if waiting for next phase -->
          ${player.selectedPhase === 5 && phaseId < 5 ? `
            <div class="bg-pink-950/40 border border-pink-700/50 rounded-lg px-3 py-1.5 text-xs text-pink-300 flex items-center gap-2">
              <span>💡</span>
              <span>Hai scelto la <strong>Fase 5 (Ricerca)</strong>. È attualmente in corso la Fase ${phaseId} scelta dal Bot. Gioca le tue carte o premi <strong>"Passa / Concludi Fase"</strong> per avanzare alla Fase di Ricerca e pescare le tue carte!</span>
            </div>
          ` : ''}
        </div>
      `;
    }
  }

  renderCardsArea() {
    if (!this.cardsContainerEl) return;
    const player = this.engine.players[0];
    const phaseId = this.engine.phaseResolution?.phaseId;
    const researchOffer = this.engine.phaseResolution?.researchOffered?.['player'];

    // Update tab counts
    document.getElementById('tab-count-hand').textContent = player.hand.length;
    document.getElementById('tab-count-green').textContent = player.playedCards.filter(c => c.type === 'green').length;
    document.getElementById('tab-count-blue').textContent = player.playedCards.filter(c => c.type === 'blue').length;
    document.getElementById('tab-count-red').textContent = player.playedCards.filter(c => c.type === 'red').length;

    // IF Phase 5 is active and player has cards to pick, show research draft banner directly!
    let researchDraftHTML = '';
    if (phaseId === 5 && researchOffer) {
      researchDraftHTML = `
        <div class="col-span-full bg-pink-950/40 border-2 border-pink-500 rounded-2xl p-4 mb-4 shadow-xl">
          <div class="flex flex-wrap items-center justify-between gap-3 mb-3 border-b border-pink-800/60 pb-3">
            <div>
              <span class="text-xs font-bold text-pink-400 uppercase tracking-widest block font-mono">Fase V: Banco di Ricerca</span>
              <h3 class="text-lg font-black text-white font-orbitron">Scegli le carte da aggiungere alla tua mano</h3>
              <p class="text-xs text-pink-200">
                Hai pescato ${researchOffer.cards.length} carte dal mazzo. Clicca su <strong>${researchOffer.keepCount}</strong> ${researchOffer.keepCount === 1 ? 'carta' : 'carte'} e premi "Aggiungi alla Mano" (oppure usa la finestra modale).
              </p>
            </div>
            <button 
              data-action="open_research_modal"
              class="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs uppercase font-mono shadow-lg transition"
            >
              Apri in Finestra Modale
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-3">
            ${researchOffer.cards.map(card => `
              <div 
                data-research-card-id="${card.id}"
                class="research-card-choice border-2 border-slate-700 rounded-xl p-3 bg-slate-950/90 cursor-pointer transition-all duration-200 hover:border-pink-500 flex flex-col justify-between"
              >
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-amber-400 font-mono font-bold text-xs">${card.cost} MC</span>
                    <span class="text-[10px] text-pink-400 uppercase font-bold">${card.type}</span>
                  </div>
                  <h4 class="font-bold text-xs text-white leading-tight mb-1">${card.nameIt || card.name}</h4>
                  <p class="text-[10px] text-slate-300 leading-snug">${card.description}</p>
                </div>

                <div class="pt-2 border-t border-slate-800 mt-2 flex items-center justify-between">
                  <span class="text-[10px] text-slate-400">Clicca per scegliere</span>
                  <input type="checkbox" class="research-checkbox pointer-events-none w-4 h-4 rounded text-pink-500 bg-slate-800 border-slate-700" value="${card.id}">
                </div>
              </div>
            `).join('')}
          </div>

          <div class="flex items-center justify-between pt-2 border-t border-pink-900/60">
            <span id="research-selection-counter-inline" class="text-xs text-pink-300 font-mono font-bold">
              Selezionate: 0 / ${researchOffer.keepCount}
            </span>
            <button 
              id="confirm-research-btn-inline"
              disabled
              class="px-6 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-black text-xs uppercase font-mono transition disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
            >
              Aggiungi alla Mano
            </button>
          </div>
        </div>
      `;
    }

    let cardsToShow = [];
    let location = 'hand';

    if (this.currentTab === 'hand') {
      cardsToShow = player.hand;
      location = 'hand';
    } else if (this.currentTab === 'green') {
      cardsToShow = player.playedCards.filter(c => c.type === 'green');
      location = 'played_green';
    } else if (this.currentTab === 'blue') {
      cardsToShow = player.playedCards.filter(c => c.type === 'blue');
      location = 'played_blue';
    } else if (this.currentTab === 'red') {
      cardsToShow = player.playedCards.filter(c => c.type === 'red');
      location = 'played_red';
    }

    let cardsListHTML = '';
    if (cardsToShow.length === 0) {
      cardsListHTML = `
        <div class="col-span-full py-12 text-center text-slate-500 text-sm border-2 border-dashed border-slate-800 rounded-2xl">
          Nessuna carta presente in questa sezione.
        </div>
      `;
    } else {
      cardsListHTML = cardsToShow.map(card => {
        let validation = null;
        if (location === 'hand') {
          validation = this.engine.canPlayCard(card, player, phaseId);
        }
        return renderCard(card, player, phaseId, validation, location);
      }).join('');
    }

    this.cardsContainerEl.innerHTML = researchDraftHTML + cardsListHTML;

    // Bind inline research events if present
    if (phaseId === 5 && researchOffer) {
      this.bindInlineResearchEvents(researchOffer);
    }
  }

  renderLogs() {
    if (!this.gameLogEl) return;
    this.gameLogEl.innerHTML = this.engine.logs.slice(0, 50).map(log => `
      <div class="text-[11px] leading-snug py-1 border-b border-slate-800/60 font-sans">
        <span class="text-slate-500 font-mono">[R${log.round} ${log.time}]</span>
        <span class="text-slate-300 ml-1.5">${log.text}</span>
      </div>
    `).join('');
  }

  renderModals() {
    if (!this.modalOverlayEl) return;

    // 1. Planning Step Modal
    if (this.engine.step === 'planning') {
      this.openPlanningModal();
      return;
    }

    // 2. Research Phase Modal (Phase V)
    const researchOffer = this.engine.phaseResolution?.researchOffered?.['player'];
    if (this.engine.step === 'resolution' && this.engine.phaseResolution.phaseId === 5 && researchOffer) {
      this.openResearchModal();
      return;
    }

    // 3. Game Over Modal
    if (this.engine.isGameOver && this.engine.finalScores) {
      sounds.victory();
      this.modalOverlayEl.innerHTML = renderGameOverModal(this.engine.finalScores);
      this.modalOverlayEl.classList.remove('hidden');

      document.getElementById('restart-game-btn')?.addEventListener('click', () => {
        sounds.click();
        this.appScreen = 'menu';
        this.renderScreen();
      });
      return;
    }

    // Hide overlay if no modal is active
    this.modalOverlayEl.classList.add('hidden');
  }
}

// Initialize on page load
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    window.aresApp = new AresApp();
  });
}
