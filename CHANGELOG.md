# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/pl/1.1.0/), wersjonowanie: [SemVer](https://semver.org/lang/pl/).

Wpisy opisują **zmiany widoczne dla odbiorcy strony albo dla osoby wdrażającej** —
nie każdy commit. Szczegóły decyzji projektowych są w `docs/ADR/` i w `CLAUDE.md` §15.

## [Nieopublikowane]

Nic.

## [1.0.0] — 2026-09-19

Pierwsze wydanie produkcyjne. Serwis ma dziesięć adresów, własną domenę
i komplet dokumentów odbiorowych.

### Dodane

- **Strona główna** w dziewięciu aktach: hero, po lekcjach, korzyści, oferta,
  o High Five, metoda, cennik, nabór, lokalizacje, seniorzy, FAQ i kontakt.
- **Cztery podstrony produktowe** pod `/oferta/`: klasy 1-7, egzamin ósmoklasisty,
  seniorzy, online 1 na 1 (ADR 0007, 0008).
- **Strony pomocnicze:** `/oferta/` jako hub, `/cennik/`, `/lokalizacje/`, `/kariera/`.
- **`/polityka-prywatnosci/`** — dokument prawny właściciela jako HTML, z PDF-em
  do pobrania i spisem treści podążającym za czytaną sekcją (ADR 0011).
- **Sekcja „Nowa grupa"** na `/lokalizacje/` — ścieżka dla szkoły, w której
  High Five jeszcze nie prowadzi zajęć.
- **Grafika Open Graph** wspólna dla całego serwisu, generowana z krojów i kolorów
  strony przez `node scripts/make-og-image.mjs`.
- **`LICENSE.md`** — prawa zastrzeżone. Publiczne repozytorium nie jest licencją
  open source (ADR 0012).
- **`sitemap.xml`, `robots.txt`, JSON-LD** i komplet metadanych Open Graph.

### Zmienione

- **Adres kanoniczny: `https://www.highfive.academy`** zamiast adresu technicznego
  GitHub Pages (ADR 0010). Podmiana wykonana przed publikacją, żeby wyszukiwarka
  nie zdążyła zaindeksować adresu tymczasowego.
- Cena podawana za **45 minut**, nie za godzinę — lekcja tyle trwa.
- Wezwanie główne brzmi `Zapisz się na zajęcia` zamiast `Zgłoś dziecko do grupy`
  (ADR 0006).
- Scena metody: `MÓW PRÓBUJ POPRAWIAJ UŻYWAJ` — poprawka błędu językowego
  w dokumencie źródłowym (ADR 0009).

### Znane odstępstwa

- **Brak formularza zgłoszeniowego** (decyzja D2). GitHub Pages nie ma warstwy
  serwerowej; kontakt prowadzi przez `mailto:` i `tel:` obecne w DOM od pierwszego
  renderu.
- **Brak nagłówków bezpieczeństwa i kontroli cache** (ADR 0003). Usunie je dopiero
  warstwa typu Cloudflare przed Pages — sama domena nie wystarcza.
- **Brak środowiska preview** (ADR 0004). Rolę podglądu pełni lokalne
  `npm run preview`, testy w CI i artefakt builda.
