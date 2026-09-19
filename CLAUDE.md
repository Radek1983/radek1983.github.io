# CLAUDE.md — HIGH FIVE / kontrakt projektowy

Strona WWW szkoły języka angielskiego **HIGH FIVE**: statyczny one-page, hostowany na GitHub Pages
w repozytorium `Radek1983/radek1983.github.io`, pod adresem `https://www.highfive.academy`.

Ten plik jest trwałym zapisem założeń. Czytaj go przed każdą zmianą w kodzie i aktualizuj, gdy
zmienia się ustalenie, a nie tylko implementacja.

## 0. Reguła nadrzędna — weryfikuj `instructions/` przy każdym zadaniu

Pliki w `instructions/` są **masterem projektu**. Ten plik jest ich streszczeniem, nie zamiennikiem.

**Przed rozpoczęciem każdego zadania** — nie tylko na starcie projektu — zweryfikuj odpowiednie
fragmenty `instructions/` i sprawdź, czy plan, ten dokument i kod nadal się z nimi zgadzają.
Pliki źródłowe mogą zostać zaktualizowane przez właściciela między sesjami.

**Jeżeli plan, `CLAUDE.md`, kod albo cokolwiek innego rozbiega się z `instructions/`:**

1. **Zatrzymaj się. Nie podejmuj decyzji samodzielnie.**
2. Wskaż dokładnie, który zapis w `instructions/` i który element planu są ze sobą sprzeczne.
3. **Zapytaj właściciela, co zrobić** — i czekaj na odpowiedź.
4. Odpowiedź zapisz jako ADR w `docs/ADR/` oraz w §15 lub §16 tego pliku.

Ta reguła ma pierwszeństwo przed §1 („zasada rozstrzygania braków specyfikacji”). Brak opisu
szczegółu technicznego rozstrzygasz sam i zapisujesz jako ADR. **Sprzeczność z `instructions/`
rozstrzyga wyłącznie właściciel.**

## 1. Źródła prawdy i hierarchia

Materiały źródłowe leżą w `instructions/` — folder jest **lokalny i wpisany do `.gitignore`**, nie
trafia do publicznego repozytorium. Nie commituj go i nie kopiuj jego zawartości do `docs/`
w całości.

| Priorytet | Dokument                                                                   | Zakres rozstrzygający                                                                                            |
| --------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 1         | `instructions/master_prompt_claude_high_five_v1.2.md`                      | **Wyrocznia projektu.** Rola, fakty, copy, IA, art direction, build order, kryteria BIZ                          |
| 2         | `instructions/ERRATA-zalacznik-techniczny-v1.1.md`                         | **Ma pierwszeństwo przed PDF-em v1.1** w zakresie, który opisuje: wersje narzędzi (E-01), dane kontaktowe (E-02) |
| 3         | `instructions/zalacznik_techniczny_specyfikacja_repozytorium_www_v1.1.pdf` | Wszystko techniczne: stos, repo, CSS/JS, motion, CI/CD, hosting, SEO, a11y, performance, security, odbiór        |
| 4         | `instructions/High_Five_brief_webmaster_NEWGROUND_STYLE_v3 (1).pdf`        | Fakty biznesowe, gotowe copy, design system, 9 scen, motion spec                                                 |
| 5         | `docs/ADR/`                                                                | Decyzje podjęte w trakcie realizacji                                                                             |
| 6         | ten plik                                                                   | Skrót ustaleń i decyzje D1–D6                                                                                    |

Reguły rozstrzygania:

- Konflikt biznes vs technologia w sprawie technicznej → **wygrywa specyfikacja techniczna v1.1**.
- Konflikt w sprawie faktów, oferty, ceny, CTA, lokalizacji → **wygrywa brief HIGH FIVE**.
- Szczegół techniczny nieopisany w żadnym dokumencie → wybierz rozwiązanie proste, statyczne,
  wydajne i dostępne, a decyzję zapisz jako ADR w `docs/ADR/NNNN-nazwa.md`. Nie wstrzymuj prac,
  o ile sprawa nie dotyczy treści, prawa, kosztu usługi zewnętrznej lub zmiany zakresu.
- **Sprzeczność z `instructions/` → pytaj, patrz §0.**
- Brakujący materiał (zdjęcie, tekst) nie blokuje prac technicznych — użyj placeholdera
  zachowującego docelowe proporcje i zapisz wymaganie.

**Brak w źródłach:** master prompt §2 wymienia trzeci dokument — benchmark „One-page i
slide-animation dla szkoły angielskiego”. Nie został dostarczony. Checklistę kompletności
informacji bierzemy z master promptu §14. Content gap nieblokujący.

## 2. Produkt i odbiorca

- **Decydent:** rodzic / opiekun. **Użytkownik usługi:** dziecko z klas 1–8.
- **Miejsce:** zajęcia po lekcjach na terenie SP 402 w Warszawie.
- **Problem rodzica:** dodatkowa logistyka po szkole, potrzeba regularnego i praktycznego
  angielskiego, jasna cena, jasny proces zapisu, dla klasy 8 przygotowanie egzaminacyjne.
- **Pozycjonowanie:** współczesna, lokalna, konkretna marka edukacyjna. Przyjazna dzieciom, ale
  nie infantylna. Profesjonalna, ale nie corporate-edtech.

**Test 15 sekund.** Po 15 sekundach na stronie użytkownik ma pamiętać:

1. Zajęcia są po lekcjach w SP 402.
2. Trwa nabór, planowany start to 1 października.
3. HIGH FIVE ma własny, współczesny charakter.

## 3. Potwierdzone fakty — zamknięta lista

To jedyne dane, które wolno publikować:

- HIGH FIVE, angielski dla klas 1–8.
- Zajęcia po lekcjach na terenie SP 402 w Warszawie.
- Nabór trwa. Planowany start: 1 października.
- Grupa rusza po zebraniu minimum 5 dzieci.
- Pierwsze dziecko: **55 zł / 45 min.** Drugie i każde kolejne dziecko z rodzeństwa:
  **50 zł / 45 min.** Brief pisał „zł/godz.”; właściciel potwierdził, że lekcja trwa **45 minut**,
  więc jednostka godzinowa obiecywała rodzicowi 15 minut więcej, niż trwają zajęcia.
- **Płacisz za zajęcia, które się odbywają.** Brak stałej opłaty miesięcznej niezależnej od
  liczby lekcji; zajęcia wypadające w dni wolne od szkoły nie są naliczane. Fakt bez zmian;
  brzmienie na stronie zmienił właściciel 15.09.2026 z „które są w kalendarzu” — rodzic na tym
  etapie żadnego kalendarza jeszcze nie widział.
- **Kurs egzaminacyjny: 80 zł / 90 min.** Jedne zajęcia trwają 90 minut. Przekazane przez
  właściciela 15.09.2026; wcześniej stawka była jawnym brakiem danych.
- **Angielski dla seniorów: 45 zł / 60 min.** **Online 1 na 1: 120 zł / 60 min.** Obie
  przekazane przez właściciela 16.09.2026 wraz z przebudową `/cennik/`; wcześniej były
  jawnym brakiem danych. Stoją dziś **tylko na `/cennik/`** — podstrony produktowe ceny
  nadal nie podają, co czeka na decyzję właściciela (`docs/CONTENT_GAPS.md`).
- **Model rozliczenia: płatność z góry za zajęcia zaplanowane na dany miesiąc.** To nie
  abonament i nie stały ryczałt. Spotkanie, o którym z góry wiadomo, że się nie odbędzie
  (dzień wolny, święto, przyczyny organizacyjne szkoły lub Terminalu Kultury), nie jest
  wliczane do płatności. Zajęcia opłacone, które nie odbędą się z nieplanowanej przyczyny,
  odliczamy od płatności za kolejny miesiąc. Przekazane przez właściciela 16.09.2026.
  **Nie upraszczaj tego do „płacisz tylko za odbyte zajęcia"** — rozliczenie idzie z góry.
- **Godziny kontaktu telefonicznego: 17:00–21:00.** W ciągu dnia lektor pracuje w szkole,
  więc najszybszą drogą jest e-mail. Przekazane przez właściciela 17.09.2026 wraz
  z przebudową sekcji zapisów na `/oferta/dzieci/` — jedyne miejsce, gdzie te godziny
  są publikowane. To **nie jest** grafik zajęć, którego §4 zabrania wymyślać.
- **Kwalifikacje osoby prowadzącej.** Magdalena Germel: lingwistyka stosowana na
  Uniwersytecie Warszawskim, studia podyplomowe z tłumaczeń przysięgłych w SWPS,
  ponad 20 lat nauczania, w tym w szkole podstawowej, **dyplomowana nauczycielka
  i egzaminatorka Okręgowej Komisji Egzaminacyjnej**. Przekazane przez właściciela;
  publikowane w sekcji 05. Bez tego §4 zabraniałby publikowania kwalifikacji.
- **Współpraca przy klasach 1-7: `High Five Agnieszka Karolewska`.** Zajęcia prowadzą
  również zweryfikowani lektorzy z doświadczeniem w pracy z dziećmi. Przekazane przez
  właściciela 18.09.2026. W tekście narracyjnym zapis **zwykłą kapitalizacją**, bez NIP,
  REGON i pozostałych danych rejestrowych — to informacja o współpracy, nie metryczka
  firmy. Stoi w sekcji 05 strony głównej i jako dopisek w hero `/oferta/dzieci/`.
  Dane rejestrowe HIGH FIVE w sekcji 12 i w JSON-LD **zostają bez zmian** — partner nie
  jest stroną umowy z rodzicem.
- Dwie ścieżki: **klasy 1–7** oraz **klasa 8 / egzamin ósmoklasisty**.
- Adres miejsca zajęć: Szkoła Podstawowa nr 402 im. Haliny Konopackiej,
  ul. Jana Nowaka-Jeziorańskiego 22, 03-982 Warszawa.
- **Dane rejestrowe:** `High Five Magdalena Germel`, NIP `8241730595`,
  REGON `523281712`, działalność od `2022`. Przekazane przez właściciela;
  publikowane w sekcji `#kontakt` i w JSON-LD (`legalName`, `taxID`, `foundingDate`).

Cena i warunek minimum 5 dzieci muszą być widoczne **przed** sekcją kontaktu.

## 4. Zasada anty-halucynacyjna

**Nie wymyślaj i nie publikuj bez potwierdzenia:** grafiku i częstotliwości zajęć; liczby wolnych
miejsc; nazwisk i kwalifikacji lektorów; certyfikatów; wyników egzaminów; opinii i ocen Google;
liczników klientów; darmowej lekcji próbnej; zasad odrabiania i rezygnacji; materiałów w cenie;
danych kontaktowych i danych rejestrowych firmy; partnerstwa lub patronatu SP 402; nazw metod
nauczania; obietnicy wyniku egzaminu.

Każdy brak zapisz w `docs/CONTENT_GAPS.md` ze statusem, właścicielem danych, miejscem użycia
i informacją, czy blokuje release. Brak nieblokujący nie zatrzymuje pracy.

**Relacja ze SP 402.** Pisz: „zajęcia HIGH FIVE odbywają się na terenie SP 402 po lekcjach”.
Nie sugeruj, że HIGH FIVE jest oficjalnym serwisem SP 402 ani że szkoła odpowiada za ofertę
komercyjną. Nie używaj logo SP 402. Adres SP 402 to **miejsce zajęć, nie adres rejestrowy
HIGH FIVE** — dotyczy to również JSON-LD.

## 5. Copy deck — tekst zatwierdzony

Sekcje briefu oznaczone jako gotowe copy to zatwierdzony copy deck. Przenieś je do
`docs/COPY_DECK.md` i mapuj na fragmenty kodu. **Nie przerabiaj ich na generyczny marketing.**

- **H1:** `Angielski po lekcjach. W tej samej szkole.`
- **Hero lead:** `Zajęcia dla uczniów klas 1-7, prowadzone po lekcjach w SP 402 w Warszawie. Małe grupy, dużo praktycznego angielskiego i osobny program przygotowujący do egzaminu ósmoklasisty.`
  Brzmienie zmienione przez właściciela wraz z rozbiciem oferty na cztery produkty (ADR 0008).
- **Nabór:** `Nabór trwa. Start zajęć: 1 października. Grupa rusza po zebraniu minimum 5 dzieci.`
- **Primary CTA:** `Zapisz się na zajęcia`, w nagłówku skrócone do `Zapisz się`.
  Wcześniej brief żądał `Zgłoś dziecko do grupy`. Zmianę polecił właściciel: „zgłoś dziecko” czyta się jak zgłoszenie na policję. Cel, kolor i rola CTA bez zmian — **ADR 0006**
- **Lokalna propozycja wartości:** `Mniej logistyki. Znane miejsce. Więcej ciągłości.`
- **Język metody:** `MÓW  PRÓBUJ  POPRAWIAJ  UŻYWAJ`
  Master prompt §16 pisał `MÓWIJ.` — „mówij" nie jest polskim słowem. Poprawkę na `MÓW`
  i zdjęcie kropek polecił właściciel — **ADR 0009**.

Zakaz pustych fraz: „nowoczesne metody”, „najwyższa jakość”, „doświadczeni lektorzy”,
„przyjazna atmosfera” — o ile nie stoi za nimi potwierdzony konkret. Najpierw konkret lokalny,
potem korzyść edukacyjna.

