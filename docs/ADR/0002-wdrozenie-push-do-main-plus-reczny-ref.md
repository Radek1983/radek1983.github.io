# ADR 0002: Wdrożenie na push do main, rollback przez ręczny wybór ref

Status: Accepted
Data: 2026-09-06

## Kontekst

Specyfikacja rozdz. 13.3 dopuszcza dwa mechanizmy wdrożenia produkcyjnego: push do `main`
po przejściu CI albo wiązanie produkcji z tagiem `vX.Y.Z`. Jednocześnie rozdz. 12.5 i 24.2
wymagają, żeby **rollback polegał na ponownym wdrożeniu poprzedniego dobrego taga**, bez
ręcznej edycji plików na serwerze.

Te dwa wymagania ciągną w różne strony. Wdrożenie tylko na tag daje czystą historię wydań,
ale każda zmiana wymaga tagowania — uciążliwe, gdy strona jest w budowie. Wdrożenie tylko
na push do `main` jest wygodne, ale samo z siebie nie daje mechanizmu cofnięcia.

## Decyzja

Workflow `deploy-production.yml` ma **dwa wyzwalacze**:

1. `push` do `main` — automatyczne wdrożenie po scaleniu. Codzienny tryb pracy.
2. `workflow_dispatch` z parametrem `ref` — ręczne wdrożenie dowolnego taga, brancha
   lub commit SHA. **To jest procedura rollback.**

Job `build` wykonuje checkout wskazanego `ref`, więc wdrożenie starszej wersji nie wymaga
żadnej operacji w gicie — w szczególności nie wymaga `revert` ani `force push` na `main`,
którego rozdz. 3.2 zabrania.

Po wdrożeniu job `smoke` sprawdza publiczny URL. Release jest zakończony dopiero po jego
zielonym wyniku (rozdz. 22.3).

## Rozważane alternatywy

**Tylko tag `v*.*.*`** — daje jednoznaczną odpowiedź na pytanie „która wersja jest na
produkcji" i najczystszy rollback. Odrzucone na tym etapie: strona jest w aktywnej budowie
i tagowanie każdej zmiany wizualnej byłoby sztuczne. Do rozważenia ponownie po wydaniu
`v1.0.0`, gdy tempo zmian spadnie.

**Tylko push do main** — brak jakiejkolwiek ścieżki cofnięcia poza `revert` i kolejnym
commitem, co przy awarii produkcji wydłuża czas naprawy.

**Ręczne zatwierdzanie w GitHub Environment** — dodaje krok akceptacji przed każdym
wdrożeniem. Bez wartości przy jednym wykonawcy, który sam zatwierdzałby własne wdrożenia.

## Konsekwencje

Automatyczne wdrożenie po merge oznacza, że **każdy merge do `main` trafia na produkcję**.
Dlatego ruleset na `main` z wymaganymi checkami jest tu nie wygodą, a warunkiem bezpieczeństwa.

Job `build` powtarza `lint:js`, `lint:css` i `validate:html` na artefakcie, który faktycznie
zostanie opublikowany — to zabezpieczenie na wypadek, gdyby coś weszło do `main` inną drogą
niż Pull Request.

Testy e2e nie są powtarzane w workflow wdrożeniowym: wykonuje je `ci.yml` na Pull Requestach,
a ich duplikowanie wydłużyłoby wdrożenie bez zysku informacyjnego.
