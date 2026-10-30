/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';

export const DisclaimerBanner: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-amber-500/10 border-y border-amber-500/20 text-[11px] text-amber-800 dark:text-amber-300/90 text-center">
        <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
        <span>Konsolidované znenie má informatívny charakter. Právne záväzné je iba znenie v Zbierke zákonov SR.</span>
      </div>
    );
  }

  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/50 py-4 px-4 text-center">
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
        <p>
          Konsolidované znenie má informatívny charakter. Právne záväzné je iba znenie v Zbierke zákonov SR.
        </p>
      </div>
    </footer>
  );
};
