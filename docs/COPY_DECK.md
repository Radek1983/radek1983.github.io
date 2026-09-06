# Copy deck

Teksty zatwierdzone w briefie v3. **Nie przerabiać na generyczny marketing** — to nie
propozycja, a zatwierdzona treść (master prompt §10).

Wszystkie teksty żyją w `index.html`. Ten plik jest mapą: gdzie leży co i czego nie wolno
zmienić. Procedura zmiany treści: `docs/CONTENT.md`.

## Fundament

| Element            | Treść                                                                                                                                             | Miejsce                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `title`            | `High Five - angielski dla dzieci w SP 402 Warszawa`                                                                                              | `<head>`                  |
| `meta description` | `Zajęcia z angielskiego dla klas 1-8 po lekcjach w SP 402 w Warszawie. Przygotowanie do egzaminu ósmoklasisty. Nabór trwa, start 1 października.` | `<head>`                  |
| **H1**             | `Angielski po lekcjach. W tej samej szkole.`                                                                                                      | `#hero-title`             |
| **Primary CTA**    | `Zapisz się na zajęcia` (w nagłówku: `Zapisz się`)                                                                                                | hero, nabór, dock mobilny |
| Wordmark           | `High Five`                                                                                                                                       | `.hero__wordmark`, stopka |

Title, description i H1 są **cytatami dosłownymi** z briefu. Test w `tests/smoke/page.spec.js`
sprawdza je co do znaku.

## 01 Hero

**Lead:**

> Zajęcia dla dzieci z klas 1-8 na terenie Szkoły Podstawowej nr 402 w Warszawie. Małe grupy,
> dużo praktycznego używania języka i osobna ścieżka przygotowania do egzaminu ósmoklasisty.

Cały tekst hero leży **na fotografii**, na pustej ścianie w lewej części kadru: wordmark,
H1 i lead. Ściana jest niemal biała, więc tekst w kolorze INK ma pełny kontrast i nie wymaga
ani przycienienia, ani gradientu — jednego i drugiego brief zabrania.

**Akcja pomocnicza:** `Zobacz ofertę` — czarny przycisk, prowadzi do `#oferta`.

**W hero NIE MA:**

- ceny — żyje w pasku faktów i w sekcji `#cennik`;
- głównego CTA `Zapisz się na zajęcia` — zostaje w nagłówku oraz w sekcjach
  decyzyjnych `#nabor` i `#kontakt`.

Decyzja właściciela: w pierwszym ekranie ma być **dokładnie jedno** wezwanie zgłoszeniowe.
Test w `tests/smoke/page.spec.js` tego pilnuje.

**Pasek faktów** (widoczny przed pierwszym scrollem), kolejność ustalona przez właściciela:

1. **Nabór trwa** — czasowe, w kolorze sygnałowym
2. Angielski dla klas 1-8
3. **Start październik 2026** — czasowe
4. SP 402, Warszawa
5. Zajęcia po lekcjach
6. Małe grupy 5-8 dzieci

Ceny **nie ma** w pasku — żyje w sekcji `#cennik` oraz w faktach obu modułów oferty.
Wymóg briefu, żeby cena była widoczna przed sekcją kontaktu, pozostaje spełniony: akt 06
stoi przed aktem 09.

**Uwaga do faktu „Małe grupy 5-8 dzieci":** górna granica 8 nie występuje w briefie.
Przekazał ją właściciel — patrz `docs/CONTENT_GAPS.md`. Nie jest sprzeczna z warunkiem
„minimum 5 dzieci", który obowiązuje w sekcji `#nabor` i w FAQ.

## 02 Po lekcjach — `#po-lekcjach`

**Claim:** `Mniej logistyki. Znane miejsce. Więcej ciągłości.`

> High Five prowadzi zajęcia z angielskiego dla dzieci z klas 1-8 po zakończeniu lekcji
> szkolnych, na terenie Szkoły Podstawowej nr 402 im. Haliny Konopackiej w Warszawie.

