# ops/

Dokumentacja operacyjna hostingu. Pliki w tym katalogu **nie są wykonywane** — to wzorce
konfiguracji do zastosowania przez administratora hostingu.

## Stan faktyczny

Strona działa na **GitHub Pages**, który nie pozwala ustawiać nagłówków HTTP ani reguł cache.
Żaden plik z tego katalogu nie jest dziś aktywny.

Macierz zgodności — co jest spełnione, a co nie — znajduje się w `docs/HOSTING.md`.
Uzasadnienie odstępstwa: `docs/ADR/0003-naglowki-bezpieczenstwa-na-github-pages.md`.

## Pliki

| Plik                     | Przeznaczenie                                                     |
| ------------------------ | ----------------------------------------------------------------- |
| `headers.example.conf`   | Docelowa polityka nagłówków bezpieczeństwa i cache, trzy dialekty |
| `redirects.example.conf` | Przekierowania domenowe i reguła canonical host                   |

## Kiedy to wykorzystać

Gdy strona trafi za Cloudflare albo na hosting z konfigurowalnymi nagłówkami — patrz sekcja
„Jak spełnić brakujące wymagania" w `docs/HOSTING.md`.
