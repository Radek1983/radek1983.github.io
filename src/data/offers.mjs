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
    opis: 'Angielski po lekcjach',
    kontekst: 'SP 402 · klasy 1-7',
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
    opis: 'Egzamin ósmoklasisty',
    kontekst: 'SP 402 · przygotowanie egzaminacyjne',
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
    opis: 'Angielski dla seniorów',
    kontekst: 'Terminal Kultury Gocław',
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
    opis: 'Indywidualnie online',

    /*
     * Nie "Online" - to powtarzalo slowo z linii wyzej. Druga linia ma
     * dopowiadac, kto moze skorzystac, a nie duplikowac nazwe.
     */
    kontekst: 'Dzieci · młodzież · dorośli',
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

/**
 * Etykieta odnosnika do cennika.
 *
 * "Porownaj ceny" obiecuje zestawienie czterech kwot obok siebie. Dopoki
 * trzy z czterech produktow nie maja potwierdzonej stawki, taka obietnica
 * byloby wprowadzaniem w blad - strona cennika pokazuje wtedy glownie
 * informacje "cena nieustalona".
 *
 * Etykieta zmieni sie sama, gdy wlasciciel uzupelni brakujace ceny w OFFERS.
 */
export const CENY_KOMPLETNE = OFFERS.every((oferta) => oferta.price !== null)
export const LINK_CENNIK = CENY_KOMPLETNE ? 'Porównaj ceny' : 'Cennik'