### Łamanie wierszy — zasada obowiązkowa

**Krótkie słowo nie zostaje na końcu wiersza.** Dotyczy spójników, przyimków, przeczeń
i skrótów: `z`, `w`, `i`, `a`, `o`, `u`, `do`, `po`, `za`, `na`, `od`, `nie`, `dla`, `nr`,
`np.`, `im.`, `ul.`, a także liczby oddzielonej od tego, co opisuje (`nr 402`, `klas 1-7`,
`5 dzieci`, `45 min`). Takie słowo ma schodzić do następnego wiersza **razem z wyrazem,
do którego należy**.

Wiąże się je **twardą spacją** `&nbsp;` w HTML — nigdy `<br />`. Różnica jest zasadnicza:
`<br />` wymusza łamanie w tym samym miejscu przy każdej szerokości ekranu i na telefonie
zostawia poszarpane wiersze; twarda spacja mówi wyłącznie „tych dwóch słów nie rozdzielaj”,
a resztę układu przeglądarka dobiera sama.

Sprawdzaj to po **każdej** zmianie tekstu, szerokości kolumny i stopnia pisma — łamanie
zależy od wszystkich trzech naraz. Właściciel zgłasza takie miejsca wzrokowo, więc nie czekaj
na zgłoszenie: przy zmianie copy przejrzyj cały akapit, nie tylko zdanie, które zmieniałeś.

Reguła ma dziś charakter redakcyjny — twarde spacje wstawiamy ręcznie w treści. Automat
wstawiający je przy budowaniu byłby możliwy w `htmlPartials`, ale to zmiana architektury
i wymaga osobnej decyzji właściciela oraz ADR.

## 6. Architektura treści: 9 aktów, jeden scroll

| #   | Akt                | Pytanie rodzica            | Dominująca forma                                                | Kotwica            |
| --- | ------------------ | -------------------------- | --------------------------------------------------------------- | ------------------ |
| 01  | Hero / nabór       | Czy to dla mojego dziecka? | Gigantyczny wordmark + full-bleed fotografia                    | — (top)            |
| 02  | Po lekcjach        | Gdzie i dlaczego wygodnie? | Tekst + sticky fotografia                                       | `#po-lekcjach`     |
| 03  | Co dziecko zyskuje | Po co te zajęcia?          | Marquee typograficzny. **Bez gridu ikon**                       | `#korzysci`        |
| 04  | Kursy              | Która oferta?              | Dwa duże moduły 50/50                                           | `#oferta`          |
| 05  | Jak uczymy         | Jak wyglądają zajęcia?     | Czarny ekran + 4 ogromne czasowniki                             | `#metoda`          |
| 06  | Cena               | Ile?                       | 55 zł / 50 zł jako dominująca typografia. **Bez pricing cards** | `#cennik`          |
| 07  | Nabór / start      | Kiedy rusza grupa?         | „5” + „01.10”. **Bez fałszywego licznika**                      | `#nabor`           |
| 08  | Lokalizacja        | Czy to wygodne?            | Adres SP 402 + `Wyznacz trasę`                                  | `#lokalizacja`     |
| 09  | FAQ + final CTA    | Co dalej?                  | Krótki FAQ + kontakt                                            | `#faq`, `#kontakt` |

Kotwice `#oferta`, `#cennik`, `#faq`, `#kontakt` są obowiązkowe. Każda kotwica musi być trwała
i działać po wejściu bezpośrednio z URL, z uwzględnieniem wysokości sticky headera.

**Oferta — co komunikować.** Klasy 1–7: mówienie, słownictwo, rozumienie, gramatyka używana
w praktyce; młodsze klasy — krótsze i aktywniejsze zadania; starsze — precyzja, dłuższa
wypowiedź, czytanie, język szkolny. Klasa 8: uporządkowanie materiału, typy zadań, strategie,
regularny trening, słuchanie i czytanie, środki i funkcje językowe, wypowiedź pisemna, kontrola
czasu, analiza błędów. **Nie obiecuj wyniku egzaminu.**

**FAQ — wolno publikować:** klasy 1–8; ścieżka egzaminacyjna dla klasy 8; zajęcia na terenie
SP 402 po lekcjach; start 1 października; minimum 5 dzieci; 55/50 zł; sposób kontaktu.
**Nie publikuj:** zasad dołączenia po starcie, nieobecności i odrabiania, materiałów w cenie,
rezygnacji, lekcji próbnej.

## 7. Design system

| Token      | Wartość   | Rola                                   |
| ---------- | --------- | -------------------------------------- |
| PAPER      | `#F2EFE8` | Tło dominujące                         |
| INK        | `#0A0A0A` | Tekst i akt czarny                     |
| SIGNAL RED | `#F23B2F` | Akcja / sygnał                         |
| HF BLUE    | `#123B8C` | Drugi akt marki / sekcja egzaminacyjna |

PAPER + INK dominują na ekranie. RED to kolor akcji. BLUE jest drugim aktem, nie tłem całej
strony. **Brak gradientów.**

- **Typografia:** display Inter Display ExtraBold/Bold, tekst Inter Regular/Medium. Self-hosted
  WOFF2. Żadnych „dziecięcych” novelty fonts. Skalowanie przez `clamp()`, nigdy samo `vw`.
  Display może zajmować 30–70% viewportu, być kadrowany krawędzią, nachodzić na zdjęcie
  i chwilowo być sticky. Body copy zachowuje czytelną długość wiersza.
- **Siatka:** desktop 12 kolumn, margines 24–36 px, gutter 12–20 px. Mobile 4 kolumny,
  margines 16–20 px.
- **Forma:** corner radius **0** w modułach (kapsuła dozwolona tylko dla CTA), shadows **0**,
  glassmorphism **0**. Ikony wyłącznie użytkowe: strzałka, plus/minus w FAQ, marker mapy.
- **Fotografia:** editorialowa, naturalne światło, dzieci w ruchu i rozmowie, bliskie kadry,
  czasem częściowo ucięte. Full-bleed lub duże prostokątne cropy — **nie w kartach**. Bez
  napisów, logo i znaków wodnych w obrazie. Brytyjskie symbole tylko jako pojedynczy detal.
- Co najmniej 2–3 różne typy kompozycji sekcji. Nie osiem identycznych bloków.

Wymagane decyzje przed kodowaniem sekcji zapisz w `docs/DESIGN_SYSTEM.md`: skala typografii,
maksymalna szerokość body copy, zasady full-bleed, trzy wzorce kompozycji, słownik motion,
zasady fotografii, zasady CTA i menu.

## 8. Anty-wzorce — powodują brak odbioru

Card grid jako główny język layoutu. Sześć ikonek korzyści. Corporate edtech dashboard.
Gradienty, badge, liczniki. „British theme park” (Big Ben + bus + flagi + budki). Scroll
show-off. fullPage i scroll hijacking. Parallax wszystkiego. Obroty i zoomy 3D jako sztuczka.
Preloader pełnoekranowy wyłącznie dla efektu. Generyczny premium landing. Wyśrodkowany nagłówek
na stock photo z gradient overlay. Utrata charakteru na mobile przez redukcję wszystkiego do
identycznego stacku.

**Test odbioru:** statyczny screenshot bez animacji ma wyglądać jak mocny projekt brandingowy.
Jeśli po usunięciu animacji strona wygląda jak „ładny landing page z kartami”, projekt nie
spełnia briefu — popraw art direction, nie dokładaj animacji.

## 9. Motion

Ruch ma wynikać z layoutu i wzmacniać kompozycję, nie ją zastępować. Trzy warstwy:
**micro** (hover/focus, underline, stan przycisku, menu mobilne), **reveal** (fade/translate,
mask/clip reveal, stagger nagłówka), **narrative** (sticky media, marquee, lokalny track).

Pięć reguł:

1. **Reveal, nie fly-in** — `clip-path`/`overflow: hidden`, 450–750 ms. Nie elementy lecące z 200 px.
2. **Parallax tylko w mediach** — 3–8% wysokości względem sekcji. Nie parallax tekstu i CTA.
3. **Typografia ma momentum** — oversized wordmark / marquee zależny od scrolla, 6–16 vw na sekcję.
4. **Kolor zmienia akt** — PAPER → BLACK → RED → BLUE → PAPER.
5. **Interakcja jest mała** — strzałka CTA 3–5 px, underline/invert, 150–220 ms.

Bezwzględne zakazy: globalny `preventDefault()` na `wheel`/`touchmove`; scroll-jacking; pinowanie
całych ekranów na sztuczne 300vh; animacje blokujące wejście do sekcji z kotwicy; autoplay
marquee w spoczynku; autoplay audio.

`prefers-reduced-motion: reduce` jest obowiązkowe: wordmark i obraz od razu w stanie końcowym,
brak parallaxu, marquee statyczne, reveal minimalny lub natychmiastowy. Kopia marquee służąca
do zapętlenia dostaje `aria-hidden="true"`; jedna semantyczna wersja tekstu pozostaje dostępna.

Mobile: amplituda ruchu mniejsza o 40–60%, animacje 200–500 ms, brak poziomego tracka jeśli nie
działa idealnie, brak długiego sticky. Nawigację poniżej `75rem` przejmuje szuflada z pułapką
focusu (ADR 0007) - przy ośmiu pozycjach menu nie da się już pominąć. Zachowaj duży crop typografii, pełne zdjęcia, kontrast,
jedno CTA i kolejność narracji.

Sticky storytelling musi degradować się do układu statycznego na małych ekranach i przy reduced
motion. GSAP dopuszczalny **wyłącznie po ADR**, gdy konkretna choreografia nie jest rozsądnie
osiągalna natywnie. Lenis nie jest wymagany i nie wolno go dodawać po to, by zmienić odczucie
naturalnego scrolla. Wzorce zapisuj w `docs/MOTION.md`.

Kontrakt HTML dla motion: atrybuty deklaratywne `data-animation="reveal-up"`,
`data-motion="marquee"`, `data-story-step`. Atrybuty opisują zachowanie, nie zawierają wartości
pikselowych. Moduły opcjonalne muszą bezpiecznie kończyć działanie, gdy element nie istnieje.

## 10. Stos i ograniczenia techniczne

- HTML5 semantyczny, nowoczesny CSS3, **vanilla JavaScript ES Modules**. Build: **Vite**.
- **Brak CMS. Brak bazy danych. Brak frameworka SPA (React/Vue/Angular/Svelte). Brak jQuery.**
- Zależności tylko przez npm, nigdy z przypadkowego CDN. Nowa zależność wymaga uzasadnienia
  technicznego i wpisu w `docs/ARCHITECTURE.md`.
- Node.js przypięty w `.nvmrc` i `engines` w `package.json`. `package-lock.json` commitowany,
  w CI wyłącznie `npm ci`.
- Strona musi działać jako statyczny build hostowalny na CDN. Awaria JS nie może ukryć oferty
  ani drogi kontaktu. Treść krytyczna renderowana w HTML, nie generowana w runtime.

**HTML:** jeden logiczny `h1`, hierarchia nagłówków bez skoków dla wyglądu, `header`/`nav`/`main`/
`section`/`footer`, skip link, linki jako `<a>` i akcje jako `<button>`, `width`/`height` lub
`aspect-ratio` na obrazach, treść krytyczna nie w pseudo-elementach, brak inline style i inline
executable script.

**CSS:** wejście wyłącznie przez `src/css/main.css` importujący warstwy w kontrolowanej kolejności
(`base/` → `layout/` → `components/` → `sections/` → `animations/` → `utilities/`). Mobile-first,
CSS Grid, tokeny w `base/variables.css`. Nazewnictwo `.komponent`, `.komponent__element`,
`.komponent--wariant`, stany `.is-open`/`.is-active`/`.is-visible`. Zakaz selektorów zależnych od
głębokiej struktury DOM, `!important` tylko jako udokumentowany wyjątek, brak globalnego
`overflow: hidden` jako hacka.

**JS:** `main.js` to wyłącznie punkt startowy bez logiki sekcji. Każdy moduł ma jedną
odpowiedzialność i eksportuje jawną funkcję `init*`. `IntersectionObserver`, `ResizeObserver`,
`requestAnimationFrame` zamiast ciężkich obliczeń w `scroll`/`resize`. Brak zmiennych globalnych
na `window`. Błąd jednego modułu nie może zablokować treści. Zero danych użytkownika w `console`.
Zakaz niesanitowanego `innerHTML` — dla tekstu `textContent`.

## 11. Struktura repozytorium

Obowiązuje struktura z rozdz. 4–5 specyfikacji technicznej, rozszerzona w rozdz. 32.
**Nie redukuj do `index.html` + `style.css` + `script.js`.**

