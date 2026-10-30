/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LegalDocument, LegalPart } from '../../types/law';

const parts: LegalPart[] = [
  {
    id: 'part-1',
    number: 'PRVÁ ČASŤ',
    title: 'Všeobecná časť',
    chapters: [
      {
        id: 'chap-1',
        number: 'I. Hlava',
        title: 'Základy trestnej zodpovednosti',
        units: [
          {
            id: 'par-1',
            type: 'paragraph',
            number: '1',
            displayNumber: '§ 1',
            title: 'Účel Trestného zákona',
            subsections: [
              {
                id: '1',
                number: 1,
                text: 'Trestný zákon chráni práva a oprávnené záujmy fyzických osôb a právnických osôb, záujmy spoločnosti a ústavné zriadenie Slovenskej republiky pred trestnými činmi.',
              },
            ],
            fullText: '§ 1 (1) Trestný zákon chráni práva a oprávnené záujmy fyzických osôb a právnických osôb, záujmy spoločnosti a ústavné zriadenie Slovenskej republiky pred trestnými činmi.',
          },
          {
            id: 'par-8',
            type: 'paragraph',
            number: '8',
            displayNumber: '§ 8',
            title: 'Trestný čin',
            subsections: [
              {
                id: '1',
                number: 1,
                text: 'Trestný čin je protiprávny čin, ktorého znaky sú uvedené v tomto zákone, ak tento zákon neustanovuje inak.',
              },
            ],
            fullText: '§ 8 (1) Trestný čin je protiprávny čin, ktorého znaky sú uvedené v tomto zákone, ak tento zákon neustanovuje inak.',
          },
          {
            id: 'par-9',
            type: 'paragraph',
            number: '9',
            displayNumber: '§ 9',
            title: 'Prečiny a zločiny',
            subsections: [
              {
                id: '1',
                number: 1,
                text: 'Trestné činy sa delia na prečiny a zločiny.',
              },
              {
                id: '2',
                number: 2,
                text: 'Prečin je trestný čin spáchaný z nedbanlivosti alebo úmyselný trestný čin, za ktorý tento zákon v osobitnej časti ustanovuje trest odňatia slobody s hornou hranicou trestnej sadzby neprevyšujúcou päť rokov.',
              },
              {
                id: '3',
                number: 3,
                text: 'Zločin je úmyselný trestný čin, za ktorý tento zákon v osobitnej časti ustanovuje trest odňatia slobody s hornou hranicou trestnej sadzby prevyšujúcou päť rokov.',
              },
            ],
            fullText: '§ 9 (1) Trestné činy sa delia na prečiny a zločiny. (2) Prečin je trestný čin spáchaný z nedbanlivosti alebo úmyselný trestný čin, za ktorý tento zákon v osobitnej časti ustanovuje trest odňatia slobody s hornou hranicou trestnej sadzby neprevyšujúcou päť rokov. (3) Zločin je úmyselný trestný čin, za ktorý tento zákon v osobitnej časti ustanovuje trest odňatia slobody s hornou hranicou prevyšujúcou päť rokov.',
          },
          {
            id: 'par-24',
            type: 'paragraph',
            number: '24',
            displayNumber: '§ 24',
            title: 'Okolnosti vylučujúce protiprávnosť činu',
            subsections: [
              {
                id: '1',
                number: 1,
                text: 'Čin inak trestný nie je trestným činom, ak ide o krajnú núdzu, nutnú obranu, oprávnené použitie zbrane, dovolené riziko, výkon práva a povinnosti, súhlas poškodeného alebo plnenie úlohy agenta.',
              },
            ],
            fullText: '§ 24 (1) Čin inak trestný nie je trestným činom, ak ide o krajnú núdzu, nutnú obranu, oprávnené použitie zbrane, dovolené riziko, výkon práva a povinnosti, súhlas poškodeného alebo plnenie úlohy agenta.',
          },
          {
            id: 'par-25',
            type: 'paragraph',
            number: '25',
            displayNumber: '§ 25',
            title: 'Nutná obrana',
            subsections: [
              {
                id: '1',
                number: 1,
                text: 'Čin inak trestný, ktorým niekto odvracia priamo hroziaci alebo trvajúci útok na záujem chránený týmto zákonom, nie je trestným činom.',
              },
              {
                id: '2',
                number: 2,
                text: 'Nejde o nutnú obranu, ak obrana bola celkom zjavne neprimeraná útoku, najmä k jeho spôsobu, miestu a času, okolnostiam vzťahujúcim sa k osobe útočníka alebo k osobe obrancu.',
              },
              {
                id: '3',
                number: 3,
                text: 'Ten, kto odvracia útok spôsobom uvedeným v odseku 2, nie je trestne zodpovedný, ak konal v silnom rozrušení spôsobenom útokom, najmä v dôsledku zmätku, strachu alebo zľaknutia.',
              },
            ],
            fullText: '§ 25 (1) Čin inak trestný, ktorým niekto odvracia priamo hroziaci alebo trvajúci útok na záujem chránený týmto zákonom, nie je trestným činom. (2) Nejde o nutnú obranu, ak obrana bola celkom zjavne neprimeraná útoku, najmä k jeho spôsobu, miestu a času, okolnostiam vzťahujúcim sa k osobe útočníka alebo k osobe obrancu.',
          },
        ],
      },
    ],
  },
  {
    id: 'part-2',
    number: 'DRUHÁ ČASŤ',
    title: 'Osobitná časť',
    chapters: [
      {
        id: 'chap-2-1',
        number: 'I. Hlava',
        title: 'Trestné činy proti životu a zdraviu',
        units: [
          {
            id: 'par-144',
            type: 'paragraph',
            number: '144',
            displayNumber: '§ 144',
            title: 'Úkladná vražda',
            subsections: [
              {
                id: '1',
                number: 1,
                text: 'Kto iného úmyselne usmrtí s vopred uváženou pohnútkou, potrestá sa odňatím slobody na dvadsať rokov až dvadsaťpäť rokov.',
              },
              {
                id: '2',
                number: 2,
                text: 'Odňatím slobody na dvadsaťpäť rokov alebo trestom odňatia slobody na doživotie sa páchateľ potrestá, ak spácha čin uvedený v odseku 1 na chránenej osobe, alebo z osobitného motívu.',
              },
            ],
            fullText: '§ 144 (1) Kto iného úmyselne usmrtí s vopred uváženou pohnútkou, potrestá sa odňatím slobody na dvadsať rokov až dvadsaťpäť rokov. (2) Odňatím slobody na dvadsaťpäť rokov alebo trestom odňatia slobody na doživotie sa páchateľ potrestá, ak spácha čin uvedený v odseku 1 na chránenej osobe, alebo z osobitného motívu.',
          },
          {
            id: 'par-145',
            type: 'paragraph',
            number: '145',
            displayNumber: '§ 145',
            title: 'Vražda',
            subsections: [
              {
                id: '1',
                number: 1,
                text: 'Kto iného úmyselne usmrtí, potrestá sa odňatím slobody na pätnásť rokov až dvadsať rokov.',
              },
            ],
            fullText: '§ 145 (1) Kto iného úmyselne usmrtí, potrestá sa odňatím slobody na pätnásť rokov až dvadsať rokov.',
          },
        ],
      },
      {
        id: 'chap-2-4',
        number: 'IV. Hlava',
        title: 'Trestné činy proti majetku',
        units: [
          {
            id: 'par-212',
            type: 'paragraph',
            number: '212',
            displayNumber: '§ 212',
            title: 'Krádež',
            subsections: [
              {
                id: '1',
                number: 1,
                text: 'Kto si prisvojí cudziu vec tým, že sa jej zmocní, a spôsobí tak malú škodu, potrestá sa odňatím slobody až na dva roky.',
              },
              {
                id: '2',
                number: 2,
                text: 'Odňatím slobody na šesť mesiacov až tri roky sa páchateľ potrestá, ak spácha čin uvedený v odseku 1 vlámaním, bezprostredne po čine sa pokúsi uchovať si vec násilím alebo hrozbou bezprostredného násilia, alebo na veci, ktorú má iný pri sebe.',
              },
              {
                id: '3',
                number: 3,
                text: 'Odňatím slobody na tri roky až desať rokov sa páchateľ potrestá, ak spácha čin uvedený v odseku 1 a spôsobí ním väčšiu škodu, alebo z osobitného motívu.',
              },
              {
                id: '4',
                number: 4,
                text: 'Odňatím slobody na sedem rokov až pätnásť rokov sa páchateľ potrestá, ak spácha čin uvedený v odseku 1 a spôsobí ním škodu veľkého rozsahu, alebo ako člen nebezpečného zoskupenia.',
              },
            ],
            fullText: '§ 212 (1) Kto si prisvojí cudziu vec tým, že sa jej zmocní, a spôsobí tak malú škodu, potrestá sa odňatím slobody až na dva roky. (2) Odňatím slobody na šesť mesiacov až tri roky sa páchateľ potrestá, ak spácha čin uvedený v odseku 1 vlámaním. (3) Odňatím slobody na tri roky až desať rokov sa páchateľ potrestá, ak spácha čin uvedený v odseku 1 a spôsobí ním väčšiu škodu.',
          },
          {
            id: 'par-221',
            type: 'paragraph',
            number: '221',
            displayNumber: '§ 221',
            title: 'Podvod',
            subsections: [
              {
                id: '1',
                number: 1,
                text: 'Kto na škodu cudzieho majetku seba alebo iného obohatí tým, že uvedie niekoho do omylu alebo využije niečí omyl, a spôsobí tak na cudzom majetku malú škodu, potrestá sa odňatím slobody až na dva roky.',
              },
            ],
            fullText: '§ 221 (1) Kto na škodu cudzieho majetku seba alebo iného obohatí tým, že uvedie niekoho do omylu alebo využije niečí omyl, a spôsobí tak na cudzom majetku malú škodu, potrestá sa odňatím slobody až na dva roky.',
          },
        ],
      },
    ],
  },
];

const allUnits = parts.flatMap((p) => p.chapters.flatMap((c) => c.units));

export const docTrestnyZakon: LegalDocument = {
  id: '300-2005',
  actNumber: 'č. 300/2005 Z. z.',
  title: 'Trestný zákon',
  shortTitle: 'Trestný zákon',
  category: 'trestne',
  categoryLabel: 'Trestné právo',
  year: 2005,
  effectiveDate: '1. januára 2006',
  description:
    'Kľúčový kódex hmotného trestného práva ustanovujúci základy trestnej zodpovednosti, druhy trestov a skutkové podstaty trestných činov.',
  parts,
  allUnits,
  stats: {
    unitCount: allUnits.length,
    wordCount: 2150,
    estimatedReadTimeMinutes: 10,
  },
};
