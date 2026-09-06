# Design system

Decyzje podjęte **przed** kodowaniem sekcji, zgodnie z rozdz. 34 specyfikacji.
Wartości wynikają z briefu v3, sekcja „Design system".

## 1. Kolor — cztery tokeny i ich role

| Token            | Wartość   | Rola                                   |
| ---------------- | --------- | -------------------------------------- |
| `--color-paper`  | `#F2EFE8` | Tło dominujące                         |
| `--color-ink`    | `#0A0A0A` | Tekst i akt czarny                     |
| `--color-signal` | `#F23B2F` | Akcja, wyróżnik, puenta                |
| `--color-blue`   | `#123B8C` | Drugi akt marki, ścieżka egzaminacyjna |

**Zero odcieni pochodnych.** Nie ma `--color-signal-light` ani `--gray-400`. Jedyne wartości
wyliczane to `--color-rule` (linia 1 px jako `color-mix` koloru tekstu z przezroczystością).

**Brak gradientów, cieni i glassmorphism.** To nie oszczędność, a język marki — test
automatyczny `VIZ-008` w `tests/e2e/layout.spec.js` pilnuje tego przy każdym uruchomieniu CI.

### Role semantyczne i motywy sekcji

Komponenty odwołują się **wyłącznie** do ról (`--color-bg`, `--color-text`, `--color-accent`,
`--color-cta-bg`), nigdy do surowych kolorów. Dzięki temu motyw sekcji to jedna deklaracja:

```html
<section class="section" data-theme="ink"></section>
```

Dostępne motywy: `ink`, `signal`, `blue`. Brak atrybutu = papier.

### Sekwencja aktów kolorystycznych

