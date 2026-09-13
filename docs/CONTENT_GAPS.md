# Content gaps

Braki treści i materiałów. Zasada anty-halucynacyjna z master promptu §3: czego nie ma
w źródłach, tego **nie wymyślamy** — trafia tutaj.

Kolumna „Blokuje release" mówi, czy brak uniemożliwia publikację. Brak nieblokujący
nie zatrzymuje pracy.

## Otwarte

| #    | Brak                                                                                                                              | Właściciel danych             | Miejsce użycia                                  | Blokuje release                                                                         |
| ---- | --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------- |
| G-01 | **Docelowe dane kontaktowe High Five** — obecne (`janek.gitara@onet.pl`, `+48 789 789 789`) są tymczasowe i prywatne, nie firmowe | Właściciel                    | `index.html` sekcja `#kontakt`, stopka, JSON-LD | **Nie** — wartości tymczasowe działają. Do podmiany przed kampanią                      |
| G-02 | **Grafika Open Graph** (`og-image.jpg`, 1200 × 630)                                                                               | Wykonawca albo właściciel     | `public/social/`, `<meta property="og:image">`  | **Nie** — brak obrazu nie psuje strony, tylko podgląd linku                             |
| G-03 | **Logo / znak graficzny High Five** w SVG                                                                                         | Właściciel                    | Header, stopka, favicon                         | **Nie** — wordmark jest dziś realizowany typografią, co jest zgodne z kierunkiem briefu |
| G-04 | **Grafik i częstotliwość zajęć** — ile razy w tygodniu, w jakich godzinach                                                        | Właściciel                    | Sekcja oferty, FAQ                              | **Nie** — brief zabrania publikacji bez potwierdzenia                                   |
| G-05 | **Zasady dołączenia po 1 października**                                                                                           | Właściciel                    | FAQ                                             | **Nie**                                                                                 |
| G-06 | **Polityka nieobecności i odrabiania**                                                                                            | Właściciel                    | FAQ                                             | **Nie**                                                                                 |
| G-07 | **Czy materiały są w cenie**                                                                                                      | Właściciel                    | FAQ, cennik                                     | **Nie**                                                                                 |
| G-08 | **Zasady rezygnacji**                                                                                                             | Właściciel                    | FAQ, regulamin                                  | **Nie**                                                                                 |
| G-09 | **Dane rejestrowe firmy** — nazwa, NIP, adres                                                                                     | Właściciel                    | Stopka, JSON-LD                                 | **Nie** dla obecnego zakresu. **Tak**, jeśli powstanie formularz albo płatności         |
| G-10 | **Polityka prywatności i klauzula RODO**                                                                                          | Prawnik / właściciel          | Osobna podstrona                                | **Nie** dziś. **Tak** w momencie zbierania danych osobowych — czyli gdy wróci formularz |
| G-11 | **Benchmark** „One-page i slide-animation dla szkoły angielskiego" wymieniony w master prompcie §2                                | Właściciel                    | Audyt kompletności informacji                   | **Nie** — checklistę 8 pytań klienta wzięliśmy z master promptu §14                     |
| G-12 | **Informacje o lektorach** — nazwiska, kwalifikacje, doświadczenie                                                                | Właściciel                    | Brak sekcji; architektura pozwala dodać         | **Nie** — brief zabrania wymyślania                                                     |
| G-14 | **Dokładny adres Terminalu Kultury Gocław** — w JSON-LD jest dziś tylko miasto                                                    | Właściciel                    | Sekcja `#seniorzy`, JSON-LD                     | **Nie** — nazwa i link do strony instytucji wystarczają do znalezienia miejsca          |
| G-15 | **Harmonogram zajęć dla seniorów** — dni i godziny                                                                                | Właściciel / Terminal Kultury | Sekcja `#seniorzy`                              | **Nie** — strona Terminalu podaje szczegóły, link jest na miejscu                       |
| G-16 | **Warunki uruchomienia grupy senioralnej** — czy obowiązuje minimum uczestników                                                   | Właściciel                    | Sekcja `#seniorzy`                              | **Nie**                                                                                 |
| G-13 | **Opinie i referencje**                                                                                                           | Właściciel                    | Brak sekcji                                     | **Nie** — zakaz wymyślonych ocen jest testowany automatycznie w JSON-LD                 |

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

| Brak                               | Gdzie potrzebne      | Blokujący | Uwagi                                                                                                                                              |
| ---------------------------------- | -------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Cena zajęć dla seniorów**        | `/dla-seniorow/`     | nie       | ADR 0005 podaje 45 zł za zajęcia i abonament miesięczny, ale zapisy prowadzi Terminal Kultury. Strona celowo nie podaje ceny — kieruje do kontaktu |
| **Cena lekcji online 1:1**         | `/online/`           | nie       | Nie ma potwierdzonej stawki. Strona nie podaje żadnej kwoty                                                                                        |
| **Terminy i harmonogram**          | obie strony ofertowe | nie       | Żadna podstrona nie podaje dni ani godzin                                                                                                          |
| **Osobna skrzynka rekrutacyjna**   | `/kariera/`          | nie       | Zgłoszenia idą tymczasowo na ten sam adres co kontakt ogólny (D6), z tematem „Rekrutacja"                                                          |
| **Forma przyjmowania CV**          | `/kariera/`          | nie       | Dziś: załącznik do wiadomości. Formularza z uploadem nie da się zrobić bez warstwy serwerowej (D2)                                                 |
| **Dokładny zakres zaświadczenia**  | `/kariera/`          | nie       | Strona mówi ogólnie „zgodnie z obowiązującymi wymaganiami". Doprecyzowanie wymaga decyzji właściciela                                              |
| **`og:image` dla trzech podstron** | wszystkie            | nie       | Wspólny brak z G-03 — żadna strona serwisu nie ma jeszcze obrazka Open Graph                                                                       |

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
| Klasy 1-7            | **55 zł / 60 min**, rodzeństwo 50 zł        | potwierdzone |
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
- **Czas trwania zajęć dla seniorów, online i kursu egzaminacyjnego** — strony nie podają
  ani długości lekcji, ani harmonogramu.
- **Osobna skrzynka rekrutacyjna** — zgłoszenia z `/kariera` idą na ten sam adres co kontakt
  ogólny, z tematem „Rekrutacja".
- **`og:image`** — żadna z dziewięciu stron nie ma jeszcze obrazka Open Graph.

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

**Zakres klas w metadanych.** `title`, `meta description` i JSON-LD mówią „klas 1-8", a treść
stron mówi teraz „klasy 1-7 + osobny kurs dla klasy 8". Formalnie oba są prawdziwe — 1-8 jest
skrótem obejmującym obie ścieżki — ale przy najbliższej rewizji SEO warto to ujednolicić.
Nie zmieniam teraz, bo `title` i `description` są cytatami z briefu (§13).

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
