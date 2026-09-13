/**
 * Szuflada nawigacji na waskich ekranach.
 *
 * Modul jest opcjonalny: gdy przelacznika albo panelu nie ma w dokumencie,
 * konczy dzialanie bez bledu (spec 8.4). Bez JavaScriptu szuflada pozostaje
 * ukryta atrybutem `hidden`, a nawigacja jest osiagalna ze stopki - zaden
 * link nie znika razem ze skryptem.
 */

const OTWARTA = 'is-open'

/**
 * Elementy, na ktore realnie da sie ustawic focus wewnatrz panelu.
 *
 * Widocznosc sprawdzamy przez getClientRects(), a NIE przez offsetParent.
 * Panel jest `position: fixed`, a WebKit zwraca wtedy null dla offsetParent
 * jego potomkow - lista wychodzila pusta i focus nigdy nie wchodzil do srodka.
 */
function fokusowalne(panel) {
  return [...panel.querySelectorAll('a[href], button:not([disabled])')].filter(
    (el) => el.getClientRects().length > 0,
  )
}

export function initMenu() {
  const przelacznik = document.querySelector('.site-header__toggle')
  const szuflada = document.querySelector('.drawer')
  if (!przelacznik || !szuflada) return

  const panel = szuflada.querySelector('.drawer__panel')
  const zamknij = szuflada.querySelector('.drawer__close')
  let ostatniFokus = null

  function otworz() {
    ostatniFokus = document.activeElement
    szuflada.hidden = false
    szuflada.classList.add(OTWARTA)
    przelacznik.setAttribute('aria-expanded', 'true')

    /*
     * Blokada przewijania tla. Ustawiana WYLACZNIE na czas otwarcia panelu
     * i zdejmowana przy zamknieciu - to nie jest globalny `overflow: hidden`
     * jako hack, ktorego zabrania CLAUDE.md par. 10.
     */
    document.documentElement.style.overflow = 'hidden'

    const cele = fokusowalne(panel)
    if (cele.length > 0) cele[0].focus()
  }

  function zamknijPanel() {
    szuflada.classList.remove(OTWARTA)
    szuflada.hidden = true
    przelacznik.setAttribute('aria-expanded', 'false')
    document.documentElement.style.overflow = ''

    /*
     * Focus wraca na PRZELACZNIK, a nie na zapamietany element.
     *
     * Safari nie ustawia focusu na <button> po klknieciu myszka ani palcem,
     * wiec w chwili otwarcia aktywnym elementem bywa <body>. Powrot do niego
     * wyrzucalby uzytkownika klawiatury na poczatek dokumentu. Przelacznik
     * jest tu jedynym sensownym punktem powrotu - to z niego panel zostal
     * otwarty. Zapamietany element sluzy tylko jako zapasowy cel, gdy
     * przelacznik zdazyl zniknac przy zmianie szerokosci okna.
     */
    const cel = przelacznik.getClientRects().length > 0 ? przelacznik : ostatniFokus
    if (cel instanceof HTMLElement) cel.focus()
  }

  przelacznik.addEventListener('click', () => {
    if (szuflada.hidden) otworz()
    else zamknijPanel()
  })

  zamknij?.addEventListener('click', zamknijPanel)

  // Klikniecie w przycienione tlo zamyka panel; klikniecie w sam panel nie.
  szuflada.addEventListener('click', (event) => {
    if (event.target === szuflada) zamknijPanel()
  })

  // Link w szufladzie prowadzi dalej - panel ma sie zamknac, takze przy
  // kotwicy na tej samej stronie, gdzie nie ma przeladowania dokumentu.
  panel.addEventListener('click', (event) => {
    if (event.target.closest('a[href]')) zamknijPanel()
  })

  document.addEventListener('keydown', (event) => {
    if (szuflada.hidden) return

    if (event.key === 'Escape') {
      zamknijPanel()
      return
    }

    if (event.key !== 'Tab') return

    /*
     * Pulapka focusu. Panel jest modalny (aria-modal), wiec Tab nie moze
     * wyprowadzic uzytkownika na tresc ukryta za przycieniona warstwa.
     */
    const cele = fokusowalne(panel)
    if (cele.length === 0) return

    const pierwszy = cele[0]
    const ostatni = cele[cele.length - 1]

    if (event.shiftKey && document.activeElement === pierwszy) {
      event.preventDefault()
      ostatni.focus()
    } else if (!event.shiftKey && document.activeElement === ostatni) {
      event.preventDefault()
      pierwszy.focus()
    }
  })

  /*
   * Powrot do szerokiego ekranu przy otwartym panelu zostawilby zablokowane
   * przewijanie i niewidoczna pulapke focusu.
   */
  const szeroki = window.matchMedia('(width >= 75rem)')
  szeroki.addEventListener('change', (event) => {
    if (event.matches && !szuflada.hidden) zamknijPanel()
  })
}
