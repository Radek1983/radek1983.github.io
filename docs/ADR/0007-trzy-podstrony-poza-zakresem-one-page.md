# ADR 0007: Trzy podstrony poza zakresem pierwszego one-page

Status: Accepted — **odstępstwo zlecone przez właściciela**
Data: 2026-09-13

## Kontekst

Master prompt §23 mówi wprost: „Na start: jeden kompletny one-page". `CLAUDE.md` §13
dopuszczał przyszłe podstrony **wyłącznie jako opis** w `docs/SEO.md`, a §18 zawierał zakaz:
„Nie twórz podstron poza zakresem pierwszego one-page **bez zlecenia**".

Właściciel zlecił rozszerzenie serwisu o trzy pełne podstrony: ofertę dla seniorów,
indywidualne lekcje online 1:1 oraz stronę rekrutacyjną. Zakaz był warunkowy — zlecenie
go uchyla. Ten ADR odnotowuje moment, w którym zakres pierwszego wydania został rozszerzony.

## Decyzja

Powstają trzy adresy: `/dla-seniorow/`, `/online/`, `/kariera/`.

**Statyczny MPA, bez routera.** Każda podstrona to osobny katalog z `index.html` i osobne
wejście w konfiguracji Vite. GitHub Pages serwuje wtedy czysty adres bez przepisywania URL,
a wejście z paska adresu i odświeżenie działają bez żadnej warstwy serwerowej. Rozwiązanie
z routerem po stronie klienta byłoby tu wprost sprzeczne z §10 („brak frameworka SPA").

**Wspólne fragmenty HTML zamiast kopiowania.** Nagłówek i stopka stoją w `partials/`
i są wstawiane przy budowaniu przez dwudziestolinijkowy plugin `htmlPartials`
w `vite.config.js`. Bez tego każda zmiana pozycji w menu wymagałaby czterech identycznych
edycji i strony prędzej czy później rozjechałyby się między sobą. Świadomie **nie** dodajemy
tu zależności — nowa paczka wymaga uzasadnienia i wpisu w `docs/ARCHITECTURE.md`.

**Wspólny system bloków, nie page builder.** `src/css/components/page-sections.css` daje sześć
bloków o ustalonym zachowaniu: hero ze zdjęciem, deklaracja, trzy kolumny, ponumerowane kroki,
split i pas końcowy. Kolor **nie** jest wariantem klasy — sekcje używają istniejącego
atrybutu `[data-theme]` ze strony głównej, więc papier, czerń, czerwień i granat zachowują
się identycznie w całym serwisie.

## Konsekwencje

**Nawigacja urosła z czterech pozycji do ośmiu.** To wymusiło dwie zmiany:

- Próg menu poziomego podniesiony z `62rem` na `75rem` — poniżej tej szerokości osiem pozycji
  plus wordmark i przycisk zawijało się do drugiego wiersza.
- Powstała **szuflada mobilna** z pułapką focusu. `CLAUDE.md` §9 uzasadniał wcześniej jej brak
  zdaniem „cztery kotwice nie uzasadniają menu hamburgerowego" — przy ośmiu pozycjach
  i trzech podstronach ten argument przestał obowiązywać. Bez JavaScriptu nawigacja pozostaje
  osiągalna ze stopki, która niesie te same osiem pozycji w zwykłym HTML.

**Kotwice w menu są bezwzględne** (`/#oferta`, nie `#oferta`), bo to samo menu stoi na czterech
stronach. Obserwator aktywnej sekcji w `navigation.js` filtruje teraz linki po tym, czy
prowadzą w głąb bieżącego dokumentu.

**Walidacja HTML przeniesiona na artefakt builda.** Pliki źródłowe zawierają komentarz
`<!--#include -->` zamiast markupu nagłówka, więc walidacja źródeł nie sprawdzałaby ani
nawigacji, ani stopki. `html-validate` celuje teraz w `dist/`. Ceną jest wyłączenie reguły
`void-style`: Vite wstrzykuje `<meta>` i `<link>` bez ukośnika, a o styl zapisu w źródłach
i tak dba Prettier.

**Kryterium BIZ „jeden one-page" przestaje obowiązywać w dotychczasowym brzmieniu.**
W raporcie odbioru pozycja idzie jako **odstępstwo zlecone przez właściciela**, nie jako PASS.

## Rozważane alternatywy

**Sekcje na stronie głównej zamiast podstron** — zero zmian w architekturze. Odrzucone:
trzy pełne narracje na jednym scrollu rozbiłyby test 15 sekund z §2, a strona rekrutacyjna
miesza dwie zupełnie różne grupy odbiorców w jednym lejku.

**Silnik szablonów (Handlebars, Nunjucks, EJS)** — wygodniejszy od własnego pluginu przy
większej liczbie stron. Odrzucony na tym etapie: jedna zależność budowania dla dwóch
fragmentów HTML to koszt bez pokrycia. **Do rozważenia, gdy podstron będzie więcej niż pięć
albo pojawi się powtarzalna treść poza nagłówkiem i stopką.**

**Osobny styl dla strony kariery** — mockup sugerował inny charakter. Odrzucone: powstałyby
dwa systemy do utrzymania. Kariera dostaje własny rytm kolorystyczny (granat → czerń →
papier → granat → czerń) i ciemny nagłówek, ale w ramach tych samych tokenów i tych samych
komponentów.
