# ADR 0004: Brak środowiska preview/staging

Status: Accepted — **odstępstwo od specyfikacji**
Data: 2026-09-06

## Kontekst

Specyfikacja rozdz. 14 przewiduje trzy środowiska: development, preview/staging i production.
Preview ma służyć akceptacji zmian przed produkcją, musi być oznaczone `noindex, nofollow`
i — o ile to możliwe — chronione dostępem. Rozdz. 17.2 dodaje, że sam `robots.txt` nie
wystarcza jako ochrona przed indeksacją znanego adresu, i wskazuje nagłówek `X-Robots-Tag`.

Struktura repozytorium w rozdz. 4 przewiduje plik `.github/workflows/deploy-preview.yml`.

Dwie przeszkody:

1. **Ochrona dostępu do GitHub Pages wymaga GitHub Enterprise Cloud** i dotyczy wyłącznie
   project sites w repozytoriach należących do organizacji. To repozytorium jest user site
   na koncie osobistym — ochrona dostępu jest niedostępna niezależnie od planu.
2. **GitHub Pages nie pozwala ustawić `X-Robots-Tag`** (patrz ADR 0003), więc jedyną
   dostępną barierą byłby znacznik `meta` — który rozdz. 17.2 uznaje za niewystarczający.

## Decyzja

Na tym etapie **nie tworzymy środowiska preview**. Plik `deploy-preview.yml` nie powstaje —
zgodnie z rozdz. 32.2, który mówi wprost, że nie należy tworzyć opcjonalnych plików,
jeśli projekt ich nie używa.

Rolę podglądu przed scaleniem pełnią:

- **`npm run build && npm run preview`** lokalnie — dokładnie ten sam artefakt, który
  trafiłby na produkcję, serwowany z `dist/`;
- **testy Playwright** uruchamiane w CI na każdym Pull Requeście, w trzech konfiguracjach
  przeglądarek, na buildzie produkcyjnym;
- **artefakt builda** z CI, dostępny do pobrania z uruchomienia workflow.

## Rozważane alternatywy

**Cloudflare Pages preview** — ustawia `X-Robots-Tag: noindex` na każdym wdrożeniu
podglądowym automatycznie, daje osobny origin i pozwala włączyć ochronę dostępu przez
Cloudflare Access na darmowym planie. **To jest najlepsze techniczne rozwiązanie tego
problemu.** Odrzucone teraz wyłącznie dlatego, że wprowadza kolejnego dostawcę i konto do
utrzymania, a projekt ma jednego wykonawcę i krótką pętlę zwrotną. Do rozważenia razem
z decyzją D3, bo ten sam dostawca zamyka też odstępstwo z ADR 0003.

**Osobne repozytorium jako project site** — dałoby adres `radek1983.github.io/preview/`,
czyli **ten sam origin co produkcja**. To gorzej niż brak podglądu: podgląd konkurowałby
z produkcją w indeksie na tym samym hoście, a `noindex` byłby dostępny tylko przez `meta`.
Odrzucone.

**Katalog `preview/` w artefakcie produkcyjnym** — kod podglądowy trafiałby do wdrożenia
produkcyjnego. Odrzucone stanowczo.

## Konsekwencje

Pozycja `SEO-002` z macierzy rozdz. 27 („Preview/staging jest noindex i nie konkuruje
z produkcją") jest **N/A** — środowisko nie istnieje, więc nie może konkurować w indeksie.
To odstępstwo od struktury, nie realne ryzyko SEO.

Ryzyko przeniesione na wykonawcę: zmiany są weryfikowane lokalnie i przez testy
automatyczne, bez etapu akceptacji na osobnym adresie. Przy jednoosobowej realizacji
i statycznej stronie bez integracji jest to akceptowalne.

**Jeżeli w projekcie pojawi się osoba akceptująca zmiany po stronie biznesowej, ten ADR
należy zrewidować** — wtedy podgląd na osobnym adresie przestaje być wygodą, a staje się
warunkiem sensownego procesu odbioru. Rekomendowanym rozwiązaniem jest wtedy Cloudflare Pages.
