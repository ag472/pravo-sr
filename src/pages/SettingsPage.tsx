/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Moon,
  Sun,
  Laptop,
  Type,
  Volume2,
  Download,
  LogOut,
  User,
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  Info,
} from 'lucide-react';
import { useReaderSettings, useAuth, store } from '../store/lawStore';
import { audioPlayer } from '../services/audioPlayerService';
import { PWAInstallButton } from '../components/PWAInstallButton';

interface SettingsPageProps {
  onNavigateToAuth: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigateToAuth }) => {
  const { settings, updateSettings } = useReaderSettings();
  const { user, isAuthenticated, logout } = useAuth();

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    updateSettings({ theme: newTheme });
    if (typeof document !== 'undefined') {
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (newTheme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    }
  };

  const speeds = [0.75, 1.0, 1.25, 1.5, 2.0];

  return (
    <div className="space-y-8 max-w-3xl mx-auto pb-16">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Nastavenia aplikácie
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Prispôsobte si vzhľad, veľkosť písma, rýchlosť audio prednesu a inštaláciu.
        </p>
      </div>

      {/* PWA Inštalácia & Offline stav */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <Smartphone className="w-5 h-5 text-amber-500" />
          <h2>Inštalácia aplikácie (PWA) & Offline prístup</h2>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          Aplikáciu Právo SR si môžete nainštalovať priamo do svojho mobilu, tabletu alebo počítača. Funguje rýchlo a umožňuje čítanie zákonov aj bez pripojenia na internet.
        </p>
        <PWAInstallButton variant="card" />
      </section>

      {/* Vzhľad a Téma */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <Sun className="w-5 h-5 text-amber-500" />
          <h2>Vzhľad a motív rozhrania</h2>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleThemeChange('light')}
            className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 text-xs font-semibold transition ${
              settings.theme === 'light'
                ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-400 ring-2 ring-amber-500/30'
                : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Sun className="w-5 h-5 text-amber-500" />
            <span>Svetlý papier</span>
          </button>

          <button
            onClick={() => handleThemeChange('dark')}
            className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 text-xs font-semibold transition ${
              settings.theme === 'dark'
                ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-400 ring-2 ring-amber-500/30'
                : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Moon className="w-5 h-5 text-indigo-400" />
            <span>Tmavý grafit</span>
          </button>

          <button
            onClick={() => handleThemeChange('system')}
            className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 text-xs font-semibold transition ${
              settings.theme === 'system'
                ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-400 ring-2 ring-amber-500/30'
                : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Laptop className="w-5 h-5 text-slate-400" />
            <span>Podľa systému</span>
          </button>
        </div>
      </section>

      {/* Typografia v čítačke */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <Type className="w-5 h-5 text-amber-500" />
          <h2>Typografia a čitateľnosť</h2>
        </div>

        {/* Font size slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Veľkosť písma textu
            </span>
            <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
              {settings.fontSize} px
            </span>
          </div>
          <input
            type="range"
            min="14"
            max="22"
            value={settings.fontSize}
            onChange={(e) => updateSettings({ fontSize: parseInt(e.target.value, 10) })}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>Kompaktné (14px)</span>
            <span>Štandard (17px)</span>
            <span>Veľké (22px)</span>
          </div>
        </div>

        {/* Serif font toggle */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Knižné pätkové písmo (Literata)
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Zlepšuje čitateľnosť a dojem z čítania rozsiahlych právnych textov.
            </p>
          </div>
          <button
            onClick={() => updateSettings({ serifFont: !settings.serifFont })}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
              settings.serifFont ? 'bg-amber-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
            }`}
          >
            <div className="bg-white w-4 h-4 rounded-full shadow-md" />
          </button>
        </div>

        {/* Auto-scroll toggle */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Automatický posun na práve čítaný paragraf
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Počas prehrávania audia automaticky udrží aktuálny paragraf v strede obrazovky.
            </p>
          </div>
          <button
            onClick={() => updateSettings({ autoScrollToPlaying: !settings.autoScrollToPlaying })}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
              settings.autoScrollToPlaying ? 'bg-amber-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
            }`}
          >
            <div className="bg-white w-4 h-4 rounded-full shadow-md" />
          </button>
        </div>
      </section>

      {/* Audio & Syntéza */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <Volume2 className="w-5 h-5 text-amber-500" />
          <h2>Predvolená rýchlosť hlasového prednesu</h2>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => audioPlayer.setRate(s)}
              className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold transition ${
                settings.playbackRate === s
                  ? 'border-amber-500 bg-amber-500 text-slate-950 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </section>

      {/* Používateľský profil & Odhlásenie */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <User className="w-5 h-5 text-amber-500" />
          <h2>Používateľský účet</h2>
        </div>

        {isAuthenticated && user ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{user.fullName}</p>
              <p className="text-xs font-mono text-amber-600 dark:text-amber-400 mt-0.5">{user.email}</p>
              <p className="text-[11px] text-slate-400 mt-1">Alias: @{user.username}</p>
            </div>
            <button
              onClick={() => logout()}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-500/10 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Odhlásiť sa</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Nie ste prihlásený. Prihláste sa pre uchovanie svojich poznámok naprieč zariadeniami.
            </p>
            <button
              onClick={onNavigateToAuth}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs transition"
            >
              Prihlásiť sa
            </button>
          </div>
        )}
      </section>

      {/* Informácie o aplikácii */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
        <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
          <Info className="w-3.5 h-3.5 text-amber-500" />
          <span>Právo SR • Verzia 1.0 (PWA)</span>
        </div>
        <p>Konsolidované znenie právnych predpisov Zbierky zákonov Slovenskej republiky (Slov-Lex).</p>
      </div>
    </div>
  );
};
