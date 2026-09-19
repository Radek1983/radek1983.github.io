# Hosting

## Profil obecny

| Parametr      | Stan                                                                  |
| ------------- | --------------------------------------------------------------------- |
| Hosting       | GitHub Pages, **user site** (repozytorium `radek1983.github.io`)      |
| Źródło        | GitHub Actions (`.github/workflows/deploy-production.yml`)            |
| Domena        | `www.highfive.academy` — podpięta 19.09.2026, decyzja D3              |
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

Domena jest od 19.09.2026 podpięta (ADR 0010), więc obie drogi są **dostępne od zaraz** —
brakuje wyłącznie decyzji właściciela. Dopóki jej nie ma, odstępstwa z ADR 0003 obowiązują
bez zmian: sama domena żadnego nagłówka nie dokłada.

**1. Cloudflare przed GitHub Pages** — Pages zostaje hostem, domena idzie przez Cloudflare,
jedna reguła Response Header Transform ustawia CSP, HSTS, `nosniff`, `Referrer-Policy`
i `Permissions-Policy`. Cache Rules dają per-ścieżkowe TTL. Zamyka wszystkie pozycje
oznaczone wyżej jako niemożliwe.

**2. Przeniesienie na hosting z konfiguracją nagłówków** — np. Cloudflare Pages z plikiem
`_headers`. Wymaga zmiany procedury wdrożenia.

Wybór wymaga decyzji właściciela i osobnego ADR.

## DNS

`www.highfive.academy` — domena kupiona przez właściciela, rekordy ustawione i podpięte
po stronie GitHuba **19.09.2026** (ADR 0010). Ta sama domena obsługuje pocztę od 16.09.2026
(decyzja D6).

Stan i zasady:

- Właścicielem domeny i konta u rejestratora pozostaje Zamawiający.
- Wariant **z `www`**, nie apex: jeden `CNAME` zamiast czterech rekordów A na adresy
  GitHuba, które bywają zmieniane. Ten sam wariant stoi w grafice Open Graph.
- **Publikacja w GitHub Pages jest dziś wyłączona** decyzją właściciela. Po jej włączeniu:
  potwierdzić „Enforce HTTPS" — przy własnej domenie certyfikat Let's Encrypt wystawia się
  dopiero po propagacji DNS i do tego czasu opcja bywa wyszarzona.
- Pliku `CNAME` repozytorium nie wersjonuje; przy wdrożeniu przez GitHub Actions domena
  żyje w konfiguracji Pages. Gdyby odpięła się przy kolejnym wdrożeniu — `public/CNAME`
  z jedną linią `www.highfive.academy`, zgodną z ustawieniem co do znaku.
- HSTS włączać dopiero po stabilnym HTTPS; `preload` wymaga osobnej świadomej decyzji.
- Adres kanoniczny stoi w jedenastu plikach HTML, `sitemap.xml`, `robots.txt` i w dwóch
  plikach testów. Kontrola przy zmianie: `grep` po starym adresie ma nie dawać trafień
  poza ADR-ami, które są zapisem historii.
