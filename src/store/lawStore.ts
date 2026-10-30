/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSyncExternalStore } from 'react';
import {
  BookmarkItem,
  PlaybackState,
  ReaderSettings,
  ReadingHistoryItem,
  UserProfile,
} from '../types/law';

export interface RegisteredAccount {
  id: string;
  username: string;
  email: string;
  fullName: string;
  passwordHash: string;
  createdDate: string;
}

interface AppStoreState {
  user: UserProfile | null;
  accounts: RegisteredAccount[];
  bookmarks: BookmarkItem[];
  history: ReadingHistoryItem[];
  playback: PlaybackState;
  settings: ReaderSettings;
}

const STORAGE_KEY = 'pravo_sr_state_v1';

export const PRESET_ACCOUNTS: RegisteredAccount[] = [
  {
    id: 'usr-adriana-1',
    username: 'adriana',
    email: 'adriana@pravo-sr.sk',
    fullName: 'Adriana',
    passwordHash: 'naucimsato',
    createdDate: new Date().toISOString(),
  },
  {
    id: 'usr-demo-1',
    username: 'pravnik_sr',
    email: 'pravnik_sr@pravo-sr.sk',
    fullName: 'Dr. Martin Kováč',
    passwordHash: 'admin123',
    createdDate: new Date().toISOString(),
  },
];

const DEFAULT_SETTINGS: ReaderSettings = {
  theme: 'system',
  fontSize: 17,
  serifFont: true,
  playbackRate: 1.0,
  autoScrollToPlaying: true,
  highContrast: false,
};

const DEFAULT_PLAYBACK: PlaybackState = {
  documentId: null,
  documentTitle: '',
  documentActNumber: '',
  unitId: null,
  unitDisplayNumber: '',
  unitTitle: '',
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  rate: 1.0,
  isBuffering: false,
  isMinimized: false,
  autoPlayNext: true,
  ttsVoice: 'Kore',
};

function loadInitialState(): AppStoreState {
  const initialBookmarks: BookmarkItem[] = [
    {
      id: 'bm-init-1',
      documentId: '460-1992',
      documentTitle: 'Ústava Slovenskej republiky',
      documentActNumber: 'č. 460/1992 Zb.',
      unitId: 'cl-1',
      unitDisplayNumber: 'Čl. 1',
      unitTitle: 'Zvrchovaný, demokratický a právny štát',
      note: 'Základný článok ústavnosti',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'bm-init-2',
      documentId: '300-2005',
      documentTitle: 'Trestný zákon',
      documentActNumber: 'č. 300/2005 Z. z.',
      unitId: 'par-25',
      unitDisplayNumber: '§ 25',
      unitTitle: 'Nutná obrana',
      note: 'Okolnosti vylučujúce protiprávnosť',
      createdAt: new Date().toISOString(),
    },
  ];

  const initialHistory: ReadingHistoryItem[] = [
    {
      documentId: '300-2005',
      documentTitle: 'Trestný zákon',
      documentActNumber: 'č. 300/2005 Z. z.',
      unitId: 'par-212',
      unitDisplayNumber: '§ 212',
      unitTitle: 'Krádež',
      progressPercent: 65,
      updatedAt: new Date().toISOString(),
    },
  ];

  const defaultUser: UserProfile = {
    id: 'usr-adriana-1',
    username: 'adriana',
    email: 'adriana@pravo-sr.sk',
    fullName: 'Adriana',
    createdDate: new Date().toISOString(),
  };

  if (typeof window === 'undefined') {
    return {
      user: defaultUser,
      accounts: PRESET_ACCOUNTS,
      bookmarks: initialBookmarks,
      history: initialHistory,
      playback: DEFAULT_PLAYBACK,
      settings: DEFAULT_SETTINGS,
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Ensure preset accounts (including adriana: naucimsato) are in the accounts list
      const savedAccounts: RegisteredAccount[] = Array.isArray(parsed.accounts) ? parsed.accounts : [];
      const mergedAccounts = [...savedAccounts];
      for (const preset of PRESET_ACCOUNTS) {
        const existingIdx = mergedAccounts.findIndex(
          (a) => a.username.toLowerCase() === preset.username.toLowerCase()
        );
        if (existingIdx === -1) {
          mergedAccounts.push(preset);
        } else {
          // Keep passwordHash synchronized with preset
          mergedAccounts[existingIdx] = {
            ...mergedAccounts[existingIdx],
            passwordHash: preset.passwordHash,
            fullName: preset.fullName || mergedAccounts[existingIdx].fullName,
          };
        }
      }

      // If active user was previous demo user, set to Adriana as newly requested
      const activeUser = parsed.user || defaultUser;

      return {
        user: activeUser,
        accounts: mergedAccounts,
        bookmarks: Array.isArray(parsed.bookmarks) ? parsed.bookmarks : initialBookmarks,
        history: Array.isArray(parsed.history) ? parsed.history : initialHistory,
        playback: { ...DEFAULT_PLAYBACK, ...(parsed.playback || {}), isPlaying: false, isBuffering: false },
        settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
      };
    }
  } catch (err) {
    console.error('Failed to parse localStorage state for Pravo SR:', err);
  }

  return {
    user: defaultUser,
    accounts: PRESET_ACCOUNTS,
    bookmarks: initialBookmarks,
    history: initialHistory,
    playback: {
      ...DEFAULT_PLAYBACK,
      documentId: '300-2005',
      documentTitle: 'Trestný zákon',
      documentActNumber: 'č. 300/2005 Z. z.',
      unitId: 'par-212',
      unitDisplayNumber: '§ 212',
      unitTitle: 'Krádež',
    },
    settings: DEFAULT_SETTINGS,
  };
}

