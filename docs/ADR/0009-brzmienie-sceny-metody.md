# ADR 0009 — brzmienie sceny metody: `MÓW PRÓBUJ POPRAWIAJ UŻYWAJ`

- **Status:** przyjęte
- **Data:** 2026-09-13
- **Decyduje:** właściciel
- **Dotyczy:** sekcja `06 JAK UCZYMY` (`#metoda`) na stronie głównej

## Kontekst

Master prompt §16 i brief podają scenę typograficzną tej sekcji jako:

```
MÓWIJ. PRÓBUJ. POPRAWIAJ. UŻYWAJ.
```

**„Mówij" nie jest polskim słowem.** Tryb rozkazujący od „mówić" brzmi **„mów"**. Pozostałe
trzy formy — `próbuj`, `poprawiaj`, `używaj` — są poprawne i kończą się na `-uj` / `-aj`;
błędna forma powstała przez analogię do nich.

Cztery czasowniki są największym napisem na stronie i jedynym elementem sekcji. Błąd
ortograficzny w tym miejscu jest widoczny natychmiast i podważa wiarygodność szkoły
językowej — czyli działa dokładnie przeciwko celowi sekcji.

## Decyzja

Właściciel polecił dwie zmiany naraz:

1. `MÓWIJ` → **`MÓW`**
2. **zdjęcie kropek** po wszystkich czterech czasownikach

Docelowe brzmienie:

```
MÓW
PRÓBUJ
POPRAWIAJ
UŻYWAJ
```

Kolor (trzy kremowe, ostatni sygnałowy), skala, układ lewa/prawa, numeracja procesu 01–05
i animacja sekcji **pozostają bez zmian**. To korekta językowa, nie redesign.

## Konsekwencje

- `CLAUDE.md` §5 i `docs/COPY_DECK.md` zapisują nowe brzmienie razem z uzasadnieniem.
  Master prompt pozostaje niezmieniony — jest masterem i nie edytujemy go po stronie repo.
- Przy każdej weryfikacji `instructions/` (§0) to odstępstwo trzeba potwierdzić jako nadal
  obowiązujące. Gdyby master prompt został kiedyś zaktualizowany, ADR staje się zbędne.
- Zakaz zmieniania copy decku „na generyczny marketing" (§5) nadal obowiązuje. To odstępstwo
  jest **poprawką błędu językowego w cytacie**, nie przepisaniem treści: sens, rytm i funkcja
  czterech czasowników są identyczne.
- Usunięcie kropek nie zmienia sensu. Cztery tryby rozkazujące jeden pod drugim czytają się
  jak lista poleceń, a nie zdania — kropka po każdym była interpunkcją zdania, którego tu nie ma.

## Odrzucone warianty

- **Zostawić `MÓWIJ` jako cytat ze źródła.** Odrzucone przez właściciela: błąd ortograficzny
  na największym napisie strony kosztuje więcej niż wierność cytatowi.
- **Zamienić na `MÓWIĘ`.** To pierwsza osoba, a cała scena jest w trybie rozkazującym; poza
  tym `MÓWIĘ` jest już zajęte przez pasek sekcji 03.
