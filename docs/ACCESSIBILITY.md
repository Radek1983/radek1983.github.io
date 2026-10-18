# Dostępność — stan i świadome odstępstwa

Dokument opisuje, jak serwis HIGH FIVE ma się do WCAG 2.2 AA, które §13
`CLAUDE.md` stawia jako wymóg, oraz **dwa** odstępstwa przyjęte świadomie
przez właściciela: kontrast tekstu i skalowanie tekstu przy powiększeniu
przeglądarki.

## Co jest spełnione

Zweryfikowane testami w `tests/e2e/` i `tests/smoke/`:

- pełna obsługa klawiatury, szuflada mobilna z pułapką focusu (ADR 0007);
- widoczny focus — nigdzie `outline: none` bez zamiennika;
- skip link jako pierwszy element w kolejności focusu;
- `lang="pl"` na wszystkich dokumentach;
- `alt` zgodny z funkcją obrazu, `aria-hidden` na dekoracjach;
- `prefers-reduced-motion: reduce` obsłużone w całym serwisie — osobny
  projekt Playwrighta sprawdza każdą sekcję w tym trybie;
- treść krytyczna w DOM, nie generowana w runtime — awaria JavaScriptu
  nie ukrywa oferty ani drogi kontaktu (D2);
- minimum 44 × 44 px na krytycznych celach dotykowych.

## Odstępstwo: kontrast tekstu

**Decyzja właściciela z 23.09.2026: zostaje obecna paleta.**

Serwis **nie spełnia** progów kontrastu WCAG AA w części miejsc. To nie jest
przeoczenie — właściciel obejrzał na żywo dwa warianty poprawki i świadomie
wybrał zachowanie dotychczasowego wyglądu.

### Zmierzony stan

Pomiar silnikiem axe (`@axe-core/playwright`) na wszystkich dziesięciu
stronach, w stanie końcowym animacji, przy 390 px i 1440 px:

| Przyczyna                                       | Kontrast  | Próg | Skala       |
| ----------------------------------------------- | --------- | ---- | ----------- |
| kremowy tekst na czerwieni, poniżej 24 px       | 3,36      | 4,5  | ~225 miejsc |
| etykiety sekcji, czerń 55 % na kremowym, 13 px  | 4,25      | 4,5  | ~192        |
| duże przygaszone liczby i napisy, czerń 35–40 % | 2,30–2,67 | 3,0  | ~90         |
| jasny tekst 55–72 % na czerwieni i granacie     | 1,85–3,83 | 4,5  | ~115        |

**Duże nagłówki na czerwieni (≥ 24 px) spełniają próg 3:1** i nie były
przedmiotem sporu.

### Warianty, które właściciel odrzucił

1. **Czarny tekst na czerwonych przyciskach** — kontrast 5,13 z zapasem,
   czerwień marki nietknięta. Zmienia charakter wszystkich wezwań.
2. **Przyciemnienie czerwieni do `#cb3227`** — kontrast 4,54, kremowy tekst
   zostaje. Wymaga zmiany tokenu `--color-signal` z §7, czyli koloru marki
   w całym serwisie. Właściciel obejrzał oba odcienie obok siebie na
   `/oferta/dzieci/` i uznał obecny za lepszy.
3. **Podniesienie przygaszeń** (etykiety 55 % → 68 %, numery 35 % → 48 %) —
   obejrzane na sekcji 04 strony głównej. Odrzucone: spłaszcza hierarchię,
   która jest częścią języka wizualnego projektu (§7, §8).

### Co to znaczy w praktyce

- osoby ze słabszym wzrokiem mogą mieć trudność z odczytaniem drobnych
  napisów na czerwonych tłach i przygaszonych etykiet;
- audyt zewnętrzny (np. Lighthouse, WAVE) zgłosi te miejsca;
- **§13 kontraktu deklaruje WCAG 2.2 AA** — ta deklaracja jest dziś
  niespełniona w zakresie kontrastu i tylko w tym zakresie.

### Jak wrócić do tematu

`tests/e2e/kontrast.spec.js` zawiera gotowy pomiar, wyłączony przez
`test.describe.skip`. Zdjęcie `.skip` **bez wcześniejszej zmiany palety
wywróci CI** — to celowe: test ma być włączony dopiero wtedy, gdy paleta
przejdzie.

Właściciel rozważał też osobną, dostępną wersję serwisu jako oddzielny
projekt, bez ingerencji w obecny kod. Technicznie wykonalne (osobne
repozytorium + własny adres, z obowiązkowym `noindex`, żeby nie
konkurowała z wersją główną w wyszukiwarce), ale odłożone.

## Odstępstwo: skalowanie tekstu, kryterium 1.4.4

**Przyjęte 18.10.2026 przez właściciela. Pełne uzasadnienie: ADR 0014.**

Od tej zmiany korzeń dokumentu skaluje się liniowo z szerokością okna
(`clamp(0.75rem, 100vw / 96, 2.5rem)`). Powiększenie przeglądarki działa
przez **zmniejszenie okna CSS**, więc razem z oknem maleje korzeń —
a to znaczy, że w zakresie 100–175 % powiększenie **nie zwiększa tekstu**.
Na ekranie 1920 px tekst ma fizycznie stały rozmiar od 50 % do 150 %.

Kryterium 1.4.4 wymaga skalowania tekstu do 200 % bez utraty treści
i funkcji. Pierwszej części nie spełniamy w tym zakresie.

**Czego odstępstwo nie narusza:**

- treść nie znika i nic nie jest ucinane w całym zakresie 100–200 % —
  mierzy to `scripts/sprawdz-skalowanie.mjs` na czterech stronach;
- **powyżej 175 % powiększenie znowu działa** — korzeń dobija do dolnej
  granicy 12 px i dalej nie maleje, więc tekst rośnie fizycznie;
- układ mobilny i systemowe powiększenie czcionki są nietknięte: poniżej
  992 px korzeń wraca do 16 px, a przy 390 i 768 px układ jest tożsamy
  z produkcją;
- `text-size-adjust: 100%` zostaje bez zmian.

**Dlaczego mimo to przyjęte.** Bez skalowania na monitorze szerszym niż
1536 px zostawał drobny tekst pośrodku pustki — 192 px marginesu przy
1920, 952 px przy 3440 — a przy 50 % powiększenia tekst miał fizycznie
8 px i był nieczytelny. Właściciel zgłaszał to trzykrotnie i obejrzał
wariant bez skalowania oraz wariant pośredni; oba odrzucił po pomiarach.

## Czego nie sprawdzaliśmy automatycznie

- czytniki ekranu na prawdziwych urządzeniach (NVDA, VoiceOver);
- kontrast elementów graficznych innych niż tekst.

Powiększenie strony do 200 % **jest** od 18.10.2026 sprawdzane —
`scripts/sprawdz-skalowanie.mjs` mierzy przycięcia i treść schowaną
za przyklejonym paskiem na czterech stronach, w siedmiu krokach
powiększenia.