```
.github/           workflows/{ci,deploy-preview,deploy-production}.yml, ISSUE_TEMPLATE/,
                   pull_request_template.md, CODEOWNERS, dependabot.yml
docs/              ARCHITECTURE, DESIGN_SYSTEM, CONTENT, SEO, ACCESSIBILITY, SECURITY,
                   TESTING, HOSTING, DEPLOYMENT, MOTION + ADR/
docs/              BUSINESS_REQUIREMENTS, COPY_DECK, CONTENT_GAPS, ART_DIRECTION, ANALYTICS
ops/               README.md, headers.example.conf, redirects.example.conf
public/            favicon.svg, robots.txt, sitemap.xml, site.webmanifest, social/og-image.png
src/assets/        fonts/, icons/, images/{hero,courses,backgrounds}/, video/
src/css/           main.css + base/ layout/ components/ sections/ animations/ utilities/
src/js/            main.js + modules/ + utils/
tests/             e2e/, smoke/
                   index.html, 404.html, konfiguracje, README, CHANGELOG, CONTRIBUTING, SECURITY
```

`public/` służy tylko zasobom wymagającym stabilnego URL. Zdjęcia, ikony i fonty idą do
`src/assets/`, żeby Vite nadał im fingerprint. Nazwy plików: małe litery, alfabet łaciński,
cyfry i myślniki; bez spacji i polskich znaków; warianty rozmiaru liczbowo
(`hero-school-768.avif`, `hero-school-1600.avif`).

Dokumenty obowiązkowe poza techniczną dokumentacją: `docs/BUSINESS_REQUIREMENTS.md`,
`docs/COPY_DECK.md`, `docs/CONTENT_GAPS.md`, `docs/ART_DIRECTION.md`, `docs/MOTION.md`,
`docs/ANALYTICS.md`.

## 12. Workflow, wersjonowanie, wdrożenie

- `main` chroniony. Zmiany przez branch + Pull Request. Wymagane checks: lint, validate, test, build.
- Prefiksy branchy: `feature/`, `fix/`, `perf/`, `refactor/`, `docs/`, `chore/`.
- **Conventional Commits**, z dopuszczonym dodatkowym typem `seo`. Jeden commit = jedna zmiana logiczna.
- SemVer, tagi `vX.Y.Z`, `CHANGELOG.md` aktualizowany przed wydaniem.
- `npm run check` musi przechodzić lokalnie **przed** PR: format:check, lint:js, lint:css, build,
  validate:html, test:e2e.
- **Pętla robocza przy zmianach wizualnych.** Pełny `npm run check` trwa około czterech minut
  i nie jest narzędziem do oglądania przesuniętego napisu. Przy dopracowywaniu wyglądu —
  odstęp, stopień pisma, kadr, kolor — pracuj w pętli **stylelint + `npm run build` + podgląd
  w przeglądarce** (kilkanaście sekund) i pokazuj właścicielowi efekt. Testy zbieraj w paczkę:
  najpierw testy sekcji, której dotyczyła zmiana, a pełny `npm run check` **raz, przed
  commitem** całej serii poprawek. Wyjątek bez dyskusji: zmiana architektury, danych, treści
  albo czegokolwiek w `src/js/` idzie z pełnym checkiem od razu.
- Deployment automatyczny i powtarzalny. **Rollback = ponowne wdrożenie poprzedniego dobrego
  taga**, nie ręczna edycja plików na serwerze. Rutynowy FTP nie jest metodą publikacji.
- CI generuje `version.json` (wersja, commit SHA, timestamp). Bez sekretów.
- Zmiana treści przebiega jak zmiana kodu: branch → edycja → lokalny check → PR → CI → merge →
  release. `docs/CONTENT.md` wskazuje, które fragmenty `index.html` odpowiadają za które sekcje.

Twarde fakty wdrożeniowe dla tego repozytorium:

- To **user site** — `base` w Vite = `/`. Nigdy `/radek1983.github.io/`. Własna domena tego
  nie zmienia: serwis stoi w korzeniu i przy zmianie hostingu też ma tam stać.
- Node przypięty na `24.20.0` (nie samo `24` — narzędzia lintujące mają wyższy floor niż 24.0).
- Źródło GitHub Pages musi zostać **ręcznie** przestawione na „GitHub Actions” w ustawieniach
  repozytorium. Tego nie da się zrobić z workflow.
- Ruleset na `main` włączamy **po** pierwszym zielonym CI, gdy nazwy checków już istnieją.
- `.gitattributes` z `* text=auto eol=lf` musi trafić do pierwszego PR-a — praca na Windows,
  CI na Linuksie, inaczej `prettier --check` przejdzie lokalnie i wywali się w CI.

## 13. Budżety, dostępność, SEO

**Core Web Vitals:** LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1.
**Budżety:** własny JS ≤ 120 KB gzip, CSS ≤ 80 KB gzip, hero ≤ 350 KB, pozostałe zdjęcia
≤ 250 KB na wariant, initial page weight mobile ≤ 1,5 MB.
**Lighthouse:** Performance ≥ 90, Accessibility / Best Practices / SEO ≥ 95.

Techniki obowiązkowe: AVIF/WebP z `srcset`/`sizes`; **obraz LCP nigdy `loading="lazy"`**; lazy
poniżej fold; `preload` tylko dla rzeczywiście krytycznych zasobów; `defer`/`module` dla skryptów;
`transform`/`opacity` zamiast animowania `top`/`left`/`width`; usunięcie martwego kodu przed release.

**WCAG 2.2 AA:** pełna obsługa klawiatury bez pułapek focusu; widoczny focus (nie `outline: none`
bez zamiennika); skip link; logiczna kolejność DOM i focus; minimum 44×44 CSS px dla krytycznych
targetów dotykowych; accessible name dla przycisków ikonowych; poprawne `label`, komunikaty błędów
i `autocomplete` w formularzach; brak informacji przekazywanej wyłącznie kolorem; `aria-live` dla
statusu; `alt` zgodny z funkcją obrazu (`alt=""` dla dekoracyjnych); reduced motion. Element nie
może pozostać trwale ukryty przy braku JavaScriptu — klasy animacyjne nakładaj dopiero po
inicjalizacji albo przez klasę `js` na `<html>`.

**SEO.** Na start jeden kompletny one-page.

- `title`: `High Five - angielski dla dzieci w SP 402 Warszawa`
- `meta description`: `Zajęcia z angielskiego dla klas 1-7 po lekcjach w SP 402 w Warszawie. Osobny kurs przygotowujący do egzaminu ósmoklasisty. Nabór trwa, start 1 października.`
  `1-8` zamienione na `1-7 + osobny kurs`, bo tak brzmi menu i treść stron po ADR 0008.
  Sam `title` pozostaje dosłownym cytatem z briefu.
- `h1`: `Angielski po lekcjach. W tej samej szkole.`
- Wymagane: canonical, Open Graph, favicon, `sitemap.xml`, `robots.txt`, poprawny `lang`,
  semantyczne nagłówki, trwałe kotwice, cała istotna treść w DOM.
- **`og:image` — jeden plik marki dla całego serwisu**, `public/social/og-image.png`
  1200 × 630, PNG. Nie składa się go w edytorze graficznym: generuje go
  `node scripts/make-og-image.mjs` z szablonu `scripts/og-image.html`, renderowanego
  w Chromium z Playwrighta. Dzięki temu bierze **te same pliki WOFF2 i te same kolory**
  co strona i nie rozjeżdża się z marką po zmianie copy. Skrypt przyjmuje `--haslo`
  i `--plik`, więc warianty per podstrona to jedno wywołanie — dziś świadomie ich nie
  robimy: jeden plik to jedno miejsce do podmiany.
  **Adresy `og:image` są bezwzględne** i przy przeprowadzce na własną domenę zmieniają
  się razem z `canonical` — obie wartości stoją w tym samym nagłówku każdej strony.
  Na obrazku **nie ma adresu WWW**: `highfive.academy` obsługuje dziś tylko pocztę (D3).
- JSON-LD `EducationalOrganization`/`LocalBusiness` **tylko z prawdziwymi danymi**. Bez ratingów.
  Adres SP 402 jako miejsce zajęć, nie adres rejestrowy firmy.
- **Serwis ma dziesięć adresów** (ADR 0007, 0008, 0011). Hierarchia: `/` (one-page), `/oferta`
  jako hub czterech produktów (`/oferta/dzieci`, `/oferta/egzamin-osmoklasisty`,
  `/oferta/seniorzy`, `/oferta/online`), `/lokalizacje`, `/cennik` oraz `/kariera` jako osobna
  ścieżka dla innego odbiorcy. Dziesiąta jest `/polityka-prywatnosci` — dokument prawny,
  nie strona ofertowa (ADR 0011). Każdy adres to katalog z `index.html` i wejście
  w konfiguracji Vite - bez routera po stronie klienta.
- **Cena należy do produktu.** `/cennik` jest stroną porównawczą osiągalną z mega-menu
  i ze stopki, ale **nie** z pierwszego poziomu menu.
- **Jedno źródło danych oferty:** `src/data/offers.mjs` zasila mega-menu, szufladę, stopkę
  i kontekstowe CTA. Dodanie kursu to jedna zmiana w jednym pliku. Stron `/oferta` i `/cennik`
  **nie** generujemy z tych danych - to byłby page builder.
- **Stare adresy** `/dla-seniorow/` i `/online/` zostają jako strony przekierowujące.
  GitHub Pages nie umie 301 - szczegóły i droga do prawdziwego przekierowania: ADR 0008.
- Podstrony SEO-owe (`/angielski-dla-dzieci-warszawa/`, `/egzamin-osmoklasisty-angielski/`,
  `/cennik/`) nadal tylko opisz w `docs/SEO.md`. **Nie rozszerzaj zakresu bez zlecenia.**

**Analityka.** Taksonomia w `docs/ANALYTICS.md`: `cta_apply_click`, `contact_email_click`,
`contact_phone_click`, `route_click`, `faq_open`. Zero PII w zdarzeniach. Żadnych trackerów bez
decyzji biznesowej; integracja izolowana w osobnym module i zgodna z mechanizmem zgody.

**Bezpieczeństwo.** Zero sekretów w repo, bundle, zmiennych `VITE_*` i publicznym HTML. CSP bez
`unsafe-eval` i `unsafe-inline`. Preferowane lokalne bundlowanie zamiast CDN.

## 14. Build order — kolejność bezwzględna

1. Source audit → 2. Business extraction → 3. **Static composition** → 4. Responsive →
2. Motion → 6. SEO + a11y + performance → 7. Testy → 8. Content audit →
3. Business acceptance → 10. Technical acceptance.

**Nie zaczynaj od GSAP.** Najpierw kompletna strona bez animacji, już zgodna z art direction.
Przed ukończeniem wszystkich sekcji sprawdź hero, jedną sekcję tekst+media i jedną narracyjną
na szerokości 390 px i 1440 px. Jeśli te trzy wzorce nie przenoszą kierunku kreatywnego, popraw
system, nie kopiuj ich na kolejne sekcje.

Viewporty testowe: 320, 375/390, 768, 1024, 1366/1440, 1920 px.
Przeglądarki: Chrome, Edge, Firefox (aktualna + 2 poprzednie), Safari macOS i iOS
(aktualna + 1 poprzednia), Chrome Android.

## 15. Decyzje projektu

