/**
 * UI Components for Terraforming Mars: Ares Expedition
 * Clean, modern sci-fi dashboard design with high accessibility and rich feedback.
 */

import { PHASES, GLOBAL_PARAMS, STANDARD_ACTIONS, TAGS } from '../engine/types.js';

export function renderMarsBoard(global) {
  // Calculate percentage of terraforming completed
  const tempSteps = (global.temperature - GLOBAL_PARAMS.TEMPERATURE.min) / GLOBAL_PARAMS.TEMPERATURE.step; // max 19
  const oxySteps = global.oxygen; // max 14
  const oceanSteps = global.oceansFlipped; // max 9
  const totalMax = 19 + 14 + 9; // 42 total steps
  const currentSteps = tempSteps + oxySteps + oceanSteps;
  const progressPercent = Math.min(100, Math.round((currentSteps / totalMax) * 100));

  const tempPercent = Math.min(100, Math.round((tempSteps / 19) * 100));
  const oxyPercent = Math.min(100, Math.round((oxySteps / 14) * 100));

  return `
    <div class="bg-slate-900/90 border border-slate-700/80 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-2xl backdrop-blur-md">
      <!-- Mars Global Header & Progress -->
      <div class="flex flex-wrap items-center justify-between gap-2 sm:gap-4 mb-3 sm:mb-5 border-b border-slate-800 pb-3 sm:pb-4">
        <div class="flex items-center gap-2.5 sm:gap-3">
          <div class="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-red-600 via-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-900/40 text-xl sm:text-2xl animate-pulse shrink-0">
            🪐
          </div>
          <div>
            <h2 class="text-base sm:text-xl font-bold tracking-wider text-slate-100 uppercase">Marte: Parametri Globali</h2>
            <p class="text-[11px] sm:text-xs text-slate-400">Progresso Terraforming: <span class="text-orange-400 font-semibold">${progressPercent}%</span></p>
          </div>
        </div>

        <div class="w-full sm:w-64 bg-slate-800/90 rounded-full h-2.5 sm:h-3 border border-slate-700 overflow-hidden relative">
          <div class="bg-gradient-to-r from-red-500 via-amber-500 to-emerald-400 h-full rounded-full transition-all duration-700" style="width: ${progressPercent}%"></div>
        </div>
      </div>

      <!-- Tracks Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-5">
        
        <!-- TEMPERATURE TRACK -->
        <div class="bg-slate-950/70 border border-red-950/60 rounded-xl p-3 sm:p-4 flex flex-col justify-between relative overflow-hidden group hover:border-red-600/50 transition">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>🌡️</span> Temperatura
            </span>
            <span class="text-sm sm:text-base font-black text-red-400 font-mono">
              ${global.temperature > 0 ? '+' : ''}${global.temperature}°C
            </span>
          </div>

          <div class="w-full bg-slate-900 rounded-full h-2.5 sm:h-3 border border-slate-800 overflow-hidden my-1.5 sm:my-2 relative">
            <div class="bg-gradient-to-r from-blue-600 via-amber-500 to-red-500 h-full rounded-full transition-all duration-500" style="width: ${tempPercent}%"></div>
          </div>

          <div class="flex justify-between items-center text-[9px] sm:text-[10px] text-slate-400 mt-1">
            <span>-30°C</span>
            <span class="${global.temperature >= -24 ? 'text-amber-400 font-bold' : ''}">-24° (+Calore)</span>
            <span class="${global.temperature >= 0 ? 'text-blue-400 font-bold' : ''}">0° (Oceano)</span>
            <span class="text-red-400 font-bold">+8°C</span>
          </div>
        </div>

        <!-- OXYGEN TRACK -->
        <div class="bg-slate-950/70 border border-emerald-950/60 rounded-xl p-3 sm:p-4 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-600/50 transition">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>💨</span> Ossigeno
            </span>
            <span class="text-sm sm:text-base font-black text-emerald-400 font-mono">${global.oxygen}%</span>
          </div>

          <div class="w-full bg-slate-900 rounded-full h-2.5 sm:h-3 border border-slate-800 overflow-hidden my-1.5 sm:my-2 relative">
            <div class="bg-gradient-to-r from-slate-600 via-emerald-600 to-emerald-400 h-full rounded-full transition-all duration-500" style="width: ${oxyPercent}%"></div>
          </div>

          <div class="flex justify-between items-center text-[9px] sm:text-[10px] text-slate-400 mt-1">
            <span>0%</span>
            <span class="${global.oxygen >= 8 ? 'text-red-400 font-bold' : ''}">8% (+Temp)</span>
            <span class="text-emerald-400 font-bold">14% (Max)</span>
          </div>
        </div>

        <!-- OCEANS TRACK -->
        <div class="bg-slate-950/70 border border-blue-950/60 rounded-xl p-3 sm:p-4 flex flex-col justify-between relative overflow-hidden group hover:border-blue-600/50 transition">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>🌊</span> Oceani (${global.oceansFlipped}/9)
            </span>
            <span class="text-xs font-mono text-blue-300 font-bold">${global.oceansFlipped === 9 ? 'Completati' : (9 - global.oceansFlipped) + ' Rimasti'}</span>
          </div>

          <!-- 9 Ocean Tiles Grid -->
          <div class="grid grid-cols-9 gap-1 my-1.5">
            ${global.oceanTiles.map((t, idx) => `
              <div 
                title="Tessera Oceano #${idx + 1}: ${t.flipped ? t.label + ' (GIRATA)' : 'Non girata (Bonus: ' + t.label + ')'}"
                class="h-7 sm:h-8 rounded-md sm:rounded-lg flex items-center justify-center text-[10px] sm:text-[11px] font-bold border transition-all duration-300 ${
                  t.flipped 
                    ? 'bg-gradient-to-br from-blue-600 to-cyan-500 border-cyan-300 text-white shadow-md shadow-blue-500/30' 
                    : 'bg-slate-900 border-slate-700/80 text-slate-600 hover:border-blue-500/50'
                }"
              >
                ${t.flipped ? '🌊' : idx + 1}
              </div>
            `).join('')}
          </div>

          <div class="text-[9px] sm:text-[10px] text-slate-400 flex justify-between items-center mt-1">
            <span>+1 TR per tessera</span>
            <span class="text-cyan-400 font-semibold font-mono">15 MC</span>
          </div>
        </div>

      </div>
    </div>
  `;
}

