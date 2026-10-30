/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sidebar,
  MobileBottomNav,
  AppPage,
} from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ReaderPage } from './pages/ReaderPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { SettingsPage } from './pages/SettingsPage';
import { AuthPage } from './pages/AuthPage';
import { AudioPlayer } from './components/AudioPlayer';
import { SearchModal } from './components/SearchModal';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { PWAInstallButton } from './components/PWAInstallButton';
import { useLawStore } from './store/lawStore';
import { LawCategory } from './types/law';
import { WifiOff, Search, Scale } from 'lucide-react';

function getRepoPrefix(): string {
  if (typeof window === 'undefined') return '';
  if (window.location.hostname.endsWith('github.io')) {
    const segments = window.location.pathname.split('/').filter(Boolean);
    if (segments.length > 0) {
      return `/${segments[0]}`;
    }
  }
  return '';
}

function parseCurrentRoute(): { page: AppPage; lawId?: string; unitId?: string } {
  if (typeof window === 'undefined') return { page: 'home' };

  const hash = window.location.hash.replace(/^#\/?/, '');
  const searchParams = new URLSearchParams(window.location.search);
  const path = window.location.pathname;

  // Candidate path checks both hash route and pathname
  const candidate = hash || path;

  if (candidate.includes('/zakon/')) {
    const match = candidate.match(/\/zakon\/([^/?#]+)/);
    const id = match ? match[1] : '300-2005';
    let unit = searchParams.get('unit');
    if (!unit && hash.includes('unit=')) {
      const hashParams = new URLSearchParams(hash.split('?')[1]);
      unit = hashParams.get('unit');
    }
    return { page: 'reader', lawId: id, unitId: unit || undefined };
  }

  if (candidate.endsWith('/zakony') || candidate === 'zakony') {
    return { page: 'catalog' };
  }
  if (candidate.endsWith('/oblubene') || candidate === 'oblubene') {
    return { page: 'favorites' };
  }
  if (candidate.endsWith('/nastavenia') || candidate === 'nastavenia') {
    return { page: 'settings' };
  }
  if (candidate.endsWith('/prihlasenie') || candidate === 'prihlasenie') {
    return { page: 'auth' };
  }

  return { page: 'home' };
}

export default function App() {
  const { settings } = useLawStore();
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [activeLawId, setActiveLawId] = useState<string>('300-2005');
  const [activeUnitId, setActiveUnitId] = useState<string | undefined>('par-212');
  const [catalogCategory, setCatalogCategory] = useState<LawCategory | 'all'>('all');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  // Online / Offline listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Theme synchronization with html class
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const isDark =
      settings.theme === 'dark' ||
      (settings.theme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // URL sync (Browser history, GitHub Pages & deep linking)
  useEffect(() => {
    const handleLocationChange = () => {
      const parsed = parseCurrentRoute();
      setCurrentPage(parsed.page);
      if (parsed.lawId) {
        setActiveLawId(parsed.lawId);
      }
      if (parsed.unitId) {
        setActiveUnitId(parsed.unitId);
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateTo = (page: AppPage, lawId?: string, unitId?: string) => {
    setCurrentPage(page);

    let relativePath = '/';
    if (page === 'catalog') {
      relativePath = '/zakony';
    } else if (page === 'reader') {
      const id = lawId || activeLawId;
      setActiveLawId(id);
      setActiveUnitId(unitId);
      relativePath = `/zakon/${id}${unitId ? `?unit=${unitId}` : ''}`;
    } else if (page === 'favorites') {
      relativePath = '/oblubene';
    } else if (page === 'settings') {
      relativePath = '/nastavenia';
    } else if (page === 'auth') {
      relativePath = '/prihlasenie';
    }

    const repoPrefix = getRepoPrefix();
    const targetUrl = `${repoPrefix}${relativePath}`;

    if (window.location.pathname !== targetUrl) {
      try {
        window.history.pushState({}, '', targetUrl);
      } catch (e) {
        // Fallback to hash if pushState fails
        window.location.hash = relativePath;
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectLaw = (lawId: string, unitId?: string) => {
    navigateTo('reader', lawId, unitId);
  };

  const handleNavigateToCatalogWithCategory = (category?: LawCategory) => {
    setCatalogCategory(category || 'all');
    navigateTo('catalog');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row antialiased selection:bg-amber-500 selection:text-white">
      {/* Offline Status Alert */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-amber-600 text-slate-950 py-1.5 px-4 text-xs font-bold flex items-center justify-center gap-2 shadow-md">
          <WifiOff className="w-4 h-4 animate-bounce" />
          <span>Režim offline: Všetky uložené zákony máte k dispozícii v pamäti PWA.</span>
        </div>
      )}

      {/* Desktop Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={navigateTo}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top App Bar */}
        <header className="md:hidden sticky top-0 z-30 bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 shadow-xs">
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <span className="font-heading font-bold text-sm tracking-wide">PRÁVO SR</span>
              <span className="text-[10px] block text-slate-400 -mt-0.5">Slov-Lex čítač</span>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              title="Vyhľadávanie"
            >
              <Search className="w-4 h-4" />
            </button>
            <PWAInstallButton />
          </div>
        </header>

        {/* Global Compact Top Disclaimer */}
        <DisclaimerBanner compact />

        {/* Primary Route Page Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          {currentPage === 'home' && (
            <HomePage
              onOpenSearch={() => setIsSearchOpen(true)}
              onSelectLaw={handleSelectLaw}
              onNavigateToCatalog={handleNavigateToCatalogWithCategory}
            />
          )}

          {currentPage === 'catalog' && (
            <CatalogPage
              initialCategory={catalogCategory}
              onSelectLaw={handleSelectLaw}
            />
          )}

          {currentPage === 'reader' && (
            <ReaderPage
              lawId={activeLawId}
              initialUnitId={activeUnitId}
              onBack={() => navigateTo('catalog')}
            />
          )}

          {currentPage === 'favorites' && (
            <FavoritesPage
              onSelectLaw={handleSelectLaw}
              onExploreCatalog={() => navigateTo('catalog')}
            />
          )}

          {currentPage === 'settings' && (
            <SettingsPage onNavigateToAuth={() => navigateTo('auth')} />
          )}

          {currentPage === 'auth' && (
            <AuthPage onSuccess={() => navigateTo('home')} />
          )}
        </main>

        {/* Legal Disclaimer Footer on all pages */}
        <DisclaimerBanner />
      </div>

      {/* Floating Audio Player with sync to Reader */}
      <AudioPlayer
        onNavigateToLaw={(docId, unitId) => {
          handleSelectLaw(docId, unitId);
        }}
      />

      {/* Mobile Sticky Bottom Navigation */}
      <MobileBottomNav currentPage={currentPage} onNavigate={navigateTo} />

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={(docId, unitId) => {
          handleSelectLaw(docId, unitId);
        }}
      />
    </div>
  );
}
