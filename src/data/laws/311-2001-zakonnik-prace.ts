/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LegalDocument, LegalPart } from '../../types/law';

const parts: LegalPart[] = [
  {
    id: 'part-1',
    number: 'PRVÁ ČASŤ',
    title: 'Všeobecné ustanovenia',
    chapters: [
      {
        id: 'chap-1-1',
        number: 'I. Hlava',
        title: 'Rozsah pôsobnosti a základné zásady',
        units: [
          {
            id: 'par-1',
            type: 'paragraph',
            number: '1',
            displayNumber: '§ 1',
            title: 'Pôsobnosť Zákonníka práce',
            subsections: [
              {
                id: '1',
                number: 1,
                text: 'Tento zákon upravuje individuálne pracovnoprávne vzťahy v súvislosti s výkonom závislej práce fyzických osôb pre právnické osoby alebo fyzické osoby a kolektívne pracovnoprávne vzťahy.',
              },
              {
                id: '2',
                number: 2,
                text: 'Závislá práca je práca vykonávaná vo vzťahu nadriadenosti zamestnávateľa a podriadenosti zamestnanca, osobne zamestnancom pre zamestnávateľa, podľa pokynov zamestnávateľa, v jeho mene, v pracovnom čase určenom zamestnávateľom.',
              },
            ],
            fullText: '§ 1 (1) Tento zákon upravuje individuálne pracovnoprávne vzťahy v súvislosti s výkonom závislej práce. (2) Závislá práca je práca vykonávaná vo vzťahu nadriadenosti zamestnávateľa a podriadenosti zamestnanca.',
          },
        ],
      },
    ],
  },
  {
    id: 'part-2',
    number: 'DRUHÁ ČASŤ',
    title: 'Pracovný pomer',
    chapters: [
      {
        id: 'chap-2-1',
        number: 'I. Hlava',
        title: 'Vznik pracovného pomeru',
        units: [
          {
            id: 'par-42',
            type: 'paragraph',
            number: '42',
            displayNumber: '§ 42',
            title: 'Pracovná zmluva',
            subsections: [
              {
                id: '1',
                number: 1,
                text: 'Pracovný pomer sa zakladá písomnou pracovnou zmluvou medzi zamestnávateľom a zamestnancom, ak tento zákon neustanovuje inak. Jedno písomné vyhotovenie pracovnej zmluvy je zamestnávateľ povinný vydať zamestnancovi.',
              },
            ],
            fullText: '§ 42 (1) Pracovný pomer sa zakladá písomnou pracovnou zmluvou medzi zamestnávateľom a zamestnancom.',
          },
          {
            id: 'par-43',
            type: 'paragraph',
            number: '43',
            displayNumber: '§ 43',
            title: 'Náležitosti pracovnej zmluvy',
            subsections: [
              {
                id: '1',
                number: 1,
                text: 'V pracovnej zmluve je zamestnávateľ povinný so zamestnancom dohodnúť podstatné náležitosti, ktorými sú druh práce, miesto výkonu práce, deň nástupu do práce a mzdové podmienky, ak nie sú dohodnuté v kolektívnej zmluve.',
              },
            ],
            fullText: '§ 43 (1) V pracovnej zmluve je zamestnávateľ povinný dohodnúť druh práce, miesto výkonu práce, deň nástupu a mzdové podmienky.',
          },
          {
            id: 'par-61',
            type: 'paragraph',
            number: '61',
            displayNumber: '§ 61',
            title: 'Výpoveď',
            subsections: [
              {
                id: '1',
                number: 1,
                text: 'Výpoveďou môže skončiť pracovný pomer zamestnávateľ aj zamestnanec. Výpoveď musí byť písomná a doručená, inak je neplatná.',
              },
              {
                id: '2',
                number: 2,
                text: 'Zamestnávateľ môže dať zamestnancovi výpoveď iba z dôvodov ustanovených v tomto zákone. Dôvod výpovede sa musí v písomnej výpovedi skutkovo vymedziť tak, aby ho nebolo možné zameniť s iným dôvodom.',
              },
            ],
            fullText: '§ 61 (1) Výpoveďou môže skončiť pracovný pomer zamestnávateľ aj zamestnanec. Výpoveď musí byť písomná a doručená, inak je neplatná. (2) Zamestnávateľ môže dať výpoveď iba zo zákonných dôvodov.',
          },
        ],
      },
      {
        id: 'chap-2-3',
        number: 'III. Hlava',
        title: 'Pracovný čas a doba odpočinku',
        units: [
          {
            id: 'par-85',
            type: 'paragraph',
            number: '85',
            displayNumber: '§ 85',
            title: 'Pracovný čas',
            subsections: [
              {
                id: '1',
                number: 1,
                text: 'Pracovný čas je časový úsek, v ktorom je zamestnanec k dispozícii zamestnávateľovi, vykonáva prácu a plní povinnosti v súlade s pracovnou zmluvou.',
              },
              {
                id: '5',
                number: 5,
                text: 'Pracovný čas zamestnanca je najviac 40 hodín týždenne. Zamestnanec, ktorý má pracovný čas rozvrhnutý tak, že pravidelne vykonáva prácu striedavo v oboch zmenách v dvojzmennej prevádzke, má pracovný čas najviac 38 a 3/4 hodiny týždenne a vo všetkých zmenách v trojzmennej prevádzke alebo v nepretržitej prevádzke má pracovný čas najviac 37 a 1/2 hodiny týždenne.',
              },
            ],
            fullText: '§ 85 (1) Pracovný čas je časový úsek, v ktorom je zamestnanec k dispozícii zamestnávateľovi. (5) Pracovný čas zamestnanca je najviac 40 hodín týždenne.',
          },
          {
            id: 'par-118',
            type: 'paragraph',
            number: '118',
            displayNumber: '§ 118',
            title: 'Mzda',
            subsections: [
              {
                id: '1',
                number: 1,
                text: 'Zamestnávateľ je povinný poskytovať zamestnancovi za vykonanú prácu mzdu.',
              },
              {
                id: '2',
                number: 2,
                text: 'Mzda je peňažné plnenie alebo plnenie peňažnej hodnoty (naturálna mzda) poskytované zamestnávateľovi zamestnancovi za prácu.',
              },
            ],
            fullText: '§ 118 (1) Zamestnávateľ je povinný poskytovať zamestnancovi za vykonanú prácu mzdu. (2) Mzda je peňažné plnenie poskytované za prácu.',
          },
        ],
      },
    ],
  },
];

const allUnits = parts.flatMap((p) => p.chapters.flatMap((c) => c.units));

export const docZakonnikPrace: LegalDocument = {
  id: '311-2001',
  actNumber: 'č. 311/2001 Z. z.',
  title: 'Zákonník práce',
  shortTitle: 'Zákonník práce',
  category: 'pracovne',
  categoryLabel: 'Pracovné právo',
  year: 2001,
  effectiveDate: '1. apríla 2002',
  description:
    'Základný predpis pracovného práva upravujúci vznik, zmenu a skončenie pracovného pomeru, pracovný čas, dovolenku, mzdu a ochranu zamestnancov.',
  parts,
  allUnits,
  stats: {
    unitCount: allUnits.length,
    wordCount: 1740,
    estimatedReadTimeMinutes: 8,
  },
};
