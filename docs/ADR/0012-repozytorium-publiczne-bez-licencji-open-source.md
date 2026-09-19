# ADR 0012 — publiczne repozytorium bez licencji open source

- **Status:** przyjęte
- **Data:** 2026-09-19
- **Decyduje:** właściciel
- **Dotyczy:** `LICENSE.md`, prawa do kodu i projektu

## Kontekst

Repozytorium jest publiczne z przymusu technicznego, nie z wyboru: user site
GitHub Pages nie może być prywatny (odstępstwo od §3.1 specyfikacji, opisane
w `CLAUDE.md` §16). Do 19.09.2026 nie było w nim żadnego pliku licencyjnego —
ani `LICENSE`, ani `LICENSE.md`, ani `LICENSE.txt`, a `package.json` nie miał
pola `license`.

Brak licencji w publicznym repozytorium bywa czytany jako zaproszenie do
kopiowania, mimo że prawo autorskie działa odwrotnie. Właściciel chciał to
powiedzieć wprost.

## Decyzja

**`LICENSE.md` w katalogu głównym, o charakterze ALL RIGHTS RESERVED.**
Treść przekazał właściciel i jest przeniesiona co do znaku, w dwóch wersjach
językowych. Zastrzega kod, układ, system wizualny, teksty i grafiki; nie
rozciąga się na materiały podmiotów trzecich, które zostają przy swoich
licencjach.

**Żadnej licencji open source.** Ani MIT, ani Apache, ani GPL, ani Creative
Commons — projekt nie jest otwarty, a publiczny dostęp do repozytorium nie
jest zgodą na wykorzystanie.

## Konsekwencje

- Plik dotyczy **wyłącznie oryginalnych elementów High Five**. Licencji
  zależności npm, fontów Inter (SIL OFL) ani żadnych innych materiałów
  zewnętrznych nie kopiujemy do niego i nie usuwamy z projektu.
- `package.json` **zostaje bez pola `license`** — pakiet jest `private`, więc
  npm tego nie wymaga. Gdyby kiedyś miało się tam znaleźć, poprawną wartością
  jest `UNLICENSED` (identyfikator npm dla praw zastrzeżonych, nie mylić
  z licencją „The Unlicense").
- `README.md` na razie nie odsyła do licencji — to osobna decyzja właściciela.
- W widocznym interfejsie strony nie ma o tym ani słowa: to informacja dla
  osoby oglądającej repozytorium, nie dla rodzica szukającego zajęć.

## Odrzucone warianty

- **Brak pliku i poleganie na samym prawie autorskim.** Formalnie wystarcza,
  praktycznie nie: GitHub pokazuje przy repozytorium etykietę licencji i jej
  brak bywa czytany jako brak zastrzeżeń.
- **Licencja otwarta z klauzulą niekomercyjną.** Odrzucone: Creative Commons
  nie jest przeznaczone do licencjonowania kodu, a żadna licencja OSI nie
  pozwala zabronić wdrożenia kopii.
