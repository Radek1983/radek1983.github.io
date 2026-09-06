# Deployment

Wdrożenie produkcyjne strony HIGH FIVE. Dokument opisuje stan faktyczny, nie plan.

## Środowiska

| Środowisko  | Gdzie                          | Kto wdraża                                | Indeksowanie   |
| ----------- | ------------------------------ | ----------------------------------------- | -------------- |
| development | `http://127.0.0.1:5173`        | `npm run dev` lokalnie                    | nie dotyczy    |
| production  | `https://radek1983.github.io/` | `.github/workflows/deploy-production.yml` | `index,follow` |

**Preview/staging nie istnieje.** Specyfikacja §14 go wymaga, ale GitHub Pages nie pozwala go
zabezpieczyć na tym planie — patrz `docs/ADR/0004-brak-srodowiska-preview.md`. Rolę podglądu
przed scaleniem pełni lokalne `npm run build && npm run preview` oraz artefakt builda z CI.

## Konfiguracja jednorazowa (już wykonana)

W ustawieniach repozytorium: **Settings → Pages → Build and deployment → Source = „GitHub Actions"**.

To ustawienie jest **obowiązkowe** i nie da się go ustawić z pliku workflow. Bez niego
`actions/deploy-pages` kończy się błędem.

Dla repozytorium o nazwie `<użytkownik>.github.io` GitHub domyślnie wybiera „Deploy from a branch"
i publikuje **surowe pliki źródłowe** z korzenia gałęzi domyślnej. To nie jest wdrożenie zgodne
ze specyfikacją: brak builda Vite, brak minifikacji, brak hashowanych nazw assetów, brak
`version.json`. Ustawienie źródła na „GitHub Actions" wyłącza ten mechanizm.

**Nie używaj sugerowanych przez GitHuba workflow** („GitHub Pages Jekyll", „Static HTML").
Pierwszy dodaje Jekylla, którego projekt nie używa. Drugi publikuje pliki bez builda.

## Wdrożenie automatyczne

Każdy push do `main` uruchamia `Deploy production`. Trzy etapy:

1. **build** — `npm ci`, `npm run build`, następnie `lint:js`, `lint:css` i `validate:html`
   na artefakcie, który faktycznie zostanie opublikowany. Artefakt trafia do `actions/upload-pages-artifact`.
2. **deploy** — `actions/deploy-pages` publikuje `dist/` w środowisku `github-pages`.
3. **smoke** — sprawdzenie publicznego URL: status 200, treść krytyczna w HTML, `version.json`,
   strona 404. Osobno weryfikuje, że **nie** opublikowano surowych źródeł — job kończy się
   błędem, jeśli w HTML pojawi się odwołanie do `/src/js/main.js`.

Release jest uznany za zakończony dopiero po zielonym jobie `smoke` (spec §22.3).

## Rollback

Rollback to **ponowne wdrożenie poprzedniej dobrej wersji**, nigdy ręczna edycja plików.

1. Ustal ostatni poprawny tag lub commit SHA — `git tag -l` albo historia `main`.
2. Wejdź w **Actions → Deploy production → Run workflow**.
3. W polu `ref` podaj tag, branch lub SHA do wdrożenia, np. `v1.0.0`.
4. Poczekaj na zielony job `smoke` — potwierdza, że publiczny URL działa.
5. Założ issue z przyczyną cofnięcia i przygotuj poprawkę na osobnym branchu.

Workflow celowo przyjmuje dowolny `ref`, żeby rollback nie wymagał żadnych operacji w gicie —
w szczególności nie wymaga `revert` ani `force push` na `main`.

## Weryfikacja wdrożonej wersji

`https://radek1983.github.io/version.json` zwraca wersję z `package.json`, commit SHA, ref,
nazwę środowiska i czas builda. Plik generuje `scripts/write-version.mjs` jako część
`npm run build`, więc build lokalny i build w CI dają ten sam artefakt.

Plik nie zawiera sekretów.

## Czego ten workflow nie robi

- **Nie ustawia nagłówków HTTP.** GitHub Pages tego nie umożliwia — patrz `docs/HOSTING.md`
  i `docs/ADR/0003-naglowki-bezpieczenstwa-na-github-pages.md`.
- **Nie steruje cache'em.** Pages narzuca `max-age=600` na wszystko.
- **Nie uruchamia testów e2e.** Te wykonuje `ci.yml` na Pull Requestach; ruleset na `main`
  pilnuje, żeby nic nie weszło bez zielonego CI.

## Ręczne kopiowanie plików

Zabronione jako normalna metoda utrzymania (spec §13.3, §11.3). Źródłem prawdy jest kod w Git.
Zmiana wprowadzona ręcznie na serwerze zostałaby utracona przy kolejnym wdrożeniu.
