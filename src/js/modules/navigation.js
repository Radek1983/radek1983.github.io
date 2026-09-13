/**
 * Nawigacja: podswietlenie aktywnej sekcji na podstawie jej widocznosci
 * oraz pomiar wysokosci sticky headera dla scroll-margin kotwic.
 *
 * Swiadomie NIE przechwytujemy klikniec w linki kotwiczace - natywne zachowanie
 * przegladarki obsluguje scroll, historie i klawiature poprawnie (spec 9.3, 9.4).
 */

const ACTIVE_CLASS = 'is-active'

/**
 * Wysokosc headera trafia do zmiennej CSS, bo scroll-margin kotwic musi ja znac.
 * Wartosc zapasowa 4rem jest w CSS, wiec brak JS nie psuje skokow do sekcji -
 * tylko je nieco mniej precyzyjnie pozycjonuje.
 *
 * UWAGA: --header-h nie moze byc uzywane do ustalania wysokosci samego headera.
 * Powstaje wtedy sprzezenie zwrotne - kazdy pomiar powieksza element o grubosc
 * obramowania i wyzwala kolejny pomiar. Zmienna jest wylacznie do scroll-margin.
 *
 * Zapis tylko przy faktycznej zmianie chroni dodatkowo przed petla, gdyby
 * ktos w przyszlosci powiazal z ta zmienna cokolwiek wplywajacego na layout.
 */
function trackHeaderHeight(header) {
  let last = 0

  const apply = () => {
    const height = Math.round(header.getBoundingClientRect().height)
    if (height === last || height === 0) return
    last = height
    document.documentElement.style.setProperty('--header-h', `${height}px`)
  }

  apply()

  if (typeof ResizeObserver === 'function') {
    new ResizeObserver(apply).observe(header)
  }
}

/**
 * Poprawia pozycje kotwicy przy wejsciu z adresem zawierajacym hash.
 *
 * Przegladarka wykonuje skok do kotwicy ZANIM ustabilizuje sie uklad strony.
 * Kroje tekstowe laduja sie z `font-display: swap`, wiec sekcje powyzej celu
 * zmieniaja wysokosc juz po skoku i cel laduje w zlym miejscu. Zmierzone:
 * przy 1024 px etykieta sekcji "O High Five" stawala 871 px ponizej naglowka
 * zamiast 32 px.
 *
 * Drugi przypadek to odswiezenie strony. Przegladarka przywraca wtedy
 * zapisana pozycje przewijania, ktora po przeliczeniu ukladu wskazuje juz
 * inne miejsce niz kotwica. Przy obecnym hashu to hash ma wygrac, wiec
 * wylaczamy przywracanie - ale TYLKO wtedy, zeby zwykle odswiezenie bez
 * hasha nadal wracalo tam, gdzie uzytkownik przerwal czytanie.
 *
 * `scrollIntoView` respektuje scroll-margin-block-start, wiec cala logika
 * offsetu zostaje w CSS. Tutaj jest wylacznie powtorzenie skoku.
 */
function fixHashOnLoad() {
  if (!window.location.hash) return

  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual'
  }

  let cel = null
  try {
    cel = document.querySelector(window.location.hash)
  } catch {
    // Hash nie jest poprawnym selektorem - nic do zrobienia.
    return
  }
  if (!cel) return

  // `instant` swiadomie omija `scroll-behavior: smooth` - to korekta pozycji,
  // a nie przejscie, ktore uzytkownik ma ogladac.
  const przewin = () => cel.scrollIntoView({ behavior: 'instant', block: 'start' })

  przewin()
  document.fonts?.ready.then(przewin)
  window.addEventListener('load', przewin, { once: true })
}

function trackActiveSection(links) {
  const linkBySection = new Map()

  for (const link of links) {
    const id = decodeURIComponent(link.hash.slice(1))
    const section = document.getElementById(id)
    if (section) linkBySection.set(section, link)
  }

  if (linkBySection.size === 0) return

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const link = linkBySection.get(entry.target)
        if (link) link.classList.toggle(ACTIVE_CLASS, entry.isIntersecting)
      }
    },
    // Waski pas w srodku ekranu: aktywna jest sekcja, ktora uzytkownik faktycznie czyta,
    // a nie kazda, ktora choc skrajem weszla w viewport.
    { rootMargin: '-45% 0px -50% 0px' },
  )

  for (const section of linkBySection.keys()) observer.observe(section)
}

export function initNavigation() {
  const header = document.querySelector('.site-header')
  if (header) trackHeaderHeight(header)

  fixHashOnLoad()

  /*
   * Od czasu dodania podstron kotwice w menu sa BEZWZGLEDNE ("/#oferta"),
   * bo to samo menu stoi na czterech stronach. Wskaznik aktywnej sekcji
   * dotyczy wylacznie linkow prowadzacych w glab biezacego dokumentu -
   * linki do innych stron ("/online/") nie maja tu czego sledzic.
   */
  const links = [...document.querySelectorAll('.site-nav__link[href*="#"]')].filter((link) => {
    const cel = new URL(link.href, window.location.href)
    return cel.hash !== '' && cel.pathname === window.location.pathname
  })

  if (links.length > 0) trackActiveSection(links)
}