| #       | Temat                                     | Decyzja                                                                                                                                                                                                                         |
| ------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **D1**  | Środowisko lokalne                        | Node.js 24 LTS instalowany lokalnie. `npm ci`, lint, build i Playwright uruchamiane przed każdym PR                                                                                                                             |
| **D2**  | Konwersja                                 | **Brak formularza zgłoszeniowego w v1.** Główne CTA prowadzi do sekcji kontaktu z adresem e-mail i telefonem                                                                                                                    |
| **D3**  | Adres                                     | **`https://www.highfive.academy` — podpięte 19.09.2026** (ADR 0010). Wcześniej `https://radek1983.github.io/`. Publikacja w GitHub Pages wstrzymana decyzją właściciela                                                         |
| **D4**  | Fotografia                                | Kadry generowane przez AI. Teraz mock/placeholder w docelowych proporcjach, podmiana po dostarczeniu finalnych plików                                                                                                           |
| **D5**  | Wersje narzędzi                           | **Aktualne majory: ESLint 10, Stylelint 17, html-validate 11.** Zmiana wpisana do `instructions/ERRATA-zalacznik-techniczny-v1.1.md` (E-01) — rozstrzygnięte, nie pytaj o to ponownie                                           |
| **D6**  | Dane kontaktowe                           | **Docelowe:** e-mail `kontakt@highfive.academy`, telefon `+48 790 266 517`. Przekazane przez właściciela; zastąpiły konto prywatne z czasu budowy. Errata E-02 mówi o wartościach tymczasowych — jest w tym punkcie nieaktualna |
| **D7**  | Sekcja 01 hero                            | **ZAMKNIĘTA. Nie wprowadzaj w niej zmian.** Właściciel zatwierdził układ 14.09.2026 i poprosił, żeby go już nie ruszać. Szczegóły i sposób pracy z sekcją niżej                                                                 |
| **D8**  | Sekcja 02 po lekcjach                     | **ZAMKNIĘTA. Nie wprowadzaj w niej zmian.** Zatwierdzona 14.09.2026, tego samego dnia co hero. Szczegóły niżej                                                                                                                  |
| **D9**  | Sekcja 03 co dziecko zyskuje              | **ZAMKNIĘTA. Nie wprowadzaj w niej zmian.** Zatwierdzona 14.09.2026. Szczegóły niżej                                                                                                                                            |
| **D10** | Sekcje 04 nasza oferta i 06 jak uczymy    | **ZAMKNIĘTE. Nie wprowadzaj w nich zmian.** Zatwierdzone 14.09.2026. Szczegóły niżej                                                                                                                                            |
| **D11** | Sekcja 05 o High Five                     | **ZAMKNIĘTA. Nie wprowadzaj w niej zmian.** Zatwierdzona 14.09.2026 po najdłuższej serii poprawek. Szczegóły niżej                                                                                                              |
| **D12** | Sekcja 07 cennik · klasy 1-7              | **ZAMKNIĘTA. Nie wprowadzaj w niej zmian.** Zatwierdzona 15.09.2026 po przebudowie obu paneli. Szczegóły niżej                                                                                                                  |
| **D13** | Sekcja 12 kontakt                         | **ZAMKNIĘTA. Nie wprowadzaj w niej zmian.** Zatwierdzona 15.09.2026. Szczegóły niżej                                                                                                                                            |
| **D14** | Sekcja 08 nabór 2026 · klasy 1-7          | **ZAMKNIĘTA. Nie wprowadzaj w niej zmian.** Zatwierdzona 16.09.2026 po trzech przebudowach pod warunek jednego ekranu. Szczegóły niżej                                                                                          |
| **D15** | Sekcja 09 lokalizacje                     | **ZAMKNIĘTA. Nie wprowadzaj w niej zmian.** Zatwierdzona 16.09.2026 razem ze zmianą wariantu wezwania. Szczegóły niżej                                                                                                          |
| **D16** | Sekcja 10 dodatkowo · seniorzy            | **ZAMKNIĘTA. Nie wprowadzaj w niej zmian.** Zatwierdzona 16.09.2026 po przebudowie z jednej grupy na trzy poziomy. Szczegóły niżej                                                                                              |
| **D17** | Podstrona `/cennik/`                      | **ZAMKNIĘTA. Nie wprowadzaj w niej zmian** poza podmianą odnośników. Zatwierdzona 16.09.2026 po przebudowie na cztery akty kolorystyczne. Szczegóły niżej                                                                       |
| **D18** | Podstrona `/oferta/dzieci/`               | **ZAMKNIĘTA. Nie wprowadzaj w niej zmian.** Zatwierdzona 17.09.2026 po przebudowie zamknięcia na czerwony akt zapisów. Szczegóły niżej                                                                                          |
| **D19** | Podstrona `/oferta/egzamin-osmoklasisty/` | **ZAMKNIĘTA. Nie wprowadzaj w niej zmian.** Zatwierdzona 18.09.2026. Jest **wzorcem rytmu** dla wszystkich trzech sekcji zapisów. Szczegóły niżej                                                                               |
| **D20** | Podstrona `/oferta/seniorzy/`             | **ZAMKNIĘTA. Nie wprowadzaj w niej zmian.** Zatwierdzona 18.09.2026. Jedyna sekcja zapisów z przyciskiem — bo zapisy prowadzi Terminal. Szczegóły niżej                                                                         |
| **D21** | Podstrona `/polityka-prywatnosci/`        | **ZAMKNIĘTA. Nie wprowadzaj w niej zmian.** Zatwierdzona 19.09.2026. Treść jest dokumentem prawnym i pochodzi z PDF-a właściciela — ADR 0011. Szczegóły niżej                                                                   |

### D5 — konsekwencje

- `.nvmrc` = `24.20.0`, `engines` = `>=24.8.0 <25`. `html-validate@11` odrzuca Node 24.0–24.7,
  więc samo `24` z rozdz. 11.1 specyfikacji nie wystarczy.
- Stylelint 17 jest ESM-only → `stylelint.config.mjs` z `export default`.
- ESLint 10 nie czyta `.eslintrc` → wyłącznie flat config w `eslint.config.js`.
- Odstępstwo od cyfr w załączniku A.1 zapisz jako ADR, żeby przy odbiorze było jawne.

### D6 — konsekwencje

- Obie wartości trzymane w **jednym miejscu w kodzie** — `KONTAKT` w `src/data/offers.mjs`.
  Adres zmieniano dzięki temu dwa razy jedną linią, rozniesioną przy budowaniu na
  wszystkie dziewięć stron, do stopki, do JSON-LD i do szkiców `mailto:`.
- Wyświetlanie `+48 790 266 517`, atrybut `tel:+48790266517`.
- **Skrzynka we własnej domenie — załatwione 16.09.2026.** Adres zszedł z publicznego
  dostawcy na `kontakt@highfive.academy`; domenę przekazał właściciel, nie została
  wymyślona. To zamyka G-17. **Od 19.09.2026 domena poczty jest też domeną serwisu** —
  strona stoi pod `www.highfive.academy` (D3, ADR 0010).
- **Jeden wyjątek od „jednego źródła": sekcja zapisów na `/oferta/dzieci/`.** Niesie
  osobny adres zapisowy `highfive.zapisy@gmail.com`, wpisany wprost w HTML, nie przez
  `{{EMAIL}}`. Decyzja właściciela z 17.09.2026. To **nie jest pozostałość** po starej
  wartości — skrzynka zapisowa jest czymś innym niż ogólny adres kontaktowy, który stoi
  w stopce i w sekcji 12. Zakaz powrotu gmaila obowiązuje więc na ośmiu stronach,
  nie na dziewięciu.
- Adres e-mail widoczny publicznie ściąga spam — świadomie przyjęte ryzyko.
- **Żadna stara wartość nie może wrócić** — ani konto prywatne z czasu budowy, ani
  skrzynka na gmailu. Pilnuje tego test w `tests/e2e/regressions.spec.js`, który
  skanuje wszystkie dziewięć stron.

### D7 — sekcja 01 hero jest zamknięta

Właściciel zatwierdził układ hero **14.09.2026** po serii poprawek robionych na żywo i wprost
poprosił, żeby tej sekcji już nie zmieniać. Stan zatwierdzony jest otagowany w git:
`zatwierdzone/hero-strona-glowna`.

**Zasada:** sekcji 01 nie dotykasz — ani „przy okazji" innej zmiany, ani w ramach porządków,
ani optymalizacji. Jeżeli jakieś zadanie wymaga ruszenia hero, **zatrzymaj się i zapytaj
właściciela**, tak jak przy sprzeczności z `instructions/` (§0). To dotyczy również zmian
pośrednich: tokenów, od których hero zależy, i reguł globalnych, które na nie wpływają.

Co dokładnie jest zamrożone — `src/css/sections/hero.css` i blok hero w `index.html`:

- blok tekstu podniesiony ponad oś kadru (`--space-hero-lift`), żeby czarna typografia leżała
  na jasnej ścianie, a nie na postaciach i blacie;
- wezwanie `Sprawdź grupy i ceny` opuszczone o `--space-hero-cta-drop` względem reszty bloku,
  z kompensacją w `--space-hero-lift` — dzięki niej opuszczenie przycisku nie rusza wordmarku,
  nagłówka ani leadu;
- lead łamany na **cztery** wiersze (`max-inline-size: 46ch`);
- nagłówek: po jednym zdaniu w wierszu, dwa wiersze;
- prawa granica całego tekstu: `--measure-hero-safe: 40vw`.

Pilnuje tego `tests/e2e/hero.spec.js` na macierzy 1280–1920 px. Czerwony test w tym pliku
oznacza, że zatwierdzony układ się rozjechał — naprawiasz kod, **nie** asercję.

### D8 — sekcja 02 po lekcjach jest zamknięta

Właściciel zatwierdził sekcję **14.09.2026**, tego samego dnia co hero, i poprosił, żeby jej
już nie zmieniać — **także przy pracy nad innymi sekcjami**. Stan otagowany w git:
`zatwierdzone/po-lekcjach`.

Obowiązuje ta sama zasada co przy D7: sekcji nie dotykasz ani „przy okazji”, ani w ramach
porządków, ani optymalizacji. Jeżeli zadanie wymaga ruszenia sekcji 02, **zatrzymaj się
i zapytaj właściciela**.

Co jest zamrożone — `src/css/sections/after-school.css` i blok `#po-lekcjach` w `index.html`:

- **wszystkie przerwy między blokami mają identyczną wysokość.** Jedynym ich źródłem jest
  `gap` w `.after-school__text`; żaden blok nie dokłada własnego marginesu. Puenta straciła
  swój dodatkowy odstęp i **nie wolno go przywracać**;
- puenta `Mniej wożenia…` stoi w **dwóch** wierszach, z podziałem po „pośpiechu,” —
  pilnuje tego miara `24ch`, policzona na podstawie szerokości obu wariantów wiersza;
- hasło sekcji zostaje w rejestrze plakatowym (`clamp(2.125rem, 6.05vw, 5.125rem)`);
- treści akapitów mają twarde spacje zgodne z regułą łamania wierszy z §5.

Wymóg „zdanie kończące sekcję mieści się w dwóch wierszach” **już nie obowiązuje** — zniknął
razem z krótszą treścią, którą właściciel wymienił. Nie przywracaj go.

Pilnuje tego `tests/e2e/po-lekcjach.spec.js` na macierzy 1280–1920 px. Czerwony test w tym
pliku oznacza, że zatwierdzony układ się rozjechał — naprawiasz kod, **nie** asercję.

### D9 — sekcja 03 co dziecko zyskuje jest zamknięta

Zatwierdzona **14.09.2026**, jako trzecia po hero i „Po lekcjach”. Otagowana jako
`zatwierdzone/korzysci`. Obowiązuje ta sama zasada co przy D7 i D8: sekcji nie dotykasz
ani „przy okazji”, ani w ramach porządków. Jeżeli zadanie tego wymaga — zapytaj właściciela.

Co jest zamrożone — blok `#korzysci` w `index.html` i `src/css/sections/benefits.css`:

- trzy korzyści w pierwszej osobie (`Mówię więcej.`, `Rozumiem więcej.`, `Czuję się pewniej.`)
  w dokładnie tym brzmieniu, jakie stoi w teście;
- twarde spacje zgodne z regułą łamania wierszy z §5 — właściciel zgłosił tu wiszące `do`;
- marquee zostaje **dekoracją** z `aria-hidden="true"`; treść niesie nagłówek sekcji;
- czerwony akt, zero obrazów i ikon, zero kart — §7 i §8.

Pilnuje tego `tests/e2e/korzysci.spec.js` na macierzy 1280–1920 px.

### D10 — sekcje 04 nasza oferta i 06 jak uczymy są zamknięte

Zatwierdzone **14.09.2026**. Tagi: `zatwierdzone/oferta` i `zatwierdzone/metoda`.

Co jest zamrożone:

- **04:** cztery drogi w tej kolejności, z tymi adresami i etykietami; wspólny język wskazania
  z mega-menu (`.offer-mark` — czerwony numer, strzałka 7 px); krem, zero kart;
- **06:** `MÓW PRÓBUJ POPRAWIAJ UŻYWAJ` bez kropek i bez błędnego „MÓWIJ” (ADR 0009);
  pięć kroków lekcji w tej kolejności; czarny akt bez fotografii; odstęp między etykietą
  sekcji a pierwszym czasownikiem.

**Otwarte, do decyzji właściciela:** pierwsza pozycja oferty nazywa się inaczej w menu
(`Klasy 1-7`) niż w sekcji 04 (`Dla dzieci`). Pozostałe trzy zostały kiedyś ujednolicone
na polecenie właściciela. Test porównuje adresy i trzy ujednolicone etykiety, ale **nie
przesądza** tej jednej — nie zmieniaj jej samodzielnie.

Pilnuje tego `tests/e2e/oferta-metoda.spec.js`.

### D11 — sekcja 05 o High Five jest zamknięta

Zatwierdzona **14.09.2026** po najdłuższej serii poprawek w całym projekcie. Tag:
`zatwierdzone/o-high-five`.

Co jest zamrożone:

- miara akapitów **75ch** i kolumna tekstowa na **ośmiu** z dwunastu pól siatki;
- kadr Magdaleny Germel kończy się **równo z dołem kolumny tekstowej** i zwęża się od lewej,
  gdy tekst jest krótszy; prawa krawędź stoi na krawędzi okna — wspólna oś ze zdjęciami hero
  i sekcji 02;
- odstęp nad paskiem faktów: **2 px** łącznie z `gap` kolumny (`calc(0.125rem - var(--space-4))`);
- `--space-about-anchor: 1.25rem` — po skoku z menu pasek faktów mieści się w ekranie.

Trzy pułapki zapisane w `about.css`, żeby nikt ich nie powtórzył:

1. `align-self: stretch` na kadrze jest **błędnym kołem** — jako element siatki kadr sam
   współtworzy wysokość wiersza. Stąd pozycjonowanie bezwzględne.
2. `inset-block: 0` **i** `block-size: 100%` naraz to nadmiar — wygrywa procent liczony
   w chwili układu, więc kadr bywał o wiersz za krótki. Wysokość ma wynikać z samych `inset`.
3. Kadr pozycjonowany bezwzględnie **nic go nie zatrzymuje przed wejściem na tekst** —
   dlatego ma limit szerokości czterech pól siatki. Cena: przy oknie poniżej ~1400 px kadr
   bywa niższy niż kolumna i dolne krawędzie się nie spotykają. To świadomy kompromis —
   nachodzenie na treść jest gorsze niż nierówna krawędź.

