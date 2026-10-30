/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Home,
  BookOpen,
  Bookmark,
  Settings,
  Scale,
  User,
  LogOut,
  Moon,
  Sun,
  Search,
} from 'lucide-react';
import { useAuth, useBookmarks, useReaderSettings } from '../store/lawStore';
import { PWAInstallButton } from './PWAInstallButton';

export type AppPage = 'home' | 'catalog' | 'reader' | 'favorites' | 'settings' | 'auth';

interface NavigationProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  onOpenSearch?: () => void;
}

export const Sidebar: React.FC<NavigationProps> = ({
  currentPage,
  onNavigate,
  onOpenSearch,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { bookmarks } = useBookmarks();
  const { settings, updateSettings } = useReaderSettings();

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: nextTheme });
    if (typeof document !== 'undefined') {
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const navItems = [
    { id: 'home' as AppPage, label: 'Domov', icon: Home },
    { id: 'catalog' as AppPage, label: 'Katalóg zákonov', icon: BookOpen },
    {
      id: 'favorites' as AppPage,
      label: 'Obľúbené a záložky',
      icon: Bookmark,
      badge: bookmarks.length > 0 ? bookmarks.length : undefined,
    },
    { id: 'settings' as AppPage, label: 'Nastavenia', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-200 border-r border-slate-800 shrink-0 h-screen sticky top-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 text-left group w-full"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20 group-hover:scale-105 transition">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading text-lg font-bold tracking-wider text-white">
                PRÁVO SR
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
                PWA
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Legislatíva & Audio čítač</p>
          </div>
        </button>
      </div>

      {/* Quick Search Button in Sidebar */}
      <div className="p-3">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs transition border border-slate-700/60"
        >
          <Search className="w-4 h-4 text-amber-400" />
          <span className="flex-1 text-left">Hľadať v zákonoch...</span>
          <kbd className="text-[10px] bg-slate-700 px-1.5 py-0.5 rounded text-slate-300">§</kbd>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* PWA Install Promotion */}
      <div className="p-3">
        <PWAInstallButton variant="card" />
      </div>

      {/* User & Theme Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/60 space-y-2">
        <div className="flex items-center justify-between px-2 text-xs text-slate-400">
          <span>Téma rozhrania</span>
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-amber-400 transition"
            title="Prepnúť tému"
          >
            {settings.theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </div>

        {isAuthenticated && user ? (
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                {user.fullName.charAt(0)}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">{user.fullName}</p>
                <p className="text-[10px] text-slate-400 truncate">@{user.username}</p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition"
              title="Odhlásiť sa"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onNavigate('auth')}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition border border-slate-700"
          >
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span>Prihlásiť sa</span>
          </button>
        )}
      </div>
    </aside>
  );
};

export const MobileBottomNav: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  const { bookmarks } = useBookmarks();

  const navItems = [
    { id: 'home' as AppPage, label: 'Domov', icon: Home },
    { id: 'catalog' as AppPage, label: 'Zákony', icon: BookOpen },
    {
      id: 'favorites' as AppPage,
      label: 'Obľúbené',
      icon: Bookmark,
      badge: bookmarks.length > 0 ? bookmarks.length : undefined,
    },
    { id: 'settings' as AppPage, label: 'Nastavenia', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-slate-300 py-1.5 px-2 safe-area-pb">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[11px] font-medium transition relative ${
                isActive ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 bg-amber-500 text-slate-950 font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="mt-1">{item.label}</span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-amber-400 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
