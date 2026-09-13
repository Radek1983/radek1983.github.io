/**
 * Mega-menu oferty w naglowku.
 *
 * Modul jest opcjonalny: gdy przycisku albo panelu nie ma w dokumencie,
 * konczy dzialanie bez bledu (spec 8.4). Bez JavaScriptu panel pozostaje
 * ukryty atrybutem `hidden`, a wszystkie cztery produkty sa osiagalne
 * ze stopki i ze strony /oferta - nic nie znika razem ze skryptem.
 */

export function initMegaMenu() {
  const przycisk = document.querySelector('.site-nav__trigger')
  const panel = document.querySelector('.mega')
  if (!przycisk || !panel) return

  const grupa = przycisk.closest('.site-nav__item--mega')
  let zamkniecieZOpoznieniem = null

  function ustaw(otwarte) {
    panel.hidden = !otwarte
    przycisk.setAttribute('aria-expanded', String(otwarte))
  }

  function zamknij() {
    clearTimeout(zamkniecieZOpoznieniem)
    ustaw(false)
  }

  /*
   * Panel otwiera sie KLIKNIECIEM, nie najechaniem.
   *
   * Wariant z otwieraniem na hover byl w tym miejscu pulapka: kursor
   * dojezdzajacy do przycisku otwieral panel, a nastepujace po nim
   * klikniecie przelaczalo go z powrotem i menu wygladalo na zepsute.
   * Dalo sie to obejsc znacznikami czasu, ale kosztem logiki, ktorej
   * nikt pozniej nie zrozumie.
   *
   * Klikniecie jest tez uczciwsze wobec dotyku i klawiatury: jedno
   * zachowanie dla wszystkich sposobow obslugi, zamiast dwoch rownoleglych.
   */
  przycisk.addEventListener('click', () => ustaw(panel.hidden))

  // Kursor opuszczajacy grupe zamyka panel - ale dopiero po chwili, zeby
  // przejscie nad przerwa miedzy przyciskiem a panelem go nie gasilo.
  grupa.addEventListener('pointerleave', (event) => {
    if (event.pointerType !== 'mouse' || panel.hidden) return
    zamkniecieZOpoznieniem = setTimeout(zamknij, 240)
  })

  grupa.addEventListener('pointerenter', () => clearTimeout(zamkniecieZOpoznieniem))

  /*
   * Focus wychodzacy poza grupe zamyka panel. Dzieki temu Tab przechodzi
   * przez cztery produkty i naturalnie wraca do reszty menu, zamiast
   * zostawiac otwarty panel nad trescia strony.
   */
  grupa.addEventListener('focusout', (event) => {
    if (!grupa.contains(event.relatedTarget)) zamknij()
  })

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || panel.hidden) return
    zamknij()
    przycisk.focus()
  })

  // Klikniecie poza naglowkiem zamyka panel.
  document.addEventListener('click', (event) => {
    if (panel.hidden) return
    if (!grupa.contains(event.target)) zamknij()
  })
}
