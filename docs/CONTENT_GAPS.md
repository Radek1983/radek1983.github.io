# Content gaps

Braki treści i materiałów. Zasada anty-halucynacyjna z master promptu §3: czego nie ma
w źródłach, tego **nie wymyślamy** — trafia tutaj.

Kolumna „Blokuje release" mówi, czy brak uniemożliwia publikację. Brak nieblokujący
nie zatrzymuje pracy.

## Otwarte

| #    | Brak                                                                                                                              | Właściciel danych         | Miejsce użycia                                  | Blokuje release                                                                         |
| ---- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------- |
| G-01 | **Docelowe dane kontaktowe High Five** — obecne (`janek.gitara@onet.pl`, `+48 789 789 789`) są tymczasowe i prywatne, nie firmowe | Właściciel                | `index.html` sekcja `#kontakt`, stopka, JSON-LD | **Nie** — wartości tymczasowe działają. Do podmiany przed kampanią                      |
| G-02 | **Grafika Open Graph** (`og-image.jpg`, 1200 × 630)                                                                               | Wykonawca albo właściciel | `public/social/`, `<meta property="og:image">`  | **Nie** — brak obrazu nie psuje strony, tylko podgląd linku                             |
| G-03 | **Logo / znak graficzny High Five** w SVG                                                                                         | Właściciel                | Header, stopka, favicon                         | **Nie** — wordmark jest dziś realizowany typografią, co jest zgodne z kierunkiem briefu |
| G-04 | **Grafik i częstotliwość zajęć** — ile razy w tygodniu, w jakich godzinach                                                        | Właściciel                | Sekcja oferty, FAQ                              | **Nie** — brief zabrania publikacji bez potwierdzenia                                   |
| G-05 | **Zasady dołączenia po 1 października**                                                                                           | Właściciel                | FAQ                                             | **Nie**                                                                                 |
| G-06 | **Polityka nieobecności i odrabiania**                                                                                            | Właściciel                | FAQ                                             | **Nie**                                                                                 |
| G-07 | **Czy materiały są w cenie**                                                                                                      | Właściciel                | FAQ, cennik                                     | **Nie**                                                                                 |
| G-08 | **Zasady rezygnacji**                                                                                                             | Właściciel                | FAQ, regulamin                                  | **Nie**                                                                                 |
| G-09 | **Dane rejestrowe firmy** — nazwa, NIP, adres                                                                                     | Właściciel                | Stopka, JSON-LD                                 | **Nie** dla obecnego zakresu. **Tak**, jeśli powstanie formularz albo płatności         |
| G-10 | **Polityka prywatności i klauzula RODO**                                                                                          | Prawnik / właściciel      | Osobna podstrona                                | **Nie** dziś. **Tak** w momencie zbierania danych osobowych — czyli gdy wróci formularz |
| G-11 | **Benchmark** „One-page i slide-animation dla szkoły angielskiego" wymieniony w master prompcie §2                                | Właściciel                | Audyt kompletności informacji                   | **Nie** — checklistę 8 pytań klienta wzięliśmy z master promptu §14                     |
| G-12 | **Informacje o lektorach** — nazwiska, kwalifikacje, doświadczenie                                                                | Właściciel                | Brak sekcji; architektura pozwala dodać         | **Nie** — brief zabrania wymyślania                                                     |
| G-13 | **Opinie i referencje**                                                                                                           | Właściciel                | Brak sekcji                                     | **Nie** — zakaz wymyślonych ocen jest testowany automatycznie w JSON-LD                 |

## Materiały dostarczone

| Materiał                      | Status                                                                                                                         |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Siedem kadrów fotograficznych | **Dostarczone.** Wygenerowane przez AI. Rozdzielczości poniżej minimum z briefu — szczegóły i skutki w `docs/ART_DIRECTION.md` |
| Copy deck                     | **Dostarczony** w briefie v3, przeniesiony do `docs/COPY_DECK.md`                                                              |
| Fonty                         | **Dostarczone.** Inter 4.1, SIL OFL 1.1, samohostowane                                                                         |

## Zastrzeżenia do materiałów istniejących

**Zdjęcia nie przedstawiają rzeczywistych uczniów SP 402.** Zastrzeżenie jest publikowane
w stopce strony i nie wolno go usunąć. Atrybuty `alt` opisują sceny, nie przypisują ich
konkretnej placówce.

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
