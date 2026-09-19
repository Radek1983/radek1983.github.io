import { expect, test } from '@playwright/test'

/**
 * 04 NASZA OFERTA i 06 JAK UCZYMY — układy zatwierdzone przez właściciela.
 *
 * Obie sekcje domknięte 14.09.2026 razem z 05. Właściciel poprosił
 * o zabezpieczenie ich przed przypadkową zmianą przy pracy nad resztą strony.
 *
 * Trzymane są tu rzeczy, których nie widać w samym HTML-u, a które łatwo
 * zepsuć zmianą gdzie indziej: wspólny język interakcji z mega-menu, zgodność
 * etykiet oferty z menu, oraz to, że scena metody nie wróci do błędnego
 * „MÓWIJ" ani do kropek po czasownikach (ADR 0009).
 *
 * Zmiana któregokolwiek punktu wymaga decyzji właściciela (CLAUDE.md §15, D10).
 */

const INK = 'rgb(10, 10, 10)'
const PAPER = 'rgb(242, 239, 232)'
const SIGNAL = 'rgb(242, 59, 47)'

/* Kolejnosc i brzmienie musza zgadzac sie z mega-menu i ze stopka. */
const OFERTA = [
  ['01', 'Dla dzieci', 'Klasy 1-7 · SP 402', '/oferta/dzieci/'],
  ['02', 'Klasa 8', 'Egzamin ósmoklasisty · SP 402', '/oferta/egzamin-osmoklasisty/'],
  ['03', 'Dla seniorów', 'Seniorzy · Terminal Kultury Gocław', '/oferta/seniorzy/'],
  ['04', 'Online 1 na 1', 'Indywidualnie · zdalnie', '/oferta/online/'],
]

const CZASOWNIKI = ['Mów', 'Próbuj', 'Poprawiaj', 'Używaj']

const KROKI = [
  'Krótkie wejście w temat',
  'Model języka',
  'Ćwiczenie w parach lub małej grupie',
  'Zastosowanie w zadaniu komunikacyjnym',
  'Konkretna informacja zwrotna',
]

test.describe('04 oferta - uklad zatwierdzony', () => {
  test('cztery drogi w zatwierdzonej kolejnosci i z wlasciwymi adresami', async ({ page }) => {
    await page.goto('/')

    const pozycje = page.locator('.paths__item')
    await expect(pozycje).toHaveCount(4)

    for (const [i, [numer, etykieta, meta, url]] of OFERTA.entries()) {
      await expect(pozycje.nth(i).locator('.paths__number')).toHaveText(numer)
      await expect(pozycje.nth(i).locator('.paths__title')).toHaveText(etykieta)
      await expect(pozycje.nth(i).locator('.paths__meta')).toHaveText(meta)
      await expect(pozycje.nth(i).locator('a')).toHaveAttribute('href', url)
    }
  })

  /*
   * Sekcja i mega-menu musza opisywac te sama oferte w tej samej kolejnosci.
   *
   * Porownujemy ADRESY, nie etykiety. Etykiety zgadzaja sie dla trzech
   * pozycji - wlasciciel kazal je kiedyś ujednolicic, bo sekcja mowila
   * "ONLINE 1:1", a menu "Online 1 na 1". Pierwsza pozycja swiadomie rozni
   * sie do dzis: menu mowi "Klasy 1-7", sekcja "Dla dzieci". To jest
   * odnotowane i czeka na decyzje wlasciciela - test nie ma tego przesadzac.
   */
  test('sekcja i mega-menu opisuja te sama oferte', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chromium', 'panel poziomy dziala od 75rem')

    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    await page.locator('.site-nav__trigger[data-nav="oferta"]').click()
    await expect(page.locator('.mega')).toBeVisible()

    const zbierz = (sel, atrybut) =>
      page.evaluate(
        ({ s, a }) =>
          [...document.querySelectorAll(s)].map((el) =>
            a ? el.getAttribute(a) : el.textContent.trim(),
          ),
        { s: sel, a: atrybut },
      )

    expect(await zbierz('.paths__link', 'href')).toEqual(await zbierz('.mega__link', 'href'))

    // Trzy ujednolicone etykiety musza zostac identyczne.
    const zMenu = await zbierz('.mega__item .mega__label')
    const zSekcji = await zbierz('.paths__title')
    expect(zSekcji.slice(1)).toEqual(zMenu.slice(1))
  })

  /*
   * Wspolny jezyk interakcji: numer czerwienieje, strzalka jedzie w prawo.
   * Ten sam komponent .offer-mark niesie mega-menu, wiec zmiana tam odbija
   * sie tutaj - i odwrotnie.
   */
  test('stan wskazania jest wspolny z mega-menu', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chromium', 'stan wskazania to wejscie myszy')

    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')

    const link = page.locator('.paths__link').first()
    await link.hover()
    await page.waitForTimeout(400)

    const s = await page.evaluate(() => {
      const l = document.querySelector('.paths__link')
      return {
        numer: getComputedStyle(l.querySelector('.paths__number')).color,
        strzalka: getComputedStyle(l.querySelector('.offer-mark__arrow')).translate,
      }
    })

    expect(s.numer).toBe(SIGNAL)
    expect(s.strzalka).toBe('7px')
  })

  test('sekcja jest kremowa i nie ma kart', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('#oferta')).toHaveCSS('background-color', PAPER)

    const ozdoby = await page.evaluate(
      () =>
        [...document.querySelectorAll('#oferta .paths__item, #oferta .paths__link')].filter(
          (el) => {
            const cs = getComputedStyle(el)
            return parseFloat(cs.borderRadius) > 0 || cs.boxShadow !== 'none'
          },
        ).length,
    )
    expect(ozdoby, 'zero kart').toBe(0)
  })
})

