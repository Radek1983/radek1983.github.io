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
    etykietaStopki: 'Klasy 1-7',
    tytul: 'Angielski dla dzieci',
    opis: 'Angielski po lekcjach',
    kontekst: 'SP 402 · klasy 1-7',
    odbiorca: 'Klasy 1-7',
    miejsce: 'SP 402, po lekcjach',
    url: '/oferta/dzieci/',
    ctaMenu: 'Zobacz zajęcia',
    price: { pierwsze: '55 zł / 45 min', kolejne: '50 zł / 45 min' },
  },
  {
    id: 'egzamin',
    numer: '02',
    skrot: 'Klasa 8',
    etykietaStopki: 'Klasa 8',
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
    skrot: 'Dla seniorów',
    etykietaStopki: 'Seniorzy 60+',
    tytul: 'Angielski dla seniorów',
    opis: 'Angielski dla seniorów',
    /*
     * Wiek zszedl z etykiety, wiec musi zostac TU. Inaczej pozycja "Dla
     * seniorow" nie mowilaby juz, do kogo sa te zajecia - a to jedyna
     * oferta w serwisie z progiem wiekowym.
     */
    kontekst: '60+ · Terminal Kultury Gocław',
    odbiorca: '60+',
    miejsce: 'Terminal Kultury Gocław',
    url: '/oferta/seniorzy/',
    ctaMenu: 'Zobacz zajęcia',
    price: null,
  },
  {
    id: 'online',
    numer: '04',
    skrot: 'Online 1 na 1',
    etykietaStopki: 'Online 1 na 1',
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
  /*
   * Ta strona ma WLASNA sekcje zapisow, wiec wezwanie zostaje na niej
   * zamiast odsylac na strone glowna. Mapa jest kluczowana sciezka pliku,
   * wiec zmiana dotyczy wylacznie tego adresu - pozostale osiem stron
   * zachowuje swoje cele.
   */
  'oferta/dzieci/index.html': { label: 'Zapisz dziecko', href: '#zapisy-klasy-1-7' },
  /* Ta strona ma WLASNA sekcje zapisow, wiec wezwanie zostaje na niej. */
  'oferta/egzamin-osmoklasisty/index.html': {
    label: 'Zapytaj o grupę',
    href: '#zapisy-egzamin-osmoklasisty',
  },
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

/**
 * Dane kontaktowe - JEDNO zrodlo dla calego serwisu.
 *
 * Wczesniej numer i adres byly zaszyte w pieciu plikach HTML, wiec podmiana
 * na dane docelowe oznaczalaby pieciokrotna edycje i realne ryzyko, ze gdzies
 * zostanie stara wartosc.
 *
 * OBIE WARTOSCI SA DOCELOWE. Wlasciciel przekazal je bezposrednio i zastapily
 * tymczasowe konto prywatne z decyzji D6 - patrz CLAUDE.md par. 15.
 *
 * SKRZYNKA WE WLASNEJ DOMENIE - ZALATWIONE 17.09.2026. Adres zszedl
 * z publicznego dostawcy na kontakt@highfive.academy; domene przekazal
 * wlasciciel, nie zostala wymyslona. To zamyka brak G-17.
 *
 * Uwaga: domena poczty NIE jest domena serwisu. Strona nadal stoi pod
 * radek1983.github.io (decyzja D3) i adres kanoniczny zostaje bez zmian.
 */
export const KONTAKT = {
  /** Postac wyswietlana, z niełamliwymi spacjami. */
  telefon: '+48&nbsp;790&nbsp;266&nbsp;517',
  /** Postac dla protokolu tel: - bez spacji i znakow formatujacych. */
  telefonHref: '+48790266517',
  email: 'kontakt@highfive.academy',
}
