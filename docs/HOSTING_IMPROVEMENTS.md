# Co zyskamy po dołożeniu warstwy CDN

`docs/HOSTING.md` opisuje **stan faktyczny** i ograniczenia GitHub Pages.
Ten dokument jest **planem działania**: co konkretnie trzeba zrobić, w jakiej
kolejności i jak sprawdzić, że zadziałało.

**Nic z tego nie jest dziś wykonane.** Wdrożenie wymaga decyzji właściciela
i osobnego ADR — wiąże się z założeniem konta w usłudze zewnętrznej
i przełączeniem serwerów nazw domeny.

## Czego dziś brakuje — pomiar, nie teoria

Nagłówki odpowiedzi z `https://www.highfive.academy/`, stan na 23.09.2026:

| Nagłówek                    | Stan           | Skutek                                                         |
| --------------------------- | -------------- | -------------------------------------------------------------- |
| `Strict-Transport-Security` | **brak**       | pierwsze wejście po `http://` idzie jawnym tekstem przed 301   |
| `X-Content-Type-Options`    | **brak**       | przeglądarka może zgadywać typ zawartości                      |
| `Referrer-Policy`           | **brak**       | działa tylko `<meta name="referrer">`, słabsze i późniejsze    |
| `Permissions-Policy`        | **brak**       | brak deklaracji o kamerze, mikrofonie, geolokalizacji          |
| `Content-Security-Policy`   | tylko w `meta` | `frame-ancestors` i `report-uri` są w `meta` **ignorowane**    |
| `Cache-Control`             | `max-age=600`  | sztywne dla wszystkiego — brak `immutable` dla plików z hashem |

Ostatni wiersz jest najbardziej wymierny: pliki CSS, JS i obrazy mają
w nazwie skrót zawartości, więc **nigdy się nie zmieniają** i mogłyby być
trzymane w pamięci przeglądarki rok. Dziś przeglądarka odpytuje o nie co
dziesięć minut.

## Przekierowania

**Działają już dziś** i nie wymagają CDN — GitHub Pages sam obsługuje
przekierowanie z apexu i z adresu technicznego na kanoniczny:

```
http://highfive.academy/        -> 301 -> https://www.highfive.academy/
http://www.highfive.academy/    -> 301 -> https://www.highfive.academy/
https://radek1983.github.io/    -> 301 -> https://www.highfive.academy/
```

**Czego GitHub Pages nie potrafi:** przekierowań wewnątrz serwisu. Stare
adresy `/dla-seniorow/` i `/online/` są dziś stronami HTML z `meta refresh`,
`canonical` na nowy adres i `noindex, follow` (ADR 0008). To rozwiązanie
poprawne w granicach hostingu, ale wyszukiwarka traktuje je słabiej niż
prawdziwe 301, a użytkownik widzi przez moment pustą stronę.

**Zostawiamy je bez zmian**, dopóki nie ma warstwy serwerowej. Podmiana na
cokolwiek innego w obecnym hostingu byłaby pozorowaniem.

## Plan wdrożenia — Cloudflare przed GitHub Pages

Wariant najmniej inwazyjny: **Pages zostaje hostem**, zmienia się tylko to,
przez co przechodzi ruch. Kod, wdrożenie i workflow bez zmian.

1. **Konto Cloudflare**, plan darmowy. Reguły nagłówków i cache są w nim
   dostępne.
2. **Dodanie domeny** `highfive.academy`. Cloudflare zaimportuje rekordy DNS
   — trzeba je porównać z obecnymi **co do znaku**, zwłaszcza rekordy MX
   poczty, bo na tej domenie działa `kontakt@highfive.academy` (D6).
   **Błąd tutaj kładzie pocztę, nie stronę.**
3. **Przełączenie serwerów nazw** u rejestratora na te wskazane przez
   Cloudflare. Propagacja do 24 godzin; w tym czasie strona działa,
   ale część ruchu idzie starą drogą.
4. **Tryb SSL: Full (strict)** — inaczej Cloudflare łączy się z Pages bez
   szyfrowania albo bez weryfikacji certyfikatu.
5. **Reguła Response Header Transform** ustawiająca nagłówki. Wartości
   docelowe są gotowe w `ops/headers.example.conf`, w trzech dialektach —
   sekcja o Cloudflare to punkt 3 tamtego pliku.
6. **Cache Rules**: `immutable` i długi TTL dla `/assets/*` (pliki z hashem
   w nazwie), krótki dla HTML.
7. **HSTS dopiero na końcu**, po kilku dniach stabilnego HTTPS.
   `preload` wymaga osobnej decyzji — jest **trudny do wycofania**
   i unieruchamia domenę na `https` w przeglądarkach na miesiące.

## Jak sprawdzić, że zadziałało

Po każdym kroku, nie na końcu:

```bash
# nagłówki bezpieczeństwa
curl -sSI https://www.highfive.academy/ | grep -iE "strict-transport|content-type-options|referrer-policy|permissions-policy|content-security"

# cache plików z hashem — oczekujemy długiego max-age i immutable
curl -sSI https://www.highfive.academy/assets/main-*.css | grep -i cache-control

# przekierowania nadal działają
for u in http://highfive.academy/ http://www.highfive.academy/ https://radek1983.github.io/; do
  curl -sS -o /dev/null -w "%{http_code} -> %{redirect_url}\n" "$u"
done

# poczta żyje — najważniejsze po zmianie DNS
nslookup -type=MX highfive.academy
```

Dodatkowo: wyślij do siebie wiadomość na `kontakt@highfive.academy`
i sprawdź, czy dochodzi. Rekordy MX mogą wyglądać poprawnie, a poczta i tak
nie działać, jeśli zgubi się rekord SPF lub DKIM.

Smoke test w `deploy-production.yml` sprawdza już kod 200, treść krytyczną
i przekierowania — **po wdrożeniu CDN warto dołożyć do niego asercje
nagłówków**, żeby ich zniknięcie zatrzymało wdrożenie.

## Czego ten plan NIE rozwiązuje

- **Środowisko preview** — ochrona dostępu do podglądu wymaga GitHub
  Enterprise Cloud (ADR 0004). Cloudflare Pages ma własne podglądy, ale to
  już wariant 2, czyli zmiana hosta i procedury wdrożenia.
- **Przekierowania wewnątrz serwisu** — działałyby dopiero po przeniesieniu
  na Cloudflare Pages albo po dołożeniu reguł przekierowań w Cloudflare,
  co jest wykonalne, ale mnoży miejsca, w których żyje konfiguracja.

## Ryzyka

| Ryzyko                               | Skutek                          | Jak ograniczyć                                          |
| ------------------------------------ | ------------------------------- | ------------------------------------------------------- |
| zgubione rekordy MX przy imporcie    | **poczta przestaje działać**    | zrzut obecnych rekordów przed zmianą, porównanie po     |
| zbyt ostra CSP                       | strona traci style albo skrypty | najpierw tryb `report-only`, dopiero potem egzekwowanie |
| HSTS z `preload` przedwcześnie       | domena zablokowana na `https`   | włączać po tygodniu stabilnego HTTPS, `preload` osobno  |
| Full (strict) przy złym certyfikacie | błąd 526 na całej stronie       | sprawdzić certyfikat Pages przed przełączeniem trybu    |

Wdrożenie tego planu **usuwa w całości odstępstwa opisane w ADR 0003**
— zarówno nagłówki bezpieczeństwa, jak i cache.
