/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Scale, Lock, User, Mail, ArrowRight, ShieldCheck, CheckCircle2, Sparkles, KeyRound } from 'lucide-react';
import { useAuth } from '../store/lawStore';

interface AuthPageProps {
  onSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const { user, isAuthenticated, login, register, logout } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('adriana');
  const [fullName, setFullName] = useState('Adriana');
  const [password, setPassword] = useState('naucimsato');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUsername = username.trim();
    if (!cleanUsername) {
      setError('Zadajte používateľské meno alebo e-mail.');
      return;
    }

    if (password.length < 4) {
      setError('Heslo musí mať aspoň 4 znaky.');
      return;
    }

    if (isRegisterMode) {
      const cleanName = fullName.trim() || cleanUsername;
      const res = register(cleanUsername, cleanName, password);
      if (!res.success && res.error) {
        setError(res.error);
        return;
      }
      setSuccessMsg(`Účet pre „${cleanUsername}“ bol úspešne vytvorený!`);
      setTimeout(() => onSuccess(), 600);
    } else {
      const res = login(cleanUsername, password);
      if (!res.success && res.error) {
        setError(res.error);
        return;
      }
      setSuccessMsg(`Úspešne prihlásený ako „${cleanUsername}“!`);
      setTimeout(() => onSuccess(), 500);
    }
  };

  const fillQuickAccount = (uname: string, pwd: string, name?: string) => {
    setUsername(uname);
    setPassword(pwd);
    if (name) setFullName(name);
    setError(null);
  };

  if (isAuthenticated && user) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Aktívne prihlásená
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-2">
            {user.fullName}
          </h2>
          <p className="text-xs text-amber-500 font-mono mt-0.5">{user.email}</p>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl text-xs text-slate-600 dark:text-slate-300 text-left space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-400">Používateľské meno:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">{user.username}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Alias domény:</span>
            <span className="font-mono text-amber-500">@pravo-sr.sk</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Offline synchronizácia:</span>
            <span className="text-emerald-500 font-medium">Aktívna v PWA</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onSuccess}
            className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md transition"
          >
            Prejsť na zákony
          </button>
          <button
            onClick={() => logout()}
            className="py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Odhlásiť
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-10 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 mb-3">
          <Scale className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {isRegisterMode ? 'Vytvoriť účet' : 'Prihlásenie do Právo SR'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {isRegisterMode
            ? 'Zaregistrujte sa pre synchronizáciu záložiek a histórie.'
            : 'Zadajte používateľské meno alebo e-mail pre prístup k uloženým zákonom.'}
        </p>
      </div>

      {/* Quick Account Pill (Adriana) */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-amber-500" />
            Vytvorený účet pre vás:
          </span>
          <span className="text-[10px] bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-mono font-semibold">
            Pripravené
          </span>
        </div>
        <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
          <div>
            <p>Meno: <strong className="font-mono text-slate-900 dark:text-white">adriana</strong></p>
            <p>Heslo: <strong className="font-mono text-slate-900 dark:text-white">naucimsato</strong></p>
          </div>
          <button
            type="button"
            onClick={() => fillQuickAccount('adriana', 'naucimsato', 'Adriana')}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs transition active:scale-95"
          >
            Vyplniť
          </button>
        </div>
      </div>

      {/* Error / Success Feedback */}
      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs">
          {successMsg}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegisterMode && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Celé meno / Titul
            </label>
            <div className="relative">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Napr. Adriana"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Používateľské meno alebo e-mail
          </label>
          <div className="relative flex items-center">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="meno alebo meno@domena.sk"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              required
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Podpora aliasu: <span className="font-mono text-amber-500">meno</span> sa automaticky namapuje na <span className="font-mono">meno@pravo-sr.sk</span>.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Heslo
          </label>
          <div className="relative flex items-center">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 transition flex items-center justify-center gap-2 mt-2 active:scale-98 cursor-pointer"
        >
          <span>{isRegisterMode ? 'Zaregistrovať sa' : 'Prihlásiť sa'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Mode toggle */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
        <button
          type="button"
          onClick={() => {
            setIsRegisterMode(!isRegisterMode);
            setError(null);
          }}
          className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-semibold cursor-pointer"
        >
          {isRegisterMode
            ? 'Už máte účet? Prihláste sa tu'
            : 'Nemáte ešte účet? Vytvoriť nový účet'}
        </button>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>Lokálne overenie účtu a šifrované ukladanie profilu</span>
      </div>
    </div>
  );
};
