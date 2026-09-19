# Content gaps

Braki treści i materiałów. Zasada anty-halucynacyjna z master promptu §3: czego nie ma
w źródłach, tego **nie wymyślamy** — trafia tutaj.

Kolumna „Blokuje release" mówi, czy brak uniemożliwia publikację. Brak nieblokujący
nie zatrzymuje pracy.

## Otwarte

| #    | Brak                                                                                                                                        | Właściciel danych             | Miejsce użycia                                           | Blokuje release                                                                         |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| G-01 | **Docelowe dane kontaktowe High Five** — ZAMKNIĘTE. Właściciel przekazał `kontakt@highfive.academy` i `+48 790 266 517`                     | Właściciel                    | `src/data/offers.mjs`, stąd wszystkie 10 stron i JSON-LD | **Zamknięty** razem z G-17 — skrzynka stoi we własnej domenie                           |
| G-02 | **Grafika Open Graph** — ZAMKNIĘTE 19.09.2026. Plik `public/social/og-image.png` (1200 × 630) generuje `node scripts/make-og-image.mjs`     | Wykonawca                     | Wszystkie 10 stron, `<meta property="og:image">`         | **Zamknięty** — podgląd linku działa                                                    |
| G-03 | **Logo / znak graficzny High Five** w SVG                                                                                                   | Właściciel                    | Header, stopka, favicon                                  | **Nie** — wordmark jest dziś realizowany typografią, co jest zgodne z kierunkiem briefu |
| G-04 | **Grafik i częstotliwość zajęć** — ile razy w tygodniu, w jakich godzinach                                                                  | Właściciel                    | Sekcja oferty, FAQ                                       | **Nie** — brief zabrania publikacji bez potwierdzenia                                   |
| G-05 | **Zasady dołączenia po 1 października**                                                                                                     | Właściciel                    | FAQ                                                      | **Nie**                                                                                 |
| G-06 | **Polityka nieobecności i odrabiania**                                                                                                      | Właściciel                    | FAQ                                                      | **Nie**                                                                                 |
| G-07 | **Czy materiały są w cenie**                                                                                                                | Właściciel                    | FAQ, cennik                                              | **Nie**                                                                                 |
| G-08 | **Zasady rezygnacji**                                                                                                                       | Właściciel                    | FAQ, regulamin                                           | **Nie**                                                                                 |
| G-09 | **Dane rejestrowe firmy** — ZAMKNIĘTE, patrz sekcja niżej. Dawniej: nazwa, NIP, adres                                                       | Właściciel                    | Stopka, JSON-LD                                          | **Nie** dla obecnego zakresu. **Tak**, jeśli powstanie formularz albo płatności         |
| G-10 | **Polityka prywatności i klauzula RODO** — ZAMKNIĘTE 19.09.2026. Dokument właściciela opublikowany jako `/polityka-prywatnosci/` (ADR 0011) | Właściciel                    | Osobna podstrona, odnośnik w stopce                      | **Zamknięty** — dokument jest na stronie i do pobrania                                  |
| G-11 | **Benchmark** „One-page i slide-animation dla szkoły angielskiego" wymieniony w master prompcie §2                                          | Właściciel                    | Audyt kompletności informacji                            | **Nie** — checklistę 8 pytań klienta wzięliśmy z master promptu §14                     |
| G-12 | **Informacje o lektorach** — nazwiska, kwalifikacje, doświadczenie                                                                          | Właściciel                    | Brak sekcji; architektura pozwala dodać                  | **Nie** — brief zabrania wymyślania                                                     |
| G-14 | **Dokładny adres Terminalu Kultury Gocław** — w JSON-LD jest dziś tylko miasto                                                              | Właściciel                    | Sekcja `#seniorzy`, JSON-LD                              | **Nie** — nazwa i link do strony instytucji wystarczają do znalezienia miejsca          |
| G-15 | **Harmonogram zajęć dla seniorów** — dni i godziny                                                                                          | Właściciel / Terminal Kultury | Sekcja `#seniorzy`                                       | **Nie** — strona Terminalu podaje szczegóły, link jest na miejscu                       |
| G-16 | **Warunki uruchomienia grupy senioralnej** — czy obowiązuje minimum uczestników                                                             | Właściciel                    | Sekcja `#seniorzy`                                       | **Nie**                                                                                 |
| G-13 | **Opinie i referencje**                                                                                                                     | Właściciel                    | Brak sekcji                                              | **Nie** — zakaz wymyślonych ocen jest testowany automatycznie w JSON-LD                 |

