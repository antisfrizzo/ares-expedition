/**
 * Main Menu and Setup Screens for Terraforming Mars: Ares Expedition
 * Styled precisely with authentic boardgame typography and sci-fi aesthetics.
 */

import { CORPORATIONS } from '../data/corporations.js';

export function renderMainMenu() {
  return `
    <div id="main-menu-screen" class="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 overflow-y-auto" style="background: radial-gradient(circle at 50% 25%, #2a0808 0%, #0d0407 45%, #05060d 100%);">
      
      <!-- Starfield & Mars background effect -->
      <div class="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:32px_32px]"></div>
      
      <!-- Top Aerospace Header info -->
      <div class="relative z-10 w-full max-w-5xl flex items-center justify-between text-xs font-mono text-slate-400 border-b border-red-950/60 pb-3">
        <span class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>ARES EXPEDITION • MISSION CONTROL</span>
        </span>
        <span class="text-amber-500/80 font-bold tracking-wider">SOL 2341 • MARS RECONNAISSANCE</span>
      </div>

      <!-- Center Logo & Title Block -->
      <div class="relative z-10 text-center my-auto py-8 max-w-3xl">
        <!-- Mars Planet Graphic Icon -->
        <div class="w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-tr from-red-700 via-orange-600 to-amber-400 shadow-[0_0_60px_rgba(239,68,68,0.5)] border-2 border-amber-400/40 flex items-center justify-center relative overflow-hidden group">
          <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.4)_0%,transparent_60%)]"></div>
          <!-- Surface Crater details -->
          <div class="w-12 h-12 rounded-full border border-red-900/40 bg-red-900/30 absolute -bottom-2 -left-2"></div>
          <div class="w-8 h-8 rounded-full border border-red-900/40 bg-red-900/30 absolute top-4 right-2"></div>
          <span class="text-4xl filter drop-shadow-md">🪐</span>
        </div>

        <!-- Official Logo Typography -->
        <h1 class="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 uppercase font-orbitron leading-none drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
          TERRAFORMING
        </h1>
        <h1 class="text-5xl sm:text-7xl md:text-8xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 uppercase font-orbitron leading-none mt-1 drop-shadow-[0_0_35px_rgba(239,68,68,0.6)]">
          MARS
        </h1>

        <!-- Ares Expedition Subtitle Banner -->
        <div class="mt-4 flex items-center justify-center gap-3">
          <div class="h-[2px] w-12 sm:w-24 bg-gradient-to-r from-transparent to-amber-500"></div>
          <h2 class="text-sm sm:text-xl md:text-2xl font-black text-amber-300 uppercase tracking-[0.3em] font-michroma drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
            ARES EXPEDITION
          </h2>
          <div class="h-[2px] w-12 sm:w-24 bg-gradient-to-l from-transparent to-amber-500"></div>
        </div>
        <p class="text-xs sm:text-sm text-slate-400 font-mono tracking-widest uppercase mt-2">
          Edizione Digitale per Browser • Simulazione Ufficiale
        </p>

        <!-- Menu Navigation Buttons -->
        <div class="mt-10 flex flex-col items-center gap-3.5 max-w-md mx-auto w-full">
          
          <!-- Start Game Button -->
          <button 
            id="menu-start-game-btn"
            class="w-full py-4 px-8 rounded-xl font-black text-sm uppercase tracking-widest font-orbitron transition-all duration-300 flex items-center justify-center gap-3 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 hover:from-red-500 hover:via-orange-400 hover:to-amber-400 text-slate-950 shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:shadow-[0_0_40px_rgba(245,158,11,0.7)] hover:scale-102 active:scale-98 border border-amber-300/60"
          >
            <span class="text-xl">🚀</span>
            <span>Avvia Partita</span>
          </button>

          <!-- Settings Button -->
          <button 
            id="menu-settings-btn"
            class="w-full py-3.5 px-8 rounded-xl font-bold text-xs uppercase tracking-widest font-orbitron transition-all duration-200 flex items-center justify-center gap-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-amber-400/60 hover:text-white shadow-lg shadow-black/40"
          >
            <span>⚙️</span>
            <span>Impostazioni</span>
          </button>

          <!-- Rules Button -->
          <button 
            id="menu-rules-btn"
            class="w-full py-3.5 px-8 rounded-xl font-bold text-xs uppercase tracking-widest font-orbitron transition-all duration-200 flex items-center justify-center gap-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-cyan-400/60 hover:text-white shadow-lg shadow-black/40"
          >
            <span>📖</span>
            <span>Regolamento Ufficiale</span>
          </button>

          <!-- Import Deck Button -->
          <button 
            id="menu-deck-btn"
            class="w-full py-3 px-8 rounded-xl font-bold text-xs uppercase tracking-widest font-mono transition-all duration-200 flex items-center justify-center gap-2 bg-slate-950/60 hover:bg-slate-900 text-slate-400 hover:text-cyan-300 border border-slate-800"
          >
            <span>📥</span>
            <span>Gestione Mazzo Progetti (JSON)</span>
          </button>

        </div>
      </div>

      <!-- Footer Info -->
      <div class="relative z-10 w-full max-w-5xl flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-500 border-t border-slate-800/80 pt-4 gap-2">
        <span>Terraforming Mars: Ares Expedition © FryxGames & Stronghold Games</span>
        <span class="text-amber-500/80 font-bold">Client-Side Engine v1.2</span>
      </div>

    </div>
  `;
}