export function renderPlayerDashboard(player, isCurrentActive = true, standardActionsEnabled = false) {
  const corp = player.corporation;

  return `
    <div class="bg-slate-900/90 border border-slate-700/80 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-2xl backdrop-blur-md">
      <!-- Player & Corporation Banner -->
      <div class="flex flex-wrap items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-5 border-b border-slate-800 pb-3 sm:pb-4">
        <div class="flex items-center gap-2.5 sm:gap-4 min-w-0">
          <div class="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-xl sm:text-3xl shadow-lg shadow-amber-900/40 border border-amber-300/40 shrink-0">
            🏢
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h2 class="text-base sm:text-xl font-bold tracking-wide text-white truncate">${player.name}</h2>
              <span class="bg-slate-800 text-slate-300 text-[10px] sm:text-xs px-2 py-0.5 rounded-full border border-slate-700 font-mono">
                ${corp.name}
              </span>
            </div>
            <p class="text-[11px] sm:text-xs text-amber-300/90 font-medium">${corp.subtitle}</p>
            <p class="text-[10px] sm:text-[11px] text-slate-400 max-w-xl mt-0.5 leading-snug line-clamp-2 sm:line-clamp-none">${corp.description}</p>
          </div>
        </div>

        <!-- TR Badge & Forest Tokens -->
        <div class="flex items-center gap-2.5 sm:gap-4 shrink-0">
          <div class="flex flex-col items-center bg-gradient-to-b from-red-600/30 to-red-900/40 border border-red-500/40 rounded-xl px-2.5 sm:px-4 py-1.5 sm:py-2 shadow-inner">
            <span class="text-[9px] sm:text-[10px] font-bold text-red-300 uppercase tracking-widest">Rating TR</span>
            <span class="text-xl sm:text-3xl font-black text-white font-mono leading-tight">${player.tr}</span>
            <span class="text-[9px] sm:text-[10px] text-red-200/80 font-mono">+${player.tr} MC</span>
          </div>

          <div class="flex flex-col items-center bg-emerald-950/40 border border-emerald-500/40 rounded-xl px-2.5 sm:px-4 py-1.5 sm:py-2 shadow-inner">
            <span class="text-[9px] sm:text-[10px] font-bold text-emerald-300 uppercase tracking-widest">Foreste</span>
            <span class="text-xl sm:text-3xl font-black text-emerald-300 font-mono leading-tight">${player.forestTokens}</span>
            <span class="text-[9px] sm:text-[10px] text-emerald-400 font-mono">${player.forestTokens} PV</span>
          </div>
        </div>
      </div>

      <!-- Resource Stocks & Production Grid (3 cols on mobile, 6 cols on large screens) -->
      <div class="grid grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-3 sm:mb-5">
        
        <!-- MC -->
        <div class="bg-slate-950/80 border border-amber-900/50 rounded-xl p-2 sm:p-3 flex flex-col justify-between">
          <div class="flex items-center justify-between text-[11px] sm:text-xs text-amber-400 font-bold uppercase">
            <span>💰 MC</span>
            <span class="text-[9px] sm:text-[10px] bg-amber-950/70 border border-amber-700/50 text-amber-300 px-1 py-0.5 rounded font-mono">
              +${player.production.mc}
            </span>
          </div>
          <div class="text-xl sm:text-2xl font-black text-amber-300 font-mono my-0.5 sm:my-1">${player.resources.mc}</div>
          <div class="text-[9px] sm:text-[10px] text-slate-400">Crediti</div>
        </div>

        <!-- CALORE -->
        <div class="bg-slate-950/80 border border-orange-900/50 rounded-xl p-2 sm:p-3 flex flex-col justify-between">
          <div class="flex items-center justify-between text-[11px] sm:text-xs text-orange-400 font-bold uppercase">
            <span>🔥 Calore</span>
            <span class="text-[9px] sm:text-[10px] bg-orange-950/70 border border-orange-700/50 text-orange-300 px-1 py-0.5 rounded font-mono">
              +${player.production.heat}
            </span>
          </div>
          <div class="text-xl sm:text-2xl font-black text-orange-400 font-mono my-0.5 sm:my-1">${player.resources.heat}</div>
          <div class="text-[9px] sm:text-[10px] text-slate-400">${player.corporation?.heatAsMC ? 'Usa come MC' : '8 = +1 Temp'}</div>
        </div>

        <!-- PIANTE -->
        <div class="bg-slate-950/80 border border-emerald-900/50 rounded-xl p-2 sm:p-3 flex flex-col justify-between">
          <div class="flex items-center justify-between text-[11px] sm:text-xs text-emerald-400 font-bold uppercase">
            <span>🌿 Piante</span>
            <span class="text-[9px] sm:text-[10px] bg-emerald-950/70 border border-emerald-700/50 text-emerald-300 px-1 py-0.5 rounded font-mono">
              +${player.production.plants}
            </span>
          </div>
          <div class="text-xl sm:text-2xl font-black text-emerald-400 font-mono my-0.5 sm:my-1">${player.resources.plants}</div>
          <div class="text-[9px] sm:text-[10px] text-slate-400">${player.customStandardActionCosts?.forestPlants || 8} = Foresta</div>
        </div>

        <!-- CARTE PROD -->
        <div class="bg-slate-950/80 border border-pink-900/50 rounded-xl p-2 sm:p-3 flex flex-col justify-between">
          <div class="flex items-center justify-between text-[11px] sm:text-xs text-pink-400 font-bold uppercase">
            <span>🃏 Carte</span>
            <span class="text-[9px] sm:text-[10px] bg-pink-950/70 border border-pink-700/50 text-pink-300 px-1 py-0.5 rounded font-mono">
              +${player.production.cards}
            </span>
          </div>
          <div class="text-xl sm:text-2xl font-black text-pink-300 font-mono my-0.5 sm:my-1">${player.hand.length}</div>
          <div class="text-[9px] sm:text-[10px] text-slate-400">In mano</div>
        </div>

        <!-- ACCIAIO -->
        <div class="bg-slate-950/80 border border-amber-950/60 rounded-xl p-2 sm:p-3 flex flex-col justify-between">
          <div class="flex items-center justify-between text-[11px] sm:text-xs text-amber-500 font-bold uppercase">
            <span>🏗️ Acciaio</span>
            <span class="text-[9px] text-slate-400 font-mono">${2 + (player.corporation?.steelValueBonus || 0)}MC</span>
          </div>
          <div class="text-xl sm:text-2xl font-black text-amber-400 font-mono my-0.5 sm:my-1">${player.resources.steel || 0}</div>
          <div class="text-[9px] sm:text-[10px] text-slate-400">Sconto Edifici</div>
        </div>

        <!-- TITANIO -->
        <div class="bg-slate-950/80 border border-slate-700/60 rounded-xl p-2 sm:p-3 flex flex-col justify-between">
          <div class="flex items-center justify-between text-[11px] sm:text-xs text-slate-300 font-bold uppercase">
            <span>🚀 Titanio</span>
            <span class="text-[9px] text-slate-400 font-mono">${3 + (player.corporation?.titaniumValueBonus || 0)}MC</span>
          </div>
          <div class="text-xl sm:text-2xl font-black text-slate-200 font-mono my-0.5 sm:my-1">${player.resources.titanium || 0}</div>
          <div class="text-[9px] sm:text-[10px] text-slate-400">Sconto Spazio</div>
        </div>

      </div>

      <!-- Standard Actions Bar (Visible in Phase III) -->
      ${standardActionsEnabled ? `
        <div class="bg-amber-950/30 border border-amber-600/40 rounded-xl p-2.5 sm:p-3.5 mb-2">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>⚡</span> Azioni Standard (Fase III Attiva)
            </span>
            <span class="text-[10px] sm:text-[11px] text-slate-400">Illimitate finché hai risorse</span>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5 sm:gap-2">
            <button 
              data-action="standard" data-action-id="forest_plants"
              class="px-2 py-2 rounded-lg bg-emerald-900/60 hover:bg-emerald-700 text-emerald-200 border border-emerald-500/50 text-xs font-bold flex flex-col items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed"
              ${player.resources.plants < (player.customStandardActionCosts?.forestPlants || 8) ? 'disabled' : ''}
            >
              <span>Foresta (${player.customStandardActionCosts?.forestPlants || 8} Piante)</span>
              <span class="text-[9px] sm:text-[10px] font-normal text-emerald-300 mt-0.5">+1 O2, +1 PV</span>
            </button>

            <button 
              data-action="standard" data-action-id="temp_heat"
              class="px-2 py-2 rounded-lg bg-orange-900/60 hover:bg-orange-700 text-orange-200 border border-orange-500/50 text-xs font-bold flex flex-col items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed"
              ${player.resources.heat < 8 ? 'disabled' : ''}
            >
              <span>Temp (8 Calore)</span>
              <span class="text-[9px] sm:text-[10px] font-normal text-orange-300 mt-0.5">+1 Temp, +1 TR</span>
            </button>

            <button 
              data-action="standard" data-action-id="ocean_mc"
              class="px-2 py-2 rounded-lg bg-blue-900/60 hover:bg-blue-700 text-blue-200 border border-blue-500/50 text-xs font-bold flex flex-col items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed"
              ${player.resources.mc < 15 ? 'disabled' : ''}
            >
              <span>Oceano (15 MC)</span>
              <span class="text-[9px] sm:text-[10px] font-normal text-blue-300 mt-0.5">+1 Oceano, +1 TR</span>
            </button>

            <button 
              data-action="standard" data-action-id="temp_mc"
              class="px-2 py-2 rounded-lg bg-red-900/60 hover:bg-red-700 text-red-200 border border-red-500/50 text-xs font-bold flex flex-col items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed"
              ${player.resources.mc < 14 ? 'disabled' : ''}
            >
              <span>Temp (14 MC)</span>
              <span class="text-[9px] sm:text-[10px] font-normal text-red-300 mt-0.5">+1 Temp, +1 TR</span>
            </button>

            <button 
              data-action="standard" data-action-id="forest_mc"
              class="px-2 py-2 rounded-lg bg-teal-900/60 hover:bg-teal-700 text-teal-200 border border-teal-500/50 text-xs font-bold flex flex-col items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed col-span-2 sm:col-span-1"
              ${player.resources.mc < 20 ? 'disabled' : ''}
            >
              <span>Foresta (20 MC)</span>
              <span class="text-[9px] sm:text-[10px] font-normal text-teal-300 mt-0.5">+1 O2, +1 PV</span>
            </button>
          </div>
        </div>
      ` : ''}

    </div>
  `;
}

