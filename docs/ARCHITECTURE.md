# Architektura

## Model rozwiązania

Statyczny dokument one-page. Cała treść krytyczna jest w HTML i nie zależy od JavaScriptu.
Build produkuje katalog `dist/`, który da się serwować z dowolnego CDN lub serwera HTTP.

```
src/            zrodla                     dist/           artefakt
├── index.html  semantyczna tresc     →    ├── index.html  + CSP, hashowane assety
├── css/        warstwy CSS           →    ├── assets/     main-<hash>.css
├── js/         moduly ES            →    │               main-<hash>.js
└── assets/     obrazy, fonty        →    └── version.json wersja, commit, timestamp
```

Nie ma warstwy serwerowej, bazy danych, CMS ani frameworka aplikacyjnego. Nie ma routera —
sekcje są kotwicami w jednym dokumencie, nie trasami.

## Zależności

Wszystkie są **wyłącznie deweloperskie**. Strona produkcyjna nie ładuje żadnej biblioteki
zewnętrznej — `script-src 'self'` w CSP jest tego konsekwencją i jednocześnie zabezpieczeniem.

| Zależność                        | Rola                         | Uzasadnienie                                                                                                                                                                                                |
| -------------------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `vite`                           | dev server i build           | Wymagana wprost przez specyfikację rozdz. 2.1                                                                                                                                                               |
| `eslint`, `@eslint/js`           | jakość JavaScriptu           | Wymagana, rozdz. 22.1                                                                                                                                                                                       |
| `globals`                        | definicje globali dla ESLint | Zależność konfiguracji ESLint, nie osobna decyzja                                                                                                                                                           |
| `stylelint` + `-config-standard` | jakość CSS                   | Wymagana, rozdz. 22.1                                                                                                                                                                                       |
| `prettier`                       | formatowanie                 | Wymagane, rozdz. 22.1                                                                                                                                                                                       |
| `html-validate`                  | walidacja HTML               | Wymagana, rozdz. 22.1                                                                                                                                                                                       |
| `@playwright/test`               | testy e2e                    | Wymagane, rozdz. 22.1                                                                                                                                                                                       |
| `sharp`                          | konwersja obrazów            | Rozdz. 10.1 wymaga AVIF/WebP i wariantów `srcset`. Vite nie konwertuje formatów obrazów, a ręczna konwersja siedmiu kadrów na trzy szerokości w dwóch formatach to 42 pliki — nie do utrzymania bez skryptu |

Wersje główne odbiegają od załącznika A.1 zgodnie z decyzją **D5** i erratą **E-01**:
ESLint 10, Stylelint 17, html-validate 11.

**Zasada.** Nowa zależność wymaga wpisu w tej tabeli z uzasadnieniem technicznym. Biblioteka
runtime — czyli taka, która trafiłaby do przeglądarki — wymaga dodatkowo ADR. Dotyczy to
w szczególności GSAP, dopuszczonego przez brief tylko dla scen niewykonalnych natywnie.

## Przepływ inicjalizacji

```
index.html
  └── <link rel="stylesheet"> ──→ CSS ładuje się niezależnie od JS
  └── <script type="module">  ──→ src/js/main.js
                                    ├── initAccessibility()  klasa `js` na <html>
                                    └── initNavigation()     IntersectionObserver
```

`main.js` jest wyłącznie punktem startowym — nie zawiera logiki sekcji. Każdy modul opakowany
jest w `safeInit`, więc **błąd jednego modułu nie blokuje pozostałych ani treści strony**
(rozdz. 8.4).

CSS jest podłączony znacznikiem `<link>`, nie importowany z JavaScriptu. To celowe: awaria
skryptu nie może pozbawić strony stylów.

## Zasady modułów JS

- Jedna odpowiedzialność, jawna funkcja `init*` jako eksport.
- Brak zmiennych globalnych na `window`.
- Moduł sprawdza istnienie potrzebnych elementów i kończy działanie bez wyjątku, jeśli sekcji
  nie ma w dokumencie.
