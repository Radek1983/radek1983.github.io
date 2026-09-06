# Hosting

## Profil obecny

| Parametr      | Stan                                                                  |
| ------------- | --------------------------------------------------------------------- |
| Hosting       | GitHub Pages, **user site** (`radek1983.github.io`)                   |
| Źródło        | GitHub Actions (`.github/workflows/deploy-production.yml`)            |
| Domena        | `radek1983.github.io` — własna domena planowana, decyzja D3           |
| `base` w Vite | `/` — user site serwuje z korzenia. **Nigdy** `/radek1983.github.io/` |
| HTTPS         | Automatyczne, certyfikat odnawiany przez GitHuba                      |
| HTTP → HTTPS  | Wymaga włączenia „Enforce HTTPS" w Settings → Pages                   |
| Compression   | Brotli/gzip po stronie GitHuba, bez możliwości konfiguracji           |
| HTTP/2        | Tak                                                                   |
| Własna 404    | `404.html` w korzeniu builda                                          |
| Logi HTTP     | Niedostępne                                                           |

## Macierz zgodności ze specyfikacją

Kolumna „Stan" mówi, czy wymaganie jest spełnione **na obecnym hostingu**.

| Wymaganie (spec)                      | Stan          | Uwaga                                                           |
| ------------------------------------- | ------------- | --------------------------------------------------------------- |
| HTTPS, automatyczny certyfikat        | ✅ spełnione  |                                                                 |
| Przekierowanie HTTP → HTTPS           | ✅ spełnione  | Wymaga „Enforce HTTPS" w ustawieniach                           |
| Compression HTML/CSS/JS/SVG           | ✅ spełnione  | Po stronie GitHuba                                              |
| Własna strona 404                     | ✅ spełnione  | `404.html`                                                      |
| Wdrożenie automatyczne i powtarzalne  | ✅ spełnione  | GitHub Actions, `npm ci` + `npm run build`                      |
| Rollback z poprzedniego taga          | ✅ spełnione  | `workflow_dispatch` z parametrem `ref`                          |
| `Content-Security-Policy`             | ⚠️ częściowo  | Tylko przez `<meta>`, bez `frame-ancestors`. Patrz ADR 0003     |
| `Referrer-Policy`                     | ✅ spełnione  | `<meta name="referrer">`                                        |
| `X-Content-Type-Options: nosniff`     | ❌ niemożliwe | Brak odpowiednika w `<meta>`. Patrz ADR 0003                    |
| `Permissions-Policy`                  | ❌ niemożliwe | Brak odpowiednika w `<meta>`. Patrz ADR 0003                    |
| `frame-ancestors` / anty-clickjacking | ❌ niemożliwe | Dyrektywa ignorowana w `<meta>` zgodnie ze specyfikacją W3C CSP |
| `Strict-Transport-Security`           | ❌ niemożliwe | Patrz ADR 0003                                                  |
| Cache: krótki dla HTML                | ✅ spełnione  | `max-age=600`                                                   |
| Cache: `immutable` dla hashed assets  | ❌ niemożliwe | Pages narzuca `max-age=600` na wszystko. Patrz ADR 0003         |
| Preview/staging `noindex`             | ❌ brak       | Środowisko nie istnieje. Patrz ADR 0004                         |
| Dostęp do logów HTTP                  | ❌ niemożliwe | GitHub Pages nie udostępnia                                     |

## Co realnie serwuje GitHub Pages

Zweryfikowane empirycznie na działającej witrynie Pages — pełny zestaw nagłówków odpowiedzi:

```
HTTP/2 200
Last-Modified: ...
ETag: "..."
expires: ...
Cache-Control: max-age=600
Age: ...
Server: GitHub.com
```

Nie ma żadnego nagłówka bezpieczeństwa i nie istnieje mechanizm ich dodania — brak pliku
`_headers`, brak konfiguracji, brak API.

## Jak spełnić brakujące wymagania

Docelowa polityka nagłówków i cache jest zapisana w `ops/headers.example.conf` w trzech
dialektach. Żaden nie jest dziś wykonywany.

Dwie drogi, gdy pojawi się własna domena (decyzja D3):

**1. Cloudflare przed GitHub Pages** — Pages zostaje hostem, domena idzie przez Cloudflare,
jedna reguła Response Header Transform ustawia CSP, HSTS, `nosniff`, `Referrer-Policy`
i `Permissions-Policy`. Cache Rules dają per-ścieżkowe TTL. Zamyka wszystkie pozycje
oznaczone wyżej jako niemożliwe.

**2. Przeniesienie na hosting z konfiguracją nagłówków** — np. Cloudflare Pages z plikiem
`_headers`. Wymaga zmiany procedury wdrożenia.

Wybór wymaga decyzji właściciela i osobnego ADR.

## DNS

Domena nie jest jeszcze kupiona. Gdy będzie:

- Właścicielem domeny i konta u rejestratora pozostaje Zamawiający.
- Rekordy DNS i procedura migracji zostaną dopisane w tym pliku.
- Przed migracją obniżyć TTL z wyprzedzeniem.
- HSTS włączać dopiero po stabilnym HTTPS; `preload` wymaga osobnej świadomej decyzji.
- Adres kanoniczny jest w jednym miejscu — podmiana domeny to jedna zmiana (decyzja D3).
