/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LegalDocument, LegalPart } from '../../types/law';

const parts: LegalPart[] = [
  {
    id: 'part-1',
    number: 'PRVÁ ČASŤ',
    title: 'Spoločné ustanovenia',
    chapters: [
      {
        id: 'chap-1',
        number: 'I. Hlava',
        title: 'Základné zásady trestného konania',
        units: [
          {
            id: 'par-1',
            type: 'paragraph',
            number: '1',
            displayNumber: '§ 1',
            title: 'Predmet úpravy',
            subsections: [
              {
                id: '1',
                number: 1,
                text: 'Trestný poriadok upravuje postup orgánov činných v trestnom konaní a súdov tak, aby trestné činy boli náležite zistené a ich páchatelia podľa zákona spravodlivo potrestaní, pričom musia byť rešpektované základné práva a slobody fyzických osôb a právnických osôb.',
              },
            ],
            fullText: '§ 1 (1) Trestný poriadok upravuje postup orgánov činných v trestnom konaní a súdov tak, aby trestné činy boli náležite zistené a ich páchatelia podľa zákona spravodlivo potrestaní, pričom musia byť rešpektované základné práva a slobody fyzických osôb a právnických osôb.',
          },
          {
            id: 'par-2',
            type: 'paragraph',
            number: '2',
            displayNumber: '§ 2',
            title: 'Základné zásady trestného konania',
            subsections: [
              {
                id: '1',
                number: 1,
                text: 'Nikto nemôže byť stíhaný ako obvinený inak než zo zákonných dôvodov a spôsobom, ktorý ustanovuje tento zákon.',
              },
              {
                id: '2',
                number: 2,
                text: 'Do základných práv a slobôd osôb v prípadoch dovolených zákonom možno zasahovať len v miere nevyhnutnej na dosiahnutie účelu trestného konania, pričom treba rešpektovať dôstojnosť osôb a ich súkromie.',
              },
              {
                id: '4',
                number: 4,
                text: 'Každý, proti komu sa vedie trestné konanie, sa považuje za nevinného, kým súd právoplatným odsudzujúcim rozsudkom nevysloví jeho vinu (prezumpcia neviny).',
              },
            ],
            fullText: '§ 2 (1) Nikto nemôže byť stíhaný ako obvinený inak než zo zákonných dôvodov a spôsobom, ktorý ustanovuje tento zákon. (2) Do základných práv a slobôd osôb možno zasahovať len v miere nevyhnutnej. (4) Každý, proti komu sa vedie trestné konanie, sa považuje za nevinného, kým súd právoplatným odsudzujúcim rozsudkom nevysloví jeho vinu.',
          },
          {
            id: 'par-34',
            type: 'paragraph',
            number: '34',
            displayNumber: '§ 34',
            title: 'Práva a povinnosti obvineného',
            subsections: [
              {
                id: '1',
                number: 1,
                text: 'Obvinený má od začiatku konania proti svojej osobe právo vyjadriť sa ku všetkým skutočnostiam, ktoré sa mu kladú za vinu, a k dôkazom o nich, nie je však povinný vypovedať. Môže uvádzať okolnosti a dôkazy slúžiace na jeho obhajobu, podávať návrhy a žiadosti a opravné prostriedky.',
              },
              {
                id: '2',
                number: 2,
                text: 'Obvinený má právo zvoliť si obhajcu a s ním sa radiť aj počas úkonov vykonávaných orgánom činným v trestnom konaní alebo súdom. S obhajcom sa môže radiť bez prítomnosti tretej osoby.',
              },
            ],
            fullText: '§ 34 (1) Obvinený má právo vyjadriť sa ku všetkým skutočnostiam, nie je však povinný vypovedať. (2) Obvinený má právo zvoliť si obhajcu a s ním sa radiť aj počas úkonov bez prítomnosti tretej osoby.',
          },
        ],
      },
    ],
  },
];

const allUnits = parts.flatMap((p) => p.chapters.flatMap((c) => c.units));

export const docTrestnyPoriadok: LegalDocument = {
  id: '301-2005',
  actNumber: 'č. 301/2005 Z. z.',
  title: 'Trestný poriadok',
  shortTitle: 'Trestný poriadok',
  category: 'trestne',
  categoryLabel: 'Trestné právo',
  year: 2005,
  effectiveDate: '1. januára 2006',
  description:
    'Procesný kódex upravujúci postup polície, prokuratúry a súdov pri vyšetrovaní a súdnom stíhaní trestných činov vrátane záruk obhajoby a prezumpcie neviny.',
  parts,
  allUnits,
  stats: {
    unitCount: allUnits.length,
    wordCount: 1620,
    estimatedReadTimeMinutes: 8,
  },
};