**Opis przepisany 18.09.2026 na polecenie właściciela** — sekcja była zamknięta,
zgoda padła wprost. Co się zmieniło i co z tego wynika:

- **cztery akapity zamiast trzech:** lead → wykształcenie i doświadczenie → sposób
  pracy → zespół i współpraca. Treść pochodzi od właściciela co do słowa;
- **mocniejszy jest WYŁĄCZNIE lead** (waga 500, stopień +7%). Przez chwilę stały
  w akapitach 2–4 pogrubione fragmenty, ale właściciel je zdjął tego samego dnia:
  cztery akcenty pod rząd czytały się jak katalog kwalifikacji, a nie jak opowieść.
  **Nie przywracaj ich;**
- **waga 500, nie 600:** z tekstowego Intera self-hostujemy tylko Regular 400
  i Medium 500 (§7). Każda wyższa wartość to sztuczne pogrubienie przez przeglądarkę;
- **odstęp między akapitami 24 px** dokładany tylko tam, gdzie akapit stoi po akapicie.
  `gap` kolumny zostaje 16 px, bo jest wliczony w ujemny margines paska faktów;
- **nagłówek `Lokalna szkoła. Dużo uwagi.` stoi w JEDNYM wierszu** na desktopie —
  miara `14ch` zniknęła;
- **miara akapitów zostaje 75ch.** Właściciel prosił o 55–65 znaków w wierszu, ale
  przy 60ch kolumna rośnie o cztery wiersze i **kadr Magdaleny kończy się 117 px nad
  dołem tekstu** — a to jest właśnie ta geometria, która jest tu zatwierdzona. Wybór
  między długim wierszem a nierówną krawędzią należy do właściciela i nadal czeka.

Pilnuje tego `tests/e2e/o-high-five.spec.js` na macierzy 1280–1920 px.

### D12 — sekcja 07 cennik · klasy 1-7 jest zamknięta

Zatwierdzona **15.09.2026** po przebudowie obu paneli według obrazu referencyjnego
właściciela. Tag: `zatwierdzone/cennik`.

Co jest zamrożone — blok `#cennik` w `index.html` i `src/css/sections/pricing.css`:

- **panel A:** nagłówek `Prosta cena.`, ceny `55` i `50` w jednostce
  `zł / 45 min`, przypis `Podane ceny dotyczą regularnych zajęć grupowych dla klas 1-7
w SP 402.` — **bez odnośnika**. Nagłówek skrócił się 16.09.2026: właściciel zdjął
  `Bez abonamentu.` mimo zamknięcia sekcji i wyraził na to zgodę wprost. Zdanie o braku
  stałej opłaty niesie dalej panel B, więc treść niczego nie straciła;
- **panel B:** nagłówek `Płacisz za zajęcia, które się odbywają.` i trzy zasady z tytułem
  oraz jednym zdaniem wyjaśnienia (`Bez stałej miesięcznej opłaty`, `Bez opłat za dni wolne`,
  `Grupa rusza od 5 osób`);
- **dokładnie jeden** odnośnik do `/cennik/` w całej sekcji: `Zobacz cennik wszystkich zajęć →`,
  z podpisem `Kurs egzaminacyjny · seniorzy · online 1 na 1`. Wcześniej to samo wezwanie padało
  dwa razy — **nie przywracaj drugiego**;
- stopnie pisma liczone z jednego tokenu `--step-cennik`: nagłówek panelu A i ceny biorą go
  wprost, hasło panelu B jako `calc(--step-cennik * 0.88)`. Relacja między nimi jest zapisana
  w kodzie, więc zmiana tokenu przesuwa wszystkie trzy i proporcja zostaje.

`--step-cennik` jest **osobnym** tokenem, nie `--step-display`: tamten niesie także nagłówki
sekcji 08, 11 i 12, więc jego zmiana ruszyłaby cztery sekcje naraz.

**Zmiana z 19.09.2026 — kreski pod cenami zdjęte.** Nad podpisami `Pierwsze dziecko`
i `Drugie i każde kolejne dziecko z rodzeństwa` stała cienka linia; dzieliła cenę
i jej opis na dwa bloki, przez co panel czytał się jak tabela, a nie jak plakat.
Właściciel polecił ją zdjąć mimo zamknięcia sekcji. **Odstęp 16 px został bez zmian** —
to on trzymał podpis pod cyfrą, nie kreska, więc geometria panelu się nie ruszyła.
**Kreska nad przypisem cenowym zostaje**: oddziela cały panel od drobnego druku.

Pilnuje tego `tests/e2e/pricing.spec.js`.

### D13 — sekcja 12 kontakt jest zamknięta

Zatwierdzona **15.09.2026**. Tag: `zatwierdzone/kontakt`.

Co jest zamrożone — blok `#kontakt` w `index.html` i `src/css/sections/contact.css`:

- kolejność: nagłówek → lead → dwa kanały kontaktu → wezwanie → metryczka firmy;
- dane rejestrowe co do znaku, z etykietami `Firma`, `NIP`, `REGON`, **`Działamy od`**
  (etykieta zmieniona przez właściciela z samego `Od`);
- te same dane w JSON-LD (`legalName`, `taxID`, `foundingDate`) — rozjechanie ich to błąd,
  nie kosmetyka;
- **telefon jako zwykły tekst, nie odnośnik** — wyjątek opisany w D2; klikalny `tel:` zostaje
  w stopce na wszystkich dziewięciu stronach;
- metryczka jest cichsza niż wezwanie: stopień `.legal__value` mniejszy niż `.contact__value`.

Pilnuje tego `tests/e2e/kontakt.spec.js`.

### D14 — sekcja 08 nabór 2026 jest zamknięta

Zatwierdzona **16.09.2026** po trzech przebudowach. Tag: `zatwierdzone/nabor`.

Sekcja miała jeden warunek nadrzędny, postawiony przez właściciela wprost i powtórzony
po drugiej nieudanej próbie: **cała sekcja — od etykiety, przez nagłówek i liczby, po
wezwanie — ma mieścić się w jednym ekranie desktopowym.** Wezwanie nie może być ucięte
dolną krawędzią. To nie estetyka, tylko warunek odbioru.

Co jest zamrożone — blok `#nabor` w `index.html` i `src/css/sections/enrollment.css`:

- nagłówek `5 dzieci i startujemy.` w **dwóch** wierszach, z czerwoną kropką jako jedynym
  akcentem koloru w typografii sekcji. Brzmienie zastąpiło `Grupa rusza od piątego dziecka.`,
  ale niesie ten sam **warunek stały** — sekcja zostaje na stronie po 1 października;
- nagłówek bierze **własny** stopień, nie `--step-display`: tamten token niesie także
  sekcje 11 i 12, a dwunastka jest zamknięta (D13);
- kolumny są przypisane **wprost** (1 · 2 · 3). Element z definitywnym wierszem jest
  układany przed elementami bez niego, więc przy `grid-column: auto` kolumna statusu
  lądowała pierwsza od lewej — to już wystąpiło;
- kreski pod podpisami liczb stoją na **jednej osi** dzięki `grid-template-rows: subgrid`.
  Równość wynika z układu, nie z dobranego marginesu, więc przetrwa zmianę stopnia pisma;
- rok `2026` jest podporządkowany dacie: połowa stopnia, 48% krycia;
- pionowe krawędzie mają 12% bieli, nie pełną moc `--color-rule` — przy pełnej sekcja
  czytała się jak arkusz kalkulacyjny.

**Interlinia nagłówka nie schodzi poniżej `--leading-caps`.** Stała tu przez chwilę na
0.95 i wyglądała zwarcie, ale padding anty-clippingowy broni tylko pierwszego wiersza
przed maską reveal — nie ma nic wspólnego z odległością **między** wierszami. Wyłapał to
`tests/e2e/polish-caps.spec.js` i miał rację.

Pilnuje tego `tests/e2e/nabor.spec.js` na macierzy 1280–1920 px.

### D15 — sekcja 09 lokalizacje jest zamknięta

Zatwierdzona **16.09.2026**. Tag: `zatwierdzone/lokalizacje`.

Co jest zamrożone — blok `#lokalizacja` w `index.html`:

- wezwanie `Wyznacz trasę` używa wariantu **`cta--ink`**, tego samego co `Sprawdź grupy
i ceny` w hero: czarne tło, jasna czcionka marki, czerwień sygnałowa po najechaniu.
  Wcześniej był to przycisk obrysowy `cta--ghost`;
- to **ten sam wariant komponentu**, a nie skopiowane style — dzięki temu oba przyciski
  nie mogą się rozjechać. Wariantu `cta--ink` nie wolno zmieniać: niesie także hero (D7);
- `cta--ghost` **zostaje** w arkuszu, bo stoi jeszcze w pięciu miejscach na podstronach.
  Na stronie głównej nie ma już żadnego przycisku obrysowego;
- odnośnik prowadzi do trasy Google Maps na adres SP 402 i otwiera się w nowej karcie
  z `rel="noopener"`.

Pilnuje tego `tests/e2e/lokalizacja.spec.js`.

### D16 — sekcja 10 dodatkowo · seniorzy jest zamknięta

Zatwierdzona **16.09.2026** po przebudowie z jednej grupy na trzy poziomy, według obrazu
referencyjnego właściciela. Tag: `zatwierdzone/seniorzy`.

Dwie rzeczy są w tej sekcji wrażliwe i obie wynikają z wyraźnego polecenia:

1. **Nigdzie nie wolno podać granicy wieku.** Nazwa oferty zostaje — `Angielski dla
seniorów` — ale `60+` i każda inna dolna granica są zakazane. Kurs ma być czytelny
   także dla osoby po pięćdziesiątce; „seniorzy" to nazwa oferty, nie kategoria wiekowa.
2. **Trzy poziomy są równorzędne.** Żaden nie jest domyślny, żaden nie dostaje własnego
   tła, obrysu ani koloru. Wyróżnienie jednego czytałoby się jak sugestia wyboru.

Co jest zamrożone — blok `#seniorzy` w `index.html` i `src/css/sections/seniors.css`:

- nagłówek `Angielski dla / seniorów.` w dwóch wierszach, we własnym stopniu;
- trzy poziomy w tej kolejności i brzmieniu: `Początkująca`, `Podstawowa`,
  `Średniozaawansowana`, każdy jako numer → nazwa → cienka kreska → opis;
- kolumny **równe co do piksela**: kreska dzieląca jest pseudoelementem w połowie rynny,
  a nie obramowaniem z paddingiem, który zabierałby szerokość dwóm z trzech kolumn;
- **zero kart.** Projekt referencyjny obrysowywał każdy poziom zaokrąglonym prostokątem —
  tego świadomie nie przenieśliśmy: §7 ustawia promień narożnika na 0 i dopuszcza kapsułę
  wyłącznie dla CTA, a §8 wymienia siatkę kart jako anty-wzorzec;
- kadr Terminalu jest o **10% mniejszy** od pełnej prawej połowy siatki, ale zwężenie idzie
  wyłącznie od lewej: prawa krawędź stoi na krawędzi okna, na wspólnej osi ze zdjęciami
  hero i sekcji 02. Wysokość bloku pod kadrem wynika z tego automatycznie — kadr jest
  wyższy od kolumny tekstowej, więc to on wyznacza wysokość górnego bloku;
- sekcja ma **niższe niż domyślne** odstępy pionowe. Rytm sekcji jest w tym projekcie
  celowo zmienny, a ten moduł niesie cztery piętra treści.

**Przebudowa 19.09.2026 — sekcja jest ZAPOWIEDZIĄ, nie katalogiem.** Właściciel
zlecił ją wprost wraz z projektem referencyjnym, mimo zamknięcia sekcji:

- **trzy karty poziomów zeszły z tej sekcji** na `/oferta/seniorzy/` (D20).
  Została po nich jedna linia `3 poziomy · od podstaw do średniozaawansowanego`,
  wersalikami, z krótką kreską przed tekstem. **Nie przywracaj rozpiski tutaj;**
- **lead nie mówi już o „60+"** — zastąpiło je brzmienie bez granicy wieku,
  więc zakaz z tej decyzji jest dziś spełniony także w treści, nie tylko w duchu;
- **kadr Terminalu nie jest przycinany:** proporcja pudełka równa się proporcji
  pliku (750×518). Stała tu klasa `media--16-9`, czyli 1.78 wobec 1.45 źródła —
  `object-fit: cover` zdejmował górę kadru razem z literą „T" neonu;
- **lewa i prawa kolumna to OSOBNE STOSY**, nie wiersze wspólnej siatki. Przy
  wierszach wyższy kadr spychał linię o poziomach i wezwanie w dół; teraz zdjęcie
  może rosnąć, a tekst po lewej zostaje na swojej wysokości;
- **dopisek `Zapisy i szczegóły na stronie Terminala.`** stoi pod kadrem, przy
  prawej krawędzi siatki (nie okna), poprzedzony pionową kreską. To zdanie, nie
  drugie wezwanie — zapisy prowadzi Terminal, więc strona główna nie ma czego
  obiecywać;
- **jedno wezwanie** `Zobacz zajęcia dla seniorów` prowadzące na `/oferta/seniorzy/`.

Pilnuje tego `tests/e2e/seniorzy.spec.js`.

### D17 — podstrona `/cennik/` jest zamknięta

