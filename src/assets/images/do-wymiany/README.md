# Kadry do wymiany — wyższa rozdzielczość

Katalog roboczy. **Generator `npm run images` go pomija** (`POMIJANE_KATALOGI`
w `scripts/optimize-images.mjs`), więc nic stąd nie trafia na stronę, dopóki plik
nie wróci pod swoją właściwą ścieżkę.

- **`obecne/`** — kopie plików, które stoją dziś na stronie. To materiał wyjściowy:
  z tych kadrów mają powstać wersje w wyższej rozdzielczości.
- **`nowe/`** — tutaj wrzucasz wygenerowane pliki.

## Dlaczego te trzy

Maksymalna szerokość siatki stoi dziś na **1920 px** (`--container-max: 120rem`,
§7 kontraktu). Sufit wyznaczają zdjęcia, nie kod: kadry pełnoekranowe rozciągają się
wtedy ponad swoją rozdzielczość i robią się miękkie. Trzeci kadr jest za mały już dziś.

| plik                       | ma dziś     | **potrzebuje**  | stan                    | gdzie stoi                                               |
| -------------------------- | ----------- | --------------- | ----------------------- | -------------------------------------------------------- |
| ~~`hero-classroom`~~       | 2560 × 1440 | —               | **ZROBIONE 08.10.2026** | hero strony głównej, pełna szerokość                     |
| `detail-desk-1600.png`     | 1536 × 1024 | **2560 × 1700** | czeka                   | sekcja 12 kontakt, pełna szerokość                       |
| `terminal-kultury-750.jpg` | 750 × 518   | **1600 × 1100** | czeka                   | sekcja 10 seniorzy, `/lokalizacje/`, `/oferta/seniorzy/` |

**Hero jest załatwione.** Nowe źródło `hero/hero-classroom-2560.png` dało warianty
768 / 1200 / 1600 / 2000 / 2560 px, poprzedni kadr leży w `archiwum/` pod nazwą
`hero-classroom-zastapione-2026-10-08.png`. Przeglądarka dobiera dziś wariant nie
węższy niż pudełko na każdej szerokości — rozciągnięcia nie ma nigdzie.

**Kadr Terminalu jest za mały już przy 1920 px** — zajmuje tam około 1000 px, a plik
ma 750. Jego podmiana poprawi stronę od razu, niezależnie od dalszego podnoszenia limitu.

## Warunki, które muszą być spełnione

1. **Proporcja musi zostać ta sama.** Na niej stoi geometria sekcji — dlatego w tabeli
   podane są wysokości, nie tylko szerokości. Hero to 16:9, biurko 3:2, Terminal 1,45:1.
2. **Ten sam kadr, nie nowe ujęcie.** Zmiana zdjęcia to osobna decyzja; tutaj chodzi
   wyłącznie o rozdzielczość.
3. **Format źródła: PNG albo JPG.** Warianty AVIF i WebP robi generator.
4. **Bez napisów, logo i znaków wodnych** w obrazie (§7 kontraktu).

## Co się dzieje dalej

Po wrzuceniu plików do `nowe/`:

1. plik wędruje pod swoją właściwą ścieżkę (`hero/`, `backgrounds/`, `sections/`),
   a poprzednie źródło ląduje w `archiwum/` pod nazwą z datą zastąpienia — §11 kontraktu;
2. `npm run images` generuje komplet wariantów AVIF i WebP. Konfiguracja przewiduje już
   szerokość **2000 px** dla kadrów panoramicznych; dotąd nigdy nie powstała, bo generator
   **nie powiększa** źródeł (`widths.filter((w) => w <= width)`);
3. `srcset` w HTML dostaje nowe szerokości, a przeglądarka sama wybiera właściwą.

Dopiero wtedy ma sens podnoszenie `--container-max` powyżej 1920 px.
