/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Search,
  Play,
  Pause,
  Headphones,
  BookOpen,
  Bookmark,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Landmark,
  Briefcase,
  Scale,
  Car,
} from 'lucide-react';
import { ALL_LAWS, CATEGORIES } from '../data/laws';
import { useLawStore, useBookmarks } from '../store/lawStore';
import { audioPlayer } from '../services/audioPlayerService';
import { LawCategory } from '../types/law';
import { PWAInstallButton } from '../components/PWAInstallButton';

interface HomePageProps {
  onOpenSearch: () => void;
  onSelectLaw: (lawId: string, unitId?: string) => void;
  onNavigateToCatalog: (category?: LawCategory) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenSearch,
  onSelectLaw,
  onNavigateToCatalog,
}) => {
  const { history, playback } = useLawStore();
  const { bookmarks } = useBookmarks();

  const getCategoryIcon = (id: LawCategory) => {
    switch (id) {
      case 'ustavne':
        return Landmark;
      case 'trestne':
        return ShieldAlert;
      case 'obcianske':
        return Scale;
      case 'pracovne':
        return Briefcase;
      case 'dopravne':
        return Car;
      default:
        return BookOpen;
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white p-6 sm:p-10 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 translate-x-12 -translate-y-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Zbierka zákonov Slovenskej republiky • Konsolidované znenie</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Právo SR – Moderný čítač & audio prehrávač legislatívy
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Vyhľadávajte v kľúčových kódexoch Slovenskej republiky, počúvajte paragrafy v podaní prirodzeného AI hlasu a ukladajte si citácie.
          </p>

          {/* Interactive Global Search Trigger Bar */}
          <div className="pt-2">
            <button
              onClick={onOpenSearch}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/80 shadow-lg text-sm transition group"
            >
              <Search className="w-5 h-5 text-amber-400 group-hover:scale-110 transition" />
              <span className="flex-1 text-left font-normal text-slate-300">
                Hľadať zákon alebo konkrétny paragraf (napr. „§ 212“, „Čl. 1“, „krádež“)...
              </span>
              <kbd className="hidden sm:inline-block px-2.5 py-1 text-xs bg-slate-700 text-amber-300 rounded-lg font-mono font-semibold">
                Hľadať
              </kbd>
            </button>
          </div>
        </div>
      </section>

      {/* Continue Listening Card (if active track or recent item exists) */}
      {(playback.documentId || history.length > 0) && (
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Headphones className="w-4 h-4 text-amber-500" />
              Pokračovať v počúvaní
            </h2>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
              AI Hlas: Kore
            </span>
          </div>

          {(() => {
            const docId = playback.documentId || history[0]?.documentId || '300-2005';
            const unitId = playback.unitId || history[0]?.unitId || 'par-212';
            const docTitle = playback.documentTitle || history[0]?.documentTitle || 'Trestný zákon';
            const unitDisp = playback.unitDisplayNumber || history[0]?.unitDisplayNumber || '§ 212';
            const unitTitle = playback.unitTitle || history[0]?.unitTitle || 'Krádež';
            const isCurrPlaying = playback.isPlaying;

            return (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <div
                  onClick={() => onSelectLaw(docId, unitId)}
                  className="cursor-pointer group flex-1"
                >
                  <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                    {docTitle}
                  </p>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition mt-0.5">
                    {unitDisp} • {unitTitle}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Prehrávanie plynule prechádza do ďalšieho paragrafu.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (isCurrPlaying) {
                        audioPlayer.pause();
                      } else {
                        audioPlayer.playUnit(docId, unitId);
                      }
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md transition active:scale-95"
                  >
                    {isCurrPlaying ? (
                      <>
                        <Pause className="w-4 h-4 fill-current" />
                        <span>Pozastaviť</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                        <span>Počúvať od {unitDisp}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })()}
        </section>
      )}

      {/* Legal Categories Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Právne odvetvia Slovenskej republiky
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Rýchly výber podľa špecializácie
            </p>
          </div>
          <button
            onClick={() => onNavigateToCatalog()}
            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            Všetky kódexy
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CATEGORIES.map((cat) => {
            const Icon = getCategoryIcon(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => onNavigateToCatalog(cat.id)}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 hover:shadow-md transition text-center group"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="font-bold text-xs text-slate-900 dark:text-white">
                  {cat.label}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  {cat.count} {cat.count === 1 ? 'predpis' : 'predpisy'}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Key Slovak Codes Catalog Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Prehľad základných kódexov SR
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Plné konsolidované znenia pripravené na čítanie a hlasové prehrávanie
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ALL_LAWS.map((law) => (
            <div
              key={law.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 hover:shadow-lg transition flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300">
                    {law.actNumber}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    <Headphones className="w-3 h-3" />
                    AI Audio
                  </span>
                </div>

                <h3
                  onClick={() => onSelectLaw(law.id)}
                  className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition cursor-pointer"
                >
                  {law.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {law.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <div className="text-[11px] text-slate-400 space-x-2">
                  <span>{law.allUnits.length} jednotiek (§ / Čl.)</span>
                  <span>•</span>
                  <span>Účinnosť: {law.effectiveDate}</span>
                </div>

                <button
                  onClick={() => onSelectLaw(law.id)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 transition"
                >
                  <span>Otvoriť</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recents & Bookmarks Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recents */}
        <section className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-amber-500" />
            Naposledy čítané
          </h3>

          {history.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">
              Zatiaľ žiadna história čítania. Otvorte zákon a začnite čítať.
            </p>
          ) : (
            <div className="space-y-2">
              {history.slice(0, 3).map((item) => (
                <div
                  key={`${item.documentId}-${item.unitId}`}
                  onClick={() => onSelectLaw(item.documentId, item.unitId)}
                  className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition cursor-pointer flex items-center justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {item.unitDisplayNumber} • {item.unitTitle || item.documentTitle}
                    </p>
                    <p className="text-[10px] text-slate-400">{item.documentTitle}</p>
                  </div>
                  <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 shrink-0">
                    {item.progressPercent}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Bookmarks Preview */}
        <section className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
            <Bookmark className="w-4 h-4 text-amber-500" />
            Uložené záložky ({bookmarks.length})
          </h3>

          {bookmarks.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">
              Zatiaľ nemáte žiadne záložky. V čítačke môžete kliknúť na ikonu záložky.
            </p>
          ) : (
            <div className="space-y-2">
              {bookmarks.slice(0, 3).map((bm) => (
                <div
                  key={bm.id}
                  onClick={() => onSelectLaw(bm.documentId, bm.unitId)}
                  className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition cursor-pointer flex items-center justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {bm.unitDisplayNumber} {bm.unitTitle && `• ${bm.unitTitle}`}
                    </p>
                    <p className="text-[10px] text-slate-400">{bm.documentTitle}</p>
                  </div>
                  <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-current shrink-0" />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
