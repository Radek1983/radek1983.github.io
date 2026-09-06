# ADR 0003: Nagłówki bezpieczeństwa i cache nieosiągalne na GitHub Pages

Status: Accepted — **odstępstwo od specyfikacji**
Data: 2026-09-06

## Kontekst

Specyfikacja rozdz. 20.1 oraz załącznik A.5 wymagają zestawu nagłówków HTTP:
`Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`,
`Referrer-Policy`, `Permissions-Policy` oraz ograniczenia `frame-ancestors`.
Rozdz. 15.2 wymaga długiego cache `immutable` dla hashowanych assetów i krótkiego dla HTML.

**GitHub Pages nie udostępnia żadnego mechanizmu ustawiania nagłówków odpowiedzi.**
Nie ma pliku `_headers`, nie ma konfiguracji, nie ma API.

Zweryfikowane empirycznie — pełny zestaw nagłówków zwracanych przez działającą witrynę Pages:

```
Last-Modified, ETag, expires, Cache-Control: max-age=600, Age, Server: GitHub.com
```

## Decyzja

Przyjmujemy odstępstwo. Realizujemy podzbiór osiągalny przez znaczniki HTML, a docelową
politykę zapisujemy w `ops/headers.example.conf` jako gotową do zastosowania.

### Co realizujemy przez HTML

- `Content-Security-Policy` przez `<meta http-equiv>` — działają `default-src`, `script-src`,
  `style-src`, `img-src`, `font-src`, `connect-src`, `base-uri`, `form-action`, `object-src`,
  `upgrade-insecure-requests`.
- `Referrer-Policy` przez `<meta name="referrer">` — **w pełni spełnione**, bez odstępstwa.

### Czego nie da się zrealizować

Zgodnie ze specyfikacją W3C CSP, przy dostarczaniu polityki znacznikiem `meta`
**ignorowane** są dyrektywy: `frame-ancestors`, `report-uri`, `report-to`, `sandbox`.

Bez odpowiednika w znacznikach w ogóle: `X-Content-Type-Options`, `Permissions-Policy`,
`Strict-Transport-Security`.

Cache: Pages narzuca `max-age=600` na wszystko. HTML w tej wartości jest akceptowalny —
to rzeczywiście krótki cache. Hashowane assety **nie** dostaną `immutable, max-age=31536000`.

`<meta http-equiv="Cache-Control">` nie jest respektowany przez cache HTTP przeglądarek
i nie zostanie dodany — to nieporozumienie, nie obejście.

## Wpływ i jego ograniczenie

**Brak `frame-ancestors`** — strona może zostać osadzona w ramce na obcej witrynie.
Realne ryzyko clickjackingu jest tu niskie: strona nie ma formularzy (decyzja D2),
logowania ani żadnej akcji zmieniającej stan. Jedyne interakcje to nawigacja po kotwicach
oraz odnośniki `tel:` i `mailto:`.

**Brak `nosniff`** — łagodzone tym, że Pages serwuje poprawny `Content-Type` dla
hashowanych plików `.js` i `.css`.

**Brak HSTS** — łagodzone opcją „Enforce HTTPS" w ustawieniach Pages, która daje trwałe
przekierowanie HTTP → HTTPS, oraz dyrektywą `upgrade-insecure-requests` w CSP. Pozostaje
okno pierwszego żądania.

Świadomie **nie** zapisujemy w dokumentacji, że `github.io` jest na liście preload HSTS —
tej informacji nie udało się potwierdzić u źródła, a `github.io` jest sufiksem publicznym.

**Brak długiego cache dla assetów** — powtarzający się odwiedzający revaliduje assety
po 10 minutach. Koszt to żądania warunkowe kończące się `304`, nie pełne pobrania,
więc wpływ na LCP przy powrocie jest niewielki. Efekt uboczny jest korzystny: nie ma ryzyka,
że nieaktualny `index.html` wskaże na nieistniejące hashe assetów.

## Ścieżka wyjścia

Odstępstwo znika w całości, gdy pojawi się własna domena (decyzja D3) i strona trafi za
**Cloudflare** — jedna reguła Response Header Transform ustawia wszystkie brakujące nagłówki,
a Cache Rules dają per-ścieżkowe TTL. Pages pozostaje wtedy hostem.

To jest argument za wcześniejszym niż późniejszym zakupem domeny.

## Konsekwencje formalne

Pozycje `SEC-002` i `HOST-002` z macierzy odbioru rozdz. 27 są **spełnione częściowo,
z opisanym wyjątkiem**. Macierz zgodności pozycja po pozycji: `docs/HOSTING.md`.