> Dla rodzica oznacza to mniej logistycznego chaosu. Dla dziecka — znajome miejsce
> i łatwiejsze przejście z dnia szkolnego do pracy w małej grupie.

> Dziecko nie musi jechać do kolejnej placówki, a rodzic nie organizuje dodatkowego dojazdu
> w środku popołudnia.

## 03 Co dziecko zyskuje — `#korzysci`

**Pasy typograficzne:** Mówię · Rozumiem · Próbuję / Pewność · Ciekawość · Postęp

Pasy są `aria-hidden` — są rytmem wizualnym, nie nośnikiem treści. Semantyczna wersja
komunikatu to trzy bloki poniżej. Sekcja ma ukryty nagłówek dla czytników ekranu.

- **Więcej mówienia.** Dziecko regularnie używa języka w praktyce, zamiast tylko rozwiązywać ćwiczenia.
- **Lepsze rozumienie.** Słownictwo i gramatyka mają pomagać rozumieć i komunikować się, nie być celem samym w sobie.
- **Więcej pewności.** Regularny kontakt z językiem ułatwia pracę na lekcjach szkolnych i przygotowanie do ważnych sprawdzianów.

## 04 Kursy — `#oferta`

**Nagłówek sekcji:** `Dwie ścieżki. Zero chaosu.`

### Moduł 01 — Klasy 1-7: „Angielski dla dzieci"

> Regularne zajęcia dopasowane do wieku i poziomu grupy. Rozwijamy słownictwo, rozumienie,
> gramatykę potrzebną w praktyce oraz przede wszystkim swobodę używania języka.

> W młodszych klasach tempo i zadania są krótsze i bardziej aktywne. W starszych coraz więcej
> miejsca zajmuje precyzja, dłuższa wypowiedź, czytanie i praca nad językiem potrzebnym w szkole.

### Moduł 02 — Klasa 8: „Przygotowanie do egzaminu ósmoklasisty"

> Program dla ósmoklasistów, którzy chcą uporządkować materiał, poznać logikę zadań
> egzaminacyjnych i regularnie ćwiczyć w warunkach zbliżonych do egzaminu.

> Pracujemy nad rozumieniem ze słuchu i tekstu, środkami językowymi, funkcjami językowymi
> oraz wypowiedzią pisemną. Ważnym elementem jest plan pracy, kontrola czasu i analiza błędów.

> **Nie obiecujemy wyniku.** Dajemy regularny trening i sposób pracy, który pomaga wejść
> na egzamin przygotowanym.

Zdanie o braku obietnicy wyniku jest **obowiązkowe** i testowane automatycznie. Master prompt
§8 zabrania obiecywania wyniku egzaminu.

**Fakty operacyjne w obu modułach:** format (zajęcia grupowe po lekcjach w SP 402),
minimum (5 dzieci w grupie), cena (55 zł/godz., rodzeństwo 50 zł/godz.).

## 05 Jak uczymy — `#metoda`

**Scena typograficzna:** `MÓWIJ. PRÓBUJ. POPRAWIAJ. UŻYWAJ.`

> Zajęcia mają być miejscem aktywnego używania języka, nie kolejną godziną siedzenia
> nad ćwiczeniami.

**Proces, pięć kroków:** krótkie wejście w temat → model języka → ćwiczenie w parach lub
małej grupie → zastosowanie w zadaniu komunikacyjnym → konkretna informacja zwrotna.

Zakaz dopisywania nazw metod, certyfikatów i obietnic pedagogicznych bez źródła.

## 06 Cena — `#cennik`

**Nagłówek:** `Prosta cena. Bez ukrywania.`

- **55 zł / godzina** — pierwsze dziecko
- **50 zł / godzina** — drugie i każde kolejne dziecko z rodzeństwa

> Cena za godzinę zajęć. Grupa rozpoczyna pracę po zebraniu minimum 5 dzieci.

Brief zabrania nazywania niższej stawki „pakietem rodzinnym", jeśli formalnie jest to po
prostu niższa cena za kolejne dziecko.

## 07 Jak rusza grupa — `#nabor`

**Nagłówek:** `Grupa rusza od piątego dziecka.`

