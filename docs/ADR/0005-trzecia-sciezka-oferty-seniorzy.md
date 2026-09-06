# ADR 0005: Trzecia ścieżka oferty — angielski dla seniorów

Status: Accepted — **odstępstwo od briefu, zatwierdzone przez właściciela**
Data: 2026-09-06

## Kontekst

Brief v3 i master prompt §6 opisują **dwie** ścieżki ofertowe: klasy 1–7 oraz klasa 8
z przygotowaniem do egzaminu ósmoklasisty. Kryterium odbioru **BIZ-006** brzmi wprost:
„tylko 2 główne ścieżki ofertowe".

Właściciel przekazał informację, że High Five prowadzi także **zajęcia z angielskiego dla
seniorów w Terminalu Kultury Gocław**, i polecił umieścić je na stronie. To fakt biznesowy
pochodzący bezpośrednio od właściciela, więc nie narusza zasady anty-halucynacyjnej —
narusza natomiast strukturę oferty z briefu.

Dodatkowa trudność: zatwierdzony copy deck ustala H1, `title` i `meta description` mówiące
wyłącznie o dzieciach w SP 402.

## Decyzja

Seniorzy wchodzą jako **osobna sekcja poza dziewięcioma aktami**, a nie jako trzeci moduł
w sekcji oferty. Dzieci pozostają głównym odbiorcą.

Konkretnie:

- **H1, `title` i `meta description` bez zmian.** Copy deck pozostaje nienaruszony,
  pozycjonowanie strony nadal celuje w rodzica.
- Sekcja `#seniorzy` stoi między lokalizacją a FAQ, w motywie **HF BLUE** — brief przypisuje
  temu kolorowi rolę „alternatywnego aktu marki". Sekcja jest wystarczająco daleko od
  granatowego modułu klasy 8, więc kolor nie powtarza się w polu widzenia.
- Etykieta sekcji **nie ma numeru aktu** — brzmi „Dodatkowo / Terminal Kultury Gocław".
  Numer sugerowałby kolejny krok tej samej decyzji rodzica, a to inny odbiorca.
- Konwersja idzie **do Terminalu Kultury**, nie do głównego CTA. Zapisy prowadzi tamta
  instytucja, więc kierowanie seniorów na `#kontakt` byłoby wprowadzaniem w błąd. Link
  ma wariant obrysowany, żeby nie konkurował z primary CTA (master prompt §7).
- Dane strukturalne dostają **drugie miejsce zajęć** w tablicy `location`. Oba są faktyczne.

## Rozważane alternatywy

**Dwie równorzędne grupy odbiorców** — przebudowa pozycjonowania, gdzie dzieci i seniorzy są
równymi filarami. Wymagałoby zmiany H1, tytułu i opisu SEO, czyli odejścia od zatwierdzonego
copy decku. Odrzucone: rozmyłoby przekaz, który master prompt §5 każe utrzymać ostry
(„po 15 sekundach użytkownik ma pamiętać: zajęcia po lekcjach w SP 402").

**Osobna podstrona** — lepsza pod SEO lokalne, bo pozwoliłaby na własny `title` i opis.
Odrzucona na tym etapie: master prompt §23 wymaga na start jednego kompletnego one-page
i zabrania rozszerzania zakresu bez zlecenia. **Do rozważenia, gdy oferta dla seniorów
zacznie wymagać własnego pozycjonowania w wyszukiwarce.**

**Trzeci moduł w sekcji oferty** — najprostsze technicznie, ale postawiłoby seniorów
w lejku decyzyjnym rodzica, obok klas 1–7 i klasy 8. Mylące dla obu grup.

## Fakty przekazane przez właściciela

| Pozycja           | Wartość                                                                                                                             |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Nazwa             | Angielski dla seniora, grupa początkująca                                                                                           |
| Miejsce           | Terminal Kultury Gocław                                                                                                             |
| Prowadzi          | Magda Germel                                                                                                                        |
| Poziom            | Początkujący                                                                                                                        |
| Koszt             | 45 zł za zajęcia                                                                                                                    |
| Model rozliczenia | **Wyłącznie abonament miesięczny.** Odpłatność zależy od liczby dni zajęć w miesiącu. Brak możliwości wykupienia pojedynczych zajęć |
| Źródło            | `terminalkultury.pl`, strona kursu                                                                                                  |

Model rozliczenia jest podany **wprost na stronie**, bo różni się od oferty dla dzieci.
Bez tego zastrzeżenia „45 zł" czytałoby się jak tańsza alternatywa dla „55 zł", a to inna
usługa, inne miejsce i inne zasady.

Publikujemy **imię i nazwisko osoby prowadzącej**, bo przekazał je właściciel i widnieje
publicznie na stronie Terminalu Kultury. **Nie publikujemy** jej kwalifikacji ani
doświadczenia — tego master prompt §3 zabrania bez potwierdzenia.

## Konsekwencje

**BIZ-006 z macierzy odbioru jest formalnie naruszone.** W raporcie końcowym pozycja musi
być opisana jako **odstępstwo zatwierdzone przez właściciela**, nie jako PASS. Struktura
strony chroni jednak intencję kryterium: w lejku dla rodzica nadal są dokładnie dwie ścieżki.

Braki do uzupełnienia, zapisane w `docs/CONTENT_GAPS.md`:

- **Dokładny adres Terminalu Kultury Gocław** — dziś w JSON-LD jest tylko miasto.
- **Termin i harmonogram zajęć** — strona nie podaje dni ani godzin.
- **Warunki uruchomienia grupy** — czy obowiązuje minimum uczestników.
