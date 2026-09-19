/**
 * Spis tresci polityki prywatnosci.
 *
 * Trzy zadania, wszystkie opcjonalne dla samej tresci dokumentu:
 *   1. na waskim ekranie zwija spis do rozwijanego paska,
 *   2. zamyka go po wybraniu sekcji,
 *   3. zaznacza sekcje, ktora czytelnik ma aktualnie przed oczami.
 *
 * Modul konczy dzialanie bez bledu, gdy strona nie ma spisu - czyli
 * na kazdej innej stronie serwisu (spec 8.4).
 *
 * BEZ JAVASCRIPTU spis zostaje rozwiniety (atrybut `open` stoi w HTML),
 * a wszystkie odnosniki dzialaja jako zwykle kotwice. To swiadomy wybor:
 * element nie moze pozostac trwale ukryty przy awarii skryptu.
 */

const WASKI_EKRAN = '(width < 62rem)'

/**
 * Zwija spis na waskim ekranie i rozwija go z powrotem na szerokim.
 *
 * Stan ustawiamy TYLKO przy zmianie progu, a nie przy kazdym przeliczeniu:
 * inaczej odebralibysmy czytelnikowi jego wlasna decyzje o rozwinieciu.
 */
function dopasujDoSzerokosci(spis) {
  const zapytanie = window.matchMedia(WASKI_EKRAN)

  const zastosuj = (dopasowane) => {
    spis.open = !dopasowane
  }

  zastosuj(zapytanie.matches)
  zapytanie.addEventListener('change', (zdarzenie) => zastosuj(zdarzenie.matches))

  return zapytanie
}

/**
 * Po wybraniu sekcji na waskim ekranie pasek sie zamyka - inaczej lista
 * zaslanialaby akurat ten fragment, do ktorego czytelnik chcial trafic.
 */
function zamykajPoWyborze(spis, zapytanie) {
  spis.addEventListener('click', (zdarzenie) => {
    const odnosnik = zdarzenie.target.closest('a[href^="#"]')
    if (!odnosnik) return
    if (zapytanie.matches) spis.open = false
  })
}

/**
 * Dosuwa czytana pozycje do kadru SPISU, nie strony.
 *
 * Osiemnastu pozycji nie widac naraz w nizszym oknie, wiec przy sekcji 16
 * czytelnik widzialby zaznaczenie poza kadrem - czyli wcale. Przewijamy
 * recznie `scrollTop` kontenera zamiast `scrollIntoView`: tamto przesuwa
 * KAZDEGO przodka, ktory da sie przewinac, wiec razem ze spisem skakalaby
 * cala strona i obserwator natychmiast wskazywalby inna sekcje.
 *
 * Margines trzyma pozycje z dala od samej krawedzi, zeby bylo widac,
 * ze lista ma ciag dalszy.
 */
function dosunDoKadru(lista, odnosnik, plynnie) {
  const kadr = lista.getBoundingClientRect()
  const pozycja = odnosnik.getBoundingClientRect()
  const margines = 48

  let przesuniecie = 0
  if (pozycja.top < kadr.top + margines) {
    przesuniecie = pozycja.top - kadr.top - margines
  } else if (pozycja.bottom > kadr.bottom - margines) {
    przesuniecie = pozycja.bottom - kadr.bottom + margines
  }

  if (przesuniecie === 0) return

  lista.scrollTo({
    top: lista.scrollTop + przesuniecie,
    behavior: plynnie ? 'smooth' : 'auto',
  })
}

/**
 * Ustawia czerwony odcinek osi na wysokosci czytanej pozycji.
 *
 * Polozenie liczymy WZGLEDEM PRZEWIJANEGO OBSZARU, a nie przez `offsetTop`.
 * `offsetTop` odnosi sie do najblizszego przodka z `position`, a kazda
 * pozycja listy jest `relative` - dawalo to stale dwa piksele zamiast
 * kilkuset. Suma prostokata i `scrollTop` jest odporna na to, gdzie
 * w drzewie siedzi znacznik.
 */
function ustawZnacznik(lista, znacznik, odnosnik) {
  if (!znacznik || !lista) return
  const kadr = lista.getBoundingClientRect()
  const pozycja = odnosnik.getBoundingClientRect()
  const gora = pozycja.top - kadr.top + lista.scrollTop
  const srodek = gora + (pozycja.height - znacznik.offsetHeight) / 2
  znacznik.style.translate = `0 ${Math.round(srodek)}px`
  znacznik.classList.add('is-visible')
}

/**
 * Zaznacza czytana sekcje.
 *
 * IntersectionObserver zamiast nasluchu na scroll (spec 5.7). Gorna granica
 * `rootMargin` odsuwa strefe obserwacji o wysokosc sticky headera, wiec
 * sekcja liczy sie jako czytana dopiero wtedy, gdy naprawde jest widoczna,
 * a nie gdy chowa sie za naglowkiem.
 */
function sledzCzytanaSekcje(spis, dokument, odnosniki) {
  if (typeof IntersectionObserver !== 'function') return

  const sekcje = [...dokument.querySelectorAll('.policy__section[id]')]
  if (!sekcje.length) return

  const lista = spis.querySelector('.policy-toc__nav')
  const znacznik = spis.querySelector('.policy-toc__marker')
  const widoczne = new Set()

  const plynnie = !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const zaznacz = (id) => {
    for (const odnosnik of odnosniki) {
      const aktywny = odnosnik.getAttribute('href') === `#${id}`
      if (!aktywny) {
        odnosnik.removeAttribute('aria-current')
        continue
      }
      if (odnosnik.getAttribute('aria-current') === 'true') continue
      odnosnik.setAttribute('aria-current', 'true')
      ustawZnacznik(lista, znacznik, odnosnik)
      if (lista) dosunDoKadru(lista, odnosnik, plynnie)
    }
  }

  const obserwator = new IntersectionObserver(
    (wpisy) => {
      for (const wpis of wpisy) {
        if (wpis.isIntersecting) widoczne.add(wpis.target)
        else widoczne.delete(wpis.target)
      }

      if (!widoczne.size) return

      /* Przy kilku widocznych naraz wygrywa ta najwyzej na stronie. */
      const pierwsza = [...widoczne].sort(
        (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top,
      )[0]

      zaznacz(pierwsza.id)
    },
    {
      rootMargin: '-25% 0px -60% 0px',
      threshold: 0,
    },
  )

  for (const sekcja of sekcje) obserwator.observe(sekcja)

  /*
   * Stan poczatkowy. Obserwator uznaje sekcje za czytana dopiero wtedy, gdy
   * wejdzie w srodkowy pas okna, wiec na samej gorze strony - kiedy widac
   * jeszcze naglowek - nie bylaby zaznaczona zadna. Spis wygladalby wtedy
   * jak nieaktywny. Pierwszy rozdzial jest tu poprawna odpowiedzia: to on
   * zaczyna sie tuz pod wstepem.
   */
  zaznacz(sekcje[0].id)
}

export function initPolicyToc() {
  const spis = document.querySelector('.policy-toc')
  const dokument = document.querySelector('.policy__doc')
  if (!spis || !dokument) return

  const odnosniki = [...spis.querySelectorAll('a[href^="#"]')]
  if (!odnosniki.length) return

  const zapytanie = dopasujDoSzerokosci(spis)
  zamykajPoWyborze(spis, zapytanie)
  sledzCzytanaSekcje(spis, dokument, odnosniki)
}
