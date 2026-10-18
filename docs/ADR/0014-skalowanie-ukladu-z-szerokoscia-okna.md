# ADR 0014 — skalowanie układu wraz z szerokością okna

- **Status:** przyjęte
- **Data:** 2026-10-18
- **Decyduje:** właściciel
- **Dotyczy:** `html { font-size }`, `--container-max`, próg przyklejanego kadru,
  trzy asercje w testach zamków

## Kontekst

Na monitorach szerszych niż 1536 px serwis stawał w miejscu, a cała nadwyżka
szerokości szła w puste marginesy. Zmierzone na produkcji:

| okno    | kontener | lewy margines |
| ------- | -------- | ------------- |
| 1536 px | 1536 px  | 0 px          |
| 1920 px | 1536 px  | **192 px**    |
| 2560 px | 1536 px  | **512 px**    |
| 3440 px | 1536 px  | **952 px**    |

Pismo, odstępy i kadry zostawały przy tym w tych samych pikselach, więc na większym
monitorze strona nie wyglądała na większą — wyglądała na **węższą**, z drobnym
tekstem pośrodku pustki. Właściciel zgłosił to jako podstawową wadę serwisu na
własnym sprzęcie.

Źródłem był `--container-max: 96rem` przy stałym korzeniu 16 px.

## Decyzja

**Korzeń skaluje się liniowo z szerokością okna, a granica kontenera zostaje
w `rem`** — dzięki temu obie wartości poruszają się razem i proporcje układu są
w każdym punkcie te same.

```css
html {
  font-size: clamp(0.75rem, 100vw / 96, 2.5rem);
}

@media (width < 62rem) {
  html {
    font-size: 1rem;
  }
}
```

`--container-max` zostaje `96rem`. Dzielnik `96` daje dokładnie **16 px przy
1536 px**, czyli punkt sklejenia ze stanem produkcyjnym.

Cały serwis jest wymierzony w `rem` — siatka, odstępy `--space-*` i górne granice
skali typograficznej `--step-*` — więc korzeń jest jedynym pokrętłem, które rusza
pismo, odstępy i szerokość kolumny naraz.

### Co z tego wynika

| okno    | korzeń  | kontener | margines | nagłówek wypełnia kolumnę |
| ------- | ------- | -------- | -------- | ------------------------- |
| 1280 px | 13,3 px | 1280 px  | 0        | 90%                       |
| 1536 px | 16,0 px | 1536 px  | 0        | 90%                       |
| 1920 px | 20,0 px | 1920 px  | 0        | 90%                       |
| 2560 px | 26,7 px | 2560 px  | 0        | 90%                       |
| 3840 px | 40,0 px | 3840 px  | 0        | 90%                       |

Układ jest **niezmienniczy wobec skali**: okno 3840 px wygląda jak 1920 px
powiększone dwukrotnie. To samo dotyczy powiększenia przeglądarki, bo zmienia ono
rozmiar okna CSS — na ekranie 1920 px tekst ma **fizycznie stały rozmiar od 50% do
150%** powiększenia.

### Granice

**Dolna `0.75rem` (12 px), czyli poniżej 1440 px.** Pełna proporcja dawałaby 11,4 px
przy oknie 1366 px, a to szerokość **realnego laptopa**, nie powiększenia. Granica
zatrzymuje kurczenie; powyżej 175% powiększenia tekst znowu rośnie fizycznie.

**Poniżej 62rem (992 px) korzeń wraca do 16 px.** Tam kończy się układ desktopowy
i zaczyna mobilny, strojony pod telefon. Telefon o szerokości 390 px dostałby
z tej formuły 3,25 px. Sprawdzone: przy 390 i 768 px układ jest **tożsamy
z produkcją**.

**Górna `2.5rem` (40 px)** dotyczy okien szerszych niż 3840 px.

### Próg przyklejanego kadru

Sekcja 02 strony głównej włączała przyklejanie zdjęcia warunkiem
`(width >= 62rem) and (height >= 40rem)`. Przy 150% powiększenia okno CSS ma
1280 × 571 px, czyli poniżej 640 px wysokości — efekt gasł, choć razem z oknem
malała cała treść i miejsca było proporcjonalnie tyle samo.

Próg jest dziś **proporcją okna**: `(width >= 62rem) and (aspect-ratio <= 12/5)`.
Pyta o to samo, co tamten warunek miał pytać — czy okno nie jest skrajnie szerokie
względem wysokości — ale przy powiększaniu proporcja się nie zmienia. Naprawdę
niskie okno (1920 × 600, proporcja 3,2) nadal degraduje się do zwykłego bloku,
zgodnie z rozdz. 30.1 specyfikacji.

### Asercje w testach zamków

Trzy asercje porównywały **bezwzględne piksele** wartości, które od teraz skalują
się razem z układem. Właściciel zatwierdził przepisanie ich na proporcję:

