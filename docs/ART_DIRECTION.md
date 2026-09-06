# Art direction — fotografia

## Status: kadry dostarczone

Wszystkie siedem kadrów jest w repozytorium, zgodnych z nazwami i lokalizacjami z tabeli
poniżej. Proporcje **dokładnie** takie, jak wymagane. Materiał wygenerowany przez AI —
**nie przedstawia rzeczywistych uczniów SP 402** i nigdzie nie wolno tego sugerować.

Rozdzielczości źródeł są niższe od minimów podanych niżej:

| Kadr              | Dostarczone | Minimum w tabeli |
| ----------------- | ----------- | ---------------- |
| Hero desktop      | 1672 × 941  | 2400 px          |
| Kadry pionowe 4:5 | 1122 × 1402 | 1600 px          |
| Kadry 3:2         | 1536 × 1024 | 2400 px          |

Skutek dotyczy wyłącznie hero: na monitorze szerszym niż 1672 px lub na ekranie o podwyższonej
gęstości obraz nieco się rozciągnie. Kadry pionowe i 3:2 stoją w mniejszych polach, więc ich
rozdzielczość wystarcza. **Nie jest to blokada.** Jeśli kiedyś dostarczysz większe pliki pod
tymi samymi nazwami, wystarczy `npm run images` i wszystkie warianty przeliczą się od nowa.

Warianty AVIF i WebP są generowane skryptem — patrz „Pipeline obrazów" w `docs/ARCHITECTURE.md`.
Nie edytuj ich ręcznie i nie dodawaj do repozytorium samodzielnie; są wynikiem, nie źródłem.

---

Dalsza część dokumentu to brief dla osoby dostarczającej zdjęcia — obowiązuje przy każdej
podmianie i przy kolejnych kadrach. Źródło wymagań: brief v3, sekcje „Design system",
„Fotografia i assety" oraz opis dziewięciu scen. Zasady kompozycyjne: załącznik techniczny rozdz. 31.

## Kierunek w jednym zdaniu

Autentyczne, editorialowe kadry przy naturalnym świetle — dzieci w ruchu i rozmowie, bliskie
cropy, czasem częściowo ucięte krawędzią. **Nie stock, nie klasa ustawiona do zdjęcia.**

## Zasady obowiązujące każdy kadr

**Wymagane:**

- naturalne światło, realistyczne i wyciszone kolory
- bliski kadr; dopuszczalne i pożądane ucięcie postaci krawędzią zdjęcia
- sytuacja w trakcie, nie pozowana — rozmowa, gest, pisanie, ruch
- kompozycja zostawiająca spokojne pole na oversized typografię

**Zabronione:**

- jakikolwiek **tekst, logo, znak wodny lub napis w obrazie** — typografia jest wyłącznie w kodzie
- widoczne logotypy szkoły, marek odzieżowych, wydawnictw
- estetyka stockowa: uśmiechnięta grupa patrząca w obiektyw, ktoś wskazujący na laptop
- klasa ustawiona rzędem do zdjęcia
- brytyjskie symbole jako motyw — Big Ben, autobus, flagi, budki telefoniczne. Pojedynczy
  drobny detal jest dopuszczalny, motyw przewodni nie
- gradienty, winiety, filtry „instagramowe", sztuczne rozmycia tła
- zaokrąglone narożniki i cienie — moduły mają promień 0, obróbka nie może tego wyprzedzać

**Ważne zastrzeżenie prawne i etyczne.** Zdjęcia nie przedstawiają rzeczywistych uczniów
SP 402 i **nigdzie nie wolno tego sugerować** — ani w treści, ani w atrybutach `alt`.
To wymóg briefu, nie ostrożność.

## Uwaga praktyczna do generowania obrazów

Znaczna część generatorów obrazów odmawia tworzenia fotorealistycznych wizerunków dzieci
albo daje słabe wyniki. Jeśli trafisz na taką blokadę, **kadry bez rozpoznawalnych twarzy
działają tu równie dobrze, a często lepiej** — i są dokładnie zgodne z briefem, który mówi
o bliskich, częściowo uciętych kadrach.

Warianty, które omijają problem i pasują do kierunku:

- dłonie przy zeszycie, ołówku, karcie pracy
- kadr od tyłu albo przez ramię, twarz poza kadrem
- postać w ruchu, rozmyta, na korytarzu
- detale: plecak, piórnik, słownik, tablica, ławka
- silhouette przy oknie, kontra

Jeśli któryś kadr wyjdzie źle — pomiń go i daj znać. Lepiej pięć mocnych zdjęć niż sześć,
z których jedno jest oczywiście sztuczne.

## Lista kadrów

Siedem plików. Kolumna „Plik" podaje **dokładną nazwę i katalog** — wrzuć pliki pod tymi
nazwami, a konwersją na AVIF/WebP i wariantami szerokości zajmuje się `npm run images`.

Format źródłowy: **PNG** albo **JPG**. PNG jest preferowany, bo jest bezstratny.

### 01 — HERO (dwa cropy tej samej scenki)

Najważniejsze zdjęcie na stronie. Pełna szerokość ekranu, wchodzi pod gigantyczny wordmark
„HIGH FIVE", więc **lewa górna i środkowa część kadru powinna być spokojna** — tam wejdzie tekst.

