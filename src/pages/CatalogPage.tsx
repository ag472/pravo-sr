/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Filter, BookOpen, Headphones, Calendar, ArrowRight, Check } from 'lucide-react';
import { ALL_LAWS, CATEGORIES } from '../data/laws';
import { LawCategory, LegalDocument } from '../types/law';
import { removeDiacritics } from '../services/legislationService';
import { audioPlayer } from '../services/audioPlayerService';

interface CatalogPageProps {
  initialCategory?: LawCategory | 'all';
  onSelectLaw: (lawId: string, unitId?: string) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  initialCategory = 'all',
  onSelectLaw,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<LawCategory | 'all'>(
    initialCategory
  );
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  const years = Array.from(new Set(ALL_LAWS.map((l) => l.year))).sort((a, b) => b - a);

  const filteredLaws = ALL_LAWS.filter((law) => {
    // Category filter
    if (selectedCategory !== 'all' && law.category !== selectedCategory) {
      return false;
    }
    // Year filter
    if (selectedYear !== 'all' && law.year.toString() !== selectedYear) {
      return false;
    }
    // Text search filter
    if (searchFilter.trim()) {
      const q = removeDiacritics(searchFilter.trim());
      const titleNorm = removeDiacritics(law.title);
      const actNorm = removeDiacritics(law.actNumber);
      const descNorm = removeDiacritics(law.description);
      return titleNorm.includes(q) || actNorm.includes(q) || descNorm.includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Page Title & Intro */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Katalóg zákonov SR
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Konsolidované znenia kľúčových právnych predpisov Zbierky zákonov Slovenskej republiky.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filtrovať v katalógu podľa názvu alebo čísla..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="all">Všetky roky</option>
              {years.map((y) => (
                <option key={y} value={y.toString()}>
                  Rok {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Všetky ({ALL_LAWS.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Laws List */}
      <div className="space-y-4">
        {filteredLaws.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Pre zadané filtre sa nenašli žiadne zákony.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedYear('all');
                setSearchFilter('');
              }}
              className="mt-3 px-4 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold"
            >
              Resetovať filtre
            </button>
          </div>
        ) : (
          filteredLaws.map((law) => (
            <div
              key={law.id}
              className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 hover:shadow-md transition space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 font-mono font-bold text-xs">
                      {law.actNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-medium">
                      {law.categoryLabel}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      <Headphones className="w-3 h-3" />
                      Hlasové čítanie
                    </span>
                  </div>

                  <h3
                    onClick={() => onSelectLaw(law.id)}
                    className="text-lg font-bold text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition cursor-pointer"
                  >
                    {law.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {law.description}
                  </p>
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0">
                  <button
                    onClick={() => onSelectLaw(law.id)}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-xs transition"
                  >
                    <span>Čítať zákon</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      const firstUnit = law.allUnits[0];
                      if (firstUnit) {
                        audioPlayer.playUnit(law.id, firstUnit.id);
                      }
                    }}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 font-semibold text-xs transition"
                    title="Spustiť prehrávanie od začiatku zákona"
                  >
                    <Headphones className="w-3.5 h-3.5" />
                    <span>Počúvať od začiatku</span>
                  </button>
                </div>
              </div>

              {/* Stats Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
                <span>{law.allUnits.length} paragrafov / článkov</span>
                <span>•</span>
                <span>Účinnosť od: {law.effectiveDate}</span>
                <span>•</span>
                <span>Zbierka zákonov SR</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
