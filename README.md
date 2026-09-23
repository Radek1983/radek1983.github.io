# High Five

Strona WWW szkoły języka angielskiego High Five — **https://www.highfive.academy**.
Repozytorium `Radek1983/radek1983.github.io` (user site GitHub Pages).

Statyczny serwis wielostronicowy: strona główna jako one-page z dwunastoma
sekcjami oraz dziewięć podstron. Bez CMS-a, bez bazy danych, bez frameworka
SPA — HTML, nowoczesny CSS i vanilla JavaScript w modułach ES, budowane
przez Vite.

## Zanim zaczniesz

**Przeczytaj `CLAUDE.md`.** To kontrakt projektu: potwierdzone fakty, których
wolno używać, zakaz wymyślania danych, lista sekcji zamkniętych i zakazy
operacyjne. Zmiana wyglądu sekcji zamkniętej wymaga decyzji właściciela —
nie jest to formalność, tylko rzecz, na której ten projekt stoi.

## Wymagania

| Narzędzie | Wersja         | Skąd                        |
| --------- | -------------- | --------------------------- |
| Node.js   | `>=24.8.0 <25` | `.nvmrc` przypina `24.20.0` |
| npm       | `>=11`         | idzie z Node                |

Node jest zawężony **od góry i od dołu**: `html-validate@11` odrzuca wersje
24.0–24.7, więc samo „Node 24" nie wystarczy.

## Praca lokalna

```bash
npm ci                 # instalacja dokładnie z package-lock.json
npm run dev            # serwer deweloperski, http://localhost:5173
npm run build          # produkcyjny build do dist/ + version.json
npm run preview        # podgląd builda, http://localhost:4173
```

W CI używamy **wyłącznie `npm ci`**, nigdy `npm install` — lock ma decydować
o wersjach.

## Testy i kontrola jakości

```bash
npm run check          # komplet: format, lint JS, lint CSS, build, HTML, e2e
```

`npm run check` musi przejść **przed każdym pull requestem**. Trwa około
sześciu minut — na pojedyncze poprawki wizualne szybsza jest pętla
`stylelint` + `npm run build` + podgląd w przeglądarce, a pełny zestaw
uruchamiany raz, przed commitem. Wyjątek bez dyskusji: zmiana danych,
treści albo czegokolwiek w `src/js/` idzie z pełnym checkiem od razu.

Pojedyncze elementy:

```bash
npm run lint:js        # ESLint
npm run lint:css       # Stylelint
npm run format         # Prettier — zapisuje zmiany
npm run format:check   # Prettier — tylko sprawdza
npm run validate:html  # html-validate na zbudowanym dist/
npm run test:e2e       # Playwright, trzy projekty
npm run images         # generuje warianty AVIF/WebP ze źródeł PNG
```

Playwright ma trzy projekty: `desktop-chromium`, `mobile-safari`
i `reduced-motion`. Testy sekcji zamkniętych są **zamkami** — czerwony test
w takim pliku znaczy, że zatwierdzony układ się rozjechał. Naprawia się
wtedy kod, nie asercję.

## Struktura

```
index.html            strona główna (one-page, dwanaście sekcji)
404.html              strona błędu
oferta/               hub oferty + cztery podstrony produktowe
lokalizacje/          miejsca zajęć
cennik/               porównanie wszystkich stawek
kariera/              ścieżka rekrutacyjna
polityka-prywatnosci/ dokument prawny
dla-seniorow/         stary adres — strona przekierowująca
online/               stary adres — strona przekierowująca

partials/             wspólny nagłówek i stopka, wstrzykiwane przy budowaniu
src/data/offers.mjs   JEDNO źródło danych oferty i kontaktu
src/css/              main.css + warstwy base/layout/components/sections/…
src/js/               main.js + modules/
src/assets/           fonty, zdjęcia źródłowe i wygenerowane warianty
public/               zasoby o stabilnym URL: robots, sitemap, og-image
scripts/              generator obrazów, generator og-image, version.json
tests/e2e/            zamki sekcji i podstron
tests/smoke/          treść, SEO, dane kontaktowe
docs/                 dokumentacja i ADR-y
ops/                  wzorce konfiguracji dla hostingu z warstwą serwerową
```

## Jak zmieniać treść