## Materiały dostarczone

| Materiał                         | Status                                                                                                                         |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Siedem kadrów fotograficznych    | **Dostarczone.** Wygenerowane przez AI. Rozdzielczości poniżej minimum z briefu — szczegóły i skutki w `docs/ART_DIRECTION.md` |
| Zdjęcie budynku SP 402           | **Dostarczone.** Fotografia rzeczywistej szkoły, zastąpiła losowy budynek z materiału AI                                       |
| Zdjęcia Terminalu Kultury Gocław | **Dostarczone.** Dwa kadry; użyty jest jeden, drugi (`terminal-kultury-750`) pozostaje w rezerwie                              |
| Fakty o ofercie dla seniorów     | **Dostarczone.** Nazwa, miejsce, prowadząca, poziom, koszt i model rozliczenia — patrz ADR 0005                                |
| Copy deck                        | **Dostarczony** w briefie v3, przeniesiony do `docs/COPY_DECK.md`                                                              |
| Fonty                            | **Dostarczone.** Inter 4.1, SIL OFL 1.1, samohostowane                                                                         |

## Fakty przekazane poza briefem

Dane, które **nie występują w briefie ani w master prompcie**, a zostały przekazane
bezpośrednio przez właściciela. Wolno je publikować, bo pochodzą od źródła — ale muszą tu być
odnotowane, żeby przy odbiorze było jasne, skąd się wzięły.

| Fakt                                                        | Gdzie użyty           | Uwagi                                                                                                                                                                                    |
| ----------------------------------------------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Małe grupy 5-8 dzieci** — górna granica liczebności grupy | Pasek faktów na górze | Brief podaje wyłącznie **minimum 5 dzieci**, bez maksimum. Wartości nie są sprzeczne: 5 to warunek startu, 8 to górny limit. Reszta strony nadal mówi „minimum 5 dzieci" i tak pozostaje |
| **Start październik 2026** — rok                            | Pasek faktów          | Brief podaje „1 października" bez roku. Rok wynika z kontekstu i został potwierdzony przez właściciela                                                                                   |
| **Oferta dla seniorów** w Terminalu Kultury                 | Sekcja `#seniorzy`    | Pełne uzasadnienie i lista faktów: ADR 0005                                                                                                                                              |

## Zastrzeżenia do materiałów istniejących

**Zdjęcia nie przedstawiają rzeczywistych uczniów SP 402.** Zastrzeżenie jest publikowane
w stopce strony i nie wolno go usunąć. Atrybuty `alt` opisują sceny, nie przypisują ich
konkretnej placówce.

**Zdjęcia budynków przedstawiają rzeczywiste, rozpoznawalne obiekty.** Zdjęcie SP 402 i Terminalu
Kultury pokazują faktyczne miejsca zajęć, co jest zgodne z prawdą i uzasadnione. Nie używamy
logotypów ani znaków graficznych tych instytucji — zastrzeżenie o braku oficjalnej relacji
ze SP 402 pozostaje w stopce i w sekcji lokalizacji.

**Kadr detalu (`detail-desk`) niesie akcenty młodszych klas** — pluszak w narożniku. Kadr jest
przycięty i niskokontrastowy, więc pod wielką typografią nie przeszkadza, ale przy podmianie
warto to skorygować.

**Favicon jest tymczasowy** — znak „5" wygenerowany kodem w `public/favicon.svg`.
Do podmiany razem z G-03.

## Odstępstwa od copy decku

Jedno, wymuszone decyzją D2 o braku formularza:

