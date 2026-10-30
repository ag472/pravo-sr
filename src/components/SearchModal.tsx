/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, Sparkles, ArrowRight, CornerDownLeft } from 'lucide-react';
import { searchLegislation, removeDiacritics } from '../services/legislationService';
import { SearchResult } from '../types/law';
import { ALL_LAWS } from '../data/laws';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (docId: string, unitId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectResult,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      return;
    }
    const res = searchLegislation(trimmed);
    setResults(res);
  }, [query]);

  // Quick suggestions for fast jumping
  const suggestions = [
    { label: '§ 212 Krádež', query: '§ 212' },
    { label: '§ 25 Nutná obrana', query: '§ 25' },
    { label: 'Čl. 1 Zvrchovaný štát', query: 'cl. 1' },
    { label: '§ 4 Povinnosti vodiča', query: '§ 4' },
    { label: '§ 61 Výpoveď', query: '§ 61' },
    { label: '§ 123 Vlastnícke právo', query: '§ 123' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4 bg-slate-950/70 backdrop-blur-xs">
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-amber-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Hľadať v zákonoch (napr. „§ 212“, „trestný“, „krádež“, „čl. 1“)..."
            className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none text-base sm:text-lg"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            ESC
          </button>
        </div>

        {/* Results / Suggestions Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {query.trim().length === 0 ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Rýchly skok na paragraf
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => setQuery(s.query)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 text-xs font-medium text-slate-700 dark:text-slate-300 transition border border-slate-200 dark:border-slate-700/60"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Dostupné kódexy (6 zákonov)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ALL_LAWS.map((law) => (
                    <button
                      key={law.id}
                      onClick={() => {
                        onSelectResult(law.id, law.allUnits[0]?.id || 'par-1');
                        onClose();
                      }}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                    >
                      <BookOpen className="w-4 h-4 text-amber-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                          {law.title}
                        </p>
                        <p className="text-[10px] text-slate-400">{law.actNumber}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <p className="text-sm">Pre výraz „{query}“ sa nenašli žiadne výsledky.</p>
              <p className="text-xs text-slate-400 mt-1">
                Tip: Skúste vyhľadať konkrétny paragraf (napr. „§ 212“) alebo kľúčové slovo bez diakritiky.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-slate-400 font-medium">
                Nájdené výsledky ({results.length}):
              </p>
              {results.map((res) => (
                <div
                  key={`${res.documentId}-${res.unitId}`}
                  onClick={() => {
                    onSelectResult(res.documentId, res.unitId);
                    onClose();
                  }}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 hover:bg-amber-500/5 transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs">
                        {res.unitDisplayNumber}
                      </span>
                      {res.unitTitle && (
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {res.unitTitle}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0">
                      {res.documentTitle}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {res.matchedSnippet}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Vyhľadávanie bez ohľadu na diakritiku</span>
          </div>
          <span className="hidden sm:inline">Stlačením ESC zatvoríte</span>
        </div>
      </div>
    </div>
  );
};
