import { expect, test } from '@playwright/test'

/**
 * 08 NABÓR 2026 · KLASY 1-7 — układ zatwierdzony przez właściciela.
 *
 * Sekcja była przebudowywana trzy razy pod jeden warunek, który właściciel
 * postawił wprost: CAŁOŚĆ ma mieścić się w jednym ekranie desktopowym razem
 * z wezwaniem. Dwa razy zgłaszał, że przycisk wychodzi pod dolną krawędź.
 *
 * Czego pilnujemy:
 *   1. cała sekcja mieści się pod sticky headerem, z wezwaniem włącznie,
 *   2. nagłówek stoi w DWÓCH wierszach i opisuje warunek stały, nie datę,
 *   3. kreski pod podpisami liczb stoją na jednej osi (subgrid),
 *   4. kolumny idą w kolejności: liczba - data - status.
 *
 * Zmiana któregokolwiek punktu wymaga decyzji właściciela (CLAUDE.md §15, D14).
 */

const WIDOKI = [
  [1920, 1080],
  [1600, 900],
  [1440, 900],
  [1280, 800],
]

test.describe('08 nabor - uklad zatwierdzony', () => {
  test.skip(({ isMobile }) => isMobile, 'uklad trzykolumnowy dziala od 62rem')

  for (const [width, height] of WIDOKI) {
    test(`cala sekcja z wezwaniem miesci sie w ekranie przy ${width}x${height}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height })
      await page.goto('/')
      await page.evaluate(() => document.fonts.ready)

      const m = await page.evaluate(() => {
        const sekcja = document.querySelector('#nabor')
        const naglowek = document.querySelector('.site-header')
        return {
          wysokoscSekcji: Math.round(sekcja.offsetHeight),
          dostepne: window.innerHeight - Math.round(naglowek.offsetHeight),
        }
      })

      /*
       * Warunek konieczny postawiony przez wlasciciela. Zapas jest policzony
       * od wysokosci dostepnej POD sticky headerem, bo tyle rodzic naprawde
       * widzi po skoku z menu.
       */
      expect(
        m.wysokoscSekcji,
        `sekcja ${m.wysokoscSekcji} px, dostepne ${m.dostepne} px`,
      ).toBeLessThanOrEqual(m.dostepne)
    })

    test(`kreski pod liczbami stoja na jednej osi przy ${width}x${height}`, async ({ page }) => {
      await page.setViewportSize({ width, height })
      await page.goto('/')
      await page.evaluate(() => document.fonts.ready)

      /*
       * "5" i blok "01.10 / 2026" maja rozne stopnie pisma i rozna liczbe
       * wierszy. Rownosc kresek wynika z `grid-template-rows: subgrid`,
       * a nie z dobranego marginesu - i wlasnie dlatego ma prawo przetrwac
       * kolejna zmiane stopnia pisma.
       */
      const y = await page.evaluate(() =>
        [...document.querySelectorAll('.enrollment__caption')].map((el) => {
          let t = 0
          let e = el
          while (e) {
            t += e.offsetTop
            e = e.offsetParent
          }
          return t
        }),
      )

      expect(y).toHaveLength(2)
      expect(Math.abs(y[0] - y[1]), `kreski na ${y[0]} i ${y[1]}`).toBeLessThanOrEqual(1)
    })

    test(`kolumny ida w kolejnosci liczba - data - status przy ${width}x${height}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height })
      await page.goto('/')

      /*
       * Regresja, ktora juz wystapila: kolumna statusu ma definitywny wiersz,
       * wiec siatka ukladala ja PRZED kolumnami bez niego i ladowala pierwsza
       * od lewej. Kolumny sa dzis przypisane wprost - ten test tego pilnuje.
       */
      const lewe = await page.evaluate(() =>
        [...document.querySelectorAll('.enrollment__grid > *')].map((el) =>
          Math.round(el.getBoundingClientRect().left),
        ),
      )

      expect(lewe).toHaveLength(3)
      expect(lewe[0], 'liczba przed data').toBeLessThan(lewe[1])
      expect(lewe[1], 'data przed statusem').toBeLessThan(lewe[2])
    })
  }

  test('naglowek stoi w dwoch wierszach i nie niesie daty', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    await page.evaluate(() => document.fonts.ready)

    const tytul = page.locator('#nabor-title')

    // Warunek staly, ktory zostaje na stronie takze po 1 pazdziernika.
    await expect(tytul).toContainText(/5\s*dzieci/i)
    await expect(tytul).not.toContainText(/pa[zż]dziernik|2026/i)

    const wiersze = await page.evaluate(() => {
      const el = document.querySelector('#nabor-title')
      const s = getComputedStyle(el)
      const tresc =
        el.offsetHeight - parseFloat(s.paddingBlockStart) - parseFloat(s.paddingBlockEnd)
      return Math.round(tresc / parseFloat(s.lineHeight))
    })

    expect(wiersze, 'naglowek w dwoch wierszach').toBe(2)
  })

  /*
   * Blok czasowy musi dac sie usunac w calosci po 1 pazdziernika. W tej sekcji
   * sa dwa znaczniki: data i plakietka statusu.
   */
  test('elementy czasowe sa oznaczone do usuniecia', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#nabor [data-temporary="nabor-2026"]')).toHaveCount(2)
  })
})
