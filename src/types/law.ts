/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LegalUnitType = 'paragraph' | 'article'; // 'paragraph' = §, 'article' = Čl.

export interface SubsectionLetter {
  id: string; // napr. "a", "b"
  letter: string; // "a)", "b)"
  text: string;
}

export interface LegalSubsection {
  id: string; // napr. "1", "2"
  number: number; // 1, 2
  text: string;
  letters?: SubsectionLetter[];
}

export interface LegalUnit {
  id: string; // e.g. "par-212" or "cl-1"
  type: LegalUnitType;
  number: string; // "212", "1", "1a"
  displayNumber: string; // "§ 212" or "Čl. 1"
  title?: string; // e.g. "Krádež", "Základné ustanovenia"
  subsections: LegalSubsection[];
  fullText: string; // plain text representation for diacritic search & TTS
  ttsText?: string; // pre-normalized or custom text for voice reading
}

export interface LegalChapter {
  id: string;
  number?: string; // "PRVÁ HLAVA", "I. HLAVA"
  title: string;
  units: LegalUnit[];
}

export interface LegalPart {
  id: string;
  number?: string; // "PRVÁ ČASŤ", "VŠEOBECNÁ ČASŤ"
  title: string;
  chapters: LegalChapter[];
}

export type LawCategory =
  | 'ustavne'
  | 'trestne'
  | 'obcianske'
  | 'pracovne'
  | 'dopravne'
  | 'obchodne'
  | 'spravne';

export interface LegalDocument {
  id: string; // e.g. "460-1992", "300-2005"
  actNumber: string; // "460/1992 Zb.", "300/2005 Z. z."
  title: string; // "Ústava Slovenskej republiky", "Trestný zákon"
  shortTitle: string; // "Ústava SR", "Trestný zákon"
  category: LawCategory;
  categoryLabel: string; // "Ústavné právo", "Trestné právo"
  year: number;
  effectiveDate: string; // "1. januára 1993", "1. januára 2006"
  description: string;
  parts: LegalPart[];
  // Pre-flattened units array for fast iteration, indexing and search
  allUnits: LegalUnit[];
  stats: {
    unitCount: number;
    wordCount: number;
    estimatedReadTimeMinutes: number;
  };
}

export interface SearchResult {
  documentId: string;
  documentTitle: string;
  documentActNumber: string;
  unitId: string;
  unitDisplayNumber: string;
  unitTitle?: string;
  matchedSnippet: string;
  matchType: 'exact_number' | 'title' | 'fulltext';
}

export interface BookmarkItem {
  id: string; // unique
  documentId: string;
  documentTitle: string;
  documentActNumber: string;
  unitId?: string;
  unitDisplayNumber?: string;
  unitTitle?: string;
  note?: string;
  createdAt: string;
}

export interface ReadingHistoryItem {
  documentId: string;
  documentTitle: string;
  documentActNumber: string;
  unitId: string;
  unitDisplayNumber: string;
  unitTitle?: string;
  progressPercent: number;
  updatedAt: string;
}

export interface PlaybackState {
  documentId: string | null;
  documentTitle: string;
  documentActNumber: string;
  unitId: string | null;
  unitDisplayNumber: string;
  unitTitle?: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  rate: number; // 0.75, 1.0, 1.25, 1.5, 2.0
  isBuffering: boolean;
  isMinimized: boolean;
  autoPlayNext: boolean;
  ttsVoice: string; // "Kore"
}

export interface ReaderSettings {
  theme: 'light' | 'dark' | 'system';
  fontSize: number; // 14 to 22 (default 17)
  serifFont: boolean; // true = Literata/Georgia, false = Sans
  playbackRate: number; // 0.75, 1.0, 1.25, 1.5, 2.0
  autoScrollToPlaying: boolean;
  highContrast: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  token?: string;
  createdDate: string;
}
