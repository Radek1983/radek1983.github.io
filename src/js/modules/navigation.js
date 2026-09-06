/**
 * Nawigacja: podswietlenie aktywnej sekcji na podstawie jej widocznosci.
 *
 * Swiadomie NIE przechwytujemy klikniec w linki kotwiczace - natywne zachowanie
 * przegladarki obsluguje scroll, historie i klawiature poprawnie (spec 9.3, 9.4).
 */

const ACTIVE_CLASS = 'is-active'

export function initNavigation() {
  const links = document.querySelectorAll('.site-header nav a[href^="#"]')
  if (links.length === 0) return

  const byId = new Map()
  const sections = []

  for (const link of links) {
    const id = decodeURIComponent(link.hash.slice(1))
    const section = document.getElementById(id)
    if (!section) continue
    byId.set(section, link)
    sections.push(section)
  }

  if (sections.length === 0) return

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const link = byId.get(entry.target)
        if (!link) continue
        link.classList.toggle(ACTIVE_CLASS, entry.isIntersecting)
      }
    },
    { rootMargin: '-40% 0px -55% 0px' },
  )

  for (const section of sections) observer.observe(section)
}
