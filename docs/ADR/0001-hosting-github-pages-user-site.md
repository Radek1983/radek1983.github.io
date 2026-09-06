# ADR 0001: Hosting na GitHub Pages jako user site

Status: Accepted
Data: 2026-09-06

## Kontekst

Strona jest statycznym one-page bez CMS i bez bazy danych (specyfikacja rozdz. 2.2). Repozytorium
nosi nazwę `radek1983.github.io`, czyli jest **user site** GitHub Pages. Właściciel nie posiada
jeszcze własnej domeny (decyzja D3).

## Decyzja

Hosting produkcyjny: **GitHub Pages, user site, źródło „GitHub Actions"**.

Konsekwencje dla konfiguracji builda:

- `base` w Vite wynosi `/`. Dla user site strona jest serwowana z korzenia domeny.
  Wartość `/radek1983.github.io/` to wzorzec dla **project site** i zepsułaby wszystkie
  odwołania do assetów.
- Wartość jest brana z `steps.pages.outputs.base_path` akcji `configure-pages`, która dla
  user site zwraca pusty ciąg. Zapis przez output zamiast wartości na sztywno przetrwa
  ewentualną zmianę nazwy repozytorium.
- Adres kanoniczny trzymany w jednym miejscu, żeby podmiana na własną domenę była
  jedną zmianą.

## Rozważane alternatywy

**Project site w osobnym repozytorium** — dawałby adres z podkatalogiem i wymagał `base`
innego niż `/`. Nazwa repozytorium jest już ustalona, więc bez korzyści.

**Cloudflare Pages** — pozwala ustawiać nagłówki HTTP i cache per ścieżka, czyli zamyka
odstępstwa z ADR 0003. Odrzucone na tym etapie: wymaga konta u kolejnego dostawcy, a strona
nie ma jeszcze własnej domeny. Do ponownego rozważenia przy realizacji decyzji D3.

**Zwykły hosting współdzielony** — wymagałby ręcznego lub półautomatycznego wdrożenia,
co kłóci się z wymogiem powtarzalnego deploymentu (rozdz. 13.3).

## Konsekwencje

Pozytywne: zero kosztów, HTTPS z automatycznym certyfikatem, wdrożenie przez GitHub Actions
w tym samym repozytorium co kod, brak dodatkowego dostawcy w łańcuchu.

Negatywne: brak możliwości ustawienia nagłówków HTTP i reguł cache (ADR 0003), brak środowiska
preview z ochroną dostępu (ADR 0004), brak dostępu do logów HTTP.

Wymóg ustawienia „Source = GitHub Actions" jest **ręczny** i nie da się go zapisać w kodzie.
Udokumentowany w `docs/DEPLOYMENT.md`.