**FAQ, pytanie „Jak zapisać dziecko?"** Brief podaje odpowiedź „Wypełnij krótki formularz".
Ponieważ formularza nie ma, pytanie brzmi „Jak zgłosić dziecko?" i odpowiada „Zadzwoń albo
napisz e-mail". Reszta zdania — o kontakcie w sprawie klasy, poziomu, terminu i statusu grupy
— pozostaje dosłownie z briefu.

Zapisane również w `docs/COPY_DECK.md`.

## Braki wprowadzone przez trzy nowe podstrony

Rozszerzenie zakresu opisuje ADR 0007. Podstrony są kompletne pod względem układu i treści,
ale wchodzą do serwisu z brakami, których **nie wolno uzupełnić zgadywaniem** (§4).

### Fotografie — pięć brakujących kadrów, status: nieblokujący

W miejscu każdego brakującego zdjęcia stoi widoczny blok `.photo-todo` z opisem potrzebnego
kadru. **To nie jest zdjęcie ze stocka ani obraz z zewnętrznego adresu** — blok trzyma docelową
proporcję, więc podmiana nie zmieni geometrii strony i nie wywoła przesunięcia layoutu. Test
w `tests/e2e/pages.spec.js` pilnuje, że żaden obraz nie pochodzi z obcego hosta.

| Strona           | Miejsce            | Potrzebny kadr                                                                      | Proporcja |
| ---------------- | ------------------ | ----------------------------------------------------------------------------------- | --------- |
| `/dla-seniorow/` | hero               | Troje seniorów 65-75 lat na zajęciach, sala szkoleniowa, nikt nie patrzy w obiektyw | 4:3       |
| `/online/`       | hero               | Osoba prowadząca 25-35 lat, słuchawki, laptop, neutralne wnętrze                    | 4:3       |
| `/online/`       | sekcja „Dla kogo?" | Dziecko 9-13 lat w słuchawkach, na ekranie osoba prowadząca                         | 3:2       |
| `/kariera/`      | hero               | Rozmowa rekrutacyjna w kawiarni, kandydat 21-26 lat i osoba rekrutująca             | 4:3       |
| `/kariera/`      | sekcja granatowa   | Osoba prowadząca zajęcia z trójką lub czwórką dzieci z klas 1-7                     | 3:2       |

Wymagania wspólne, powtórzone za właścicielem: bez plakatów i kubków z angielskimi hasłami,
bez symboli brytyjskich, bez dekoracji udających szkołę, nikt nie pozuje do zdjęcia.

Po dostarczeniu plików: wrzucić źródła do `src/assets/images/sections/`, uruchomić
`npm run images`, podmienić bloki `.photo-todo` na `<figure class="media">` z `<picture>`.

### Dane, których brakuje

| Brak                               | Gdzie potrzebne      | Blokujący     | Uwagi                                                                                                                              |
| ---------------------------------- | -------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Cena zajęć dla seniorów**        | `/cennik/`           | **ZAMKNIĘTY** | Właściciel przekazał **45 zł / 60 min** 16.09.2026. Stoi na `/cennik/`. `/oferta/seniorzy/` nadal ceny nie podaje — do uzgodnienia |
| **Cena lekcji online 1:1**         | `/cennik/`           | **ZAMKNIĘTY** | Właściciel przekazał **120 zł / 60 min** 16.09.2026. Stoi na `/cennik/`. `/oferta/online/` nadal ceny nie podaje — do uzgodnienia  |
| **Terminy i harmonogram**          | obie strony ofertowe | nie           | Żadna podstrona nie podaje dni ani godzin                                                                                          |
| **Osobna skrzynka rekrutacyjna**   | `/kariera/`          | nie           | Zgłoszenia idą tymczasowo na ten sam adres co kontakt ogólny (D6), z tematem „Rekrutacja"                                          |
| **Forma przyjmowania CV**          | `/kariera/`          | nie           | Dziś: załącznik do wiadomości. Formularza z uploadem nie da się zrobić bez warstwy serwerowej (D2)                                 |
| **Dokładny zakres zaświadczenia**  | `/kariera/`          | nie           | Strona mówi ogólnie „zgodnie z obowiązującymi wymaganiami". Doprecyzowanie wymaga decyzji właściciela                              |
| **`og:image` dla trzech podstron** | wszystkie            | nie           | Wspólny brak z G-03 — żadna strona serwisu nie ma jeszcze obrazka Open Graph                                                       |