Sekcja jest **stała**. Warunek minimum 5 dzieci obowiązuje bezterminowo; data startu jest
informacją czasową i żyje w oznaczonym bloku — patrz sekcja „Blok czasowy: nabór" niżej.

- **5** — Tyle dzieci musi zebrać się w grupie, żeby zajęcia wystartowały.
- **01.10** — Planowany start zajęć.
- **Status:** `Zbieramy grupy`

> Każda grupa rozpocznie zajęcia po zebraniu minimum 5 dzieci. Po zgłoszeniu skontaktujemy się
> w sprawie klasy, poziomu, terminu oraz aktualnego statusu grupy.

**Status grupy aktualizuje się ręcznie tekstem** — dopuszczalne warianty z briefu:
„zbieramy grupę", „grupa potwierdzona", „ostatnie miejsca". Zakaz licznika zapisanych dzieci,
testowany automatycznie.

## 08 Lokalizacja — `#lokalizacja`

**Nagłówek:** `SP 402 / Po lekcjach.`

> Szkoła Podstawowa nr 402 im. Haliny Konopackiej
> ul. Jana Nowaka-Jeziorańskiego 22
> 03-982 Warszawa

**Akcja pomocnicza:** `Wyznacz trasę` — nie może konkurować z głównym CTA, dlatego wariant
obrysowany.

**Zastrzeżenie, obowiązkowe:**

> Zajęcia High Five odbywają się na terenie SP 402 po zakończeniu lekcji szkolnych. High Five
> nie jest oficjalnym serwisem szkoły, a szkoła nie odpowiada za ofertę komercyjną.

## 09 FAQ — `#faq`

Pięć pytań. **Tylko te, na które brief pozwala odpowiedzieć.**

1. **Dla jakich klas są zajęcia?** — Dla uczniów klas 1-8 szkoły podstawowej. Dla klasy 8 dostępne jest również przygotowanie do egzaminu ósmoklasisty z języka angielskiego.
2. **Gdzie odbywają się zajęcia?** — Na terenie Szkoły Podstawowej nr 402 im. Haliny Konopackiej przy ul. Jana Nowaka-Jeziorańskiego 22 w Warszawie, po zakończeniu lekcji szkolnych.
3. **Kiedy startują zajęcia?** — Planowany start to 1 października. Konkretna grupa rusza po zebraniu minimum 5 dzieci.
4. **Ile kosztują zajęcia?** — 55 zł za godzinę dla pierwszego dziecka. Drugie i każde kolejne dziecko z rodzeństwa: 50 zł za godzinę.
5. **Jak zgłosić dziecko?** — Zadzwoń albo napisz e-mail. Skontaktujemy się w sprawie klasy, poziomu, dostępnego terminu i statusu grupy.

**Nie publikujemy** (patrz `docs/CONTENT_GAPS.md`): zasad dołączenia po starcie, polityki
nieobecności i odrabiania, informacji o materiałach w cenie, zasad rezygnacji, lekcji próbnej.

## Dodatkowo — Angielski dla seniorów — `#seniorzy`

Oferta **poza** dziewięcioma aktami lejka dla rodziców. Uzasadnienie struktury: ADR 0005.
Fakty pochodzą od właściciela i ze strony kursu w Terminalu Kultury.

**Nagłówek:** `Angielski dla seniorów. Grupa początkująca.`

> Zajęcia dla osób, które dopiero zaczynają naukę angielskiego. Spokojne tempo, atmosfera
> wsparcia i język potrzebny w codziennych sytuacjach — bez presji.

**Trzy filary** (skrót z sześciu punktów opisu kursu):

- **Słownictwo i zwroty na co dzień** — przywitanie, przedstawianie się, zakupy, pytanie o drogę.
- **Mówienie i słuchanie od początku** — rozmowy, gry językowe i ćwiczenia, które pomagają przełamać barierę.
- **Praktyczne sytuacje** — sklep, wizyta u lekarza, rozmowa w podróży.

