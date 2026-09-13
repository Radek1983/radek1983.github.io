/**
 * Jedno zrodlo prawdy o ofercie.
 *
 * Zasila przy budowaniu: mega-menu w naglowku, liste oferty w stopce
 * i szuflade mobilna. Dzieki temu dodanie piatego kursu jest jedna zmiana
 * w jednym pliku, a nie osmioma edycjami w czterech miejscach.
 *
 * Strony `/oferta` i `/cennik` maja wlasna, rozbudowana tresc i NIE sa
 * generowane z tej listy - to byloby juz budowanie stron z danych, przed
 * czym wlasciciel wprost przestrzegal. Tutaj zyja wylacznie te pola, ktore
 * naprawde powtarzaja sie w nawigacji.
 *
 * `price: null` znaczy "cena nieustalona". NIE wolno wstawic tu liczby
 * bez potwierdzenia przez wlasciciela (CLAUDE.md par. 4).
 */

export const OFFERS = [
  {
    id: 'dzieci',
    numer: '01',
    skrot: 'Klasy 1-7',
    tytul: 'Angielski dla dzieci',
    odbiorca: 'Klasy 1-7',
    miejsce: 'SP 402, po lekcjach',
    url: '/oferta/dzieci/',
    ctaMenu: 'Zobacz zajęcia',
    price: { pierwsze: '55 zł / 60 min', kolejne: '50 zł / 60 min' },
  },
  {
    id: 'egzamin',
    numer: '02',
    skrot: 'Klasa 8',
    tytul: 'Egzamin ósmoklasisty',
    odbiorca: 'Klasa 8',
    miejsce: 'SP 402, po lekcjach',
    url: '/oferta/egzamin-osmoklasisty/',
    ctaMenu: 'Zobacz kurs',
    price: null,
  },
  {
    id: 'seniorzy',
    numer: '03',
    skrot: '60+',
    tytul: 'Angielski dla seniorów',
    odbiorca: '60+',
    miejsce: 'Terminal Kultury Gocław',
    url: '/oferta/seniorzy/',
    ctaMenu: 'Zobacz zajęcia',
    price: null,
  },
  {
    id: 'online',
    numer: '04',
    skrot: '1 na 1',
    tytul: 'Indywidualnie online',
    odbiorca: 'Dzieci, młodzież, dorośli',
    miejsce: 'Online',
    url: '/oferta/online/',
    ctaMenu: 'Zobacz online',
    price: null,
  },
]

/**
 * Wezwanie do dzialania zalezne od adresu.
 *
 * "Zapisz dziecko" na stronie kariery byloby pomylka, tak samo jak
 * "Aplikuj" na stronie dla rodzicow. Klucz to sciezka pliku wzgledem
 * katalogu projektu - tak identyfikuje strone `transformIndexHtml`.
 */
export const CTA = {
  /*
   * Strona glowna mowi do wszystkich czterech grup odbiorcow, wiec wezwanie
   * musi byc neutralne. "Zapisz dziecko" zawezalo je do rodzicow, mimo ze
   * ta sama strona niesie oferte dla seniorow i lekcje indywidualne.
   */
  'index.html': { label: 'Zapytaj o zajęcia', href: '/#kontakt' },
  'oferta/index.html': { label: 'Zapytaj o zajęcia', href: '/#kontakt' },
  'oferta/dzieci/index.html': { label: 'Zapisz dziecko', href: '/#kontakt' },
  'oferta/egzamin-osmoklasisty/index.html': { label: 'Zapytaj o grupę', href: '/#kontakt' },
  'oferta/seniorzy/index.html': { label: 'Zapytaj o miejsce', href: '/#kontakt' },
  'oferta/online/index.html': { label: 'Umów lekcję', href: '/#kontakt' },
  'lokalizacje/index.html': { label: 'Zapytaj o zajęcia', href: '/#kontakt' },
  'cennik/index.html': { label: 'Zapytaj o zajęcia', href: '/#kontakt' },
  'kariera/index.html': { label: 'Aplikuj', href: '#aplikacja' },
  '404.html': { label: 'Zapytaj o zajęcia', href: '/#kontakt' },
}

export const CTA_DOMYSLNE = { label: 'Zapisz dziecko', href: '/oferta/dzieci/' }
