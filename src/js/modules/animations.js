/**
 * Reveal wejscia tresci przez IntersectionObserver.
 *
 * To warstwa bazowa, dzialajaca w kazdej przegladarce z macierzy wsparcia.
 * Ruch wiazany ze scrollem (momentum, parallax, dryf pasow) realizuja natywne
 * animacje scroll-driven w src/css/animations/editorial.css - bez JavaScriptu.
 *
 * Modul dodaje wylacznie klase `is-visible`. Stany wizualne zyja w CSS, wiec
 * przy `prefers-reduced-motion: reduce` nic sie nie rusza, mimo ze obserwator
 * dziala dalej.
 */

const VISIBLE_CLASS = 'is-visible'

/**
 * Po tym czasie odslaniamy wszystko, co jeszcze czeka.
 *
 * To siatka bezpieczenstwa dla wymagania ANIM-003: awaria JS ani cisza
 * obserwatora nie moze pozostawic tresci trwale niewidocznej. Obserwator
 * milczy np. gdy karta nigdy nie zostala odmalowana - wtedy bez tego
 * zabezpieczenia strona zostalaby pusta.
 */
const SAFETY_TIMEOUT_MS = 2500

function revealAll(items) {
  for (const item of items) item.classList.add(VISIBLE_CLASS)
}

export function initAnimations() {
  const items = document.querySelectorAll('[data-animation]')
  if (items.length === 0) return

  // Brak IntersectionObserver: pokazujemy wszystko od razu.
  // Tresc nigdy nie moze zostac ukryta przez brak wsparcia API.
  if (typeof IntersectionObserver !== 'function') {
    revealAll(items)
    return
  }

  const safety = setTimeout(() => revealAll(items), SAFETY_TIMEOUT_MS)

  let remaining = items.length

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add(VISIBLE_CLASS)
        // Reveal wykonuje sie raz. Ponowne odtwarzanie przy kazdym przejsciu
        // daloby chaos i niepotrzebny koszt (spec 8.3).
        observer.unobserve(entry.target)
        remaining -= 1
      }

      if (remaining <= 0) clearTimeout(safety)
    },
    /*
     * Prog musi byc niski, bo obserwujemy takze cale sekcje. Przy 18% wysokosc
     * wymagana do odslonienia sekcji przekraczalaby viewport i reveal nie
     * odpalilby nigdy. Dolny rootMargin cofa moment odslonienia tak, zeby
     * element wchodzil w kadr, a nie ledwo go dotykal.
     */
    { threshold: 0.05, rootMargin: '0px 0px -12% 0px' },
  )

  for (const item of items) observer.observe(item)
}
