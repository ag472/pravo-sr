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
        title: 'Základné povinnosti a pojmy',
        units: [
          {
            id: 'par-3',
            type: 'paragraph',
            number: '3',
            displayNumber: '§ 3',
            title: 'Všeobecné povinnosti účastníka cestnej premávky',
            subsections: [
              {
                id: '1',
                number: 1,
                text: 'Účastník cestnej premávky je povinný dodržiavať pravidlá cestnej premávky ustanovené v tomto zákone.',
              },
              {
                id: '2',
                number: 2,
                text: 'Účastník cestnej premávky je ďalej povinný správať sa disciplinovane a ohľaduplne tak, aby neohrozil bezpečnosť alebo plynulosť cestnej premávky, prispôsobiť svoje správanie najmä stavebnému, dopravno-technickému stavu cesty, situácii v cestnej premávke, poveternostným podmienkam a svojim schopnostiam.',
              },
            ],
            fullText: '§ 3 (1) Účastník cestnej premávky je povinný dodržiavať pravidlá cestnej premávky ustanovené v tomto zákone. (2) Účastník cestnej premávky je povinný správať sa disciplinovane a ohľaduplne.',
          },
          {
            id: 'par-4',
            type: 'paragraph',
            number: '4',
            displayNumber: '§ 4',
            title: 'Povinnosti vodiča',
            subsections: [
              {
                id: '1',
                number: 1,
                text: 'Vodič je povinný použiť na jazdu len vozidlo, ktoré možno prevádzkovať v cestnej premávke, a venovať sa plne vedeniu vozidla a sledovať situáciu v cestnej premávke.',
              },
              {
                id: '2',
                number: 2,
                text: 'Vodič nesmie požiť počas vedenia vozidla alkoholický nápoj ani inú návykovú látku, viesť vozidlo v takom čase po požití alkoholického nápoja alebo inej návykovej látky, keď sa alkohol alebo iná návyková látka ešte môžu nachádzať v jeho tele, a nesmie počas vedenia vozidla obsluhovať mobilný telefón alebo iné telekomunikačné zariadenie okrem použitia systému „voľné ruky“ (hands-free).',
              },
            ],
            fullText: '§ 4 (1) Vodič je povinný venovať sa plne vedeniu vozidla a sledovať situáciu v cestnej premávke. (2) Vodič nesmie požiť alkohol ani inú návykovú látku a nesmie počas vedenia vozidla obsluhovať mobilný telefón bez hands-free.',
          },
        ],
      },
      {
        id: 'chap-1-2',
        number: 'II. Hlava',
        title: 'Jazda vozidlami a rýchlosť',
        units: [
          {
            id: 'par-16',
            type: 'paragraph',
            number: '16',
            displayNumber: '§ 16',
            title: 'Rýchlosť jazdy',
            subsections: [
              {
                id: '1',
                number: 1,
                text: 'Vodič je povinný rýchlosť jazdy prispôsobiť najmä svojim schopnostiam, vlastnostiam vozidla a nákladu, poveternostným podmienkam, stavu a povahe vozovky a iným okolnostiam, ktoré možno predvídať. Vodič smie jazdiť len primeranou rýchlosťou, aby bol schopný zastaviť vozidlo na vzdialenosť, na ktorú má rozhľad.',
              },
              {
                id: '2',
                number: 2,
                text: 'Vodič motorového vozidla smie jazdiť v obci rýchlosťou najviac 50 km/h a na diaľnici v obci najviac 90 km/h.',
              },
              {
                id: '3',
                number: 3,
                text: 'Vodič motorového vozidla smie jazdiť mimo obce rýchlosťou najviac 90 km/h. Na diaľnici smie vodič motorového vozidla do 3 500 kg jazdiť rýchlosťou najviac 130 km/h.',
              },
            ],
            fullText: '§ 16 (1) Vodič je povinný rýchlosť jazdy prispôsobiť najmä svojim schopnostiam a stavu vozovky. (2) V obci smie jazdiť rýchlosťou najviac 50 km/h. (3) Mimo obce najviac 90 km/h, na diaľnici najviac 130 km/h.',
          },
          {
            id: 'par-23',
            type: 'paragraph',
            number: '23',
            displayNumber: '§ 23',
            title: 'Zastavenie a státie',
            subsections: [
              {
                id: '1',
                number: 1,
                text: 'Vodič smie zastaviť a stáť len vpravo v smere jazdy v jednom rade a rovnobežne s okrajom cesty, čo najbližšie k okraju cesty a na jednosmernej ceste vpravo i vľavo.',
              },
              {
                id: '2',
                number: 2,
                text: 'Pri zastavení a státí je vodič povinný prednostne použiť parkovisko tak, aby neobmedzoval ostatných vodičov.',
              },
            ],
            fullText: '§ 23 (1) Vodič smie zastaviť a stáť len vpravo v smere jazdy v jednom rade a rovnobežne s okrajom cesty. (2) Pri zastavení a státí je povinný prednostne použiť parkovisko.',
          },
        ],
      },
    ],
  },
];

const allUnits = parts.flatMap((p) => p.chapters.flatMap((c) => c.units));

export const docCestnaPremavka: LegalDocument = {
  id: '8-2009',
  actNumber: 'č. 8/2009 Z. z.',
  title: 'Zákon o cestnej premávke',
  shortTitle: 'Cestná premávka',
  category: 'dopravne',
  categoryLabel: 'Dopravné právo',
  year: 2009,
  effectiveDate: '1. februára 2009',
  description:
    'Základný predpis pre vodičov a chodcov stanovujúci pravidlá cestnej premávky, rýchlostné limity (50 / 90 / 130 km/h), prednosť v jazde a pravidlá parkovania.',
  parts,
  allUnits,
  stats: {
    unitCount: allUnits.length,
    wordCount: 1680,
    estimatedReadTimeMinutes: 8,
  },
};