export function renderCorporationSelectModal(corpOptions) {
  return `
    <div id="corp-select-modal" class="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div class="bg-slate-900 border-2 border-amber-500/60 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        
        <div class="text-center mb-6">
          <span class="text-xs font-bold text-amber-400 uppercase tracking-widest block font-mono mb-1">Preparazione Partita (Setup Ufficiale)</span>
          <h2 class="text-2xl sm:text-3xl font-black text-white font-orbitron uppercase">Scegli la tua Corporazione</h2>
          <p class="text-xs text-slate-400 mt-1">
            Ti sono state distribuite 2 corporazioni. Seleziona quella con cui guidare la spedizione su Marte.
          </p>
        </div>

        <!-- 2 Corporation Cards Comparison -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          ${corpOptions.map((corp, idx) => `
            <div class="bg-slate-950/90 border-2 border-slate-700 hover:border-amber-400 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 shadow-xl group">
              <div>
                <div class="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
                  <div>
                    <h3 class="text-xl font-black text-white font-orbitron group-hover:text-amber-300 transition">${corp.name}</h3>
                    <p class="text-xs text-amber-400 font-medium">${corp.subtitle}</p>
                  </div>
                  <div class="text-right">
                    <span class="text-[10px] text-slate-500 block uppercase font-mono font-bold">MC Iniziali</span>
                    <span class="text-2xl font-black text-amber-400 font-mono">${corp.startingMC} MC</span>
                  </div>
                </div>

                <!-- Starting Stats -->
                <div class="grid grid-cols-2 gap-2 text-xs font-mono mb-4 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <div>
                    <span class="text-slate-400 block text-[10px]">Produzione Iniziale:</span>
                    <span class="text-slate-200">
                      ${corp.startingProduction.plants ? `🌿 +${corp.startingProduction.plants} ` : ''}
                      ${corp.startingProduction.heat ? `🔥 +${corp.startingProduction.heat} ` : ''}
                      ${corp.startingProduction.mc ? `💰 +${corp.startingProduction.mc} ` : ''}
                      ${corp.startingProduction.cards ? `🃏 +${corp.startingProduction.cards} ` : ''}
                      ${!corp.startingProduction.plants && !corp.startingProduction.heat && !corp.startingProduction.mc && !corp.startingProduction.cards ? 'Standard' : ''}
                    </span>
                  </div>
                  <div>
                    <span class="text-slate-400 block text-[10px]">Risorse Iniziali:</span>
                    <span class="text-slate-200">
                      ${corp.startingResources.plants ? `🌿 ${corp.startingResources.plants} ` : ''}
                      ${corp.startingResources.heat ? `🔥 ${corp.startingResources.heat} ` : ''}
                      ${corp.startingResources.steel ? `🏗️ ${corp.startingResources.steel} ` : ''}
                      ${corp.startingResources.titanium ? `🚀 ${corp.startingResources.titanium} ` : ''}
                      ${!corp.startingResources.plants && !corp.startingResources.heat && !corp.startingResources.steel && !corp.startingResources.titanium ? 'Nessuna extra' : ''}
                    </span>
                  </div>
                </div>

                <!-- Rule Description -->
                <div class="bg-amber-950/20 border border-amber-900/40 p-3 rounded-xl mb-4">
                  <span class="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">Abilità Speciale:</span>
                  <p class="text-xs text-slate-200 leading-relaxed">${corp.description}</p>
                </div>
              </div>

              <button 
                data-select-corp="${corp.id}"
                class="w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider font-orbitron transition-all duration-200 bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                <span>🏢</span>
                <span>Seleziona ${corp.name}</span>
              </button>
            </div>
          `).join('')}
        </div>

      </div>
    </div>
  `;
}

export function renderSettingsModal(currentSettings) {
  return `
    <div id="settings-modal" class="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div class="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
          <h3 class="text-lg font-black text-amber-400 font-orbitron uppercase flex items-center gap-2">
            <span>⚙️</span> Impostazioni
          </h3>
          <button id="close-settings-btn" class="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-bold">
            ✕
          </button>
        </div>

        <div class="space-y-4 text-xs font-mono">
          <!-- Audio Setting -->
          <div class="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span class="font-bold text-white block text-sm">Effetti Sonori</span>
              <span class="text-[10px] text-slate-400">Sintetizzatore Web Audio FX</span>
            </div>
            <button 
              id="settings-audio-toggle"
              class="px-3.5 py-1.5 rounded-lg font-bold text-xs border ${
                currentSettings.soundEnabled 
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-600' 
                  : 'bg-slate-900 text-slate-500 border-slate-700'
              }"
            >
              ${currentSettings.soundEnabled ? 'ATTIVO' : 'DISATTIVATO'}
            </button>
          </div>

          <!-- Bot Difficulty -->
          <div class="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span class="font-bold text-white block text-sm">IA Ares Bot</span>
              <span class="text-[10px] text-slate-400">Algoritmo di decisione euristica</span>
            </div>
            <span class="px-3 py-1 rounded bg-amber-950/60 text-amber-300 border border-amber-700/60 font-bold text-[11px]">
              STANDARD
            </span>
          </div>

          <!-- Speed Setting -->
          <div class="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span class="font-bold text-white block text-sm">Validazione Regole</span>
              <span class="text-[10px] text-slate-400">Controllo rigido parametri e sconti</span>
            </div>
            <span class="px-3 py-1 rounded bg-blue-950/60 text-blue-300 border border-blue-700/60 font-bold text-[11px]">
              RIGIDA (UFFICIALE)
            </span>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-slate-800 text-right">
          <button id="save-settings-btn" class="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-orbitron text-xs uppercase tracking-wider transition">
            Chiudi
          </button>
        </div>
      </div>
    </div>
  `;
}