### Fakty przekazane przez właściciela przy tej zmianie

Publikujemy je, bo pochodzą wprost od właściciela — tak jak dane Terminalu Kultury w ADR 0005:

- **Adres Terminalu Kultury Gocław: ul. Jana Nowaka-Jeziorańskiego 24 w Warszawie.** Zamyka to
  brak odnotowany przy ADR 0005. Uwaga: SP 402 stoi pod numerem 22, Terminal pod 24 — to dwa
  różne budynki przy tej samej ulicy.
- **Około 20-letnie doświadczenie właścicielki i lektorki High Five.** Publikowane wyłącznie
  na stronie kariery, bez nazwiska i bez wyliczania kwalifikacji — §4 zabrania tego drugiego
  bez potwierdzenia.
- **Lekcje indywidualne online jako linia usług**, dla dzieci, młodzieży i dorosłych.
- **Grupy rekrutacyjne:** studenci i absolwenci anglistyki, lingwistyki, amerykanistyki.

## Braki po przebudowie architektury (ADR 0008)

### Ceny — trzy z czterech produktów bez stawki

| Produkt              | Cena                                        | Status       |
| -------------------- | ------------------------------------------- | ------------ |
| Klasy 1-7            | **55 zł / 45 min**, rodzeństwo 50 zł        | potwierdzone |
| Egzamin ósmoklasisty | **TODO**                                    | brak         |
| Seniorzy             | **TODO** — zapisy prowadzi Terminal Kultury | brak         |
| Online 1:1           | **TODO**                                    | brak         |

Żadna strona nie podaje kwoty tam, gdzie jej nie ma — pytanie o cenę kieruje do kontaktu.
Test w `tests/e2e/pages.spec.js` pilnuje, że na tych trzech podstronach nie pojawi się
wzorzec „liczba zł / liczba min".

### Treść

- **Sekcja „O nas" nie istnieje.** Pozycja menu „O High Five" prowadzi do `/#metoda`, czyli
  do sekcji o sposobie prowadzenia zajęć — to najbliższe temu, czym High Five jest. Prawdziwa
  sekcja o szkole wymaga faktów od właściciela: historii, kwalifikacji, ewentualnego zespołu.
  §4 zabrania ich wymyślania.
- **Czas trwania zajęć dla seniorów i online** — brak **zamknięty** 16.09.2026 razem
  z cenami: 60 minut dla obu. Harmonogram nadal nieznany.
- **SPRZECZNOŚĆ CENY KURSU EGZAMINACYJNEGO — zamknięta 16.09.2026.** `/cennik/` mówiło
  „Cena kursu nie została jeszcze ustalona", podczas gdy podstrona kursu podawała
  `80 zł / 90 min`. Przebudowa `/cennik/` postawiła tam tę samą wartość.
- **DO ROZSTRZYGNIĘCIA — ceny na podstronach produktowych.** `/cennik/` podaje dziś
  cztery stawki, ale `/oferta/seniorzy/` i `/oferta/online/` nadal żadnej nie podają.
  To nie jest sprzeczność — to niepełna informacja w jednym z dwóch miejsc, w których
  rodzic jej szuka. §13 mówi, że **cena należy do produktu**, więc docelowo obie
  podstrony powinny ją nieść. Właściciel ograniczył zakres przebudowy wyłącznie
  do `/cennik/`, więc **czeka to na jego decyzję** — nie zmieniaj podstron samodzielnie.