export function renderBotDashboard(bot, engine = null) {
  const corp = bot.corporation;
  const botTags = engine?.getPlayerTags ? engine.getPlayerTags(bot) : {};
  const activeTags = Object.values(TAGS).filter(t => (botTags[t.id] || 0) > 0);

  return `
    <div class="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-3.5 sm:p-4 shadow-xl backdrop-blur-md flex flex-col justify-between">
      <div class="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-2.5">
        <div class="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div class="w-8 h-8 rounded-lg bg-red-600/30 border border-red-500/50 flex items-center justify-center text-lg shrink-0">
            🤖
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="font-bold text-xs sm:text-sm text-slate-200">${bot.name}</span>
              <span class="text-[9px] sm:text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700 font-mono truncate">${corp.name}</span>
            </div>
            <div class="text-[10px] sm:text-[11px] text-slate-400">
              Ultima fase: <span class="text-amber-400 font-semibold">${bot.lastSelectedPhase ? 'Fase ' + bot.lastSelectedPhase : 'Nessuna'}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 sm:gap-3 shrink-0">
          <div class="text-right">
            <span class="text-[9px] sm:text-[10px] text-red-400 uppercase font-bold block">Rating TR</span>
            <span class="text-lg sm:text-xl font-black text-red-400 font-mono leading-tight">${bot.tr}</span>
          </div>
          <div class="text-right">
            <span class="text-[9px] sm:text-[10px] text-emerald-400 uppercase font-bold block">Foreste</span>
            <span class="text-lg sm:text-xl font-black text-emerald-400 font-mono leading-tight">${bot.forestTokens}</span>
          </div>
        </div>
      </div>

      <!-- Resource stats mini-grid -->
      <div class="grid grid-cols-5 gap-1 text-center text-xs mb-2">
        <div class="bg-slate-950/60 p-1 rounded-lg border border-slate-800">
          <span class="text-[9px] text-amber-400 block font-bold">MC</span>
          <span class="font-bold text-slate-200 font-mono text-xs sm:text-sm">${bot.resources.mc}</span>
          <span class="text-[8px] text-slate-500 block font-mono">+${bot.production.mc}</span>
        </div>
        <div class="bg-slate-950/60 p-1 rounded-lg border border-slate-800">
          <span class="text-[9px] text-orange-400 block font-bold">Calore</span>
          <span class="font-bold text-slate-200 font-mono text-xs sm:text-sm">${bot.resources.heat}</span>
          <span class="text-[8px] text-slate-500 block font-mono">+${bot.production.heat}</span>
        </div>
        <div class="bg-slate-950/60 p-1 rounded-lg border border-slate-800">
          <span class="text-[9px] text-emerald-400 block font-bold">Piante</span>
          <span class="font-bold text-slate-200 font-mono text-xs sm:text-sm">${bot.resources.plants}</span>
          <span class="text-[8px] text-slate-500 block font-mono">+${bot.production.plants}</span>
        </div>
        <div class="bg-slate-950/60 p-1 rounded-lg border border-slate-800">
          <span class="text-[9px] text-pink-400 block font-bold">Mano</span>
          <span class="font-bold text-slate-200 font-mono text-xs sm:text-sm">${bot.hand.length}</span>
          <span class="text-[8px] text-slate-500 block font-mono">+${bot.production.cards}</span>
        </div>
        <div class="bg-slate-950/60 p-1 rounded-lg border border-slate-800">
          <span class="text-[9px] text-blue-400 block font-bold">Giocate</span>
          <span class="font-bold text-slate-200 font-mono text-xs sm:text-sm">${bot.playedCards.length}</span>
          <span class="text-[8px] text-slate-500 block">carte</span>
        </div>
      </div>

      <!-- Quick Tag summary strip -->
      ${activeTags.length > 0 ? `
        <div class="flex items-center gap-1 flex-wrap mb-2">
          ${activeTags.slice(0, 5).map(t => `
            <span class="inline-flex items-center gap-0.5 bg-slate-950 border border-slate-800 px-1.5 py-0.5 rounded text-[9px] text-slate-300 font-mono" title="${t.name}: ${botTags[t.id]}">
              <span>${t.icon}</span> <strong>${botTags[t.id]}</strong>
            </span>
          `).join('')}
          ${activeTags.length > 5 ? `<span class="text-[9px] text-slate-500 font-mono">+${activeTags.length - 5}</span>` : ''}
        </div>
      ` : ''}

      <!-- Inspect Opponent Action Button -->
      <button 
        data-action="inspect_bot"
        class="w-full py-2 px-2.5 rounded-xl bg-gradient-to-r from-red-950/80 via-slate-800 to-red-900/60 hover:from-red-900 hover:to-slate-700 border border-red-500/40 text-red-200 hover:text-white font-bold text-[11px] sm:text-xs uppercase font-orbitron tracking-wider flex items-center justify-center gap-1.5 transition shadow-lg shadow-red-950/30 group"
      >
        <span class="group-hover:scale-110 transition-transform">👁️</span>
        <span>Ispeziona Situazione e Carte (${bot.playedCards.length})</span>
      </button>
    </div>
  `;
}

