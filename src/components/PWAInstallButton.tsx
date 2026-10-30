/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Download, Share2, PlusSquare, CheckCircle2, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface Props {
  className?: string;
  variant?: 'button' | 'card' | 'badge';
}

export const PWAInstallButton: React.FC<Props> = ({ className = '', variant = 'button' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  if (isInstalled) {
    if (variant === 'card') {
      return (
        <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-xl text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Aplikácia Právo SR je nainštalovaná v režime celej obrazovky.</span>
        </div>
      );
    }
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    if (variant === 'card') {
      return (
        <div className="p-4 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-amber-500" />
              Nainštalovať aplikáciu Právo SR
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Čítajte a počúvajte zákony bez internetu priamo z plochy zariadenia.
            </p>
          </div>
          <button
            onClick={install}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-sm rounded-xl shadow-sm transition active:scale-95"
          >
            <Download className="w-4 h-4" />
            Inštalovať
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={install}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-medium text-xs shadow-sm transition active:scale-95 ${className}`}
        title="Nainštalovať aplikáciu na plochu"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Inštalovať PWA</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        {variant === 'card' ? (
          <div className="p-4 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-amber-500" />
                Inštalácia na iPhone a iPad
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Pridajte si Právo SR na domovskú plochu pre offline prístup.
              </p>
            </div>
            <button
              onClick={() => setShowIOSModal(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-sm rounded-xl transition"
            >
              Návod na inštaláciu
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowIOSModal(true)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition ${className}`}
          >
            <PlusSquare className="w-3.5 h-3.5 text-amber-500" />
            <span>Pridať na plochu iOS</span>
          </button>
        )}

        {showIOSModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-amber-500" />
                  Pridať na plochu iPhone
                </h3>
                <button
                  onClick={() => setShowIOSModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-600 font-bold text-xs shrink-0">1</span>
                  <p>V dolnej lište Safari klepnite na ikonu <strong>Zdieľať</strong> (štvorec so šípkou nahor).</p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-600 font-bold text-xs shrink-0">2</span>
                  <p>Prejdite v ponuke nižšie a vyberte možnosť <strong>„Pridať na plochu“</strong> (Add to Home Screen).</p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-600 font-bold text-xs shrink-0">3</span>
                  <p>V pravom hornom rohu potvrďte klepnutím na <strong>Pridať</strong>.</p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSModal(false)}
                className="mt-5 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-sm transition"
              >
                Rozumiem
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Generic fallback if not installable or desktop safari
  if (variant === 'card') {
    return (
      <div className="p-4 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm">PWA Režim</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Aplikácia je pripravená na offline použitie a inštaláciu v kompatibilných prehliadačoch.
          </p>
        </div>
        <span className="px-2.5 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-full">
          PWA Aktívne
        </span>
      </div>
    );
  }

  return null;
};