- **DO ROZSTRZYGNIĘCIA — „60+" nadal stoi w nawigacji i w stopce.** Właściciel dwa razy
  polecił, żeby nie komunikować progu wieku: przy przebudowie sekcji 10 („nie używaj
  nigdzie oznaczenia 60+") i przy `/cennik/`. Obie te rzeczy zostały zrobione, ale
  `src/data/offers.mjs` nadal niesie `etykietaStopki: 'Seniorzy 60+'`, `odbiorca: '60+'`
  i `kontekst: '60+ · Terminal Kultury Gocław'`. Te trzy pola są podstawiane przy
  budowaniu do **mega-menu, sekcji 04 strony głównej i stopki na wszystkich dziewięciu
  stronach**, więc próg wiekowy jest dziś widoczny w całym serwisie.

  Poprawka to **jedna zmiana w jednym pliku**, ale dotyka stopki (zamrożonej wprost),
  sekcji 04 (D10) i menu — wszystkich trzech rzeczy, których właściciel kazał nie
  ruszać. **Czeka na jego decyzję.** Nie zmieniaj tego samodzielnie.

- **Osobna skrzynka rekrutacyjna** — zgłoszenia z `/kariera` idą na ten sam adres co kontakt
  ogólny, z tematem „Rekrutacja".
- **`og:image`** — ZAMKNIĘTE 19.09.2026: wszystkie dziewięć stron wskazuje wspólną grafikę
  marki, generowaną z krojów i kolorów serwisu przez `node scripts/make-og-image.mjs`.
  Warianty per podstrona są możliwe jednym parametrem, ale świadomie ich nie robimy.

### Fotografie

Bez zmian względem poprzedniej listy: pięć kadrów nadal brakuje (seniorzy, online ×2,
kariera ×2). Dwie nowe podstrony korzystają z istniejących zdjęć: `/oferta/dzieci`
z `course-kids` i `sp402-building`, `/oferta/egzamin-osmoklasisty` z `course-exam`.

### Przekierowania

**Stare adresy przekierowują przez meta refresh, nie przez 301.** To ograniczenie GitHub Pages,
nie decyzja projektowa. Prawdziwe przekierowanie wymaga własnej domeny za Cloudflare —
patrz ADR 0008.

## Braki po dopracowaniu strony głównej

**Portret osoby prowadzącej** — sekcja `#o-nas` ma przygotowany slot z opisem kadru: portret
w naturalnym świetle, podczas pracy lub rozmowy, nie pozowany, proporcja 4:5. To szósty
brakujący kadr w serwisie.

**Maksymalna wielkość grupy nie jest potwierdzona.** Pasek faktów mówił wcześniej „Małe grupy
5-8 dzieci", ale §3 wymienia wyłącznie **minimum pięciu dzieci** — górna granica była liczbą
dopisaną bez pokrycia. Zmienione na „Grupy od 5 dzieci". Jeśli maksimum istnieje i jest
ustalone, można wrócić do pełnego zakresu.

**Zakres klas w metadanych — ZAMKNIĘTE.** `meta description`, Open Graph i JSON-LD mówiły
„klas 1-8", a treść stron „klasy 1-7 + osobny kurs dla klasy 8". Formalnie oba były prawdziwe,
ale rodzic czytający wynik wyszukiwania dostawał inny podział niż w menu. Ujednolicone na
„klas 1-7 … osobny kurs przygotowujący do egzaminu ósmoklasisty". `title` pozostaje cytatem
z briefu (§13). Regresję pilnuje `tests/e2e/regressions.spec.js`.

## Sekcja „O High Five" — brak zamknięty, nowe fakty opublikowane

**Portret osoby prowadzącej został dostarczony.** Źródło:
`src/assets/images/sections/about-magdalena-germel-1122.png` (1122×1402, 4:5), warianty AVIF
i WebP w trzech szerokościach. Slot `.photo-todo` w sekcji `#o-nas` zniknął — zostaje pięć
brakujących kadrów zamiast sześciu.

### Fakty przekazane przez właściciela przy tej zmianie

Publikujemy je, bo pochodzą wprost od właściciela. Bez tego §4 zabraniałby publikowania
nazwisk i kwalifikacji osób uczących:

| Fakt                                                                                 | Gdzie                                         |
| ------------------------------------------------------------------------------------ | --------------------------------------------- |
| **Magdalena Germel** prowadzi High Five                                              | `#o-nas`, wcześniej także `/oferta/seniorzy/` |
| Absolwentka **lingwistyki stosowanej na Uniwersytecie Warszawskim**                  | `#o-nas`                                      |
| **Studia podyplomowe z tłumaczeń przysięgłych w SWPS**                               | `#o-nas`                                      |
| **Ponad 20 lat** nauczania angielskiego                                              | `#o-nas`, `/kariera/`                         |
| Szkoła jest **kameralna, z Gocławia**                                                | `#o-nas`                                      |
| Zajęcia prowadzą także **zweryfikowani lektorzy** z doświadczeniem w pracy z dziećmi | `#o-nas`                                      |
| Osoby uczące posiadają **zaświadczenie o niekaralności**                             | `#o-nas`, spójne z `/kariera/`                |

Ostatnie dwa zdania to deklaracje o zespole, a nie o jednej osobie. Jeśli skład się zmieni,
trzeba je zweryfikować — test w `tests/e2e/layout.spec.js` pilnuje ich obecności, ale nie
prawdziwości.

### Uzupełnienie faktów o osobie prowadzącej

Właściciel przekazał trzy dodatkowe kwalifikacje, których wcześniej nie było:

- **Nauczanie w szkole podstawowej** — część z ponad 20 lat praktyki.
- **Nauczycielka dyplomowana** — najwyższy stopień awansu zawodowego nauczyciela.
- **Egzaminatorka Okręgowej Komisji Egzaminacyjnej** — bezpośrednio wiarygodna przy kursie
  przygotowującym do egzaminu ósmoklasisty.

Wszystkie trzy stoją zarówno w treści sekcji, jak i w pasku faktów. §4 zabrania publikowania
kwalifikacji bez potwierdzenia — tutaj potwierdzeniem jest przekazanie ich przez właściciela.

**Zdanie o zaświadczeniu o niekaralności zeszło z sekcji „O High Five".** Nie zniknęło
z serwisu — stoi na `/kariera/`, gdzie jest wymogiem wobec kandydatów, a nie deklaracją
marketingową na stronie głównej.

## Finalny pass produkcyjny homepage

### Braki zamknięte

| Brak                           | Jak zamknięty                                                                                                                        |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Jednostka ceny**             | Właściciel potwierdził lekcję **45-minutową**. Wcześniejsze „zł/godz." z briefu §3 obiecywało 15 minut więcej, niż trwają zajęcia    |
| **Model rozliczenia**          | Właściciel potwierdził: płatność za zajęcia obecne w kalendarzu, bez stałej opłaty miesięcznej, dni wolne od szkoły nie są naliczane |
| **Zakres klas w metadanych**   | Ujednolicony — patrz wyżej                                                                                                           |
| **Pochodzenie zdjęcia SP 402** | Fotografia rzeczywistego budynku szkoły, nie kadr AI. Odnotowane w tabeli materiałów dostarczonych i w `docs/ART_DIRECTION.md`       |

### Fakty przekazane przez właściciela przy tej zmianie

| Fakt                                                                      | Gdzie użyty                                   |
| ------------------------------------------------------------------------- | --------------------------------------------- |
| **Lekcja trwa 45 minut** — cena 55 zł / 50 zł należy do tej jednostki     | `#cennik`, `/cennik/`, `/oferta/dzieci/`, FAQ |
| **Płacisz za zajęcia, które są w kalendarzu** — brak stałej opłaty stałej | `#cennik`                                     |
| **Zajęcia w dni wolne od szkoły nie są naliczane**                        | `#cennik`                                     |

### Nadal otwarte

| #    | Brak                                                                                                                                                                                                       | Blokuje release |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| G-01 | **Telefon i e-mail** — ZAMKNIĘTE, patrz niżej                                                                                                                                                              | —               |
| G-17 | **Własna domena serwisu** — ZAMKNIĘTE 19.09.2026. Adresem kanonicznym jest `https://www.highfive.academy` (ADR 0010). Odstępstwa z ADR 0003 zostają: usunie je dopiero warstwa typu Cloudflare przed Pages | **Zamknięty**   |

Wszystkie trzy pozycje to jedna zmiana w `src/data/offers.mjs` — dane kontaktowe stoją
w jednym miejscu i są podstawiane do wszystkich dziewięciu stron przy budowaniu.

## Dane kontaktowe — brak zamknięty

Właściciel przekazał docelowe dane kontaktowe High Five, które zastąpiły prywatne konto
używane na czas budowy (decyzja D6):

| Dana    | Wartość                    |
| ------- | -------------------------- |
| E-mail  | `kontakt@highfive.academy` |
| Telefon | `+48 790 266 517`          |

Obie stoją w jednym miejscu — `KONTAKT` w `src/data/offers.mjs` — i są podstawiane przy
budowaniu do wszystkich dziewięciu stron, do stopki, do JSON-LD oraz do gotowych szkiców
wiadomości `mailto:` na stronach zapisów, kariery, online i seniorów.

**Powrót starych wartości jest niemożliwy po cichu:** test w `tests/e2e/regressions.spec.js`
skanuje wszystkie dziewięć stron i wywala build, jeśli którakolwiek z nich znów się pojawi.

### Co zostaje otwarte

**G-17 — skrzynka we własnej domenie — ZAMKNIĘTY 16.09.2026.** Adres zszedł z publicznego
dostawcy poczty na `kontakt@highfive.academy`. Domenę przekazał właściciel, nie została
wymyślona. **Domena poczty nie jest domeną serwisu** — strona nadal stoi pod
`www.highfive.academy` (decyzja D3), więc odstępstwa z ADR 0003 (nagłówki bezpieczeństwa,
cache, HSTS) **zostają otwarte**: zdejmie je dopiero własna domena serwisu z Cloudflare.

**Dane rejestrowe firmy (G-09)** nadal nieprzekazane — bez zmian.

## Pięć brakujących kadrów — brak zamknięty

Właściciel dostarczył wszystkie pięć zdjęć, których brakowało od czasu ADR 0007.
Bloki `.photo-todo` zniknęły z serwisu w całości.

| Plik źródłowy                        | Strona              | Miejsce            | Kadr                                                    |
| ------------------------------------ | ------------------- | ------------------ | ------------------------------------------------------- |
| `sections/career-interview-1448.png` | `/kariera/`         | hero               | Rozmowa rekrutacyjna przy stole w kawiarni              |
| `sections/career-teaching-1292.png`  | `/kariera/`         | sekcja granatowa   | Osoba prowadząca z czwórką dzieci przy wspólnym stole   |
| `sections/seniors-class-1448.png`    | `/oferta/seniorzy/` | hero               | Czworo starszych osób przy stołach, zeszyty i długopisy |
| `sections/online-lesson-1448.png`    | `/oferta/online/`   | hero               | Lektorka i uczeń w słuchawkach przed laptopami          |
| `sections/online-student-1448.png`   | `/oferta/online/`   | sekcja „Dla kogo?" | Uczeń w słuchawkach przy laptopie w czasie lekcji       |

Warianty AVIF i WebP wygenerowane przez `npm run images` w szerokościach 768 / 1200 / 1448
(dla `career-teaching` 768 / 1200 — źródło ma 1292 px, a skrypt nie skaluje w górę).

### Trzy zastrzeżenia do tych kadrów

**Kadr `career-teaching` zawiera napisy i godło państwowe.** Na tablicy widnieje „Razem możemy
więcej", na tablicy korkowej „Dobrze, że jesteś!", na ścianie mapa Polski i **godło**.
§7 briefu mówi wprost: „Bez napisów, logo i znaków wodnych w obrazie", a §4 zabrania
sugerowania oficjalnej relacji z placówką publiczną. Godło na ścianie może tę relację
sugerować. **Do decyzji właściciela:** zostawić, wykadrować prawą część bez tablicy,
czy podmienić kadr.

**Dwa kadry online są bardzo podobne.** Oba to ten sam podział ekranu (lektorka po lewej,
uczeń po prawej), różnią się głównie gestem. Stoją na jednej stronie, jeden pod drugim.
Działa, ale czyta się jak dwa ujęcia z tej samej sesji, a nie jak dwie różne sytuacje.

**Kadry są generowane przez AI (D4).** Zastrzeżenie ze stopki — „Zdjęcia mają charakter
ilustracyjny i nie przedstawiają uczniów tej szkoły" — obejmuje również te pięć.

### Co zostaje otwarte

| #    | Brak                            | Blokuje release                           |
| ---- | ------------------------------- | ----------------------------------------- |
| G-03 | **Logo / znak graficzny w SVG** | **Nie** — wordmark realizowany typografią |
| G-17 | **Własna domena serwisu**       | **Nie** — skrzynka firmowa już działa     |

## Dane rejestrowe — brak G-09 zamknięty

Właściciel przekazał dane rejestrowe działalności:

| Pozycja        | Wartość                      |
| -------------- | ---------------------------- |
| Pełna nazwa    | `High Five Magdalena Germel` |
| NIP            | `8241730595`                 |
| REGON          | `523281712`                  |
| Działalność od | `2022`                       |

Publikowane w dwóch miejscach: blok **Dane firmy** w sekcji `#kontakt` oraz JSON-LD
(`legalName`, `taxID`, `foundingDate`). Test w `tests/e2e/kontakt.spec.js` trzyma obie
kopie zgodne co do znaku — literówka w NIP-ie nie przejdzie niezauważona.

**Adres rejestrowy nadal nieprzekazany** i celowo nie jest publikowany. Adres SP 402
pozostaje **miejscem zajęć**, nie siedzibą firmy (§4) — dotyczy to również JSON-LD,
gdzie stoi jako `location`, nie `address`.

## Kadry na `/oferta/online/` — podmienione na dwa różne ujęcia

Pierwsza dostawa zawierała dwa bardzo podobne kadry: oba były tym samym podziałem ekranu
(lektorka po lewej, uczeń po prawej) i stały jeden pod drugim na tej samej stronie.
Właściciel dostarczył dwa osobne ujęcia i zastąpiły one poprzednie źródła **pod tymi samymi
nazwami plików** — markup i `srcset` zostały bez zmian.

| Plik                               | Miejsce            | Kadr                                                           |
| ---------------------------------- | ------------------ | -------------------------------------------------------------- |
| `sections/online-lesson-1448.png`  | hero               | Lektorka w zestawie słuchawkowym przy laptopie, domowy gabinet |
| `sections/online-student-1448.png` | sekcja „Dla kogo?" | Nastolatek w słuchawkach przy laptopie, zwykły pokój           |

Narracja strony czyta się teraz jako **kto prowadzi → dla kogo są zajęcia**.

`alt` opisuje **scenę, nie tożsamość** — zdjęcia są ilustracyjne i nie przedstawiają osób
związanych ze szkołą (§4, D4). Nie piszemy „lektorka High Five" ani „uczeń High Five";
pilnuje tego test w `tests/e2e/online.spec.js`.

## Kadr Terminalu Kultury — ograniczenie rozdzielczości

Jedyny kadr Terminalu, jakim dysponujemy, ma **750 × 500 px**
(`sections/terminal-kultury-750.jpg`). Po przebudowie sekcji 10 kolumna
tekstowa ma przy 1440 px **791 px** wysokości, więc wypełnienie jej zdjęciem
przez `object-fit: cover` wymagałoby powiększenia **1,58×** — widocznego
rozmycia na największej fotografii tej sekcji.

Kadr jest dlatego **wyśrodkowany w pionie**: granat obejmuje go symetrycznie
z góry i z dołu i czyta się jak margines, a nie jak dziura pod zdjęciem.

Drugi dostarczony kadr (`terminal-kultury-detail-960`, 960 × 720) jest
ujęciem z poziomu ulicy — dużo jezdni i nieba, gorsza kompozycja do wąskiej
kolumny. Zostaje w rezerwie.

**Potrzebny materiał:** ujęcie Terminalu o szerokości **minimum 1400 px**
i proporcji bliższej pionowi (3:4 lub 1:1). Pozwoli oprzeć kadr o pełną
wysokość kolumny, tak jak robi to zdjęcie SP 402 w sekcji 09.
Nieblokujący.
