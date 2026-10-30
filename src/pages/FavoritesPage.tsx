/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Bookmark,
  Trash2,
  Play,
  ArrowRight,
  BookOpen,
  Volume2,
  Copy,
  Check,
} from 'lucide-react';
import { useBookmarks } from '../store/lawStore';
import { audioPlayer } from '../services/audioPlayerService';

interface FavoritesPageProps {
  onSelectLaw: (lawId: string, unitId?: string) => void;
  onExploreCatalog: () => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  onSelectLaw,
  onExploreCatalog,
}) => {
  const { bookmarks, removeBookmark } = useBookmarks();
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopyCitation = (bm: any) => {
    const citation = `${bm.unitDisplayNumber || ''} ${bm.documentActNumber} ${bm.documentTitle}`;
    navigator.clipboard.writeText(citation);
    setCopiedId(bm.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Obľúbené & Záložky
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Vaše uložené paragrafy, články a kľúčové zákonné ustanovenia.
          </p>
        </div>
        <div className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 font-mono text-xs font-bold">
          {bookmarks.length} {bookmarks.length === 1 ? 'položka' : 'položiek'}
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Bookmark className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Zatiaľ žiadne uložené záložky
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Počas čítania zákonov môžete pri každom paragrafe kliknúť na ikonu záložky a uložiť si ho pre rýchly prístup a citovanie.
            </p>
          </div>
          <button
            onClick={onExploreCatalog}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition shadow-sm"
          >
            Prehliadať katalóg zákonov
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((bm) => (
            <div
              key={bm.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-bold text-xs">
                    {bm.unitDisplayNumber || 'Zákon'}
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {bm.unitTitle || bm.documentTitle}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {bm.documentTitle} ({bm.documentActNumber})
                </p>

                {bm.note && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 italic">
                    Poznámka: {bm.note}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Play audio button */}
                {bm.unitId && (
                  <button
                    onClick={() => audioPlayer.playUnit(bm.documentId, bm.unitId!)}
                    className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 transition"
                    title="Prehrať hlasový záznam"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}

                {/* Copy citation */}
                <button
                  onClick={() => handleCopyCitation(bm)}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition"
                  title="Kopírovať citáciu"
                >
                  {copiedId === bm.id ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>

                {/* Open in reader */}
                <button
                  onClick={() => onSelectLaw(bm.documentId, bm.unitId)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <span>Otvoriť</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {/* Delete bookmark */}
                <button
                  onClick={() => removeBookmark(bm.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition"
                  title="Odstrániť záložku"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