**Oferta, ceny, dane kontaktowe, wezwania w nagłówku** — `src/data/offers.mjs`.
To jedno źródło zasila mega-menu, szufladę mobilną, stopkę, kontekstowe CTA
i JSON-LD. Dodanie kursu to jedna zmiana w jednym pliku.

Podstron `/oferta/` i `/cennik/` **nie generujemy** z tych danych — to byłby
page builder, a nie statyczna strona.

**Teksty sekcji** — bezpośrednio w odpowiednim `index.html`. Sekcje są
opisane komentarzami w HTML (`01 HERO`, `02 PO LEKCJACH`, …), a co wolno
w nich zmieniać, rozstrzyga `CLAUDE.md` §15. Mapy treści w osobnym pliku
dziś nie ma — patrz przypis pod tabelą dokumentacji niżej.

**Zdjęcia** — źródło PNG do `src/assets/images/…`, potem `npm run images`.
Skrypt generuje warianty AVIF i WebP i pomija katalog `archiwum/`. Podmiana
kadru **nie kasuje poprzedniego**: zastąpiony plik ląduje w `archiwum/` pod
nazwą z datą.

**Komunikaty sezonowe** — elementy oznaczone `data-temporary="nabor-2026"`.
Dotyczą naboru 2026 i mają zniknąć po starcie zajęć. Szukaj tego atrybutu
przed każdą zmianą treści związanej z terminami.

## Wdrożenie i wycofanie

Push do `main` wdraża automatycznie (`.github/workflows/deploy-production.yml`,
ADR 0002). Wdrożenie kończy się smoke testem publicznego adresu — sprawdza
kod 200, treść krytyczną, to czy opublikowano build a nie surowe źródła,
oraz czy stare adresy nadal przekierowują na kanoniczny.

Praca idzie przez gałąź i pull request; `main` przyjmuje zmiany tylko po
zielonym CI.

**Wycofanie zmian to ponowne wdrożenie poprzedniego dobrego taga** —
`workflow_dispatch` z parametrem `ref`. Nigdy ręczna edycja plików na
serwerze i nigdy force push. Wydania są tagowane `vX.Y.Z`, `CHANGELOG.md`
aktualizowany przed wydaniem.

Źródło GitHub Pages jest ustawione na „GitHub Actions" — tego nie da się
zmienić z poziomu workflow.

## Licencja

**Wszystkie prawa zastrzeżone** — `LICENSE.md`. Repozytorium jest publiczne
z przymusu: user site GitHub Pages nie może być prywatny. To nie jest projekt
open source i nie ma zgody na wykorzystanie kodu ani treści (ADR 0012).

Materiały źródłowe właściciela leżą w `instructions/` i są **wpisane do
`.gitignore`** — nie trafiają do publicznego repozytorium.

## Dokumentacja

| Plik                           | O czym                                        |
| ------------------------------ | --------------------------------------------- |
| `CLAUDE.md`                    | kontrakt projektu — czytaj przed każdą zmianą |
| `docs/ADR/`                    | decyzje architektoniczne z uzasadnieniem      |
| `docs/ARCHITECTURE.md`         | stos, warstwy, zależności                     |
| `docs/DESIGN_SYSTEM.md`        | tokeny, typografia, siatka                    |
| `docs/ART_DIRECTION.md`        | zasady fotografii i kompozycji                |
| `docs/COPY_DECK.md`            | zatwierdzone teksty                           |
| `docs/CONTENT_GAPS.md`         | czego brakuje i kto ma to dostarczyć          |
| `docs/ACCESSIBILITY.md`        | stan dostępności i świadome odstępstwo        |
| `docs/HOSTING.md`              | co GitHub Pages potrafi, a czego nie          |
| `docs/HOSTING_IMPROVEMENTS.md` | co zyskamy po przejściu na warstwę z CDN      |
| `docs/DEPLOYMENT.md`           | wdrożenie i wycofanie                         |

**Siedmiu dokumentów wymaganych przez §11 kontraktu dziś nie ma:**
`CONTENT.md`, `SEO.md`, `TESTING.md`, `MOTION.md`, `ANALYTICS.md`,
`BUSINESS_REQUIREMENTS.md` i `SECURITY.md`. Luka jest odnotowana
w `docs/CONTENT_GAPS.md`. Wiedza, którą miały nieść, żyje dziś w `CLAUDE.md`
i w komentarzach w kodzie — nie zginęła, ale nie ma jednego miejsca, do
którego można odesłać nową osobę.