let currentState: AppStoreState = loadInitialState();
const listeners = new Set<() => void>();

function notify() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));
    } catch (err) {
      console.warn('Failed to persist store state to localStorage:', err);
    }
  }
  listeners.forEach((listener) => listener());
}

export const store = {
  getSnapshot(): AppStoreState {
    return currentState;
  },

  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  // Auth actions
  login(usernameOrEmail: string, password?: string): { success: boolean; error?: string } {
    const rawInput = usernameOrEmail.trim().toLowerCase();
    const isEmail = rawInput.includes('@');
    const email = isEmail ? rawInput : `${rawInput}@pravo-sr.sk`;
    const username = isEmail ? rawInput.split('@')[0] : rawInput;

    // Check against registered accounts
    const existing = currentState.accounts.find(
      (a) => a.username.toLowerCase() === username || a.email.toLowerCase() === email
    );

    if (existing) {
      // Validate password
      if (existing.passwordHash && password && existing.passwordHash !== password) {
        return {
          success: false,
          error: `Nesprávne heslo pre používateľa „${existing.username}“.`,
        };
      }

      currentState = {
        ...currentState,
        user: {
          id: existing.id,
          username: existing.username,
          email: existing.email,
          fullName: existing.fullName,
          createdDate: existing.createdDate,
        },
      };
      notify();
      return { success: true };
    }

    // If new user and password entered, create account automatically
    const newAccount: RegisteredAccount = {
      id: `usr-${Date.now()}`,
      username,
      email,
      fullName: username.charAt(0).toUpperCase() + username.slice(1),
      passwordHash: password || '',
      createdDate: new Date().toISOString(),
    };

    currentState = {
      ...currentState,
      accounts: [...currentState.accounts, newAccount],
      user: {
        id: newAccount.id,
        username: newAccount.username,
        email: newAccount.email,
        fullName: newAccount.fullName,
        createdDate: newAccount.createdDate,
      },
    };
    notify();
    return { success: true };
  },

  register(username: string, fullName: string, password?: string, email?: string): { success: boolean; error?: string } {
    const cleanUser = username.trim().toLowerCase();
    const finalEmail = (email && email.trim().toLowerCase()) || `${cleanUser}@pravo-sr.sk`;

    // Check if username already exists
    const existing = currentState.accounts.find(
      (a) => a.username.toLowerCase() === cleanUser
    );

    if (existing) {
      // Update password and login
      existing.passwordHash = password || existing.passwordHash;
      existing.fullName = fullName || existing.fullName;
      currentState = {
        ...currentState,
        user: {
          id: existing.id,
          username: existing.username,
          email: existing.email,
          fullName: existing.fullName,
          createdDate: existing.createdDate,
        },
      };
      notify();
      return { success: true };
    }

    const newAccount: RegisteredAccount = {
      id: `usr-${Date.now()}`,
      username: cleanUser,
      email: finalEmail,
      fullName: fullName || cleanUser,
      passwordHash: password || 'naucimsato',
      createdDate: new Date().toISOString(),
    };

    currentState = {
      ...currentState,
      accounts: [...currentState.accounts, newAccount],
      user: {
        id: newAccount.id,
        username: newAccount.username,
        email: newAccount.email,
        fullName: newAccount.fullName,
        createdDate: newAccount.createdDate,
      },
    };
    notify();
    return { success: true };
  },

  logout() {
    currentState = {
      ...currentState,
      user: null,
    };
    notify();
  },

  // Bookmark actions
  toggleBookmark(item: Omit<BookmarkItem, 'id' | 'createdAt'>) {
    const exists = currentState.bookmarks.find(
      (b) => b.documentId === item.documentId && b.unitId === item.unitId
    );

    if (exists) {
      currentState = {
        ...currentState,
        bookmarks: currentState.bookmarks.filter((b) => b.id !== exists.id),
      };
    } else {
      const newBookmark: BookmarkItem = {
        ...item,
        id: `bm-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        createdAt: new Date().toISOString(),
      };
      currentState = {
        ...currentState,
        bookmarks: [newBookmark, ...currentState.bookmarks],
      };
    }
    notify();
  },

  removeBookmark(id: string) {
    currentState = {
      ...currentState,
      bookmarks: currentState.bookmarks.filter((b) => b.id !== id),
    };
    notify();
  },

  isBookmarked(documentId: string, unitId?: string): boolean {
    return currentState.bookmarks.some(
      (b) => b.documentId === documentId && (!unitId || b.unitId === unitId)
    );
  },

  // Reading history
  recordHistory(item: ReadingHistoryItem) {
    const existingFiltered = currentState.history.filter(
      (h) => h.documentId !== item.documentId
    );
    currentState = {
      ...currentState,
      history: [item, ...existingFiltered].slice(0, 10),
    };
    notify();
  },

  // Playback actions
  setPlayback(partial: Partial<PlaybackState>) {
    currentState = {
      ...currentState,
      playback: {
        ...currentState.playback,
        ...partial,
      },
    };
    notify();
  },

  // Reader Settings
  updateSettings(partial: Partial<ReaderSettings>) {
    currentState = {
      ...currentState,
      settings: {
        ...currentState.settings,
        ...partial,
      },
    };
    notify();
  },
};

// React Custom Hooks
export function useLawStore(): AppStoreState {
  return useSyncExternalStore(store.subscribe, store.getSnapshot);
}

export function useAuth() {
  const state = useLawStore();
  return {
    user: state.user,
    accounts: state.accounts,
    isAuthenticated: !!state.user,
    login: store.login,
    register: store.register,
    logout: store.logout,
  };
}

export function useBookmarks() {
  const state = useLawStore();
  return {
    bookmarks: state.bookmarks,
    toggleBookmark: store.toggleBookmark,
    removeBookmark: store.removeBookmark,
    isBookmarked: store.isBookmarked,
  };
}

export function usePlayback() {
  const state = useLawStore();
  return {
    playback: state.playback,
    setPlayback: store.setPlayback,
  };
}

export function useReaderSettings() {
  const state = useLawStore();
  return {
    settings: state.settings,
    updateSettings: store.updateSettings,
  };
}