export function renderCard(card, player, currentPhaseId, validationResult = null, location = 'hand') {
  const isGreen = card.type === 'green';
  const isBlue = card.type === 'blue';
  const isRed = card.type === 'red';

  const typeColor = isGreen 
    ? 'from-emerald-700 to-emerald-900 border-emerald-500/60' 
    : isBlue 
      ? 'from-blue-700 to-blue-900 border-blue-500/60' 
      : 'from-red-700 to-red-900 border-red-500/60';

  const typeBadge = isGreen 
    ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/40' 
    : isBlue 
      ? 'bg-blue-600/30 text-blue-300 border-blue-500/40' 
      : 'bg-red-600/30 text-red-300 border-red-500/40';

  const canPlay = validationResult?.canPlay;
  const costCalc = validationResult?.costCalc;

  return `
    <div 
      class="bg-slate-900 border-2 rounded-xl flex flex-col justify-between overflow-hidden shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl relative ${typeColor}"
      style="min-height: 250px;"
    >
      <!-- Card Header -->
      <div class="p-3 bg-slate-950/80 border-b border-slate-800 flex items-start justify-between gap-2">
        <!-- Cost Badge -->
        <div class="flex items-center gap-1.5">
          <span class="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400 text-amber-300 font-black font-mono flex items-center justify-center text-sm shadow">
            ${card.cost}
          </span>
          <div>
            <h4 class="font-bold text-xs text-white leading-tight">${card.nameIt || card.name}</h4>
            <span class="text-[10px] text-slate-400 leading-none">${card.name}</span>
          </div>
        </div>

        <!-- Tags -->
        <div class="flex items-center gap-1">
          ${(card.tags || []).map(tagKey => {
            const tag = TAGS[tagKey];
            return tag ? `
              <span title="${tag.name}" class="w-6 h-6 rounded flex items-center justify-center text-xs ${tag.color} text-white shadow-sm">
                ${tag.icon}
              </span>
            ` : '';
          }).join('')}
        </div>
      </div>

      <!-- Card Body / Rules & Requirements -->
      <div class="p-3 flex-1 flex flex-col justify-between text-xs bg-slate-950/40">
        <div>
          <!-- Requirements Badge -->
          ${card.requirements ? `
            <div class="bg-amber-950/60 border border-amber-600/50 text-amber-300 px-2 py-0.5 rounded text-[10px] font-semibold mb-2 inline-flex items-center gap-1">
              <span>⚠️</span>
              ${card.requirements.minOceans ? `Min ${card.requirements.minOceans} Oceani ` : ''}
              ${card.requirements.minTemperature ? `Temp >= ${card.requirements.minTemperature}°C ` : ''}
              ${card.requirements.maxTemperature ? `Temp <= ${card.requirements.maxTemperature}°C ` : ''}
              ${card.requirements.minOxygen ? `Ossigeno >= ${card.requirements.minOxygen}% ` : ''}
              ${card.requirements.maxOxygen ? `Ossigeno <= ${card.requirements.maxOxygen}% ` : ''}
            </div>
          ` : ''}

          <!-- Description / Effect -->
          <p class="text-slate-200 text-[11px] leading-relaxed">
            ${card.description}
          </p>
        </div>

        <!-- Footer / VP -->
        <div class="flex items-center justify-between pt-2 border-t border-slate-800/80 mt-2">
          <span class="text-[10px] px-2 py-0.5 rounded border uppercase font-bold ${typeBadge}">
            ${card.type}
          </span>

          ${card.vp || card.vpCalculator ? `
            <div class="flex items-center gap-1 bg-amber-950/50 border border-amber-500/50 text-amber-300 px-2 py-0.5 rounded font-bold text-xs shadow-sm">
              <span>🏆</span>
              <span>${card.vpCalculator ? '* PV' : card.vp + ' PV'}</span>
            </div>
          ` : ''}
        </div>
      </div>

      <!-- Actions in Hand -->
      ${location === 'hand' ? `
        <div class="p-2.5 bg-slate-950/90 border-t border-slate-800 flex items-center gap-2">
          <button 
            data-action="play_card" data-card-id="${card.id}"
            class="flex-1 py-1.5 px-2 rounded-lg font-bold text-xs transition flex items-center justify-center gap-1 shadow-md ${
              canPlay 
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/50' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }"
            ${!canPlay ? 'disabled' : ''}
          >
            <span>Gioca</span>
            ${costCalc ? `<span class="font-mono text-[10px]">(${costCalc.minPayableMC} MC)</span>` : ''}
          </button>

          <button 
            data-action="sell_card" data-card-id="${card.id}"
            title="Scarta questa carta per ottenere 3 MC immediatamente"
            class="py-1.5 px-2.5 rounded-lg bg-amber-950/60 hover:bg-amber-900 text-amber-300 border border-amber-600/40 text-[11px] font-bold transition flex items-center gap-1"
          >
            <span>Vendi</span>
            <span class="font-mono text-amber-400">+3MC</span>
          </button>
        </div>
      ` : ''}

      <!-- Actions in Play for Blue Cards (Player) -->
      ${location === 'played_blue' && card.action ? `
        <div class="p-2.5 bg-slate-950/90 border-t border-slate-800">
          <button 
            data-action="activate_card_action" data-card-id="${card.id}"
            class="w-full py-1.5 px-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition flex items-center justify-center gap-1 shadow-md shadow-blue-900/50 disabled:opacity-40 disabled:cursor-not-allowed"
            ${currentPhaseId !== 3 ? 'disabled' : ''}
          >
            <span>Attiva Azione</span>
          </button>
        </div>
      ` : ''}

      <!-- Opponent Card Badges (when inspecting bot) -->
      ${location === 'opponent_played' ? `
        <div class="px-3 py-2 bg-slate-950/95 border-t border-slate-800 text-[10px] font-mono flex items-center justify-between">
          ${card.type === 'blue' && card.action ? `
            <span class="flex items-center gap-1 text-blue-300">
              <span>⚡</span> Azione:
              <strong class="${card.actionUsed ? 'text-slate-500' : 'text-emerald-400'}">${card.actionUsed ? '✓ Eseguita' : 'Disponibile'}</strong>
            </span>
          ` : card.type === 'green' ? `
            <span class="text-emerald-400">🌿 Effetto Permanente Attivo</span>
          ` : `
            <span class="text-red-400">⚡ Evento Giocato</span>
          `}
          <span class="text-slate-500">Ares Bot</span>
        </div>
      ` : ''}

    </div>
  `;
}