test.describe('06 jak uczymy - uklad zatwierdzony', () => {
  /*
   * ADR 0009. "Mowij" nie jest polskim slowem, a kropki zdjal wlasciciel
   * ta sama decyzja. Test pilnuje obu czesci tamtej poprawki.
   */
  test('cztery czasowniki bez kropek i bez bledu "MOWIJ"', async ({ page }) => {
    await page.goto('/')

    const czasowniki = page.locator('.method__verb')
    await expect(czasowniki).toHaveCount(4)

    for (const [i, slowo] of CZASOWNIKI.entries()) {
      await expect(czasowniki.nth(i)).toHaveText(slowo)
    }

    const tresc = await page.locator('#metoda').textContent()
    expect(tresc).not.toContain('Mówij')
    expect(tresc).not.toContain('Mów.')
  })

  test('piec krokow lekcji w zatwierdzonej kolejnosci', async ({ page }) => {
    await page.goto('/')

    const kroki = page.locator('.method__step')
    await expect(kroki).toHaveCount(5)
    for (const [i, krok] of KROKI.entries()) {
      await expect(kroki.nth(i)).toHaveText(krok)
    }
  })

  /*
   * Czarny akt bez fotografii - swiadoma przerwa od zdjec w rytmie strony.
   */
  test('czarny akt bez fotografii', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('#metoda')).toHaveCSS('background-color', INK)
    await expect(page.locator('#metoda img, #metoda picture')).toHaveCount(0)
  })

  /*
   * Odstep miedzy etykieta sekcji a pierwszym czasownikiem byl osobno
   * zglaszany przez wlasciciela - zniknal po poprawce interlinii wersalikow
   * i trzeba bylo go odbudowac. Test pilnuje, zeby nie zniknal ponownie.
   */
  test('miedzy etykieta a pierwszym czasownikiem jest odstep', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chromium', 'uklad dwukolumnowy')

    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')

    const odstep = await page.evaluate(() => {
      const etykieta = document.querySelector('#metoda .section__label').getBoundingClientRect()
      const pierwszy = document.querySelector('.method__verb').getBoundingClientRect()
      return Math.round(pierwszy.top - etykieta.bottom)
    })

    expect(odstep, 'etykieta nie klei sie do czasownika').toBeGreaterThanOrEqual(12)
  })
})