Zatwierdzona **16.09.2026** po przebudowie według obrazu referencyjnego właściciela.
Tag: `zatwierdzone/cennik-podstrona` — **nie mylić z `zatwierdzone/cennik`**, który
oznacza sekcję 07 strony głównej (D12).

**Jedyny dopuszczony wyjątek: podmiana odnośników.** Jeżeli zmieni się adres którejś
podstrony ofertowej, wolno poprawić `href` na cenniku i asercję w teście. Każda inna
zmiana — treść, układ, stopnie pisma, kolory — wymaga decyzji właściciela.

Co jest zamrożone — `cennik/index.html` i `src/css/pages/cennik.css`:

- **cztery kolory marki jako sekwencja aktów:** beż (hero), beż (klasy 1-7),
  granat (zasady rozliczeń), czerń (pozostałe zajęcia), czerwień (wezwanie).
  To jedyna strona w serwisie, która używa całej palety;
- **cztery stawki obok siebie** — `55` i `50` zł / 45 min, `80` zł / 90 min,
  `45` zł / 60 min, `120` zł / 60 min. `55` jest jedynym akcentem czerwieni
  w typografii cennika;
- **nie wraca „cena nieustalona" ani „60+"** — obie frazy stały tu wcześniej;
- **zasady rozliczeń w trzech punktach**: `Rozliczenie z góry`, `Bez stałego ryczałtu`,
  `Korekta w kolejnym miesiącu`. Rozliczenie idzie **z góry** — nie upraszczaj tego
  do „płacisz tylko za odbyte zajęcia", właściciel odrzucił to wprost;
- **prawa kolumna hero** odwzorowana z projektu: etykieta, krótka kreska i hasło
  z czerwoną kropką. Pionowa krawędź biegnie od pierwszego wiersza nagłówka do
  ostatniego wiersza przypisu — nie dotyka poziomych krawędzi pasa. Wynika to
  z **układu** (etykieta stoi w osobnym wierszu siatki), nie z dobranych wartości;
- **zero kart** — żadnych zaokrągleń poza kapsułą wezwania;
- kolumny w trzech gridach są **równe co do piksela**;
- **stopka jest dokładnie ta sama co na pozostałych stronach.** Projekt referencyjny
  miał własną — właściciel polecił ją zignorować w całości.

Dwie pułapki zapisane w kodzie, żeby nikt ich nie powtórzył:

1. `<hr>` dostaje od przeglądarki `margin-inline: auto`. Krótka kreska w hero stała
   przez to na środku kolumny zamiast równo z lewą krawędzią liter — stąd jawne
   `margin-inline: 0`.
2. Nagłówek strony i nagłówek sekcji 01 mają być **tej samej wielkości**. Biorą
   wartość z jednego tokenu `--step-cennik-claim`, a nie z dwóch clampów
   ustawianych równolegle.

Pilnuje tego `tests/e2e/cennik.spec.js`.

### D18 — podstrona `/oferta/dzieci/` jest zamknięta

Zatwierdzona **17.09.2026** po przebudowie zamknięcia strony według obrazu referencyjnego
właściciela. Tag: `zatwierdzone/dzieci`.

Zamiast zwykłego bloku kontaktowego z kapsułą stoi tu **czerwony akt ZAPISÓW**, a wezwanie
z nagłówka strony celuje w jego kotwicę zamiast odsyłać na stronę główną.

Co jest zamrożone — `oferta/dzieci/index.html`, `src/css/pages/dzieci.css`
i **wspólny komponent `src/css/components/enroll.css`**:

Wygląd **i rytm** sekcji przeniosły się do komponentu 18.09.2026, gdy tę samą
sekcję dostały podstrony egzaminacyjna i senioralna. Właściciel wyraził zgodę
na obie operacje wprost, mimo że ta strona była już zamknięta.

`pages/dzieci.css` trzyma odtąd wyłącznie **skalę typografii** — nagłówek jest
tu największy w trójce, bo zdanie ma tylko szesnaście znaków. **Odstępów nie
ustawia się już w warstwie strony**: wszystkie trzy sekcje mają wspólny rytm,
którego wzorcem jest podstrona egzaminacyjna (D19). Zmiana w komponencie
dotyka trzech stron naraz, więc po każdej uruchom wszystkie trzy zamki.

- sekcja `#zapisy-klasy-1-7` na czerwieni marki, zamykająca `<main>` tuż nad stopką:
  etykieta → plakatowy nagłówek `Gotowi na start?` → dwuwierszowy lead → trzy drogi
  kontaktu → jedna wspólna kreska → zdanie o odpowiadaniu mailem;
- **w tej sekcji NIE MA przycisku.** Dane kontaktowe mają być dostępne od razu, a nie
  za kolejnym klikiem — warunek postawiony przez właściciela wprost;
- nagłówek **wypełnia szerokość siatki** i stoi w jednym wierszu. Poniżej 85 % przestaje
  być plakatem, powyżej 100 % ucina go `overflow-x: clip` sekcji;
- trzy kolumny **równe co do piksela**, każda z własną kreską u góry; kreska jest
  obramowaniem elementu, nie osobnym `<hr>`, więc na wąskim ekranie schodzi razem
  ze swoją parą etykieta–wartość;
- **osobny adres zapisowy** `highfive.zapisy@gmail.com`, wpisany wprost, nie przez
  `{{EMAIL}}` — patrz wyjątek w D6. Ogólny adres serwisu stoi dalej w stopce tej samej
  strony i **nie wolno ich ujednolicać**;
- godziny `17:00–21:00` z **półpauzą** — to zakres, nie łącznik.

**Droga zapisu jest jedna.** W hero stało drugie wezwanie o tej samej nazwie
(`Zapisz dziecko`) prowadzące na `/#kontakt`, czyli w zupełnie inne miejsce niż wezwanie
z nagłówka. Właściciel kazał je zdjąć 17.09.2026 — **nie przywracaj go**. Wszystkie
wezwania `Zapisz dziecko` na tej stronie celują dziś w `#zapisy-klasy-1-7`.

**Cel wezwania zmienił się WYŁĄCZNIE tutaj.** Mapa `CTA` w `src/data/offers.mjs` jest
kluczowana ścieżką pliku, więc wystarczyła jedna wartość. Nie wpisuj tej kotwicy globalnie:
pozostałe osiem stron celowałoby w sekcję, której u siebie nie ma.

`scroll-margin-block-start` sekcji **odejmuje jej własny odstęp** od globalnej wartości
z `base/reset.css` — bez tego etykieta lądowała pół ekranu niżej niż czerwona krawędź.
Ten sam zabieg co w sekcjach 05 i 12 strony głównej.

**Trzy zmiany z 18.09.2026, wszystkie na polecenie właściciela:**

- **dopisek o współpracy pod leadem hero** — osobny akapit, mniejszy stopień,
  62% krycia, bez ramki, tła, ikony i kursywy. Odstęp 16 px na desktopie liczony
  **z odjęciem** 24-pikselowego `gap` kolumny hero. Bez danych rejestrowych partnera;
- **wezwanie `Zobacz lokalizacje` zeszło na wariant `cta--ink`** (czarne tło);
- **odstępy nad blokami z kreskami.** Listy kroków i cennika noszą w HTML klasę
  `u-mt-8`, **której nie ma w żadnym arkuszu serwisu** — nigdy nie powstała. Etykieta
  stała 0 px nad kreskami, a nagłówek cennika wchodził na nie o 5 px. Odstęp dostały
  te dwa bloki i tylko na tej stronie; osobna reguła daje też 24 px między etykietą
  `CENNIK` a nagłówkiem, bo nagłówki mają w serwisie wyzerowane marginesy.

Pilnuje tego `tests/e2e/dzieci.spec.js`.

### D19 — podstrona `/oferta/egzamin-osmoklasisty/` jest zamknięta

Zatwierdzona **18.09.2026**. Tag: `zatwierdzone/egzamin`.

Zamknięcie strony przebudowane z bloku „Chcesz dołączyć?" na **czerwony akt
ZAPISÓW** `#zapisy-egzamin-osmoklasisty`, a wezwanie z nagłówka celuje w jego
kotwicę zamiast odsyłać na stronę główną.

**Ta strona jest WZORCEM RYTMU dla wszystkich trzech sekcji zapisów.**
Właściciel wskazał ją wprost i kazał dociągnąć do niej pozostałe dwie. Odstępy
żyją w `components/enroll.css`; warstwy stron ustawiają wyłącznie skalę
typografii. Test `trzy sekcje zapisow maja ten sam rytm wewnetrzny`
w `tests/e2e/egzamin.spec.js` porównuje trzy strony między sobą.

Co jest zamrożone — `oferta/egzamin-osmoklasisty/index.html` i część
„06 ZAPISY" w `src/css/pages/egzamin.css`:

- sekcja zamyka `<main>` tuż nad stopką, **bez przycisku**;
- nagłówek `Masz pytanie o grupę?` w **jednym wierszu** na pełną szerokość
  siatki; stopień jest mniejszy niż na stronie klas 1-7, bo zdanie jest dłuższe;
- trzy drogi kontaktu z **ogólnym** adresem serwisu — w odróżnieniu od
  `/oferta/dzieci/`, która ma własny adres zapisowy (D6, D18);
- w hero **nie ma** drugiego wezwania; wszystkie `Zapytaj o grupę` na tej
  stronie celują w tę samą kotwicę.

Dwie pułapki zapisane w kodzie:

1. **Padding pasa musi być powtórzony pod kotwicą strony.** Scoped
   `[data-page='egzamin'] .section` ma wyższą specyficzność niż klasa
   komponentu i cicho go nadpisywał — pas trzymał 57,6 px zamiast 43 px,
   a skok z menu zatrzymywał się 73 px pod nagłówkiem zamiast 16 px.
2. **Dolny margines etykiety jest wyzerowany.** Wspólna reguła
   `.section__label` tej podstrony daje 32 px, a marginesy sąsiadów się
   sklejają — wygrywa większa z dwóch wartości, więc zmniejszanie marginesu
   nagłówka nie mogło zadziałać.

**Dwie zmiany z 18.09.2026, obie na polecenie właściciela:**

- **nagłówek hero bierze wspólny stopień** `clamp(2rem, 5.4vw, 4.25rem)`, ten sam co
  podstrona senioralna — 68 px przy oknie 1440 zamiast wcześniejszych 52 px. Hasło ma
  pięć wierszy i mieści się w ekranie (hero kończy się na 701 px przy oknie 900).
  `Next step.` **zostaje**: właściciel zdjął je i tego samego dnia przywrócił;
- **etykiety sekcji straciły poziomą kreskę.** Ta strona była jedynym miejscem
  w serwisie, gdzie etykieta zamieniała się w siatkę `auto 1fr`, a pseudoelement
  ciągnął linię 1 px do prawej krawędzi. Zdejmowanie jej połowicznie — najpierw
  w hero — dało stronie dwa rodzaje etykiet naraz, więc kreska zniknęła wszędzie.
  **Odstęp 32 px pod etykietami został**: tworzył go margines, nie kreska.

**19.09.2026 — numery i kreski w „Co obejmuje kurs?".** Numery obszarów zeszły
z drobnego stopnia etykiety na rejestr kroków (43 px, 40% krycia), a moduły
dostały **poziomą kreskę u góry** i **straciły pionowe kreski** między kolumnami.
Właściciel rozstrzygnął, że wyliczenia na kremowym tle mają w całym serwisie
wyglądać tak samo. **Wyliczenia na innych tłach zostają nietknięte** — czarny pas
„Jak pracujemy?" ma nadal własne, większe numery i kreski pionowe.

Pilnuje tego `tests/e2e/egzamin.spec.js`.

### D20 — podstrona `/oferta/seniorzy/` jest zamknięta

Zatwierdzona **18.09.2026**. Tag: `zatwierdzone/seniorzy-podstrona` —
**nie mylić z `zatwierdzone/seniorzy`**, który oznacza sekcję 10 strony
głównej (D16). Z tego samego powodu zamek nazywa się
`tests/e2e/oferta-seniorzy.spec.js`, a nie `seniorzy.spec.js`.

**To jedyna z trzech sekcji zapisów, która MA przycisk** — i jest to decyzja
merytoryczna, nie estetyczna: zapisów na te zajęcia **nie prowadzi High Five,
tylko Terminal Kultury**. Wezwanie nie jest więc drugim „napisz do nas", tylko
przejściem tam, gdzie decyzja faktycznie zapada.

Co jest zamrożone — `oferta/seniorzy/index.html` i `src/css/pages/seniorzy.css`:

- sekcja `#zapisy-seniorzy` zamyka `<main>` tuż nad stopką;
- nagłówek `Zapisy prowadzi Terminal.` w jednym wierszu, lead w dwóch;
- **jeden przycisk**, prowadzący na stronę Terminala Kultury w nowej karcie
  z `rel="noopener noreferrer"`. Adres nie został wymyślony — to ten sam
  odnośnik, który stoi wyżej na tej stronie. **Nie kieruj go na kontakt
  High Five**: strona obiecywałaby zapisy, których nie przyjmuje;