**Fakty:** Terminal Kultury Gocław · prowadzi Magda Germel · grupa początkująca ·
45 zł za zajęcia, rozliczenie miesięczne.

**Zastrzeżenie, obowiązkowe:**

> Odpłatność miesięczna zależy od liczby dni zajęć w danym miesiącu, zgodnie z harmonogramem.
> Nie ma możliwości wykupienia pojedynczych zajęć — obowiązuje abonament miesięczny.

To zdanie **musi zostać**. Bez niego „45 zł" czytałoby się jak tańsza alternatywa dla „55 zł",
a to inna usługa, inne miejsce i inne zasady rozliczenia.

**Konwersja:** `Szczegóły i zapisy w Terminalu Kultury` — link zewnętrzny, wariant obrysowany.
Zapisy prowadzi tamta instytucja, więc kierowanie seniorów na `#kontakt` wprowadzałoby w błąd.

**Nie publikujemy** kwalifikacji ani doświadczenia osoby prowadzącej — samo imię i nazwisko
przekazał właściciel i widnieje publicznie na stronie Terminalu Kultury.

## Final CTA — `#kontakt`

**Nagłówek:** `Gotowi na High Five?`

> Zapisz dziecko na zajęcia. Odezwiemy się z informacją o poziomie, terminie i statusie naboru.

Kanały: telefon i e-mail, oba jako duże klikalne wiersze. Dodatkowo `mailto:` z gotowym
tematem i szkieletem treści (imię rodzica, klasa dziecka, kontakt, uwagi) — to przenosi
wartość utraconego formularza bez żadnego backendu.

## Odstępstwo od briefu

**Jedno**, wymuszone decyzją D2 o braku formularza.

Brief odpowiada na pytanie „Jak zapisać dziecko?" słowami „Wypełnij krótki formularz".
Formularza nie ma, więc pytanie brzmi **„Jak zgłosić dziecko?"** i odpowiada **„Zadzwoń albo
napisz e-mail"**. Druga część zdania pozostaje dosłownie z briefu.

Gdy formularz wróci, przywrócić brzmienie oryginalne.

## Frazy zabronione

Master prompt §4 i §9. Testowane automatycznie w `tests/smoke/page.spec.js`:

`nowoczesne metody` · `najwyższa jakość` · `doświadczeni lektorzy` · `przyjazna atmosfera` ·
`gwarantujemy wynik` · `lekcja próbna` · `odrabianie` · `materiały w cenie` · `Sprawdź poziom`

Najpierw konkret lokalny, dopiero potem korzyść edukacyjna.

## Blok czasowy: nabór

Właściciel ustalił, że **nabór nie może być tematem przewodnim strony** — to informacja,
która po 1 października ma zniknąć. Czerwony baner został usunięty, a treść przeniesiona
do czarnego paska faktów na górze.

Cała treść czasowa żyje w **czterech miejscach** (pięć elementów), każdy oznaczony atrybutem
`data-temporary="nabor-2026"` oraz komentarzami granicznymi w HTML:

| Miejsce               | Co usunąć                                                          |
| --------------------- | ------------------------------------------------------------------ |
| Pasek faktów na górze | Pozycje `Nabór trwa` i `Start 1 października 2026` — dwa elementy  |
| Sekcja `#nabor`       | Blok z datą `01.10` oraz plakietka `Zbieramy grupy` — dwa elementy |
| FAQ                   | Pytanie „Kiedy startują zajęcia?"                                  |

Po usunięciu zaktualizować także `meta description`, które zawiera frazę
„Nabór trwa, start 1 października".

**Reszta paska faktów niesie wyłącznie treść stałą** — klasy 1-8, SP 402, zajęcia po lekcjach,
ceny, minimum 5 dzieci. Nie dopisywać tam nowych treści czasowych bez oznaczenia.

Test w `tests/smoke/page.spec.js` pilnuje, żeby **żadna datowana wzmianka nie została
nieoznaczona** — inaczej przetrwałaby usunięcie bloku. Sformułowanie „status naboru"
w finalnym CTA jest świadomie stałe: opisuje proces, nie termin.
