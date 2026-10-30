/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LegalDocument, LawCategory } from '../../types/law';
import { docUstavaSR } from './460-1992-ustava';
import { docTrestnyZakon } from './300-2005-trestny-zakon';
import { docTrestnyPoriadok } from './301-2005-trestny-poriadok';
import { docObcianskyZakonnik } from './40-1964-obciansky-zakonnik';
import { docZakonnikPrace } from './311-2001-zakonnik-prace';
import { docCestnaPremavka } from './8-2009-cestna-premavka';

export const ALL_LAWS: LegalDocument[] = [
  docUstavaSR,
  docTrestnyZakon,
  docTrestnyPoriadok,
  docObcianskyZakonnik,
  docZakonnikPrace,
  docCestnaPremavka,
];

export const CATEGORIES: { id: LawCategory; label: string; count: number; icon: string }[] = [
  { id: 'ustavne', label: 'Ústavné právo', count: 1, icon: 'landmark' },
  { id: 'trestne', label: 'Trestné právo', count: 2, icon: 'shield-alert' },
  { id: 'obcianske', label: 'Občianske právo', count: 1, icon: 'scale' },
  { id: 'pracovne', label: 'Pracovné právo', count: 1, icon: 'briefcase' },
  { id: 'dopravne', label: 'Dopravné právo', count: 1, icon: 'car' },
];

export function getLawById(id: string): LegalDocument | undefined {
  return ALL_LAWS.find((law) => law.id === id);
}

export function getAllUnitsForLaw(lawId: string) {
  const law = getLawById(lawId);
  return law ? law.allUnits : [];
}

export function findUnitInLaw(lawId: string, unitId: string) {
  const law = getLawById(lawId);
  if (!law) return null;
  return law.allUnits.find((u) => u.id === unitId) || null;
}