Realizacja reguły 4 z briefu („kolor zmienia akt"):

| Akt | Sekcja             | Motyw                             |
| --- | ------------------ | --------------------------------- |
| 01  | Hero               | paper                             |
| 02  | Po lekcjach        | paper                             |
| 03  | Co dziecko zyskuje | **signal**                        |
| 04  | Kursy              | paper + **blue** w module klasy 8 |
| 05  | Jak uczymy         | **ink**                           |
| 06  | Cena               | paper                             |
| 07  | Nabór              | **ink**                           |
| 08  | Lokalizacja        | paper                             |
| 09  | FAQ + kontakt      | paper                             |
| —   | Stopka             | **ink**                           |

## 2. Typografia

**Kroje:** Inter Display ExtraBold (display) i Inter Regular/Medium (tekst). Wersja 4.1,
samohostowana, licencja **SIL OFL 1.1** — kopia w `src/assets/fonts/LICENSE-Inter.txt`.

Trzy pliki WOFF2, razem 331 kB. Świadomie **nie** pobieramy pełnej rodziny: każdy dodatkowy
wariant to ~110 kB, a hierarchię budujemy rozmiarem i światłem, nie mnożeniem grubości.

Preloadujemy **tylko** krój display — nim złożony jest wordmark i H1, czyli element LCP.
Kroje tekstowe mają `font-display: swap` i nie konkurują o pasmo.

### Skala

Wszystko przez `clamp()`. **Nigdy samo `vw`** — bez górnego ogranicznika nagłówek na monitorze
2560 px staje się nieczytelną plamą.

| Token             | Zakres                 | Zastosowanie                |
| ----------------- | ---------------------- | --------------------------- |
| `--step-wordmark` | `4.5rem` → `17rem`     | Wordmark hero i stopka      |
| `--step-display`  | `3.25rem` → `9rem`     | Nagłówki sekcji, marquee    |
| `--step-h1`       | `2.25rem` → `5rem`     | H1                          |
| `--step-h2`       | `1.875rem` → `3.75rem` | H2, tytuły kursów           |
| `--step-h3`       | `1.25rem` → `1.625rem` | H3                          |
| `--step-lead`     | `1.125rem` → `1.5rem`  | Lead                        |
| `--step-body`     | `1rem` → `1.1875rem`   | Tekst ciągły                |
| `--step-label`    | `0.8125rem`            | Etykiety, numery aktów, nav |

`--step-wordmark` jest osobnym poziomem, bo wordmark **nie jest nagłówkiem** — to element
kompozycji, który ma prawo wyjść poza krawędź ekranu.

### Długość wiersza

`--measure: 34rem` dla tekstu ciągłego, `--measure-narrow: 26rem` dla bloków wąskich.

Ograniczenie stosuje się **wyłącznie** do akapitów bez klasy (`p:not([class])`). Wordmark,
pasy marquee, liczby ceny i znak w stopce są akapitami semantycznie, ale elementami kompozycji
wizualnie — muszą móc zająć pełną szerokość. Akapity z klasą deklarują własną miarę tam,
gdzie jej potrzebują.

**Udział display w wysokości ekranu: 30–70%.** Nagłówek sekcji 02 początkowo zajmował 83%
i dostał własną, mniejszą skalę.

## 3. Siatka i breakpointy

| Breakpoint | Kolumny                       | Margines | Gutter  |
| ---------- | ----------------------------- | -------- | ------- |
| < 48rem    | 4                             | 1.25rem  | 0.75rem |
| ≥ 48rem    | 12                            | 1.75rem  | 1rem    |
| ≥ 64rem    | 12                            | 2.25rem  | 1.25rem |
| ≥ 62rem    | — próg układów dwukolumnowych |

Breakpointy wynikają z zachowania layoutu, nie z modeli telefonów. `--container-max: 96rem`.

Wyjście poza kontener: klasa `.bleed` (obie krawędzie) i `.bleed-inline-end` (jedna).

## 4. Wzorce kompozycji sekcji

Wymóg rozdz. 34.1: minimum trzy. Zrealizowane pięć.

1. **Oversized wordmark + media wychodzące poza krawędź** — hero.
2. **Split tekst / sticky media** — po lekcjach, lokalizacja.
3. **Pasy typograficzne (marquee)** — korzyści.
4. **Dwa równoważne moduły z hairline** — kursy.
5. **Scena czysto typograficzna** — metoda, cena, nabór.

**Rytm pionowy jest zmienny.** `--space-section` plus warianty `.section--tight`,
`.section--airy`, `.section--flush-end`. Faktyczne wysokości sekcji: od 655 px do 2091 px
przy 1440 × 900 — test `VIZ-001` pilnuje, żeby nie zrobił się z tego deck jednakowych slajdów.

## 5. Forma

- **Corner radius 0** we wszystkich modułach. Kapsuła dozwolona **wyłącznie** dla CTA.
- **Shadows 0. Glassmorphism 0. Gradienty 0.**
- Jedyny separator: linia 1 px (`.rule`, `--color-rule`) albo hairline 1 px między modułami.
- Ikony tylko użytkowe: strzałka CTA, plus/minus w FAQ. Rysowane CSS-em, bez pliku SVG.

## 6. CTA i menu

**Primary CTA:** `Zapisz się na zajęcia`, w nagłówku skrócone do `Zapisz się`, prowadzi do `#kontakt`. Brzmienie zmienione na polecenie właściciela — ADR 0006.
Warianty: `.cta--large` (hero, final), `.cta--ghost` (akcja pomocnicza, np. „Wyznacz trasę").
Minimalna wysokość 48 px — powyżej wymaganych 44 px.

**Menu** to pięć kotwic i jedno CTA. Bez dashboardu, bez ikon, bez wyszukiwarki.
Wskaźnik aktywnej sekcji to kreska 2 px, nie tło ani pigułka.

**Na mobile nawigacja i CTA w headerze znikają**, a ich rolę przejmuje sticky CTA przy dolnej
krawędzi. Pięć kotwic nie uzasadnia menu hamburgerowego z pułapką focusu. Test `VIZ-004`
sprawdza, że widoczne jest dokładnie jedno główne CTA.

## 7. Fotografia

Zasady kadrów: `docs/ART_DIRECTION.md`. Reguły techniczne:

- Media **nigdy w kartach** — full-bleed albo duże prostokątne cropy.
- Proporcje deklarowane klasą (`.media--16-9`, `.media--4-5`, `.media--3-2`), co rezerwuje
  miejsce i eliminuje CLS.
- Hero jest **art-directed**: kadr pionowy 4:5 na mobile, 3:4 na desktopie — dwa różne pliki,
  nie jedno zdjęcie przycięte inaczej.
- `object-position` dobierane per kadr, gdy automatyczne centrowanie psuje kompozycję.
- AVIF jako format podstawowy, WebP jako fallback. Warianty generuje `npm run images`.
- Obraz LCP bez `loading="lazy"`, z `fetchpriority="high"`. Pozostałe lazy.

## 8. Motion — słownik

Warstwa ruchu powstaje w osobnym kroku; tutaj tokeny i zasady, na których się oprze.

| Token             | Wartość                    | Zastosowanie            |
| ----------------- | -------------------------- | ----------------------- |
| `--dur-micro`     | `180ms`                    | Hover, focus, underline |
| `--dur-reveal`    | `560ms`                    | Wejście treści          |
| `--ease-standard` | `cubic-bezier(.2,.8,.2,1)` | Mikrointerakcje         |
| `--ease-out-expo` | `cubic-bezier(.16,1,.3,1)` | Reveal                  |

Zaimplementowane już mikrointerakcje: przesunięcie strzałki CTA o 4 px, kreska pod pozycją
menu (`scaleX`), podkreślenie linku (`scaleX`), plus/minus w FAQ, inwersja tła CTA.

Podkreślenie linku **nie** używa `linear-gradient` — projekt zabrania gradientów, a `scaleX`
na pseudoelemencie jest przy okazji tańsze, bo animuje kompozytor, nie layout.

`prefers-reduced-motion` skraca przejścia do niepostrzegalnych zamiast je usuwać, żeby stany
focus i hover pozostały przewidywalne. Sticky media degraduje się wtedy do `position: static`.

## 9. Co jeszcze nie istnieje

- **Warstwa narrative motion** — reveal wiązany ze scrollem, momentum wordmarku, parallax
  mediów. Kolejny krok, zgodnie z kolejnością z §14 kontraktu.
- **Marquee w ruchu** — pasy są dziś statyczne i przesunięte kompozycyjnie. Brief zabrania
  autoplay w spoczynku, więc ruch musi być wiązany ze scrollem.
- **Subsetting fontów** — 331 kB można zbić do ~100 kB, ograniczając zestaw znaków do
  polskiego i angielskiego. Wymaga kolejnej zależności; do rozważenia przy optymalizacji.
