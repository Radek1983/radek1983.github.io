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

  const links = document.querySelectorAll('.site-nav__link[href^="#"]')
  if (links.length > 0) trackActiveSection(links)
}
