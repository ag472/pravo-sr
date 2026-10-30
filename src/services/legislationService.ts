/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ALL_LAWS, getLawById } from '../data/laws';
import { LegalDocument, LegalUnit, SearchResult } from '../types/law';

/**
 * Removes diacritics (accents) for insensitive search in Slovak.
 * e.g., "Trestný zákon" -> "trestny zakon", "Čl. 1" -> "cl. 1"
 */
export function removeDiacritics(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/**
 * Parses user input to check if they typed a specific paragraph or article number.
 * e.g. "§ 212", "§212", "paragraf 212", "cl. 1", "cl 12", "clanok 1"
 */
export function parseUnitQuery(query: string): { type?: 'paragraph' | 'article'; number?: string } | null {
  const clean = removeDiacritics(query.trim());

  // § 212 or §212 or p. 212
  const parMatch = clean.match(/(?:§|paragraf|par|p\.?)\s*(\d+[a-z]?)/i);
  if (parMatch) {
    return { type: 'paragraph', number: parMatch[1] };
  }

  // cl. 12 or cl 12 or clanok 12
  const artMatch = clean.match(/(?:cl\.?|clanok|clánok)\s*(\d+[a-z]?)/i);
  if (artMatch) {
    return { type: 'article', number: artMatch[1] };
  }

  // Pure number e.g. "212"
  if (/^\d+[a-z]?$/i.test(clean)) {
    return { number: clean };
  }

  return null;
}

/**
 * Global search across all consolidated laws.
 */
export function searchLegislation(query: string, targetDocId?: string): SearchResult[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const normalizedQuery = removeDiacritics(trimmed);
  const parsedTarget = parseUnitQuery(trimmed);

  const results: SearchResult[] = [];
  const docsToSearch = targetDocId
    ? ALL_LAWS.filter((d) => d.id === targetDocId)
    : ALL_LAWS;

  for (const doc of docsToSearch) {
    for (const unit of doc.allUnits) {
      const normalizedUnitNumber = removeDiacritics(unit.number);
      const normalizedTitle = unit.title ? removeDiacritics(unit.title) : '';
      const normalizedFullText = removeDiacritics(unit.fullText);

      // 1. Exact number match
      if (parsedTarget?.number && normalizedUnitNumber === parsedTarget.number) {
        if (!parsedTarget.type || parsedTarget.type === unit.type) {
          results.unshift({
            documentId: doc.id,
            documentTitle: doc.title,
            documentActNumber: doc.actNumber,
            unitId: unit.id,
            unitDisplayNumber: unit.displayNumber,
            unitTitle: unit.title,
            matchedSnippet: unit.fullText.slice(0, 160) + '...',
            matchType: 'exact_number',
          });
          continue;
        }
      }

      // 2. Unit Title match
      if (normalizedTitle && normalizedTitle.includes(normalizedQuery)) {
        results.push({
          documentId: doc.id,
          documentTitle: doc.title,
          documentActNumber: doc.actNumber,
          unitId: unit.id,
          unitDisplayNumber: unit.displayNumber,
          unitTitle: unit.title,
          matchedSnippet: unit.fullText.slice(0, 160) + '...',
          matchType: 'title',
        });
        continue;
      }

      // 3. Full text snippet match
      const matchIdx = normalizedFullText.indexOf(normalizedQuery);
      if (matchIdx !== -1) {
        const start = Math.max(0, matchIdx - 40);
        const end = Math.min(unit.fullText.length, matchIdx + trimmed.length + 80);
        const snippet = (start > 0 ? '...' : '') + unit.fullText.slice(start, end) + (end < unit.fullText.length ? '...' : '');

        results.push({
          documentId: doc.id,
          documentTitle: doc.title,
          documentActNumber: doc.actNumber,
          unitId: unit.id,
          unitDisplayNumber: unit.displayNumber,
          unitTitle: unit.title,
          matchedSnippet: snippet,
          matchType: 'fulltext',
        });
      }
    }
  }

  return results.slice(0, 25);
}

/**
 * Formats standard legal citation according to Slovak legal citation standards.
 * e.g. "§ 212 ods. 1 zákona č. 300/2005 Z. z. Trestný zákon"
 */
export function formatLegalCitation(
  doc: LegalDocument,
  unit: LegalUnit,
  subsectionNum?: number
): string {
  const unitPrefix = unit.displayNumber; // "§ 212" or "Čl. 1"
  const subsectionPart = subsectionNum ? ` ods. ${subsectionNum}` : '';
  return `${unitPrefix}${subsectionPart} ${doc.actNumber} ${doc.title}`;
}

/**
 * Normalizes text for speech synthesis according to Slovak legal rules.
 */
export function normalizeSlovakLegalTextForTTS(text: string): string {
  let normalized = text;

  // Replacements with proper word forms
  normalized = normalized.replace(/§\s*(\d+)/g, 'Paragraf $1');
  normalized = normalized.replace(/§/g, 'Paragraf');
  normalized = normalized.replace(/\bods\.\s*(\d+)/gi, 'odsek $1');
  normalized = normalized.replace(/\bods\./gi, 'odsek');
  normalized = normalized.replace(/\bpísm\.\s*([a-z]\))/gi, 'písmeno $1');
  normalized = normalized.replace(/\bpísm\./gi, 'písmeno');
  normalized = normalized.replace(/\bčl\.\s*(\d+)/gi, 'článok $1');
  normalized = normalized.replace(/\bčl\./gi, 'článok');
  normalized = normalized.replace(/\bZ\.\s*z\./g, 'Zbierky zákonov');
  normalized = normalized.replace(/\bZb\./g, 'Zbierky zákonov');
  normalized = normalized.replace(/\bnapr\./gi, 'napríklad');
  normalized = normalized.replace(/\bt\.\s*j\./gi, 'to jest');
  normalized = normalized.replace(/\bč\.\s*(\d+)/gi, 'číslo $1');

  // Spelled out bracket letters for clean TTS
  normalized = normalized.replace(/\(([a-z])\)/gi, ' písmeno $1 ');

  return normalized.trim();
}