export function renderOpponentInspectModal(bot, engine, activeFilter = 'all') {
  const corp = bot.corporation;
  const botTags = engine?.getPlayerTags ? engine.getPlayerTags(bot) : {};
  
  const allCards = bot.playedCards || [];
  const greens = allCards.filter(c => c.type === 'green');
  const blues = allCards.filter(c => c.type === 'blue');
  const reds = allCards.filter(c => c.type === 'red');

  let filteredCards = allCards;
  if (activeFilter === 'green') filteredCards = greens;
  else if (activeFilter === 'blue') filteredCards = blues;
  else if (activeFilter === 'red') filteredCards = reds;

  // Calculate estimated VP from cards
  let cardVPTotal = 0;
  for (const c of allCards) {
    if (typeof c.vp === 'number') cardVPTotal += c.vp;
  }
  const totalEstVP = bot.tr + bot.forestTokens + cardVPTotal;

  return `
    <div class="bg-slate-900 border-2 border-red-500/60 rounded-2xl sm:rounded-3xl max-w-5xl w-full p-3 sm:p-6 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div class="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div class="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-red-600/30 border border-red-500/50 flex items-center justify-center text-xl shrink-0">
            🤖
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="text-sm sm:text-lg font-black text-white uppercase font-orbitron truncate">${bot.name}</h3>
              <span class="bg-red-950/80 text-red-300 text-xs px-2.5 py-0.5 rounded-full border border-red-600/50 font-mono font-bold">
                ${corp.name}
              </span>
            </div>
            <p class="text-[11px] sm:text-xs text-slate-400 truncate">Plancia, risorse, produzione e carte giocate dall'avversario</p>
          </div>
        </div>

        <button 
          data-action="close_inspect_modal"
          class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center font-bold text-base sm:text-lg transition shrink-0"
        >
          ✕
        </button>
      </div>

      <!-- Scrollable Content -->
      <div class="overflow-y-auto space-y-3.5 pr-1 sm:pr-2 flex-1">
        
        <!-- Corporation & VP Summary Card -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <!-- Corp Ability -->
          <div class="md:col-span-2 bg-slate-950/80 border border-slate-800 rounded-xl p-3 sm:p-4 flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2 mb-1 flex-wrap">
                <span class="text-xs font-bold text-amber-400 uppercase font-mono tracking-wider">Corporazione:</span>
                <span class="text-xs font-bold text-white">${corp.name}</span>
                <span class="text-[11px] text-amber-300 font-medium">(${corp.subtitle})</span>
              </div>
              <p class="text-[11px] sm:text-xs text-slate-300 leading-relaxed">${corp.description}</p>
            </div>
            <div class="mt-2 pt-2 border-t border-slate-800/80 flex items-center gap-3 text-[11px] text-slate-400 font-mono">
              <span>Mano attuale: <strong class="text-pink-300">${bot.hand.length} carte</strong></span>
              <span>•</span>
              <span>Ultima fase: <strong class="text-amber-400">${bot.lastSelectedPhase ? 'Fase ' + bot.lastSelectedPhase : 'Nessuna'}</strong></span>
            </div>
          </div>

          <!-- VP & TR Breakdown -->
          <div class="bg-gradient-to-b from-red-950/40 to-slate-950/80 border border-red-900/60 rounded-xl p-3 sm:p-4 flex flex-col justify-between">
            <span class="text-xs font-bold text-red-400 uppercase font-mono tracking-wider">Punti Vittoria Stimati</span>
            <div class="flex items-baseline gap-2 my-1">
              <span class="text-2xl sm:text-3xl font-black text-white font-mono">${totalEstVP}</span>
              <span class="text-xs text-slate-400">PV Totali</span>
            </div>
            <div class="grid grid-cols-3 gap-1 text-center text-[10px] font-mono pt-2 border-t border-slate-800">
              <div>
                <span class="text-red-400 block font-bold">${bot.tr}</span>
                <span class="text-slate-500">TR</span>
              </div>
              <div>
                <span class="text-emerald-400 block font-bold">${bot.forestTokens}</span>
                <span class="text-slate-500">Foreste</span>
              </div>
              <div>
                <span class="text-amber-400 block font-bold">${cardVPTotal}</span>
                <span class="text-slate-500">Carte PV</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Resources & Production Grid -->
        <div class="bg-slate-950/60 border border-slate-800 rounded-xl p-3 sm:p-4">
          <span class="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider block mb-2">Risorse e Produzione</span>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center text-xs">
            <div class="bg-slate-900/80 p-2 rounded-lg border border-amber-900/40">
              <span class="text-[10px] text-amber-400 block font-bold">💰 MC</span>
              <span class="font-black text-base text-amber-300 font-mono">${bot.resources.mc}</span>
              <span class="text-[10px] text-amber-500/80 block">+${bot.production.mc} / turno</span>
            </div>
            <div class="bg-slate-900/80 p-2 rounded-lg border border-orange-900/40">
              <span class="text-[10px] text-orange-400 block font-bold">🔥 Calore</span>
              <span class="font-black text-base text-orange-400 font-mono">${bot.resources.heat}</span>
              <span class="text-[10px] text-orange-500/80 block">+${bot.production.heat} / turno</span>
            </div>
            <div class="bg-slate-900/80 p-2 rounded-lg border border-emerald-900/40">
              <span class="text-[10px] text-emerald-400 block font-bold">🌿 Piante</span>
              <span class="font-black text-base text-emerald-400 font-mono">${bot.resources.plants}</span>
              <span class="text-[10px] text-emerald-500/80 block">+${bot.production.plants} / turno</span>
            </div>
            <div class="bg-slate-900/80 p-2 rounded-lg border border-pink-900/40">
              <span class="text-[10px] text-pink-400 block font-bold">🃏 Carte Prod</span>
              <span class="font-black text-base text-pink-400 font-mono">${bot.hand.length}</span>
              <span class="text-[10px] text-pink-500/80 block">+${bot.production.cards} / turno</span>
            </div>
            <div class="bg-slate-900/80 p-2 rounded-lg border border-amber-950/60">
              <span class="text-[10px] text-amber-500 block font-bold">🏗️ Acciaio</span>
              <span class="font-black text-base text-amber-400 font-mono">${bot.resources.steel || 0}</span>
              <span class="text-[10px] text-slate-500 block">Sconto Edifici</span>
            </div>
            <div class="bg-slate-900/80 p-2 rounded-lg border border-slate-700/60">
              <span class="text-[10px] text-slate-300 block font-bold">🚀 Titanio</span>
              <span class="font-black text-base text-slate-200 font-mono">${bot.resources.titanium || 0}</span>
              <span class="text-[10px] text-slate-500 block">Sconto Spazio</span>
            </div>
          </div>
        </div>

        <!-- Tags Collected -->
        <div class="bg-slate-950/60 border border-slate-800 rounded-xl p-3 sm:p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">Tag e Simboli Raccolti</span>
            <span class="text-[11px] text-slate-400 font-mono">Totale carte: ${allCards.length}</span>
          </div>
          <div class="flex items-center gap-1.5 flex-wrap">
            ${Object.values(TAGS).map(t => {
              const count = botTags[t.id] || 0;
              return `
                <div class="flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-mono transition ${
                  count > 0 
                    ? 'bg-slate-900 border-slate-700 text-white shadow-sm' 
                    : 'bg-slate-950/50 border-slate-800/60 text-slate-600 opacity-60'
                }">
                  <span class="w-5 h-5 rounded flex items-center justify-center text-[10px] ${t.color} text-white font-bold">${t.icon}</span>
                  <span class="text-[11px]">${t.name}:</span>
                  <strong class="font-bold ${count > 0 ? 'text-amber-400' : 'text-slate-600'}">${count}</strong>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Cards Category Filter Tabs -->
        <div class="flex items-center justify-between border-b border-slate-800 pb-2 flex-wrap gap-2 pt-2">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-xs font-bold text-slate-300 font-mono uppercase">Carte Giocate:</span>
            <div class="flex items-center gap-1 flex-wrap">
              <button 
                data-bot-filter="all"
                class="bot-filter-btn px-2.5 py-1 rounded-lg text-xs font-bold border transition ${activeFilter === 'all' ? 'bg-amber-500 text-slate-950 border-amber-400 shadow' : 'bg-slate-800 text-slate-300 border-slate-700'}"
              >
                Tutte (${allCards.length})
              </button>
              <button 
                data-bot-filter="green"
                class="bot-filter-btn px-2.5 py-1 rounded-lg text-xs font-bold border transition ${activeFilter === 'green' ? 'bg-emerald-600 text-white border-emerald-400 shadow' : 'bg-slate-800 text-emerald-400 border-slate-700'}"
              >
                Verdi (${greens.length})
              </button>
              <button 
                data-bot-filter="blue"
                class="bot-filter-btn px-2.5 py-1 rounded-lg text-xs font-bold border transition ${activeFilter === 'blue' ? 'bg-blue-600 text-white border-blue-400 shadow' : 'bg-slate-800 text-blue-400 border-slate-700'}"
              >
                Blu (${blues.length})
              </button>
              <button 
                data-bot-filter="red"
                class="bot-filter-btn px-2.5 py-1 rounded-lg text-xs font-bold border transition ${activeFilter === 'red' ? 'bg-red-600 text-white border-red-400 shadow' : 'bg-slate-800 text-red-400 border-slate-700'}"
              >
                Rosse (${reds.length})
              </button>
            </div>
          </div>

          <span class="text-[11px] text-slate-400 font-mono">Mostrando ${filteredCards.length} ${filteredCards.length === 1 ? 'carta' : 'carte'}</span>
        </div>

        <!-- Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 min-h-[160px]">
          ${filteredCards.length === 0 ? `
            <div class="col-span-full py-10 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
              Nessuna carta presente in questa categoria per Ares Bot.
            </div>
          ` : filteredCards.map(c => renderCard(c, bot, engine?.phaseResolution?.phaseId, null, 'opponent_played')).join('')}
        </div>

      </div>

      <!-- Footer -->
      <div class="border-t border-slate-800 pt-3 mt-3 flex justify-end">
        <button 
          data-action="close_inspect_modal"
          class="px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase font-mono transition"
        >
          Chiudi
        </button>
      </div>
    </div>
  `;
}

export function renderProductionModal(productionReports, round = 1) {
  const pRep = productionReports?.player || { totalMC: 0, tr: 0, mcProd: 0, heat: 0, plants: 0, cardsCount: 0 };
  const bRep = productionReports?.bot || { totalMC: 0, tr: 0, mcProd: 0, heat: 0, plants: 0, cardsCount: 0 };

  return `
    <div class="bg-slate-900 border-2 border-purple-500/80 rounded-2xl sm:rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
      
      <!-- Header -->
      <div class="text-center border-b border-purple-900/60 pb-3 mb-3 sm:mb-4">
        <div class="w-11 h-11 sm:w-12 sm:h-12 mx-auto rounded-2xl bg-purple-600/30 border border-purple-400/50 flex items-center justify-center text-xl sm:text-2xl shadow-lg shadow-purple-900/40 mb-2">
          🏭
        </div>
        <span class="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-purple-400 font-bold">Fase IV Risolta • Round ${round}</span>
        <h3 class="text-lg sm:text-2xl font-black text-white uppercase font-orbitron tracking-wider">Rapporto di Produzione</h3>
        <p class="text-[11px] sm:text-xs text-slate-300 mt-1 max-w-md mx-auto">
          Tutte le risorse del tuo impero marziano sono state calcolate e accreditate alla tua plancia.
        </p>
      </div>

      <!-- Player Production Breakdown -->
      <div class="bg-gradient-to-b from-purple-950/40 via-slate-950/80 to-slate-950/90 border border-purple-500/40 rounded-2xl p-3 sm:p-5 mb-3 sm:mb-4 shadow-xl">
        <div class="flex items-center justify-between border-b border-purple-900/60 pb-2 mb-2.5">
          <div class="flex items-center gap-1.5 sm:gap-2">
            <span class="text-base sm:text-lg">🧑‍🚀</span>
            <h4 class="font-black text-xs sm:text-sm text-white uppercase font-orbitron tracking-wider">Le Tue Risorse Accreditate</h4>
          </div>
          ${pRep.isChooser ? `
            <span class="bg-amber-400/20 text-amber-300 border border-amber-400/50 text-[10px] px-2 py-0.5 rounded-full font-bold">
              Bonus di Guida (+4 MC) Incluso!
            </span>
          ` : `
            <span class="bg-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded-full">
              Produzione Base
            </span>
          `}
        </div>

        <!-- Big MC Income Display -->
        <div class="bg-slate-950/90 border border-amber-500/40 rounded-xl p-2.5 sm:p-3 mb-2.5 sm:mb-3 text-center">
          <span class="text-[10px] uppercase font-bold text-amber-400 tracking-widest block font-mono">MegaCrediti Incassati</span>
          <div class="text-3xl sm:text-4xl font-black text-amber-300 font-mono my-0.5">
            +${pRep.totalMC} MC
          </div>
          <div class="text-[11px] text-amber-400/90 font-mono">
            (${pRep.tr} TR + ${pRep.mcProd} Prod MC ${pRep.isChooser ? '+ 4 MC Bonus Guida' : ''})
          </div>
        </div>

        <!-- Heat, Plants, Cards Grid -->
        <div class="grid grid-cols-3 gap-2 sm:gap-2.5 text-center">
          <div class="bg-slate-950/90 border border-orange-900/60 rounded-xl p-2 sm:p-2.5">
            <span class="text-[9px] sm:text-[10px] uppercase font-bold text-orange-400 block font-mono">🔥 Calore</span>
            <span class="text-xl sm:text-2xl font-black text-orange-400 font-mono my-0.5 block">+${pRep.heat}</span>
            <span class="text-[9px] sm:text-[10px] text-slate-400">Energia termica</span>
          </div>

          <div class="bg-slate-950/90 border border-emerald-900/60 rounded-xl p-2 sm:p-2.5">
            <span class="text-[9px] sm:text-[10px] uppercase font-bold text-emerald-400 block font-mono">🌿 Piante</span>
            <span class="text-xl sm:text-2xl font-black text-emerald-400 font-mono my-0.5 block">+${pRep.plants}</span>
            <span class="text-[9px] sm:text-[10px] text-slate-400">Verdeggiante</span>
          </div>

          <div class="bg-slate-950/90 border border-pink-900/60 rounded-xl p-2 sm:p-2.5">
            <span class="text-[9px] sm:text-[10px] uppercase font-bold text-pink-400 block font-mono">🃏 Carte</span>
            <span class="text-xl sm:text-2xl font-black text-pink-300 font-mono my-0.5 block">+${pRep.cardsCount}</span>
            <span class="text-[9px] sm:text-[10px] text-slate-400">Pescate in mano</span>
          </div>
        </div>

        ${pRep.drawnCards && pRep.drawnCards.length > 0 ? `
          <div class="mt-2.5 pt-2 border-t border-purple-900/60 text-xs text-purple-200">
            <span class="font-bold text-[10px] sm:text-[11px] text-pink-400 block mb-1">Carte pescate dalla produzione:</span>
            <div class="flex items-center gap-1.5 flex-wrap">
              ${pRep.drawnCards.map(c => `
                <span class="inline-flex items-center gap-1 bg-slate-900 border border-pink-700/60 text-pink-300 text-[10px] sm:text-[11px] px-2 py-0.5 rounded font-medium">
                  <span>🃏</span> ${c.nameIt || c.name}
                </span>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>

      <!-- Bot Summary Card -->
      <div class="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 sm:p-3 mb-3 sm:mb-4 text-xs">
        <div class="flex items-center justify-between text-slate-300 font-mono">
          <span class="flex items-center gap-1.5 font-bold">
            <span>🤖</span> Produzione di Ares Bot:
          </span>
          <span class="text-amber-400 font-bold">+${bRep.totalMC} MC</span>
        </div>
        <div class="text-[10px] sm:text-[11px] text-slate-400 mt-1 flex items-center justify-between flex-wrap gap-2">
          <span>Dettagli: +${bRep.heat} Calore, +${bRep.plants} Piante, +${bRep.cardsCount} Carte</span>
          <span class="text-slate-500 font-mono">(${bRep.tr} TR + ${bRep.mcProd} Prod ${bRep.isChooser ? '+4 Bonus' : ''})</span>
        </div>
      </div>

      <!-- Continue Action Button -->
      <button 
        data-action="acknowledge_production"
        class="w-full py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl bg-gradient-to-r from-purple-600 via-amber-500 to-orange-500 hover:from-purple-500 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm uppercase font-orbitron tracking-wider transition shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
      >
        <span>✅</span>
        <span>Ho Raccolto le Risorse - Concludi Fase IV ➔</span>
      </button>

    </div>
  `;
}

export function renderPhaseSelectionModal(player, round = 1) {
  const lastPhase = player.lastSelectedPhase;

  return `
    <div class="bg-slate-900 border-2 border-amber-500/60 rounded-2xl sm:rounded-3xl max-w-5xl w-full p-3 sm:p-6 shadow-2xl overflow-hidden flex flex-col max-h-[96vh] sm:max-h-[92vh]">
      
      <!-- Modal Header -->
      <div class="text-center mb-2 sm:mb-3 relative pr-8 sm:pr-0">
        <!-- Close / Minimize Button -->
        <button 
          data-action="close_planning_modal"
          class="absolute top-0 right-0 py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1 font-mono text-[11px] sm:text-xs border border-slate-700 transition shadow"
          title="Chiudi per esaminare liberamente la plancia e la mano"
        >
          <span>👁️</span>
          <span class="hidden sm:inline">Guarda Plancia</span>
          <span>✕</span>
        </button>

        <span class="text-[10px] sm:text-xs font-bold text-amber-400 uppercase tracking-widest block font-mono mb-0.5">
          Passo 1: Pianificazione Simultanea • Round ${round}
        </span>
        <h2 class="text-base sm:text-2xl font-black text-white font-orbitron uppercase tracking-wide">
          Seleziona la tua Carta Fase
        </h2>

        <!-- Quick Resources Bar -->
        <div class="flex items-center justify-center gap-1.5 sm:gap-2.5 text-[10px] sm:text-xs font-mono bg-slate-950/80 py-1 px-2 sm:px-3 rounded-xl border border-slate-800 my-1 sm:my-2 flex-wrap">
          <span class="text-amber-400 font-bold">💰 ${player.resources.mc} MC (+${player.production.mc})</span>
          <span class="text-slate-600">•</span>
          <span class="text-orange-400 font-bold">🔥 ${player.resources.heat} Calore (+${player.production.heat})</span>
          <span class="text-slate-600">•</span>
          <span class="text-emerald-400 font-bold">🌿 ${player.resources.plants} Piante (+${player.production.plants})</span>
          <span class="text-slate-600 hidden xs:inline">•</span>
          <span class="text-amber-300 font-bold hidden xs:inline">🏗️ ${player.resources.steel || 0}</span>
          <span class="text-slate-600 hidden xs:inline">•</span>
          <span class="text-slate-300 font-bold hidden xs:inline">🚀 ${player.resources.titanium || 0}</span>
          <span class="text-slate-600">•</span>
          <span class="text-red-400 font-bold">⭐ ${player.tr} TR</span>
        </div>

        ${lastPhase ? `
          <div class="text-[10px] sm:text-xs text-red-400 font-semibold bg-red-950/50 py-0.5 sm:py-1 px-2 sm:px-3 rounded-lg border border-red-800/40 inline-block font-mono">
            ⚠️ La Fase ${lastPhase} è bloccata questo round (regola di non-consecutività)
          </div>
        ` : ''}
      </div>

      <!-- 5 Phase Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-5 gap-1.5 sm:gap-2.5 p-0.5 sm:p-1 mb-2 overflow-y-auto max-h-[46vh] sm:max-h-none">
        ${Object.values(PHASES).map(phase => {
          const isForbidden = phase.id === lastPhase;
          return `
            <div 
              data-phase-id="${phase.id}"
              class="phase-card-option border-2 rounded-xl p-2 sm:p-3 flex sm:flex-col justify-between items-center sm:items-stretch cursor-pointer transition-all duration-200 relative ${
                isForbidden 
                  ? 'opacity-40 cursor-not-allowed border-slate-800 bg-slate-950' 
                  : 'bg-slate-950/80 hover:scale-102 hover:shadow-xl hover:border-amber-400 border-slate-700'
              }"
              style="border-top-color: ${phase.color};"
            >
              <div class="flex items-center sm:block gap-2 min-w-0">
                <div class="flex items-center gap-1.5 sm:justify-between mb-0 sm:mb-1 shrink-0">
                  <span class="w-6 h-6 rounded-full flex items-center justify-center font-black text-xs text-slate-950 font-mono" style="background-color: ${phase.color}">
                    ${phase.id}
                  </span>
                  <span class="text-[9px] text-slate-400 uppercase font-mono hidden sm:inline">${phase.name}</span>
                </div>

                <div class="min-w-0">
                  <h3 class="font-bold text-xs text-white leading-tight">${phase.nameIt}</h3>
                  <p class="text-[10px] text-slate-300 leading-snug hidden sm:block mb-2">${phase.description}</p>
                </div>
              </div>

              <div class="border-l sm:border-l-0 sm:border-t border-slate-800 pl-2 sm:pl-0 sm:pt-1.5 shrink-0 text-right sm:text-left">
                <span class="text-[9px] text-amber-400 font-bold uppercase tracking-wider block">Bonus Guida:</span>
                <p class="text-[9px] text-amber-200/90 leading-tight max-w-[130px] sm:max-w-none truncate sm:whitespace-normal">${phase.bonusDescription}</p>
                
                ${isForbidden ? `
                  <div class="mt-0.5 sm:mt-1.5 text-center text-[9px] font-bold text-red-400 uppercase bg-red-950/50 py-0.5 rounded border border-red-800/40 font-mono">
                    Bloccata
                  </div>
                ` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Live Hand Preview Section (Collapsible Accordion on Mobile) -->
      <div class="border-t border-slate-800 pt-1.5 sm:pt-2 mb-2 flex-1 flex flex-col min-h-0">
        <button 
          id="toggle-modal-hand-btn" 
          type="button" 
          class="flex items-center justify-between w-full py-1.5 px-2.5 bg-slate-950/60 hover:bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 transition"
        >
          <span class="flex items-center gap-1.5 font-bold">
            <span>🃏</span> Le tue Carte in Mano (${player.hand.length})
          </span>
          <span id="modal-hand-arrow" class="text-[10px] text-amber-400 font-bold">
            Mostra / Nascondi ▾
          </span>
        </button>

        <div id="modal-hand-container" class="hidden sm:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 overflow-y-auto p-1.5 bg-slate-950/80 rounded-xl border border-slate-800 flex-1 max-h-36 sm:max-h-44 mt-1.5">
          ${player.hand.map(card => {
            const isGreen = card.type === 'green';
            const isBlue = card.type === 'blue';
            const typeColor = isGreen ? 'border-emerald-600 bg-emerald-950/30' : isBlue ? 'border-blue-600 bg-blue-950/30' : 'border-red-600 bg-red-950/30';
            const typeBadge = isGreen ? 'text-emerald-400' : isBlue ? 'text-blue-400' : 'text-red-400';

            return `
              <div class="border rounded-lg p-1.5 sm:p-2 flex flex-col justify-between text-[10px] shadow-sm ${typeColor}">
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <span class="font-mono font-bold text-amber-400">${card.cost} MC</span>
                    <span class="uppercase font-bold text-[9px] ${typeBadge}">${card.type}</span>
                  </div>
                  <div class="font-bold text-white text-[10px] sm:text-[11px] leading-tight mb-1 truncate" title="${card.nameIt || card.name}">
                    ${card.nameIt || card.name}
                  </div>
                  <div class="text-slate-300 text-[9px] line-clamp-2 leading-tight">
                    ${card.description}
                  </div>
                </div>
                ${card.requirements ? `
                  <div class="mt-1 text-[8px] text-amber-300 font-mono truncate">
                    ⚠️ Req
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Sticky Selected Phase Action Bar -->
      <div class="sticky bottom-0 bg-slate-900 border-t border-slate-800 pt-2 sm:pt-3 mt-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div id="selected-phase-hint" class="text-[11px] sm:text-xs text-slate-400 font-medium text-center sm:text-left">
          Nessuna fase selezionata. Clicca su una delle 5 fasi sopra.
        </div>
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <button 
            data-action="close_planning_modal"
            class="hidden sm:block px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase transition font-mono"
          >
            Guarda Plancia
          </button>
          <button 
            id="confirm-phase-btn"
            disabled
            class="w-full sm:w-auto px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm font-orbitron uppercase tracking-wider transition shadow-lg shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Conferma Selezione Fase
          </button>
        </div>
      </div>
    </div>
  `;
}

export function renderResearchModal(offer, onConfirm) {
  return `
    <div class="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full p-3 sm:p-6 shadow-2xl overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[90vh]">
      <div class="text-center mb-3 sm:mb-5">
        <span class="text-[10px] sm:text-xs font-bold text-pink-400 uppercase tracking-widest block mb-0.5">Fase V: Ricerca Progetti</span>
        <h2 class="text-xl sm:text-2xl font-black text-white tracking-wide">Scegli le carte da tenere</h2>
        <p class="text-[11px] sm:text-xs text-slate-400 mt-0.5">
          Hai pescato ${offer.cards.length} carte. Seleziona esattamente <span class="text-pink-400 font-bold">${offer.keepCount}</span> ${offer.keepCount === 1 ? 'carta' : 'carte'}.
        </p>
      </div>

      <!-- Cards to pick (2 cols on mobile, 3 on tablet, 5 on desktop) -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 overflow-y-auto p-1 mb-3 flex-1">
        ${offer.cards.map(card => `
          <div 
            data-research-card-id="${card.id}"
            class="research-card-choice border-2 border-slate-700 rounded-xl p-2.5 sm:p-3 bg-slate-950/80 cursor-pointer transition-all duration-200 hover:border-pink-500 flex flex-col justify-between"
          >
            <div>
              <div class="flex items-center justify-between mb-1">
                <span class="text-amber-400 font-mono font-bold text-xs">${card.cost} MC</span>
                <span class="text-[10px] text-pink-400 uppercase font-bold">${card.type}</span>
              </div>
              <h4 class="font-bold text-xs text-white leading-tight mb-1 truncate" title="${card.nameIt || card.name}">${card.nameIt || card.name}</h4>
              <p class="text-[10px] text-slate-300 leading-snug line-clamp-3">${card.description}</p>
            </div>

            <div class="pt-2 border-t border-slate-800 mt-2 flex items-center justify-between">
              <span class="text-[10px] text-slate-400">Tocca per scegliere</span>
              <input type="checkbox" class="research-checkbox pointer-events-none w-4 h-4 rounded text-pink-500 bg-slate-800 border-slate-700" value="${card.id}">
            </div>
          </div>
        `).join('')}
      </div>

      <div class="sticky bottom-0 bg-slate-900 border-t border-slate-800 pt-3 mt-auto flex items-center justify-between gap-2">
        <div id="research-selection-counter" class="text-xs text-pink-400 font-semibold font-mono">
          Selezionate: 0 / ${offer.keepCount}
        </div>
        <button 
          id="confirm-research-btn"
          disabled
          class="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider transition shadow-lg shadow-pink-600/30 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Aggiungi alla Mano
        </button>
      </div>
    </div>
  `;
}

export function renderGameOverModal(finalScores, onRestart) {
  const winner = finalScores[0];
  const isPlayerWinner = winner.playerId === 'player';

  return `
    <div class="bg-slate-900 border-2 ${isPlayerWinner ? 'border-amber-400' : 'border-slate-700'} rounded-3xl max-w-2xl w-full p-8 shadow-2xl text-center">
        
        <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-tr ${isPlayerWinner ? 'from-amber-500 to-yellow-300 shadow-amber-500/40' : 'from-slate-700 to-slate-500'} flex items-center justify-center text-4xl shadow-2xl">
          ${isPlayerWinner ? '🏆' : '🤖'}
        </div>

        <h2 class="text-3xl font-black text-white tracking-wide uppercase mb-1">
          ${isPlayerWinner ? 'Vittoria Straordinaria!' : 'Missione Conclusa'}
        </h2>
        <p class="text-sm text-slate-400 mb-6">
          Marte è stato completamente terraformato. Ecco il conteggio finale dei Punti Vittoria:
        </p>

        <!-- Scores Table -->
        <div class="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden mb-6">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-900/90 text-slate-400 uppercase font-mono border-b border-slate-800">
              <tr>
                <th class="p-3.5">Giocatore / Corp</th>
                <th class="p-3.5 text-center">TR (PV)</th>
                <th class="p-3.5 text-center">Foreste (PV)</th>
                <th class="p-3.5 text-center">Carte (PV)</th>
                <th class="p-3.5 text-right font-black text-amber-400">Totale PV</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60 font-mono">
              ${finalScores.map((score, idx) => `
                <tr class="${idx === 0 ? 'bg-amber-950/20 text-white font-bold' : 'text-slate-300'}">
                  <td class="p-3.5">
                    <span class="block font-sans text-sm">${score.name}</span>
                    <span class="text-[10px] text-slate-500 font-sans">${score.corporation}</span>
                  </td>
                  <td class="p-3.5 text-center">${score.tr}</td>
                  <td class="p-3.5 text-center">${score.forestVp}</td>
                  <td class="p-3.5 text-center">${score.cardVp}</td>
                  <td class="p-3.5 text-right text-base font-black ${idx === 0 ? 'text-amber-400' : 'text-slate-200'}">
                    ${score.totalVp}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <button 
          id="restart-game-btn"
          class="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm uppercase tracking-wider transition shadow-xl shadow-orange-500/30"
        >
          Nuova Partita
        </button>
      </div>
  `;
}
