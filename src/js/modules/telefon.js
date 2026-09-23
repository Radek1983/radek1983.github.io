/**
 * Numer telefonu: odnośnik na dotyku, zwykły tekst na wskaźniku.
 *
 * Decyzja właściciela z 23.09.2026. Na telefonie dotknięcie numeru ma
 * uruchamiać dzwonienie — to najkrótsza droga do kontaktu. Na komputerze
 * `tel:` zwykle niczego sensownego nie robi (mało kto ma podpiętą aplikację
 * do dzwonienia), a wygląda jak link do kliknięcia i wprowadza zamęt.
 *
 * DLACZEGO TO ROBI JAVASCRIPT, a nie CSS ani dwa warianty w HTML:
 *
 * - `pointer-events: none` zostawiłoby odnośnik w drzewie dostępności —
 *   czytnik ekranu nadal zapowiadałby link, klawiatura łapałaby focus,
 *   a kliknięcie nie robiłoby nic. To gorsze niż stan wyjściowy.
 * - dwa warianty wiersza przełączane w CSS znaczyłyby duplikat numeru
 *   w JEDENASTU miejscach na dziesięciu stronach.
 *
 * Wymóg z §10 kontraktu jest spełniony: numer stoi w HTML jako treść
 * odnośnika, więc **awaria JavaScriptu niczego nie ukrywa**. Bez skryptu
 * numer jest widoczny i klikalny wszędzie — czyli dokładnie tak, jak było
 * przed tą zmianą.
 *
 * Zdjęcie samego `href` wystarczy: `<a>` bez `href` przestaje być linkiem
 * także dla czytnika ekranu i wypada z kolejności focusu. Nie podmieniamy
 * elementu, więc klasy i style zostają nietknięte.
 */

/*
 * Pytamy o RODZAJ WSKAZNIKA, nie o szerokość okna. Wąskie okno na
 * komputerze nadal ma mysz, a duży tablet nadal ma palec — szerokość
 * odpowiedziałaby w obu przypadkach źle.
 */
const WSKAZNIK = '(hover: hover) and (pointer: fine)'

/** Numer wraca do postaci odnośnika, gdy urządzenie znów jest dotykowe. */
function przywroc(el) {
  const numer = el.dataset.telHref
  if (numer && !el.getAttribute('href')) el.setAttribute('href', numer)
}

function odlacz(el) {
  const href = el.getAttribute('href')
  if (!href) return
  /* Zapamiętany, żeby dało się wrócić bez ponownego czytania treści. */
  el.dataset.telHref = href
  el.removeAttribute('href')
}

export function initTelefon() {
  const zapytanie = window.matchMedia(WSKAZNIK)

  const zastosuj = () => {
    const numery = document.querySelectorAll('a[href^="tel:"], a[data-tel-href]')
    for (const el of numery) {
      if (zapytanie.matches) odlacz(el)
      else przywroc(el)
    }
  }

  zastosuj()

  /*
   * Podłączenie myszy do tabletu albo odłączenie klawiatury zmienia
   * odpowiedź zapytania w trakcie życia strony.
   */
  zapytanie.addEventListener('change', zastosuj)
}