- `IntersectionObserver`, `ResizeObserver` i `requestAnimationFrame` zamiast ciężkich obliczeń
  w zdarzeniach `scroll` i `resize`.
- Zero danych użytkownika w `console`.
- Dla tekstu `textContent`, nigdy niesanitowany `innerHTML`.

Nawigacja **nie przechwytuje** kliknięć w linki kotwiczące — natywne zachowanie przeglądarki
obsługuje przewijanie, historię i klawiaturę poprawnie. Modul tylko podświetla aktywną sekcję
na podstawie jej widoczności.

## Pipeline obrazów

Krok jawny, uruchamiany poleceniem `npm run images`, **nie częścią builda**. Konwersja siedmiu
kadrów zajmuje kilka sekund i nie ma sensu powtarzać jej przy każdym `npm run build`.

```
src/assets/images/**/*.png   (zrodla, bezstratne, w repozytorium)
        │
        │  npm run images  →  scripts/optimize-images.mjs (sharp)
        ▼
<nazwa>-<szerokosc>.avif  +  <nazwa>-<szerokosc>.webp
```

Szerokości zależą od proporcji kadru i pola, w którym obraz faktycznie stoi:

| Typ kadru         | Szerokości            | Gdzie                   |
| ----------------- | --------------------- | ----------------------- |
| `wide` (16:9)     | 768, 1200, 1600, 2000 | hero, sekcje full-bleed |
| `portrait` (4:5)  | 480, 768, 1120        | kadry pionowe           |
| `landscape` (3:2) | 768, 1200, 1600       | media sekcji            |

Skrypt nie powiększa obrazów ponad rozdzielczość źródła — upscaling zwiększa plik, nie dodaje
szczegółu. Przed generowaniem usuwa poprzednie warianty danego obrazu, więc podmiana źródła
na inne proporcje nie zostawia sierot. Wywołanie jest idempotentne.

AVIF jest formatem podstawowym, WebP fallbackiem dla przeglądarek bez wsparcia AVIF
(Safari starsze niż 16.4). Oba pokrywają macierz wsparcia z rozdz. 21.1, więc JPEG nie jest
potrzebny.

## Build

`npm run build` wykonuje dwa kroki:

1. `vite build` — bundluje CSS i JS z hashowanymi nazwami, przetwarza `index.html` i `404.html`
   jako osobne wejścia, wstrzykuje CSP znacznikiem `meta`.
2. `node scripts/write-version.mjs` — zapisuje `dist/version.json`.

Wersja jest generowana **także lokalnie**, nie tylko w CI. Inaczej build lokalny dawałby inny
artefakt niż produkcyjny, co łamie powtarzalność.

Istotne ustawienia w `vite.config.js` i ich powody:

| Ustawienie                      | Powód                                                                 |
| ------------------------------- | --------------------------------------------------------------------- |
| `base: '/'`                     | User site GitHub Pages serwuje z korzenia. Patrz ADR 0001             |
| `appType: 'mpa'`                | Brak fallbacku SPA, zgodnie z zachowaniem Pages                       |
| `assetsInlineLimit: 0`          | Zero `data:` URI — pozwala utrzymać CSP bez `img-src data:`           |
| `modulePreload.polyfill: false` | Vite wstrzykiwałby skrypt inline, zablokowany przez CSP               |
| `rolldownOptions`               | Vite 8 opiera się na rolldown; `rollupOptions` to przestarzały alias  |
| `preview.host: '127.0.0.1'`     | Domyślny `localhost` rozwiązuje się do IPv6, a Playwright pyta o IPv4 |

## Decyzje architektoniczne

Pełne uzasadnienia w `docs/ADR/`:

- **0001** — hosting GitHub Pages user site i `base: '/'`
- **0002** — wdrożenie na push do `main`, rollback przez ręczny wybór `ref`
- **0003** — nagłówki bezpieczeństwa i cache nieosiągalne na Pages
- **0004** — brak środowiska preview/staging