- pierwsza kolumna jest **tekstem, nie odnośnikiem** (`przez stronę Terminala
Kultury Gocław`) — w sprawie zapisów ma być jeden cel kliknięcia;
- **w sekcji nie ma adresu e-mail.** Ogólny adres serwisu stoi dalej w stopce;
- wezwanie w nagłówku brzmi **`Zapytaj o zajęcia`**, nie `Zapytaj o miejsce`:
  obietnica miejsca była mocniejsza, niż ta strona może dowieźć;
- w hero **nie ma** wezwania — stało tam `Zapytaj o miejsce` prowadzące na
  `/#kontakt`, czyli do High Five.

**Kadr hero podmieniony 18.09.2026** — nowe źródło `sections/seniors-class-1448.png`
dostarczył właściciel. Te same wymiary 1448×1086 (4:3), więc `width`/`height` w HTML
i geometria strony zostają bez zmian. **Pełna klatka 4:3 jest celowa:** na telefonie
pas ma dokładnie tę proporcję i pokazuje ją w całości, a na desktopie pudełko ma
702×736 px i `object-fit: cover` zabiera po ~14% szerokości z każdej strony. Plik
przycięty do kształtu desktopowego telefon obciąłby drugi raz — od góry i dołu.

**Zmiany z 19.09.2026, wszystkie na polecenie właściciela:**

- **sekcja „Szczegóły · Zajęcia w liczbach" przebudowana.** Metryka mówi dziś
  `Prowadzi · Dostępne grupy · Koszt` zamiast `Prowadzi · Poziom · Koszt`,
  bo oferta ma trzy grupy, a nie jedną początkującą; koszt podany z jednostką
  `45 zł / 60 min` zgodnie z §3. Pod metryką stoi **pełna rozpiska trzech
  poziomów**, która zeszła tu ze strony głównej (D16);
- **poziomy NIE są kartami.** Projekt referencyjny obrysowywał je zaokrąglonym
  prostokątem i przez chwilę tak stało — właściciel cofnął to tego samego dnia.
  Została sama kreska u góry, jak w krokach i kolumnach reszty serwisu (§7, §8);
- **numery poziomów są duże i przygaszone** (40% krycia), w rejestrze kroków
  z `/oferta/dzieci/`, a nie małe i granatowe;
- **zdanie o rozliczeniu miesięcznym zostało zdjęte.** Zasady organizacyjne
  prowadzi Terminal i to jego strona ma być ich źródłem. Ten fakt z §3 nie stoi
  już nigdzie w serwisie — jeśli ma wrócić, to na `/cennik/`;
- **wezwanie do Terminala przeniesione w prawy dolny róg sekcji zapisów**,
  na wspólną linię z przypisem. Układ żyje w warstwie strony, bo to jedyna
  z sekcji zapisów, która ma przycisk;
- **przycisk „Zobacz jak dojechać" na czarnym wariancie** `cta--ink`. To było
  ostatnie wystąpienie obrysowego `cta--ghost` w całym serwisie;
- **odstępy nad blokami z kreskami** — ta sama martwa klasa `u-mt-8` co na
  pozostałych podstronach, poprawiona w czterech miejscach na tej stronie.

Pilnuje tego `tests/e2e/oferta-seniorzy.spec.js`.

### D21 — podstrona `/polityka-prywatnosci/` jest zamknięta

Zatwierdzona **19.09.2026**. Szczegóły decyzji: **ADR 0011**.

**Treść jest dokumentem prawnym, nie copy.** Pochodzi co do słowa
z `Polityka_prywatnosci_High_Five_v1.0.pdf`. Nie skracaj jej, nie parafrazuj
i nie poprawiaj stylistycznie — nawet tam, gdzie brzmi nietypowo (wtrącenia mają
w źródle dywiz zamiast półpauzy; zostawiamy). **Zmiana treści na stronie oznacza
zmianę dokumentu źródłowego, nie odwrotnie.**

Co jest zamrożone — `polityka-prywatnosci/index.html`, blok `.policy*`
w `components/page-sections.css` i `src/js/modules/policy-toc.js`:

- **osiemnaście sekcji** z numerem w tytule (`1. Kto jest administratorem danych?`).
  Nad nagłówkiem **nie stoi drugi, drobny numer** — właściciel kazał go zdjąć jako
  powtórzenie;
- **spis treści jest nawigatorem, nie listą w pudełku:** zero ramki, tła i poziomych
  kresek między pozycjami. Porządek niesie **pionowa oś** z drobnymi punktami
  podziałki, a czytana sekcja zapala na niej **czerwony odcinek 3 px**. Dwa piksele
  czytały się jak pogrubiona kreska osi, a nie jak kolor;
- **etykieta `SPIS TREŚCI` nie przewija się razem z listą** — przewijanie siedzi
  na `.policy-toc__nav`, nie na całym spisie. Suwak jest ukryty, ale działa;
- rejestr dokumentu jest **cichszy niż reszta serwisu**: tekst 17 px / 1.65,
  nagłówek rozdziału 28 px, śródtytuł 21 px, kolumna czytania 1120 px.

Trzy pułapki zapisane w kodzie, żeby nikt ich nie powtórzył:

1. Globalna reguła `p:not([class])` z `base/typography.css` narzuca akapitom
   `--measure`, czyli 544 px. Dla dokumentu czytanego ciągiem to o połowę za wąsko —
   stąd jawne `max-inline-size: none` w warstwie strony.
2. Reset `ul[class]` zeruje punktory i wcięcie, a ma **wyższą specyficzność**
   niż sama klasa. Wyliczenia czytały się przez to jak luźne akapity; selektor
   musi brać nazwę elementu (`ul.policy__list`).
3. Znacznik czytanej sekcji **nie może pozycjonować się przez `offsetTop`** —
   ten odnosi się do najbliższego przodka z `position`, a każda pozycja listy jest
   `relative`. Wychodziły stałe 2 px zamiast kilkuset. Liczymy względem obszaru
   przewijania.

**Spis sam dosuwa czytaną pozycję do kadru** — przewijając `scrollTop` listy,
nigdy przez `scrollIntoView`: tamto przesuwa każdego przewijalnego przodka, więc
razem ze spisem skakałaby cała strona.

**Strona nie ma wezwania w nagłówku** (`CTA: null` w `src/data/offers.mjs`).
W pasku zostaje po nim pusta przegrodka o szerokości przycisku — bez niej
`space-between` odsyła menu o 463 px na prawy skraj.

### D2 — mechanika i konsekwencje

CTA `Zapisz się na zajęcia` jest zwykłym `<a href="#kontakt">`, **nie** przyciskiem odsłaniającym
ukrytą treść. Dane kontaktowe stoją w DOM od pierwszego renderu jako `<a href="tel:…">`
i `<a href="mailto:…">`, bo awaria JS nie może ukryć jedynej drogi kontaktu. Ewentualne
rozwinięcie po kliknięciu istnieje wyłącznie jako mikrointerakcja **nad treścią już obecną
w dokumencie**. `mailto:` dostaje gotowy `subject` i szkic `body` (imię rodzica, klasa dziecka,
preferowany kontakt) — to przenosi wartość utraconego formularza bez żadnego backendu.

**Wyjątek — telefon w sekcji `#kontakt`.** Na polecenie właściciela numer stoi tam jako zwykły
tekst, nie odnośnik: na desktopie `tel:` niczego sensownego nie robi, a wygląda jak link do
kliknięcia. **Klikalny `tel:` zostaje w stopce, na wszystkich dziewięciu stronach**, więc
dotknięcie numeru na telefonie nadal dzwoni, a wymóg „droga kontaktu dostępna bez JavaScriptu"
jest spełniony. Pilnują tego testy w `tests/smoke/page.spec.js` i `tests/e2e/kontakt.spec.js`.

- **GitHub Pages nie ma warstwy serwerowej i nie wyśle poczty.** Serwuje wyłącznie
  `Last-Modified`, `ETag`, `expires`, `Cache-Control: max-age=600`. Samo podanie adresu w kodzie
  niczego nie uruchamia.
- Dane SMTP nie mogą trafić do frontendu w żadnym przyszłym wariancie formularza.
- Powrót do formularza po zakupie domeny wymaga osobnego ADR i wyboru drogi: hosting z warstwą
  serwerową, endpoint serverless albo usługa formularzowa z kluczem publicznym.
- Dane kontaktowe: patrz **D6**. Wartości tymczasowe przekazane przez właściciela — nie wymyślaj
  własnych i nie zmieniaj ich bez polecenia.
- `FORM-001` = **N/A** w v1. `BIZ-010` = **N/A**. `BIZ-007` — **odstępstwo**, patrz ADR 0006: CTA prowadzi do kontaktu jak przewiduje D2, ale brzmi inaczej niż cytat w kryterium.

**Uwaga:** D2 jest odstępstwem od master promptu §7 i §16, które przewidują krótki formularz jako
główną ścieżkę konwersji. Odstępstwo zostało świadomie zatwierdzone przez właściciela. Przy każdej
weryfikacji `instructions/` (§0) potwierdź, że decyzja nadal obowiązuje.

## 16. Odstępstwa i decyzje architektoniczne

Oznaczenie `ADR NNNN` wskazuje plik z uzasadnieniem w `docs/ADR/`. Brak oznaczenia = jeszcze nieudokumentowane.

| Temat                                           | Rozstrzygnięcie                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Repo prywatne na czas realizacji (§3.1)         | Odstępstwo: user site GitHub Pages musi być publiczne. `instructions/` w `.gitignore`, zero danych wrażliwych w historii                                                                                                                                                                                                                                                                                                                                                   |
| Nagłówki bezpieczeństwa (§20.1, A.5) — ADR 0003 | GitHub Pages nie pozwala ustawić żadnego nagłówka. W `<meta>` działają `default-src`, `script-src`, `style-src`, `img-src`, `font-src`, `connect-src`, `base-uri`, `form-action`. **Ignorowane w meta:** `frame-ancestors`, `report-uri`, `sandbox`. **Bez odpowiednika w meta:** `X-Content-Type-Options`, `Permissions-Policy`. `Referrer-Policy` przez `<meta name="referrer">`. Docelowa polityka w `ops/headers.example.conf` + macierz zgodności w `docs/HOSTING.md` |
| Cache i HSTS (§15.2) — ADR 0003                 | Pages daje sztywne `max-age=600` dla wszystkiego; `immutable` dla hashowanych assetów i HSTS nieosiągalne. Łagodzenie: „Enforce HTTPS” + `upgrade-insecure-requests`. **Domena + Cloudflare przed Pages usuwa to odstępstwo w całości** — argument za wcześniejszym zakupem domeny                                                                                                                                                                                         |
| Preview/staging (§14) — ADR 0004                | Ochrona dostępu do Pages wymaga GitHub Enterprise Cloud — niedostępna. **Środowisko preview nie powstaje**; rolę podglądu pełni lokalne `npm run preview`, testy w CI i artefakt builda. Gdyby kiedyś powstało, musi mieć `noindex, nofollow`, własny `robots.txt` z `Disallow: /`, bez `sitemap.xml` i bez canonical na preview                                                                                                                                           |
| Ochrona `main` (§3.2)                           | Rulesets działają na publicznym repo w planie Free. Required approvals = 0 — GitHub nie pozwala zatwierdzić własnego PR. PR + zielone checks pozostają obowiązkowe                                                                                                                                                                                                                                                                                                         |
| Wersje narzędzi (A.1, B.1)                      | **Rozstrzygnięte — patrz D5 i errata E-01.** Vite 8 bez zmian; ESLint 10, Stylelint 17, html-validate 11. Node zawężony do `>=24.8.0`. ADR wyłącznie dla jawności przy odbiorze                                                                                                                                                                                                                                                                                            |
| Inter Display (§18 briefu)                      | Inter v4 na licencji SIL OFL zawiera Inter Display. Self-host WOFF2 z oficjalnego wydania, licencja odnotowana w `docs/DESIGN_SYSTEM.md`. Nie pobieraj webfontów z witryn referencyjnych                                                                                                                                                                                                                                                                                   |
| Kadry AI jako mock (D4)                         | Placeholdery wyraźnie oznaczone, docelowe proporcje 4:5 / 3:2 / 16:9, minimum 6 spójnych kadrów. **Nie udawaj, że placeholder pokazuje rzeczywistych uczniów SP 402.** Wymagania w `docs/ART_DIRECTION.md` i `docs/CONTENT_GAPS.md`                                                                                                                                                                                                                                        |
| Brak formularza (D2)                            | Odstępstwo od master promptu §7 i §16. Zatwierdzone przez właściciela. Szczegóły w §15                                                                                                                                                                                                                                                                                                                                                                                     |
| Hosting i `base` — ADR 0001                     | GitHub Pages user site, `base` = `/`, źródło „GitHub Actions” ustawiane ręcznie w Settings → Pages                                                                                                                                                                                                                                                                                                                                                                         |
| Brzmienie primary CTA — ADR 0006                | Odstępstwo polecone przez właściciela: `Zapisz się na zajęcia` zamiast `Zgłoś dziecko do grupy` z master promptu §7. Czasownik „zgłosić” niosł skojarzenie ze zgłoszeniem na policję. Funkcja, cel `#kontakt` i kolor sygnałowy bez zmian, więc zakaz miękkich CTA nadal obowiązuje. **BIZ-007 formalnie naruszone** — w raporcie odbioru jako odstępstwo, nie PASS                                                                                                        |
| Hub oferty i przekierowania — ADR 0008          | Zlecone przez właściciela: serwis hybrydowy. Strona główna zostaje one-page, cztery produkty dostają adresy pod `/oferta`, cennik przestaje być kategorią menu. Kontekstowe CTA i lista oferty z `src/data/offers.mjs`. Mega-menu otwierane kliknięciem, nie najechaniem. **Przekierowania ze starych adresów to meta refresh, nie 301** - GitHub Pages nie ma warstwy serwerowej                                                                                          |
| Trzy podstrony — ADR 0007                       | Odstępstwo zlecone przez właściciela: `/dla-seniorow/`, `/online/`, `/kariera/` zamiast jednego one-page z master promptu §23. Statyczny MPA bez routera, wspólne fragmenty HTML w `partials/`, wspólne bloki w `components/page-sections.css`, kolor przez istniejące `[data-theme]`. Menu urosło do ośmiu pozycji, więc powstała szuflada mobilna z pułapką focusu - argument „cztery kotwice nie uzasadniają hamburgera" przestał obowiązywać                           |
| Brzmienie sceny metody — ADR 0009               | Odstępstwo polecone przez właściciela: `MÓW PRÓBUJ POPRAWIAJ UŻYWAJ` zamiast `MÓWIJ. PRÓBUJ. POPRAWIAJ. UŻYWAJ.` z master promptu §16. „Mówij" nie jest polskim słowem — tryb rozkazujący od „mówić" to „mów". Kropki zdjęte tą samą decyzją. Kolor, skala i układ sceny bez zmian                                                                                                                                                                                         |
| Własna domena — ADR 0010                        | Adresem kanonicznym jest `https://www.highfive.academy` (wariant z `www`, ten sam co w grafice Open Graph). Podmiana wykonana **przed** publikacją, żeby Google nie zdążył zaindeksować adresu technicznego — GitHub Pages nie odda prawdziwego 301. Publikacja w Pages nadal wyłączona decyzją właściciela; `Enforce HTTPS` do potwierdzenia po propagacji DNS                                                                                                            |
| Polityka prywatności — ADR 0011                 | Dziesiąty adres serwisu, zlecony przez właściciela. Pełna treść jako HTML, PDF tylko do pobrania. Treść co do słowa z dokumentu właściciela — **zmiana danych na stronie oznacza zmianę PDF-a, nie odwrotnie**. Jeden widoczny odnośnik: stopka, kolumna `Informacje`, pod `Kontakt`                                                                                                                                                                                       |
| Licencja repozytorium — ADR 0012                | `LICENSE.md` o charakterze ALL RIGHTS RESERVED. Repozytorium jest publiczne z przymusu (user site GitHub Pages), a nie z wyboru. Żadnej licencji open source. `package.json` zostaje bez pola `license`                                                                                                                                                                                                                                                                    |
| Trigger wdrożenia — ADR 0002                    | Push do `main` wdraża automatycznie; rollback przez `workflow_dispatch` z parametrem `ref`. Bez `revert` i bez force push                                                                                                                                                                                                                                                                                                                                                  |

