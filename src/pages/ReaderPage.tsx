/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  List,
  Search,
  Bookmark,
  Share2,
  Play,
  Pause,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Volume2,
  FileText,
  Type,
  X,
  ArrowUp,
} from 'lucide-react';
import { getLawById } from '../data/laws';
import { LegalDocument, LegalUnit } from '../types/law';
import { usePlayback, useBookmarks, useReaderSettings, store } from '../store/lawStore';
import { audioPlayer } from '../services/audioPlayerService';
import { formatLegalCitation, removeDiacritics } from '../services/legislationService';

interface ReaderPageProps {
  lawId: string;
  initialUnitId?: string;
  onBack: () => void;
}

export const ReaderPage: React.FC<ReaderPageProps> = ({
  lawId,
  initialUnitId,
  onBack,
}) => {
  const law = getLawById(lawId);
  const { playback } = usePlayback();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { settings, updateSettings } = useReaderSettings();

  const [isTocOpen, setIsTocOpen] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeUnitId, setActiveUnitId] = useState<string>(
    initialUnitId || (law?.allUnits[0]?.id ?? '')
  );

  const unitRefs = useRef<Record<string, HTMLElement | null>>({});

  // Auto-scroll when active unit changes via playback or initial jump
  useEffect(() => {
    const targetId = playback.unitId && playback.documentId === lawId
      ? playback.unitId
      : activeUnitId;

    if (targetId && unitRefs.current[targetId] && settings.autoScrollToPlaying) {
      unitRefs.current[targetId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [playback.unitId, playback.documentId, lawId, settings.autoScrollToPlaying]);

  if (!law) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-base text-slate-600 dark:text-slate-400">Zákon sa nenašiel.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-sm"
        >
          Späť na zoznam
        </button>
      </div>
    );
  }

  const handleCopyCitation = (unit: LegalUnit, subsectionNum?: number) => {
    const citation = formatLegalCitation(law, unit, subsectionNum);
    navigator.clipboard.writeText(citation);
    setCopiedId(unit.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePlayUnit = (unit: LegalUnit) => {
    if (playback.unitId === unit.id && playback.isPlaying) {
      audioPlayer.pause();
    } else {
      setActiveUnitId(unit.id);
      audioPlayer.playUnit(law.id, unit.id);
    }
  };

  const normalizedFilter = removeDiacritics(filterText.trim());

  return (
    <div className="relative max-w-5xl mx-auto pb-24">
      {/* Sticky Reader Toolbar */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 -mx-4 px-4 py-3 sm:px-6 mb-6 flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition shrink-0"
            title="Späť do katalógu"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400">
              {law.actNumber}
            </span>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
              {law.title}
            </h1>
          </div>
        </div>

        {/* Reader actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick TOC Button */}
          <button
            onClick={() => setIsTocOpen(!isTocOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              isTocOpen
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            title="Zobraziť obsah zákona"
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">Obsah</span>
          </button>

          {/* Font Size Adjuster Modal/Dropdown */}
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs">
            <button
              onClick={() =>
                updateSettings({ fontSize: Math.max(14, settings.fontSize - 1) })
              }
              className="px-1.5 py-0.5 font-bold hover:text-amber-500"
              title="Zmenšiť písmo"
            >
              A-
            </button>
            <span className="font-mono text-[11px] text-slate-400 px-1">
              {settings.fontSize}px
            </span>
            <button
              onClick={() =>
                updateSettings({ fontSize: Math.min(24, settings.fontSize + 1) })
              }
              className="px-1.5 py-0.5 font-bold hover:text-amber-500"
              title="Zväčšiť písmo"
            >
              A+
            </button>
          </div>
        </div>
      </header>

      {/* In-Document Search Bar */}
      <div className="mb-6 relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Hľadať v texte tohto zákona (napr. „§ 212“, „krádež“, „zmluva“)..."
          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-xs"
        />
        {filterText && (
          <button
            onClick={() => setFilterText('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex gap-6 items-start">
        {/* Collapsible Table of Contents Sidebar / Drawer */}
        {isTocOpen && (
          <aside className="fixed inset-y-0 right-0 w-80 bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 z-50 p-5 flex flex-col animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <List className="w-4 h-4 text-amber-500" />
                Obsah zákona
              </h3>
              <button
                onClick={() => setIsTocOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-4 text-xs">
              {law.parts.map((part) => (
                <div key={part.id} className="space-y-2">
                  <div className="font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider text-[11px]">
                    {part.number} • {part.title}
                  </div>
                  {part.chapters.map((chap) => (
                    <div key={chap.id} className="pl-2 border-l border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="font-semibold text-slate-500 dark:text-slate-400 text-[11px]">
                        {chap.number} {chap.title}
                      </div>
                      <div className="space-y-0.5">
                        {chap.units.map((unit) => {
                          const isCurrent =
                            playback.unitId === unit.id && playback.documentId === law.id;
                          return (
                            <button
                              key={unit.id}
                              onClick={() => {
                                setActiveUnitId(unit.id);
                                setIsTocOpen(false);
                                unitRefs.current[unit.id]?.scrollIntoView({
                                  behavior: 'smooth',
                                  block: 'center',
                                });
                              }}
                              className={`w-full text-left px-2 py-1.5 rounded-lg transition truncate flex items-center justify-between ${
                                isCurrent
                                  ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold'
                                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                              }`}
                            >
                              <span className="truncate">
                                {unit.displayNumber} {unit.title ? `– ${unit.title}` : ''}
                              </span>
                              {isCurrent && (
                                <Volume2 className="w-3.5 h-3.5 text-amber-500 animate-pulse shrink-0 ml-1" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </aside>
        )}

        {/* Main Document Body */}
        <main
          className="flex-1 space-y-8 min-w-0"
          style={{ fontSize: `${settings.fontSize}px` }}
        >
          {/* Law Document Header */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 font-mono font-bold text-xs">
                {law.actNumber}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold">
                {law.categoryLabel}
              </span>
              <span className="text-xs text-slate-400">
                Účinnosť od {law.effectiveDate}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white font-heading">
              {law.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              {law.description}
            </p>
          </div>

          {/* Law Parts, Chapters & Units */}
          {law.parts.map((part) => (
            <section key={part.id} className="space-y-6">
              {/* Part Header */}
              <div className="border-b border-amber-500/30 pb-2">
                <p className="text-xs font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                  {part.number}
                </p>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {part.title}
                </h3>
              </div>

              {part.chapters.map((chap) => (
                <div key={chap.id} className="space-y-4">
                  {/* Chapter Header */}
                  <div className="pt-2">
                    {chap.number && (
                      <p className="text-xs font-semibold text-slate-400 uppercase">
                        {chap.number}
                      </p>
                    )}
                    <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
                      {chap.title}
                    </h4>
                  </div>

                  {/* Units list */}
                  <div className="space-y-4">
                    {chap.units
                      .filter((unit) => {
                        if (!normalizedFilter) return true;
                        const uNumNorm = removeDiacritics(unit.number);
                        const uDispNorm = removeDiacritics(unit.displayNumber);
                        const uTitleNorm = unit.title ? removeDiacritics(unit.title) : '';
                        const uTextNorm = removeDiacritics(unit.fullText);
                        return (
                          uNumNorm.includes(normalizedFilter) ||
                          uDispNorm.includes(normalizedFilter) ||
                          uTitleNorm.includes(normalizedFilter) ||
                          uTextNorm.includes(normalizedFilter)
                        );
                      })
                      .map((unit) => {
                        const isPlayingThis =
                          playback.documentId === law.id &&
                          playback.unitId === unit.id &&
                          playback.isPlaying;
                        const isUnitBookmarked = isBookmarked(law.id, unit.id);

                        return (
                          <article
                            key={unit.id}
                            ref={(el) => {
                              unitRefs.current[unit.id] = el;
                            }}
                            id={unit.id}
                            className={`p-5 sm:p-6 rounded-2xl border transition-all duration-300 relative group ${
                              isPlayingThis
                                ? 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500 shadow-md ring-2 ring-amber-500/40 active-playing-unit'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700'
                            }`}
                          >
                            {/* Unit Toolbar */}
                            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800/80">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-sm sm:text-base">
                                  {unit.displayNumber}
                                </span>
                                {unit.title && (
                                  <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                                    {unit.title}
                                  </span>
                                )}
                              </div>

                              {/* Action Buttons Toolbar */}
                              <div className="flex items-center gap-1">
                                {/* Play Audio Button */}
                                <button
                                  onClick={() => handlePlayUnit(unit)}
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                                    isPlayingThis
                                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                                      : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20'
                                  }`}
                                  title={isPlayingThis ? 'Pozastaviť prehrávanie' : 'Prehrať od tohto miesta'}
                                >
                                  {isPlayingThis ? (
                                    <>
                                      <Pause className="w-3.5 h-3.5 fill-current" />
                                      <span>Pozastaviť</span>
                                    </>
                                  ) : (
                                    <>
                                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                                      <span>Prehrať</span>
                                    </>
                                  )}
                                </button>

                                {/* Copy Citation Button */}
                                <button
                                  onClick={() => handleCopyCitation(unit)}
                                  className="flex items-center gap-1 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                  title="Kopírovať citáciu paragrafu"
                                >
                                  {copiedId === unit.id ? (
                                    <Check className="w-4 h-4 text-emerald-500" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </button>

                                {/* Bookmark Button */}
                                <button
                                  onClick={() =>
                                    toggleBookmark({
                                      documentId: law.id,
                                      documentTitle: law.title,
                                      documentActNumber: law.actNumber,
                                      unitId: unit.id,
                                      unitDisplayNumber: unit.displayNumber,
                                      unitTitle: unit.title,
                                    })
                                  }
                                  className={`p-1.5 rounded-lg transition ${
                                    isUnitBookmarked
                                      ? 'text-amber-500'
                                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                                  }`}
                                  title={isUnitBookmarked ? 'Odstrániť zo záložiek' : 'Uložiť do záložiek'}
                                >
                                  <Bookmark
                                    className={`w-4 h-4 ${isUnitBookmarked ? 'fill-current' : ''}`}
                                  />
                                </button>
                              </div>
                            </div>

                            {/* Unit Subsections Body */}
                            <div
                              className={`space-y-3 leading-relaxed text-slate-800 dark:text-slate-200 ${
                                settings.serifFont ? 'font-editorial' : 'font-sans'
                              }`}
                            >
                              {unit.subsections.map((sub) => (
                                <div key={sub.id} className="flex gap-2.5 items-start">
                                  {unit.subsections.length > 1 && (
                                    <span className="font-mono text-xs font-semibold text-slate-400 pt-0.5 shrink-0 select-none">
                                      ({sub.number})
                                    </span>
                                  )}
                                  <div className="flex-1">
                                    <p>{sub.text}</p>
                                    {sub.letters && sub.letters.length > 0 && (
                                      <ul className="mt-2 space-y-1 pl-4">
                                        {sub.letters.map((ltr) => (
                                          <li key={ltr.id} className="flex gap-2">
                                            <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                                              {ltr.letter}
                                            </span>
                                            <span>{ltr.text}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Toast notice when citation is copied */}
                            {copiedId === unit.id && (
                              <div className="absolute top-2 right-2 bg-slate-900 text-white text-xs px-2.5 py-1 rounded-lg shadow-lg flex items-center gap-1.5 animate-in fade-in">
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Citácia skopírovaná</span>
                              </div>
                            )}
                          </article>
                        );
                      })}
                  </div>
                </div>
              ))}
            </section>
          ))}
        </main>
      </div>
    </div>
  );
};