- `odstęp pod pasem faktów` na `/oferta/online/` i `/oferta/egzamin-osmoklasisty/` —
  zamiast `48` sprawdza **trzy krotności stopnia pisma**;
- `miara przypisu` u ósmoklasisty — zamiast `960` sprawdza **60 krotności**,
  czyli `60rem` z §18.

Na pulpicie produkcyjnym to dokładnie te same liczby. Wymóg z §18, żeby obie strony
trzymały tę samą wartość, jest spełniony tak samo jak wcześniej.

Osobno poprawiona została **nawigacja** w teście kotwicy sekcji 05 — nie asercja.
Test przechodził przez trzy szerokości w tej samej karcie, a przeglądarka przewija
do kotwicy raz, przy wczytaniu dokumentu. Zmiana rozmiaru okna przesuwała w tym
czasie cel. Do tej pory różnica była niewidoczna, bo dokument miał przy 1280, 1440
i 1920 px podobną wysokość; teraz różni się o ćwierć. **Przy świeżo otwartym oknie
kotwica trafia poprawnie przy każdej szerokości** — nagłówek 97 / 109 / 146 px pod
belką, cztery akapity z czterech w kadrze.

## Odstępstwo: WCAG 2.2 AA, kryterium 1.4.4 „Resize text"

To rozwiązanie **częściowo neutralizuje powiększenie przeglądarki**. Przy 125%
powiększenia tekst ma fizycznie dokładnie tyle samo pikseli co przy 100%, bo okno
CSS maleje, a razem z nim korzeń.

Dla osoby słabowidzącej, która powiększa stronę żeby ją przeczytać, znaczy to, że
powiększenie w zakresie **100–175% nie zwiększa tekstu**. Kryterium 1.4.4 wymaga
skalowania tekstu do 200% bez utraty treści i funkcji.

**Czego odstępstwo NIE narusza:**

- treść nie znika i nic nie jest ucinane w całym zakresie 100–200% — sprawdza to
  `scripts/sprawdz-skalowanie.mjs` na czterech stronach;
- **powyżej 175% powiększenie znowu działa** — korzeń dobija do dolnej granicy
  12 px i dalej nie maleje, więc tekst rośnie fizycznie;
- układ mobilny i systemowe powiększenie czcionki są nietknięte, bo poniżej 992 px
  korzeń wraca do 16 px;
- `text-size-adjust: 100%` zostaje bez zmian.

**Dlaczego mimo to przyjęte.** Właściciel zgłaszał wadę trzykrotnie i obejrzał
wariant bez skalowania pisma — w nim na szerokim monitorze zostawał drobny tekst
pośrodku pustki, a przy 50% powiększenia tekst miał fizycznie 8 px i był nieczytelny.
Wariant pośredni (skalowanie o połowie tempa okna) zdejmował jeden problem z trzech
i został odrzucony po pomiarach. Decyzja jest świadoma, a nie przeoczeniem.

To **drugie** świadome odstępstwo od WCAG w tym projekcie, obok kontrastu tekstu
(§16, decyzja właściciela z 23.09.2026).

## Konsekwencje

- Marginesy znikają na całym zakresie od 1280 do 3840 px.
- Typografia poniżej 1536 px zmienia się względem produkcji — przy 1280 i 1440 px
  wszystko jest odpowiednio mniejsze. Poniżej 992 px nic się nie zmienia.
- Sekcje zamknięte D7–D21 były strojone przy korzeniu 16 px. Ich **proporcje**
  są zachowane, bo skaluje się wszystko naraz, ale wartości bezwzględne przy
  1280 i 1440 px są inne niż na produkcji.
- Każda przyszła wartość pilnowana w testach ma być zapisana jako **krotność
  stopnia pisma**, nie jako liczba pikseli.
- Nowe narzędzie odbioru: `scripts/sprawdz-skalowanie.mjs` — sprawdza marginesy
  na dziesięciu szerokościach i przycięcia przy powiększeniu 100–200%.

## Odrzucone warianty

**Granica kontenera w pikselach, korzeń bez zmian.** Marginesy znikały, ale nagłówki
plakatowe przestawały wypełniać kolumnę — przy 1920 px wypełnienie spadało z 90%
do 73%, bo kolumna rosła, a górne granice skali `--step-*` są w `rem`.

**Korzeń rosnący o połowie tempa okna.** Sekcja 05 przestawała mieścić się w ekranie
przy 1920 × 900 (po skoku z menu jeden akapit z czterech), a wezwanie w hero
zjeżdżało o 57 px.

**Punkt sklejenia przy 1920 px zamiast 1536.** Zachowywał typografię produkcyjną
poniżej 1920, ale zostawiał ten sam problem z nagłówkami plakatowymi: kontener
rósł o ćwierć bez wzrostu pisma.

**Skalowanie zależne od wysokości okna** (`min(100vw / 96, 100vh / 54)`). Okno
przeglądarki jest zawsze niższe od ekranu, więc na pulpicie 1920 × 1080 dawało
korzeń mniejszy niż produkcyjny.
