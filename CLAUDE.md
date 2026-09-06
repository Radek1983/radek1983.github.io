# CLAUDE.md — HIGH FIVE / kontrakt projektowy

Strona WWW szkoły języka angielskiego **HIGH FIVE**: statyczny one-page, hostowany na GitHub Pages
w repozytorium `Radek1983/radek1983.github.io`.

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
- Pierwsze dziecko: **55 zł/godz.** Drugie i każde kolejne dziecko z rodzeństwa: **50 zł/godz.**
- Dwie ścieżki: **klasy 1–7** oraz **klasa 8 / egzamin ósmoklasisty**.
- Adres miejsca zajęć: Szkoła Podstawowa nr 402 im. Haliny Konopackiej,
  ul. Jana Nowaka-Jeziorańskiego 22, 03-982 Warszawa.

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
- **Hero lead:** `Zajęcia dla dzieci z klas 1-8 na terenie Szkoły Podstawowej nr 402 w Warszawie. Małe grupy, dużo praktycznego używania języka i osobna ścieżka przygotowania do egzaminu ósmoklasisty.`
- **Nabór:** `Nabór trwa. Start zajęć: 1 października. Grupa rusza po zebraniu minimum 5 dzieci.`
- **Primary CTA:** `Zapisz się na zajęcia`, w nagłówku skrócone do `Zapisz się`.
  Wcześniej brief żądał `Zgłoś dziecko do grupy`. Zmianę polecił właściciel: „zgłoś dziecko” czyta się jak zgłoszenie na policję. Cel, kolor i rola CTA bez zmian — **ADR 0006**
- **Lokalna propozycja wartości:** `Mniej logistyki. Znane miejsce. Więcej ciągłości.`
- **Język metody:** `MÓWIJ. PRÓBUJ. POPRAWIAJ. UŻYWAJ.`

Zakaz pustych fraz: „nowoczesne metody”, „najwyższa jakość”, „doświadczeni lektorzy”,
„przyjazna atmosfera” — o ile nie stoi za nimi potwierdzony konkret. Najpierw konkret lokalny,
potem korzyść edukacyjna.

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
działa idealnie, brak długiego sticky. Zachowaj duży crop typografii, pełne zdjęcia, kontrast,
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
public/            favicon.svg, robots.txt, sitemap.xml, site.webmanifest, social/og-image.jpg
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
- Deployment automatyczny i powtarzalny. **Rollback = ponowne wdrożenie poprzedniego dobrego
  taga**, nie ręczna edycja plików na serwerze. Rutynowy FTP nie jest metodą publikacji.
- CI generuje `version.json` (wersja, commit SHA, timestamp). Bez sekretów.
- Zmiana treści przebiega jak zmiana kodu: branch → edycja → lokalny check → PR → CI → merge →
  release. `docs/CONTENT.md` wskazuje, które fragmenty `index.html` odpowiadają za które sekcje.

Twarde fakty wdrożeniowe dla tego repozytorium:

- To **user site** — `base` w Vite = `/`. Nigdy `/radek1983.github.io/`.
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
- `meta description`: `Zajęcia z angielskiego dla klas 1-8 po lekcjach w SP 402 w Warszawie. Przygotowanie do egzaminu ósmoklasisty. Nabór trwa, start 1 października.`
- `h1`: `Angielski po lekcjach. W tej samej szkole.`
- Wymagane: canonical, Open Graph, favicon, `sitemap.xml`, `robots.txt`, poprawny `lang`,
  semantyczne nagłówki, trwałe kotwice, cała istotna treść w DOM.
- JSON-LD `EducationalOrganization`/`LocalBusiness` **tylko z prawdziwymi danymi**. Bez ratingów.
  Adres SP 402 jako miejsce zajęć, nie adres rejestrowy firmy.
- Przyszłe podstrony (`/angielski-dla-dzieci-warszawa/`, `/egzamin-osmoklasisty-angielski/`,
  `/cennik/`) tylko opisz w `docs/SEO.md`. **Nie rozszerzaj pierwszego zakresu bez zlecenia.**

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

| #      | Temat              | Decyzja                                                                                                                                                                               |
| ------ | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **D1** | Środowisko lokalne | Node.js 24 LTS instalowany lokalnie. `npm ci`, lint, build i Playwright uruchamiane przed każdym PR                                                                                   |
| **D2** | Konwersja          | **Brak formularza zgłoszeniowego w v1.** Główne CTA prowadzi do sekcji kontaktu z adresem e-mail i telefonem                                                                          |
| **D3** | Adres              | Start na `https://radek1983.github.io/`. Własna domena później — adres kanoniczny trzymany w jednej stałej konfiguracyjnej, żeby podmiana była jedną zmianą                           |
| **D4** | Fotografia         | Kadry generowane przez AI. Teraz mock/placeholder w docelowych proporcjach, podmiana po dostarczeniu finalnych plików                                                                 |
| **D5** | Wersje narzędzi    | **Aktualne majory: ESLint 10, Stylelint 17, html-validate 11.** Zmiana wpisana do `instructions/ERRATA-zalacznik-techniczny-v1.1.md` (E-01) — rozstrzygnięte, nie pytaj o to ponownie |
| **D6** | Dane kontaktowe    | **Tymczasowo:** e-mail `janek.gitara@onet.pl`, telefon `+48 789 789 789`. Do podmiany na dane HIGH FIVE. Errata E-02                                                                  |

### D5 — konsekwencje

- `.nvmrc` = `24.20.0`, `engines` = `>=24.8.0 <25`. `html-validate@11` odrzuca Node 24.0–24.7,
  więc samo `24` z rozdz. 11.1 specyfikacji nie wystarczy.
- Stylelint 17 jest ESM-only → `stylelint.config.mjs` z `export default`.
- ESLint 10 nie czyta `.eslintrc` → wyłącznie flat config w `eslint.config.js`.
- Odstępstwo od cyfr w załączniku A.1 zapisz jako ADR, żeby przy odbiorze było jawne.

### D6 — konsekwencje

- Obie wartości trzymane w **jednym miejscu w kodzie**, żeby podmiana była jedną zmianą.
- Wyświetlanie `+48 789 789 789`, atrybut `tel:+48789789789`.
- Content gap „dane kontaktowe" schodzi z **blokującego** na **nieblokujący**, ale pozostaje
  otwarty w `docs/CONTENT_GAPS.md` do przekazania danych docelowych. Zapisz jawnie, że są
  tymczasowe i prywatne, nie firmowe.
- Adres e-mail widoczny publicznie ściąga spam — świadomie przyjęte ryzyko wartości tymczasowej.

### D2 — mechanika i konsekwencje

CTA `Zapisz się na zajęcia` jest zwykłym `<a href="#kontakt">`, **nie** przyciskiem odsłaniającym
ukrytą treść. Dane kontaktowe stoją w DOM od pierwszego renderu jako `<a href="tel:…">`
i `<a href="mailto:…">`, bo awaria JS nie może ukryć jedynej drogi kontaktu. Ewentualne
rozwinięcie po kliknięciu istnieje wyłącznie jako mikrointerakcja **nad treścią już obecną
w dokumencie**. `mailto:` dostaje gotowy `subject` i szkic `body` (imię rodzica, klasa dziecka,
preferowany kontakt) — to przenosi wartość utraconego formularza bez żadnego backendu.

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
- **Nie dopisuj faktów** poza listą z §3. Brak → `docs/CONTENT_GAPS.md`.
- **Nie twórz podstron** poza zakresem pierwszego one-page bez zlecenia.
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
