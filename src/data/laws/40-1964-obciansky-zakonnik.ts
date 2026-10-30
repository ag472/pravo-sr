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
        title: 'Občianskoprávne vzťahy a ich ochrana',
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
                text: 'Občiansky zákonník upravuje majetkové vzťahy fyzických a právnických osôb, majetkové vzťahy medzi týmito osobami a štátom, ako aj vzťahy vyplývajúce z práva na ochranu osôb, pokiaľ tieto občianskoprávne vzťahy neupravujú iné zákony.',
              },
              {
                id: '2',
                number: 2,
                text: 'V občianskoprávnych vzťahoch majú účastníci rovnaké postavenie.',
              },
            ],
            fullText: '§ 1 (1) Občiansky zákonník upravuje majetkové vzťahy fyzických a právnických osôb, majetkové vzťahy medzi týmito osobami a štátom, ako aj vzťahy vyplývajúce z práva na ochranu osôb. (2) V občianskoprávnych vzťahoch majú účastníci rovnaké postavenie.',
          },
          {
            id: 'par-11',
            type: 'paragraph',
            number: '11',
            displayNumber: '§ 11',
            title: 'Ochrana osobnosti',
            subsections: [
              {
                id: '1',
                number: 1,
                text: 'Fyzická osoba má právo na ochranu svojej osobnosti, najmä života a zdravia, občianskej cti a ľudskej dôstojnosti, ako aj súkromia, svojho mena a prejavov osobnej povahy.',
              },
            ],
            fullText: '§ 11 (1) Fyzická osoba má právo na ochranu svojej osobnosti, najmä života a zdravia, občianskej cti a ľudskej dôstojnosti, ako aj súkromia, svojho mena a prejavov osobnej povahy.',
          },
          {
            id: 'par-12',
            type: 'paragraph',
            number: '12',
            displayNumber: '§ 12',
            title: 'Podobizne a zvukové záznamy',
            subsections: [
              {
                id: '1',
                number: 1,
                text: 'Písomnosti osobnej povahy, podobizne, obrazové snímky a obrazové a zvukové záznamy týkajúce sa fyzickej osoby alebo jej prejavov osobnej povahy sa smú vyhotoviť alebo použiť len s jej privolením.',
              },
            ],
            fullText: '§ 12 (1) Písomnosti osobnej povahy, podobizne, obrazové snímky a zvukové záznamy týkajúce sa fyzickej osoby sa smú vyhotoviť alebo použiť len s jej privolením.',
          },
        ],
      },
    ],
  },
  {
    id: 'part-2',
    number: 'DRUHÁ ČASŤ',
    title: 'Vecné práva',
    chapters: [
      {
        id: 'chap-2-1',
        number: 'I. Hlava',
        title: 'Vlastnícke právo',
        units: [
          {
            id: 'par-123',
            type: 'paragraph',
            number: '123',
            displayNumber: '§ 123',
            title: 'Obsah vlastníckeho práva',
            subsections: [
              {
                id: '1',
                number: 1,
                text: 'Vlastník je v medziach zákona oprávnený predmet svojho vlastníctva držať, užívať, požívať jeho plody a úžitky a nakladať s ním.',
              },
            ],
            fullText: '§ 123 (1) Vlastník je v medziach zákona oprávnený predmet svojho vlastníctva držať, užívať, požívať jeho plody a úžitky a nakladať s ním.',
          },
          {
            id: 'par-127',
            type: 'paragraph',
            number: '127',
            displayNumber: '§ 127',
            title: 'Susedské práva',
            subsections: [
              {
                id: '1',
                number: 1,
                text: 'Vlastník veci sa musí zdržať všetkého, čím by nad mieru primeranú pomerom obťažoval iného alebo čím by vážne ohrozoval výkon jeho práv. Preto najmä nesmie ohroziť susedovu stavbu alebo pozemok úpravami pozemku alebo úpravami stavby bez toho, že by urobil dostatočné opatrenie na upevnenie stavby alebo pozemku, nesmie nad mieru primeranú pomerom obťažovať susedov hlukom, prachom, popolčekom, dymom, plynmi, parami, pachmi, pevnými a tekutými odpadmi, svetlom, tienením a vibráciami.',
              },
            ],
            fullText: '§ 127 (1) Vlastník veci sa musí zdržať všetkého, čím by nad mieru primeranú pomerom obťažoval iného alebo čím by vážne ohrozoval výkon jeho práv.',
          },
        ],
      },
    ],
  },
  {
    id: 'part-6',
    number: 'ŠIESTA ČASŤ',
    title: 'Zodpovednosť za škodu a bezdôvodné obohatenie',
    chapters: [
      {
        id: 'chap-6-1',
        number: 'I. Hlava',
        title: 'Predchádzanie hroziacim škodám a všeobecná zodpovednosť',
        units: [
          {
            id: 'par-415',
            type: 'paragraph',
            number: '415',
            displayNumber: '§ 415',
            title: 'Generálna prevencia',
            subsections: [
              {
                id: '1',
                number: 1,
                text: 'Každý je povinný počínať si tak, aby nedochádzalo ku škodám na zdraví, na majetku, na prírode a životnom prostredí.',
              },
            ],
            fullText: '§ 415 (1) Každý je povinný počínať si tak, aby nedochádzalo ku škodám na zdraví, na majetku, na prírode a životnom prostredí.',
          },
          {
            id: 'par-420',
            type: 'paragraph',
            number: '420',
            displayNumber: '§ 420',
            title: 'Všeobecná zodpovednosť za škodu',
            subsections: [
              {
                id: '1',
                number: 1,
                text: 'Každý zodpovedá za škodu, ktorú spôsobil porušením právnej povinnosti.',
              },
              {
                id: '3',
                number: 3,
                text: 'Zodpovednosti sa zbaví ten, kto preukáže, že škodu nezavinil.',
              },
            ],
            fullText: '§ 420 (1) Každý zodpovedá za škodu, ktorú spôsobil porušením právnej povinnosti. (3) Zodpovednosti sa zbaví ten, kto preukáže, že škodu nezavinil.',
          },
        ],
      },
    ],
  },
];

const allUnits = parts.flatMap((p) => p.chapters.flatMap((c) => c.units));

export const docObcianskyZakonnik: LegalDocument = {
  id: '40-1964',
  actNumber: 'č. 40/1964 Zb.',
  title: 'Občiansky zákonník',
  shortTitle: 'Občiansky zákonník',
  category: 'obcianske',
  categoryLabel: 'Občianske právo',
  year: 1964,
  effectiveDate: '1. apríla 1964',
  description:
    'Základný súkromnoprávny predpis upravujúci majetkové vzťahy, vlastníctvo, ochranu osobnosti, záväzkové právo, zmluvy a zodpovednosť za škodu.',
  parts,
  allUnits,
  stats: {
    unitCount: allUnits.length,
    wordCount: 1890,
    estimatedReadTimeMinutes: 9,
  },
};
