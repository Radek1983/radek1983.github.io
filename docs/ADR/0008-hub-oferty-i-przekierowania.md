# ADR 0008: Hub oferty, hierarchia adresów i przekierowania ze starych URL

Status: Accepted — **zlecone przez właściciela**
Data: 2026-09-13

## Kontekst

ADR 0007 dodał trzy podstrony obok strony głównej: `/dla-seniorow/`, `/online/`, `/kariera/`.
Powstała z tego płaska lista siedmiu pozycji w menu, w której **cennik stał jako równorzędna
kategoria wobec oferty**, a seniorzy i lekcje online wyglądały na produkty _obok_ oferty,
a nie jej część.

Właściciel rozstrzygnął architekturę: serwis jest **hybrydowy**. Strona główna zostaje
scrollytellingowym one-page i doświadczeniem marki, a szczegóły czterech produktów żyją
na własnych adresach pod wspólnym hubem.

## Decyzja

### Hierarchia adresów

```
/                                  strona główna, one-page
/oferta                            hub czterech produktów
/oferta/dzieci                     klasy 1-7
/oferta/egzamin-osmoklasisty       klasa 8
/oferta/seniorzy                   60+, Terminal Kultury
/oferta/online                     1:1 online
/lokalizacje                       dwa miejsca zajęć
/cennik                            zbiorcza strona cenowa
/kariera                           osobna ścieżka, inny odbiorca
```

**Cena należy do produktu.** Każda podstrona oferty ma własną sekcję ceny, a `/cennik`
jest stroną porównawczą — osiągalną z mega-menu, ze stopki i z podstron, ale **nie** z pierwszego
poziomu menu.

**Kariera zostaje poza ofertą**, bo ma innego odbiorcę. To jedyna gałąź z własnym CTA
(`Aplikuj`) i ciemnym nagłówkiem.

### Jedno źródło danych oferty

`src/data/offers.mjs` trzyma cztery produkty i mapę wezwań do działania. Plugin `htmlPartials`
podstawia z niego przy budowaniu listę oferty w mega-menu, w szufladzie mobilnej i w stopce,
a także etykietę oraz adres przycisku w nagłówku. Dodanie piątego kursu jest jedną zmianą
w jednym pliku.

**Świadomie NIE generujemy z tych danych stron `/oferta` i `/cennik`.** Mają rozbudowaną,
własną treść — generowanie ich z listy byłoby budowaniem stron z danych, czyli dokładnie tym
page builderem, przed którym właściciel przestrzegał. W danych żyją tylko pola, które naprawdę
powtarzają się w nawigacji.

`price: null` znaczy „cena nieustalona" i nie wolno tam wpisać liczby bez potwierdzenia (§4).

### Kontekstowe CTA

Wezwanie w nagłówku zależy od adresu — „Zapisz dziecko" na stronie kariery byłoby pomyłką,
tak samo jak „Aplikuj" na stronie dla rodziców. Rozwiązane konfiguracją, nie duplikatem
nagłówka: jeden fragment HTML i mapa `CTA` w `offers.mjs`.

Poprzednie podejście — wariant przycisku ukrywany w CSS — zostało usunięte jako martwy kod.
Nie skalowało się: przy dziewięciu stronach wymagałoby dziewięciu par reguł.

### Mega-menu zamiast dropdownu

Panel na całej szerokości okna, cztery ponumerowane produkty, dwa odnośniki zbiorcze.
Otwiera się **kliknięciem, nie najechaniem**.

Wariant z otwieraniem na hover był pułapką: kursor dojeżdżający do przycisku otwierał panel,
a następujące po nim kliknięcie przełączało go z powrotem — menu wyglądało na zepsute. Dało się
to obejść znacznikami czasu, kosztem logiki, której nikt później nie zrozumie. Kliknięcie jest
też uczciwsze wobec dotyku i klawiatury: jedno zachowanie dla wszystkich sposobów obsługi.

Na telefonie ofertę rozwija `<details>` — działa bez ani jednej linii JavaScriptu.

### Stan aktywny

Strona deklaruje gałąź serwisu atrybutem `data-section` na `<body>`. Wszystkie cztery podstrony
oferty ustawiają `oferta`, więc pozycja menu podświetla się tak samo na `/oferta`
i na `/oferta/dzieci`, bez mnożenia selektorów.

## Przekierowania — odstępstwo, które warto znać

**GitHub Pages nie potrafi odpowiedzieć kodem 301.** Nie ma tam warstwy serwerowej ani pliku
przepisującego adresy. Jedyne, co działa na czysto statycznym hostingu, to strona pośrednia:

- `<meta http-equiv="refresh" content="0; url=…">` — przenosi użytkownika,
- `<link rel="canonical">` — wskazuje wyszukiwarce adres docelowy,
- `<meta name="robots" content="noindex, follow">` — bez tego w indeksie byłyby dwa adresy
  o tej samej treści,
- widoczny link, gdy odświeżenie nie zadziała.

To **nie jest** przekierowanie 301. Google traktuje meta refresh z zerowym opóźnieniem podobnie
do trwałego przekierowania, ale nie identycznie, a przeglądarka dodaje wpis do historii, więc
przycisk „wstecz" potrafi wrócić na stronę pośrednią.

**Prawdziwy 301 pojawi się razem z własną domeną za Cloudflare** — Bulk Redirects są dostępne
w planie darmowym. To kolejny argument za wcześniejszym zakupem domeny, obok tego z ADR 0003.

Stare adresy: `/dla-seniorow/` → `/oferta/seniorzy/`, `/online/` → `/oferta/online/`. Oba wypadły
z `sitemap.xml`, a wszystkie linki wewnętrzne zostały przepisane. Test sprawdza jedno i drugie.

## Konsekwencje dla strony głównej

Sekcja `#oferta` pokazywała dwa pełnowymiarowe moduły kursów. Po przebudowie pokazuje **skrót
czterech ścieżek**, a szczegóły żyją na podstronach — zgodnie z rolą strony głównej jako
doświadczenia marki, a nie katalogu.

Pociągnęło to trzy zmiany, które łatwo przeoczyć:

- **`src/css/sections/courses.css` usunięty w całości** razem z regułą staggera w `reveal.css`.
  Komponent `.course` nie występuje już w żadnym dokumencie — zostawienie go byłoby martwym
  kodem, którego zabrania §13.
- **Granat na stronie głównej** niosła sekcja kursów. Po jej przebudowie drugim aktem marki
  jest sekcja senioralna. Test koloru celuje teraz w nią.
- **Zastrzeżenie „nie obiecujemy wyniku egzaminu" przeniosło się** na `/oferta/egzamin-osmoklasisty/`,
  czyli tam, gdzie stoi opis kursu. Wymóg §6 jest spełniony dalej, ale pilnuje go test na
  podstronie, a nie na stronie głównej.

## Rozważane alternatywy

**Płaskie adresy `/dzieci`, `/seniorzy`, `/online`** — krótsze. Odrzucone: nie niosą hierarchii,
a `/oferta/seniorzy` mówi wprost, że to element oferty. Zagnieżdżenie jest też czytelne
w okruszkach wyszukiwarki bez dodawania widocznych breadcrumbs.

**Cennik jako sekcja wyłącznie na podstronach** — bez `/cennik`. Odrzucone: rodzic porównujący
oferty potrzebuje jednego miejsca z liczbami obok siebie.

**Router po stronie klienta** — pozwoliłby na prawdziwe przejścia bez przeładowania. Odrzucony:
§10 zabrania frameworka SPA, a statyczne katalogi dają działające adresy i odświeżanie bez
żadnej warstwy serwerowej.