## 17. Kryteria odbioru

Przed zakończeniem oceń **PASS / N-A / BLOCKED** i zwróć raport zgodnie z master promptem §33.

**Biznesowe (BIZ-001…015):** klasy 1–8 jasne; SP 402 + „po lekcjach” jasne; nabór + 01.10
widoczne; minimum 5 jawne; 55/50 zł jawne; tylko 2 ścieżki ofertowe; primary CTA — brzmienie
zmienione przez właściciela, ADR 0006; brak wymyślonych faktów; brak sugerowania oficjalnej relacji ze SP 402; formularz
krótki (**N/A w v1**); strona działa biznesowo bez animacji; brak generycznego card-landingu;
brand-first art direction widoczna w screenshocie; mobile ma własną choreografię; komunikat
zapamiętywalny po 15 sekundach.

**Wizualno-interakcyjne (VIZ-001…012):** brak sztywnych slajdów 100vh; wyrazista hierarchia
typograficzna przez `clamp()`; media art-directed i responsywne; zróżnicowany rytm kompozycji;
motion nie przejmuje scrolla; sticky ma fallback; marquee respektuje reduced motion; brak
nadmiaru kart, gradientów i cieni; brak kopiowania 1:1 z referencji; własny spójny język marki;
`docs/MOTION.md` opisuje faktycznie użyte wzorce; kierunek kreatywny nie obniża a11y, SEO,
performance i security.

**Techniczne:** macierz TECH / REPO / GIT / ARCH / ANIM / A11Y / SEO / PERF / SEC / FORM / CI /
CD / HOST / TEST / ROLL / HAND z rozdz. 27 specyfikacji.

## 18. Zakazy operacyjne

- **Nie podejmuj samodzielnie decyzji przy sprzeczności z `instructions/`** — pytaj, patrz §0.
- **Nie commituj:** `dist/`, `node_modules/`, `.env`, `instructions/`, raportów testów.
- **Nie dodawaj sekretów** do repo, bundle, `VITE_*` ani publicznego HTML.
- **Nie osłabiaj primary CTA** — żadnego „Sprawdź poziom”, „Umów konsultację”, „Trial”. Obowiązuje brzmienie `Zapisz się na zajęcia` (ADR 0006); dalsza zmiana wymaga decyzji właściciela.
- **Nie zmieniaj sekcji i stron zamkniętych. Na stronie głównej zamknięte jest dziś
  wszystko poza sekcją 11 FAQ: 01 hero, 02 po lekcjach, 03 co dziecko zyskuje,
  04 nasza oferta, 05 o High Five, 06 jak uczymy, 07 cennik · klasy 1-7, 08 nabór 2026,
  09 lokalizacje, 10 seniorzy, 12 kontakt. Zamknięte są też całe podstrony
  `/cennik/`, `/oferta/dzieci/`, `/oferta/egzamin-osmoklasisty/`,
  `/oferta/seniorzy/` i `/polityka-prywatnosci/`** — patrz D7–D21 w §15. Dotyczy to również zmian
  pośrednich: tokenów, od których te sekcje zależą, i reguł globalnych, które na nie
  wpływają. Po każdej zmianie w pozostałych sekcjach uruchom:

  ```
  npx playwright test tests/e2e/hero.spec.js tests/e2e/po-lekcjach.spec.js tests/e2e/korzysci.spec.js tests/e2e/oferta-metoda.spec.js tests/e2e/o-high-five.spec.js tests/e2e/pricing.spec.js tests/e2e/nabor.spec.js tests/e2e/lokalizacja.spec.js tests/e2e/seniorzy.spec.js tests/e2e/kontakt.spec.js tests/e2e/cennik.spec.js tests/e2e/dzieci.spec.js tests/e2e/egzamin.spec.js tests/e2e/oferta-seniorzy.spec.js --project=desktop-chromium
  ```

  To około minuty i jedyna rzecz, która wyłapie zmianę pośrednią.

- **Otwarta pozostaje na stronie głównej tylko sekcja 11 FAQ** oraz podstrony
  `/oferta/`, `/oferta/online/`, `/lokalizacje/` i `/kariera/`. Przy pracy nad nimi
  uważaj na `--step-display`: niesie nagłówki sekcji 11 i 12, a dwunastka jest
  zamknięta. Uważaj też na warianty `.cta`: `cta--ink` niesie hero (D7), wezwanie
  w sekcji 09 (D15), wezwanie na `/cennik/` (D17), przycisk do Terminala (D20),
  oba wezwania na `/lokalizacje/` i wezwanie do lokalizacji na `/oferta/dzieci/`
  (D18). **Obrysowy `cta--ghost` stoi już tylko na `/oferta/seniorzy/`** — ostatnie
  wystąpienie po zmianach z 18.09.2026. Zdjęcie go stamtąd zostawiłoby serwisowi
  jeden język przycisków, ale to decyzja właściciela, nie porządki.

- **`u-mt-8` w HTML NIE ISTNIEJE w żadnym arkuszu.** Klasa stoi w jedenastu miejscach
  na sześciu stronach i miała dawać margines u góry — nigdy nie powstała, więc bloki,
  które ją noszą, przylegają do poprzedzającego tekstu. Właściciel zgłosił to jako
  usterkę na `/oferta/dzieci/` i `/oferta/online/`; tam odstęp dołożyły reguły
  zakotwiczone w `[data-page='…']`. **Nie ożywiaj tej klasy globalnie bez decyzji** —
  ruszyłaby także sekcję 04 strony głównej (D10) i strony `/kariera/`,
  `/oferta/seniorzy/`, `/oferta/egzamin-osmoklasisty/`, których nikt o to nie prosił.

- **Nowy plik w `src/css/` dodawaj PRZED dopisaniem go do `main.css`.** Odwrotna
  kolejność wywraca serwer deweloperski: `postcss-import` zapamiętuje brak pliku
  i oddaje 500 na cały arkusz aż do restartu — strony lecą wtedy zupełnie bez stylów,
  mimo że build produkcyjny przechodzi. To już się zdarzyło 18.09.2026. Z tego powodu
  reguły podstrony `/oferta/online/` stoją dziś na końcu `components/page-sections.css`,
  zakotwiczone w `[data-page='online']`; przy najbliższym restarcie serwera można je
  przenieść do `pages/online.css` bez żadnej zmiany treści.

- **Mapa `CTA` w `src/data/offers.mjs` jest kluczowana ścieżką pliku.** Zmieniając cel
  albo etykietę wezwania dla jednej strony, zmieniasz jej jeden wpis — nigdy wartości
  domyślnej i nigdy kotwicy wpisanej na sztywno w partialu nagłówka. Trzy podstrony
  ofertowe (D18, D19, D20) celują w kotwice u siebie, pozostałe strony
  w `/#kontakt` albo `#aplikacja`.

  **Wpis `null` zdejmuje wezwanie z nagłówka.** Korzysta z tego wyłącznie
  `/polityka-prywatnosci/` (D21): `htmlPartials` usuwa wtedy blok w szufladzie
  i zastępuje go w pasku pustą przegrodką o szerokości przycisku. Przegrodka jest
  konieczna — pasek rozkłada dzieci przez `space-between`, więc bez trzeciego
  elementu menu odjeżdża o 463 px na prawy skraj. Nie ukrywaj przycisku stylem:
  schowany przez CSS zostaje w kolejności focusu i czytnik ekranu go zapowiada.

- **`src/css/components/enroll.css` obsługuje PIĘĆ stron naraz** — czerwony akt
  zapisów na czterech podstronach ofertowych oraz, od 19.09.2026, sekcje
  kontaktowe na `/oferta/online/` (czerwień) i `/kariera/` (też czerwień, po
  zmianie zdania właściciela: czarna sekcja zlewała się z czarną stopką).
  Po każdej zmianie w tym pliku uruchom `dzieci.spec.js`, `egzamin.spec.js`,
  `oferta-seniorzy.spec.js` i `online.spec.js`.

  **Sekcje kontaktowe na `/oferta/online/` i `/kariera/` NIE MAJĄ przycisku** —
  ten sam warunek co na trzech podstronach ofertowych. Na karierze zniknął przy
  tym szkic maila rekrutacyjnego (`subject=Rekrutacja` z polami do wypełnienia);
  czego oczekujemy w zgłoszeniu, mówi dziś lead sekcji.

  Komponent trzyma **strukturę i rytm**; warstwy stron wyłącznie **skalę typografii**.
  Odstępów nie ustawiaj w warstwie strony — wzorcem jest podstrona egzaminacyjna (D19),
  a równości pilnuje osobny test porównujący trzy strony. Stopnie pisma **mają** się
  różnić i nie wolno ich ujednolicać.

- **Podmiana odnośnika jest jedyną zmianą dopuszczoną w `/cennik/`** bez pytania —
  gdy zmieni się adres podstrony ofertowej. Poprawiasz wtedy `href` i asercję w teście.

- **Nie dopisuj faktów** poza listą z §3. Brak → `docs/CONTENT_GAPS.md`.
- **Nie twórz kolejnych podstron** bez zlecenia. Istniejące cztery adresy opisuje ADR 0007.
- **Nie dodawaj CMS, panelu administracyjnego, frameworka SPA ani zależności runtime** bez ADR
  i zatwierdzenia.
- **Nie edytuj produkcji ręcznie** jako standardowego workflow.
- **Commit i push wyłącznie na wyraźne polecenie właściciela.**

## 19. Zasada finalna

Nie buduj „efektownej strony szkoły”. Buduj markę HIGH FIVE, która natychmiast komunikuje: dla
kogo jest, gdzie odbywają się zajęcia, co oferuje, ile kosztuje, kiedy startuje, jaki jest warunek
uruchomienia i co użytkownik ma zrobić dalej.

To nie ma być prezentacja slajdowa szkoły. To ma być pełnowartościowa strona szkoły, która
zachowuje się jak elegancka, kinetyczna prezentacja marki. Ruch wzmacnia kompozycję, nie zastępuje
kompozycji. Treść i konkret biznesowy mają pierwszeństwo przed efektem.

Strona ma zachowywać prostotę techniczną, ale **nie może wyglądać technicznie prosto**. Minimalny
stack nie jest uzasadnieniem dla generycznego layoutu.
