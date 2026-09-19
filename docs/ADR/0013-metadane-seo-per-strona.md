# ADR 0013 — metadane SEO per strona, dane strukturalne i okruszki

- **Status:** przyjęte
- **Data:** 2026-09-19
- **Decyduje:** właściciel
- **Dotyczy:** `title`, `meta description`, karty Twittera, JSON-LD, atrybuty obrazów

## Kontekst

Właściciel zlecił techniczny audyt SEO całego serwisu przed publikacją i przekazał
gotowe brzmienia tytułów oraz opisów dla dziewięciu stron. Zakres był wyraźnie
ograniczony: **żadnych zmian w designie i w widocznych tekstach**.

Stan zastany był dobry — unikalne tytuły i opisy, canonical zgodny z `og:url`,
poprawny `sitemap.xml`, `robots.txt` wskazujący mapę, brak `meta keywords`, brak
przypadkowego `noindex`, wszystkie obrazy z `alt`, `srcset` i AVIF/WebP. Brakowało
czterech rzeczy i było siedem błędów w atrybutach obrazów.

## Decyzja

**Tytuły i opisy według listy właściciela.** Obejmuje to stronę główną, której
`title` był dotąd **dosłownym cytatem z briefu** — `CLAUDE.md` §13 wprost tego
wymagał. Właściciel rozstrzygnął inaczej: serwis ma cztery produkty i własną domenę,
a stary tytuł mówił wyłącznie o dzieciach w SP 402. Nowe brzmienia niosą lokalizację
(Gocław) zamiast dopisku `Warszawa`.

**`/oferta/` zostaje przy swoim tytule** — nie było go na liście, a obecny opisuje
zawartość huba. Sekcje strony głównej (`#o-nas`, `#faq`, `#kontakt`) nie dostały
osobnych tytułów, bo nie są osobnymi adresami; tworzenie stron pod gotowe tytuły
byłoby odwróceniem kolejności.

**Dodane, wcześniej nieobecne:**

- `WebSite` JSON-LD na stronie głównej, jako osobny obiekt obok organizacji.
  Bez `SearchAction` — serwis nie ma wyszukiwarki. Nazwa `High Five`, nie
  `High Five Magdalena Germel`: pełna nazwa działalności żyje w `legalName`.
- `address` organizacji — adres **rejestrowy** (Nowaka-Jeziorańskiego 7 lok. 199).
  SP 402 (nr 22) i Terminal Kultury zostają wyłącznie w `location` jako miejsca
  zajęć. Test pilnuje, że oba adresy są różne.
- `BreadcrumbList` na czterech podstronach ofertowych: `/` → `/oferta/` → produkt.
  Hierarchia odwzorowuje rzeczywiste adresy, nie wymyślony poziom pośredni.
- `twitter:title`, `twitter:description`, `twitter:image` na dziesięciu stronach.
  `twitter:card` już był. Bez `twitter:site` — serwis nie ma potwierdzonego konta.

**Poprawione atrybuty obrazów:** sześć znaczników deklarowało inną proporcję niż
plik źródłowy, co rezerwowało pole o złym kształcie i przesuwało układ po
załadowaniu. Pięć kadrów hero podstron dostało `fetchpriority="high"` — stało tam
`loading="eager"`, ale to tylko wyłącza leniwe ładowanie, nie podnosi priorytetu
w kolejce.

## Świadomie NIE zrobione

- **`LocalBusiness`** — adres rejestrowy to mieszkanie, nie lokal otwarty dla
  klientów, a zajęcia odbywają się w cudzych obiektach. `EducationalOrganization`
  jest tu uczciwszy i nie sugeruje czegoś, czego strona nie obiecuje.
- **`Course`, `FAQPage`, `Person`, `Review`, `AggregateRating`** — albo wymagałyby
  danych, których nie ma (ceny trzech produktów stoją tylko na `/cennik/`), albo
  decyzji biznesowej.
- **`meta keywords`** — Google ich nie używa od lat.
- **`logo` i `sameAs` w organizacji** — serwis nie ma pliku logo (wordmark jest
  typografią), a URL profilu społecznościowego nie jest w projekcie potwierdzony.

## Konsekwencje

- **Trzy pliki testów zaktualizowane**, nie osłabione: `pages.spec.js` (tytuły),
  `page.spec.js` (tytuł i opis strony głównej, rozdzielność adresów, nowy test
  obiektu `WebSite`), `layout.spec.js` (strona główna niesie odtąd dwa bloki
  JSON-LD, więc selektor bierze pierwszy).
- **`title` strony głównej przestał być cytatem z briefu.** Przy każdej weryfikacji
  `instructions/` (§0) to odstępstwo trzeba potwierdzić jako nadal obowiązujące.

## Sprawa nierozstrzygnięta: `www` vs bez `www`

Audytu nie dało się dokończyć w tym punkcie, bo **strona jest jeszcze
nieopublikowana**. Cała konfiguracja konsekwentnie używa `https://www.highfive.academy`
(ADR 0010). **Po publikacji trzeba sprawdzić**, czy `highfive.academy` bez `www`
przekierowuje na wersję z `www`. Gdyby było odwrotnie, zmiana dotknie canonical,
`og:url`, `sitemap.xml`, `robots.txt` i testy naraz — dlatego nie zgadujemy.

## Pomyłka w audycie, warta zapamiętania

Pierwsza wersja raportu wskazała `hero/hero-classroom-1600.png` jako plik
nieużywany. **Nieprawda:** to art-directed źródło hero dla ekranów od 48rem w górę,
podane w `<source media>`; wersja portretowa obsługuje telefon. Wniosek wziął się
z odczytania `img.currentSrc` przy jednej szerokości okna.

Z tego samego powodu atrybuty `width`/`height` hero **wróciły do 1672 × 941**.
W `<picture>` z dwoma proporcjami jeden zestaw atrybutów nie opisze obu źródeł;
geometrię hero i tak narzuca CSS, więc zostaje wartość zgodna z kadrem, który
widzi większość odwiedzających.
