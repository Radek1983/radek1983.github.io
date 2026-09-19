# ADR 0011 — podstrona `/polityka-prywatnosci/` i dziesiąty adres serwisu

- **Status:** przyjęte
- **Data:** 2026-09-19
- **Decyduje:** właściciel
- **Dotyczy:** nowy adres publiczny, treść prawna, spis treści dokumentu, odnośnik w stopce

## Kontekst

ADR 0007 i 0008 ustaliły dziewięć adresów serwisu i zakaz tworzenia kolejnych
podstron bez zlecenia (`CLAUDE.md` §18). Właściciel zlecił dziesiątą: stronę
z polityką prywatności, wraz z gotowym dokumentem źródłowym
`Polityka_prywatnosci_High_Five_v1.0.pdf`.

Powód jest prozaiczny i nie wynika z architektury: serwis zbiera dane osobowe
przez pocztę i telefon, a od 19.09.2026 stoi pod własną domeną. Dokument
musiał istnieć w formie, którą da się zalinkować i zaindeksować.

## Decyzja

**Pełna treść polityki żyje jako HTML, a PDF jest wyłącznie wersją do pobrania.**
Nie osadzamy dokumentu w `iframe` ani nie odsyłamy do samego pliku: wersja
użytkowa i indeksowalna ma być stroną.

Treść pochodzi **co do słowa** z dostarczonego PDF-a. Pominięte zostały tylko
elementy techniczne składu: żywa pagina, stopka strony i numery stron.
Zgodność sprawdzona porównaniem słowo po słowie (diff na najdłuższym wspólnym
podciągu) — 1952 słowa źródła, zero różnic merytorycznych.

**Jeden widoczny odnośnik w całym serwisie:** stopka, kolumna `Informacje`,
pod pozycją `Kontakt`. Właściciel wskazał to miejsce po tym, jak odnośnik
stanął najpierw w kolumnie `Kontakt`. Nagłówek, mega-menu, szuflada mobilna
i pozostałe strony nie dostały żadnego wejścia — dokument prawny nie jest
elementem nawigacji ofertowej.

**Strona nie ma wezwania w nagłówku.** Mapa `CTA` w `src/data/offers.mjs`
przyjmuje odtąd `null`, a `htmlPartials` usuwa wtedy cały blok wezwania
w szufladzie i zastępuje go w pasku pustą przegrodką o szerokości przycisku.
Bez przegrodki `justify-content: space-between` odsyłało menu o 463 px
na prawy skraj — przycisk zapisu obok tytułu polityki czytał się jak sprzedaż
przy okazji czytania klauzuli.

## Konsekwencje

- **Serwis ma dziesięć adresów.** `CLAUDE.md` §13 i §18 mówią o dziewięciu —
  zapis zaktualizowany razem z tym ADR.
- Podstrona wniosła **nowy moduł** `src/js/modules/policy-toc.js` (spis treści:
  zwijanie na wąskim ekranie, czytana sekcja, dosuwanie listy) oraz **nowy
  zasób** `public/dokumenty/polityka-prywatnosci-high-five-1-0.pdf`. Plik stoi
  w `public/`, bo wymaga stabilnego adresu — `src/assets/` nadałoby mu
  odcisk palca i zmieniałby się przy każdym wydaniu.
- Reguły CSS stoją na końcu `components/page-sections.css`, zakotwiczone
  nazwami `.policy*`, z tego samego powodu co bloki `[data-page='online']`
  i `[data-section='kariera']`: dołożenie nowego pliku do `main.css` wywraca
  serwer deweloperski do czasu restartu (§18). Przy najbliższym restarcie
  można je przenieść do `pages/polityka.css` bez zmiany treści.
- **Polityka publikuje fakty, których wcześniej w serwisie nie było:** dane
  rejestrowe partnera (`High Five AGNIESZKA KAROLEWSKA`, NIP, REGON, adres),
  listę odbiorców danych (OVHcloud, Google, Microsoft, mBank, Meta) i okresy
  przechowywania. Wszystkie pochodzą z dokumentu właściciela, więc §4 jest
  spełniony — ale od teraz **dokument jest ich źródłem**: zmiana danych na
  stronie oznacza zmianę PDF-a, nie odwrotnie.
- Strona trafia do `sitemap.xml` z najniższym priorytetem i częstotliwością
  `yearly`.

## Do decyzji właściciela

Dokument kończy się zdaniem „Dokument przeznaczony do publikacji na stronie
highfive.academy. W przypadku zmiany sposobu przetwarzania danych polityka
powinna zostać zaktualizowana." Czyta się jak notatka redakcyjna, a nie treść
dla czytelnika. Zostaje na stronie zgodnie z PDF-em do czasu decyzji.

## Odrzucone warianty

- **Sam PDF pod odnośnikiem.** Odrzucone: dokument prawny ma być czytelny
  na telefonie i wyszukiwalny, a plik nie jest ani jednym, ani drugim.
- **Odnośnik w kolumnie `Kontakt` stopki.** Tak stało najpierw; właściciel
  przeniósł go do `Informacje`, gdzie stoją pozostałe pozycje informacyjne.
- **Pozycja w menu głównym.** Odrzucone: menu ma osiem pozycji i prowadzi
  do oferty. Polityka jest przypisem serwisu, nie jego kategorią.
