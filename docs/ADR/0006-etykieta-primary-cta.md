# ADR 0006: Nowe brzmienie primary CTA — „Zapisz się na zajęcia"

Status: Accepted — **odstępstwo od briefu, polecone przez właściciela**
Data: 2026-09-06

## Kontekst

Master prompt §7 i §16 ustalają primary CTA dosłownie: `Zgłoś dziecko do grupy`. Kryterium
odbioru **BIZ-007** brzmi „primary CTA = Zgłoś dziecko do grupy". `CLAUDE.md` §5 oznaczał tę
frazę jako **niezmienną**, a §18 zawierał zakaz „nie zmieniaj primary CTA".

Właściciel zgłosił zastrzeżenie do samego brzmienia: „**zgłoś dziecko**" czyta się jak
zgłoszenie na policję. Czasownik „zgłosić" po polsku niesie w codziennym użyciu skojarzenie
z donosem i procedurą urzędową („zgłosić kradzież", „zgłosić na policję"), a decydentem jest
rodzic, którego mamy zaprosić, nie wezwać. Właściciel zaproponował „Zapisz się na zajęcia"
albo „Zapisz się".

To sprzeczność z `instructions/`, więc zgodnie z `CLAUDE.md` §0 rozstrzyga ją wyłącznie
właściciel — i to on jest jej autorem.

## Decyzja

Primary CTA brzmi **`Zapisz się na zajęcia`**, w nagłówku w wariancie skróconym
**`Zapisz się`**. Cel, kolor i rola pozostają bez zmian: `<a href="#kontakt">`, kolor
sygnałowy, dokładnie jedno wezwanie zgłoszeniowe w pierwszym ekranie.

Rozkład na stronie:

| Miejsce                        | Etykieta                                             | Uzasadnienie                                                                                                                        |
| ------------------------------ | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| nagłówek (`.site-header__cta`) | `Zapisz się`                                         | Stoi w jednym wierszu z wordmarkiem i czterema pozycjami menu. Pełna fraza wymuszałaby zawijanie albo zmniejszenie stopnia pisma    |
| sekcja 07 `#nabor`             | `Zapisz się na zajęcia`                              | Miejsce decyzji — pełne brzmienie                                                                                                   |
| dock mobilny `.cta-dock`       | `Zapisz się na zajęcia`                              | Zastępuje nawigację, ma pełną szerokość ekranu                                                                                      |
| lead w `#kontakt`              | `Zapisz dziecko na zajęcia.`                         | Zdanie, nie przycisk. Druga osoba brzmiałaby dziwnie o kilka wierszy od danych kontaktowych, bo zapisuje rodzic, a uczy się dziecko |
| `mailto:` (akcja pomocnicza)   | `Napisz do nas`, temat `Zapisy na zajęcia High Five` | Wcześniejsze „Napisz zgłoszenie" miało tę samą wadę co CTA                                                                          |

## Dlaczego to nie łamie intencji zakazu

Zakaz z master promptu §16 i `CLAUDE.md` §18 wymienia konkretne podmiany: „Sprawdź poziom",
„Umów konsultację", „Trial". Wszystkie trzy **osłabiają konwersję** — zamieniają decyzję
o zapisie na miękki krok pośredni, po którym rodzic nadal nie jest zapisany.

`Zapisz się na zajęcia` nie robi tego. To nadal bezpośrednie wezwanie do tej samej akcji,
z tym samym celem `#kontakt` i tym samym miejscem w lejku. Zmienia się rejestr, nie funkcja.

**BIZ-007 z macierzy odbioru pozostaje jednak formalnie naruszone**, bo kryterium cytuje
frazę co do znaku. W raporcie końcowym pozycja musi być opisana jako **odstępstwo polecone
przez właściciela**, nie jako PASS.

## Rozważane alternatywy

**Zostawić `Zgłoś dziecko do grupy`** — zgodne z briefem co do znaku. Odrzucone: właściciel
jest w tej sprawie instancją rozstrzygającą i zgłosił konkretny problem z odbiorem frazy.

**Samo `Zapisz się` wszędzie** — krótsze i najlepiej znosi wąskie ekrany. Odrzucone jako
etykieta wszędzie: w sekcji decyzyjnej i w docku brakowałoby dopowiedzenia, do czego zapis
dotyczy. Zostaje jako wariant nagłówkowy, gdzie kontekst daje sąsiedztwo menu.

**`Zapisz dziecko na zajęcia`** jako etykieta przycisku — najbliższe oryginałowi, bo zachowuje
„dziecko". Odrzucone: dłuższe od pola w nagłówku, a w docku mobilnym zawijałoby się na dwie
linie. Fraza została użyta w zdaniu prowadzącym sekcji kontaktu, gdzie długość nie przeszkadza.

## Konsekwencje

- `CLAUDE.md` §5 traci oznaczenie „niezmienne"; §18 dopuszcza to jedno brzmienie z odesłaniem
  do tego ADR. Zakaz miękkich CTA obowiązuje dalej.
- Testy przestały sprawdzać dawną frazę. Zamiast niej wzorzec `/zapisz si[eę]/i` — nadal
  pilnuje reguły „dokładnie jedno CTA zgłoszeniowe w pierwszym ekranie" i braku CTA w hero.
- Asercje zabraniające „Sprawdź poziom", „lekcja próbna" i „darmowa lekcja" zostają bez zmian.
- Nazwa zdarzenia analitycznego `cta_apply_click` bez zmian — opisuje intencję, nie napis.