| Co           | Szczegóły                                                                                                                                                       |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Scena        | Dwoje–troje dzieci przy stole w trakcie rozmowy albo zadania w parach. Energia, kontakt między nimi, nie z obiektywem                                           |
| Światło      | Dzienne, z okna, miękkie                                                                                                                                        |
| Plik desktop | `src/assets/images/hero/hero-classroom-1600.png` — proporcja **16:9**, minimum **2400 px** szerokości                                                           |
| Plik mobile  | `src/assets/images/hero/hero-classroom-portrait-1200.png` — proporcja **4:5**, minimum **1600 px** szerokości                                                   |
| Uwaga        | Mobile to **osobny kadr tej samej sytuacji**, nie automatyczne przycięcie wersji szerokiej. Na wąskim ekranie kadr pionowy musi trzymać kompozycję samodzielnie |

### 02 — PO LEKCJACH

Sekcja o lokalnej wygodzie: dziecko zostaje w znanym miejscu, bez dodatkowego dojazdu.
Zdjęcie jest **sticky** — stoi nieruchomo, gdy obok przewija się tekst. Musi znosić długie patrzenie.

| Co      | Szczegóły                                                                                                       |
| ------- | --------------------------------------------------------------------------------------------------------------- |
| Scena   | Szkolny korytarz albo przejście. Dziecko z plecakiem w ruchu, po lekcjach. Może być rozmyte ruchem              |
| Nastrój | Spokój, przejście z dnia szkolnego do zajęć. Nie pusty korytarz — potrzebny jest człowiek                       |
| Plik    | `src/assets/images/sections/after-school-corridor-1200.png` — proporcja **4:5**, minimum **1600 px** szerokości |

### 04 — KURSY (dwa zdjęcia, po jednym na ścieżkę)

Dwa duże moduły obok siebie. Zdjęcia muszą się **różnić wiekiem i energią**, bo to jedyny
wizualny sygnał, że to dwie różne oferty.

| Co        | Szczegóły                                                                                                       |
| --------- | --------------------------------------------------------------------------------------------------------------- |
| Klasy 1–7 | Młodsze dziecko, aktywnie: mówi, pokazuje, podniesiona ręka, praca w parze. Ruch i lekkość                      |
| Plik      | `src/assets/images/courses/course-kids-1200.png` — proporcja **4:5**, minimum **1600 px**                       |
| Klasa 8   | Starszy uczeń, skupienie: pisze, notuje, pracuje nad zadaniem. Ciszej, bardziej serio — bez smutku i bez presji |
| Plik      | `src/assets/images/courses/course-exam-1200.png` — proporcja **4:5**, minimum **1600 px**                       |

### 08 — LOKALIZACJA

Kontekst miejsca: Warszawa, okolica szkoły. Zdjęcie odsłaniane maską obok adresu SP 402.

| Co         | Szczegóły                                                                                                                         |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Scena      | Zwyczajna warszawska okolica mieszkaniowa albo budynek szkoły z zewnątrz. Zieleń, chodnik, blok, dzień                            |
| **Ważne**  | **Bez rozpoznawalnych szyldów, tablic, numerów i logotypów.** Nie może wyglądać jak zdjęcie konkretnej, identyfikowalnej placówki |
| Nie chcemy | Panoramy centrum, Pałacu Kultury, wieżowców — to nie jest sekcja o Warszawie jako mieście, a o wygodnej lokalizacji               |
| Plik       | `src/assets/images/sections/location-warsaw-1600.png` — proporcja **3:2**, minimum **2400 px**                                    |

### Tło typograficzne — DETAL

Używane jako podkład pod wielką typografię w sekcji korzyści i przy FAQ. Musi być **spokojne
i mało kontrastowe**, bo na nim stanie tekst.

| Co      | Szczegóły                                                                                     |
| ------- | --------------------------------------------------------------------------------------------- |
| Scena   | Kadr z góry: otwarty zeszyt, karta pracy, ołówek, słownik, ewentualnie fragment dłoni         |
| Nastrój | Zwyczajny nieporządek pracy, nie wystylizowany flat lay z równo ułożonymi przedmiotami        |
| Plik    | `src/assets/images/backgrounds/detail-desk-1600.png` — proporcja **3:2**, minimum **2400 px** |

## Open Graph

Grafika podglądu przy udostępnianiu linku. **Nie musisz jej generować** — złożę ją z kadru
hero i typografii marki. Jeśli wolisz osobny obraz, potrzebuję `1200 × 630 px` bez tekstu.

Docelowo: `public/social/og-image.jpg`.

## Jak dostarczyć

1. Nazwij pliki **dokładnie** jak w kolumnie „Plik" — małe litery, bez polskich znaków i spacji.
   To wymóg konwencji nazewnictwa z rozdz. 5.5 specyfikacji.
2. Wrzuć je do wskazanych katalogów w repozytorium.
3. Format źródłowy: **PNG** albo **JPG**, bez widocznych artefaktów kompresji. Nie zmniejszaj
   ich wcześniej — im większy oryginał, tym lepsze warianty wygeneruję.
4. Napisz, że gotowe. Ja zajmę się konwersją na AVIF i WebP, wariantami szerokości pod `srcset`,
   dopasowaniem `object-position` per breakpoint i tekstami `alt`.

## Czego brakuje poza fotografią

Do uzupełnienia w `docs/CONTENT_GAPS.md`:

- **logo / wordmark HIGH FIVE** — obecnie wordmark jest realizowany typografią, co jest zgodne
  z kierunkiem briefu. Jeśli istnieje znak graficzny, potrzebuję go w SVG
- **favicon** — tymczasowo znak „5" na czarnym tle, wygenerowany kodem
- **og-image** — patrz wyżej
- Logo SP 402 **nie może** zostać użyte bez zgody, więc nie jest na liście
