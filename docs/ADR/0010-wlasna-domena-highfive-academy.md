# ADR 0010 — własna domena `www.highfive.academy` jako adres kanoniczny

- **Status:** przyjęte
- **Data:** 2026-09-19
- **Decyduje:** właściciel
- **Dotyczy:** adres kanoniczny, Open Graph, `sitemap.xml`, `robots.txt`, JSON-LD, testy adresu

## Kontekst

Decyzja **D3** zakładała start pod adresem technicznym `https://radek1983.github.io/`
i przeniesienie na własną domenę „później”, z zastrzeżeniem, że adres kanoniczny ma stać
w jednym miejscu, żeby podmiana była jedną operacją.

Domena `highfive.academy` została kupiona wcześniej i od 16.09.2026 obsługuje pocztę
(`kontakt@highfive.academy`, decyzja **D6**). 19.09.2026 właściciel potwierdził, że rekordy
DNS dla serwisu są ustawione, domena jest podpięta do repozytorium, a jedyne, czego brakuje,
to **włączenie publikacji w GitHub Pages** — zrobił świadomy `unpublish`, bo strona nie ma
jeszcze wyjść na zewnątrz.

Adres widnieje dziś w serwisie w czterech rolach:

1. `<link rel="canonical">` na każdej z dziewięciu stron,
2. `og:url` i **bezwzględny** `og:image` (podglądy społecznościowe nie akceptują ścieżek względnych),
3. `public/sitemap.xml` — dziewięć wpisów `<loc>` — oraz `Sitemap:` w `public/robots.txt`,
4. asercje w `tests/e2e/pages.spec.js` i `tests/smoke/page.spec.js`, które pilnują adresu co do znaku.

## Decyzja

**Adresem kanonicznym serwisu jest `https://www.highfive.academy`.** Podmiana wykonana
w całości teraz, przed publikacją, a nie po niej.

Wariant **z `www`**, nie apex. Ten sam, który stoi w czarnym pasie grafiki Open Graph
(19.09.2026) i w stopce podglądów — rozjechanie tych dwóch dawałoby dwa adresy marki
w jednym podglądzie linku.

## Konsekwencje

- Podmiana objęła **jedenaście plików HTML** (dziewięć stron + dwie strony przekierowujące
  `/dla-seniorow/` i `/online/`), `sitemap.xml`, `robots.txt` i dwa pliki testów. Żadne
  wystąpienie starego adresu nie zostało w kodzie serwisu.
- **Kolejność jest tu istotna i została zachowana:** kanoniczny adres wskazuje domenę
  **zanim** cokolwiek zostanie zaindeksowane. Gdyby publikacja ruszyła pod adresem
  technicznym, a domena weszła później, Google zdążyłby zaindeksować `radek1983.github.io`,
  a GitHub Pages — bez warstwy serwerowej — nie odda prawdziwego 301 (ten sam problem
  co przy starych adresach ofertowych, ADR 0008). Przekierowanie z user site na domenę
  robi sam GitHub Pages po włączeniu domeny w ustawieniach, ale opieranie na tym indeksacji
  jest ryzykiem, którego tu nie podejmujemy.
- **Publikacja pozostaje wyłączona.** Ten ADR nie zmienia stanu GitHub Pages; włączenie
  źródła „GitHub Actions” i zdjęcie `unpublish` to ręczna czynność właściciela.
- `Enforce HTTPS` w ustawieniach Pages musi zostać **potwierdzone po publikacji** — przy
  własnej domenie GitHub wystawia certyfikat Let's Encrypt dopiero po propagacji DNS,
  a do tego czasu opcja bywa wyszarzona.
- **Odstępstwa z ADR 0003 (nagłówki bezpieczeństwa) i sprawa cache/HSTS nadal obowiązują.**
  Sama domena ich nie usuwa — usunęłoby je dopiero postawienie przed Pages warstwy typu
  Cloudflare, co jest osobną decyzją. `docs/CONTENT_GAPS.md` odnotowuje to bez zmian
  merytorycznych, tylko z nowym adresem.
- **Pliku `CNAME` w repozytorium nie ma i na razie nie dokładamy go.** Domena jest
  ustawiona po stronie GitHuba, a przy wdrożeniu przez GitHub Actions to ustawienie żyje
  w konfiguracji Pages, nie w artefakcie builda. Gdyby jednak po publikacji domena
  odpięła się przy kolejnym wdrożeniu, właściwą poprawką jest `public/CNAME` z jedną
  linią `www.highfive.academy` — plik musi wtedy zgadzać się z ustawieniem co do znaku,
  bo rozjazd zdejmuje domenę.

## Odrzucone warianty

- **Apex `highfive.academy` bez `www`.** Krótszy, ale wymaga czterech rekordów A (i czterech
  AAAA) na adresy GitHuba, które bywają zmieniane; `www` to jeden `CNAME`, odporny na taką
  zmianę. Poza tym grafika Open Graph niesie już wariant z `www`.
- **Podmiana dopiero po publikacji.** Odrzucone: patrz konsekwencja o indeksacji.
- **Trzymanie adresu w jednej stałej i składanie go przy buildzie.** Kusiło, bo D3 tak to
  zapowiadało. Adres stoi jednak w plikach, których build nie przetwarza (`sitemap.xml`,
  `robots.txt`) i w testach, więc „jedna stała” i tak nie objęłaby wszystkiego. Podmiana
  była jednorazowa, a `grep` po starym adresie jest pełną kontrolą — wprowadzanie kolejnego
  symbolu do `htmlPartials` kosztowałoby więcej niż daje.
