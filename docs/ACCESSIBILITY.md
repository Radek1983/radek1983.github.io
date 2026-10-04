# Dostępność — stan i świadome odstępstwo

Dokument opisuje, jak serwis HIGH FIVE ma się do WCAG 2.2 AA, które §13
`CLAUDE.md` stawia jako wymóg, oraz jedno odstępstwo przyjęte świadomie
przez właściciela.

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

## Czego nie sprawdzaliśmy automatycznie

- czytniki ekranu na prawdziwych urządzeniach (NVDA, VoiceOver);
- obsługa przy powiększeniu strony do 200 %;
- kontrast elementów graficznych innych niż tekst.
