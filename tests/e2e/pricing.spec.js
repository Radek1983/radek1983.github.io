import { expect, test } from '@playwright/test'

/**
 * Sekcja 07 CENNIK - dwa panele jednej sekcji.
 *
 * Panel A odpowiada "ile", panel B "na jakich zasadach". Testy pilnuja
 * trzech rzeczy naraz: ze to nadal JEDNA sekcja, ze fakty cenowe zgadzaja
 * sie z par. 3 CLAUDE.md i ze zaden z paneli nie rozjezdza sie w poziomie.
 */

const SIGNAL = 'rgb(242, 59, 47)'

const WIDOKI = [
  [1920, 1080],
  [1440, 900],
  [1280, 800],
  [1024, 768],
  [768, 1024],
  [430, 932],
  [390, 844],
]

test.describe('07 cennik - struktura', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
  })

  /*
   * Oba panele nalezą do #cennik. Gdyby ktos wydzielil zasady rozliczania
   * do wlasnej <section>, numeracja aktow przestalaby sie zgadzac, a menu
   * i kotwice mialyby o jeden cel za duzo.
   */
  test('to jedna sekcja z dwoma panelami, nie dwie sekcje', async ({ page }) => {
    const cennik = page.locator('#cennik')
    await expect(cennik).toHaveCount(1)

    await expect(cennik.locator('.pricing__grid')).toHaveCount(1)
    await expect(cennik.locator('.billing__grid')).toHaveCount(1)

    // Numer aktu pada raz - drugi panel go nie powtarza.
    await expect(cennik.locator('.section__label')).toHaveCount(1)
    await expect(cennik.locator('.section__label')).toContainText('07')

    // Zadna sekcja nie zagniezdza sie w innej.
    await expect(cennik.locator('section')).toHaveCount(0)
  })

  test('panel A niesie obie ceny w jednostce 45-minutowej', async ({ page }) => {
    const pierwsze = page.locator('.price--primary')
    const kolejne = page.locator('.price--secondary')

    await expect(pierwsze.locator('.price__amount')).toHaveText('55')
    await expect(pierwsze.locator('.price__who')).toHaveText('Pierwsze dziecko')
    await expect(kolejne.locator('.price__amount')).toHaveText('50')
    await expect(kolejne.locator('.price__who')).toContainText('rodzeństwa')

    for (const cena of [pierwsze, kolejne]) {
      await expect(cena.locator('.price__unit')).toContainText('45')
      await expect(cena.locator('.price__unit')).toContainText('min')
    }

    // Hierarchia oferty niesiona kolorem: pierwsze dziecko w sygnale.
    await expect(pierwsze.locator('.price__amount')).toHaveCSS('color', SIGNAL)
    await expect(kolejne.locator('.price__amount')).not.toHaveCSS('color', SIGNAL)
  })

  /*
   * Ceny maja czytac sie jak jeden system, a nie dwa niezalezne bloki.
   * Wczesniej druga kolumna byla celowo zepchnieta w dol; teraz obie
   * startuja w tej samej osi.
   */
  test('obie ceny stoja w tej samej linii i maja te sama wysokosc', async ({ page }) => {
    const a = await page.locator('.price--primary .price__figure').boundingBox()
    const b = await page.locator('.price--secondary .price__figure').boundingBox()

    // Tolerancja 3 px, bo WebKit przy device scale factor 3 zaokragla subpiksele.
    expect(Math.abs(a.y - b.y)).toBeLessThanOrEqual(3)
    expect(Math.abs(a.height - b.height)).toBeLessThanOrEqual(3)
    expect(b.x).toBeGreaterThan(a.x)
  })

  test('przypis stoi pod cenami, nie miedzy nimi', async ({ page }) => {
    const przypis = await page.locator('.pricing__note').boundingBox()
    const kolejne = await page.locator('.price--secondary').boundingBox()

    expect(przypis.y).toBeGreaterThan(kolejne.y + kolejne.height - 1)
    await expect(page.locator('.pricing__note')).toContainText('klas 1-7')
    await expect(page.locator('.pricing__note')).toContainText('indywidualnie')
  })

  test('panel B niesie trzy zasady rozliczania i link do pelnego cennika', async ({ page }) => {
    const zasady = page.locator('.billing__rule')
    await expect(zasady).toHaveCount(3)

    await expect(zasady.nth(0)).toContainText('Nie pobieramy stałej miesięcznej opłaty')
    await expect(zasady.nth(1)).toContainText('nie jest doliczana do rozliczenia')
    await expect(zasady.nth(2)).toContainText('minimum 5 dzieci')

    for (const [i, numer] of ['01', '02', '03'].entries()) {
      await expect(zasady.nth(i).locator('.billing__number')).toHaveText(numer)
    }

    // Prawdziwy <a>, nie div z obsluga klikniecia.
    const link = page.locator('.billing__more a')
    await expect(link).toHaveAttribute('href', '/cennik/')
    await expect(link).toContainText('Zobacz pełny cennik')
  })

  /*
   * Panel B jest dalszym ciagiem panelu A, nie nowym rozdanie: naglowek
   * zasad musi stac PONIZEJ przypisu cenowego i w tej samej sekcji.
   */
  test('panel B nastepuje po panelu A w jednym ciagu', async ({ page }) => {
    const przypis = await page.locator('.pricing__note').boundingBox()
    const claim = await page.locator('.billing__claim').boundingBox()

    expect(claim.y).toBeGreaterThan(przypis.y)
    await expect(page.locator('#cennik .billing__claim')).toHaveCount(1)
  })
})

test.describe('07 cennik - geometria', () => {
  for (const [width, height] of WIDOKI) {
    test(`bez clippingu i bez poziomego scrolla przy ${width}x${height}`, async ({ page }) => {
      await page.setViewportSize({ width, height })
      await page.goto('/')
      await page.locator('#cennik').scrollIntoViewIfNeeded()

      const wynik = await page.evaluate(() => {
        const nadmiar = (s) => {
          const el = document.querySelector(s)
          return el.scrollWidth - el.clientWidth
        }
        return {
          strona: document.documentElement.scrollWidth - window.innerWidth,
          tytul: nadmiar('#cennik-title'),
          claim: nadmiar('.billing__claim'),
          cena: nadmiar('.price--primary .price__figure'),
        }
      })

      expect(wynik.strona, 'poziomy scroll strony').toBeLessThanOrEqual(0)
      expect(wynik.tytul, 'naglowek panelu A').toBeLessThanOrEqual(1)
      expect(wynik.claim, 'naglowek panelu B').toBeLessThanOrEqual(1)
      expect(wynik.cena, 'blok ceny').toBeLessThanOrEqual(1)
    })
  }

  /*
   * "zł / 45 min" to jedna informacja. Rozbicie jej miedzy wiersze
   * zmienialoby sens - dlatego jednostka ma twarde spacje i nowrap.
   */
  test('jednostka ceny nie rozpada sie miedzy wiersze', async ({ page }) => {
    for (const [width, height] of WIDOKI) {
      await page.setViewportSize({ width, height })
      await page.goto('/')

      const jednostka = page.locator('.price--primary .price__unit')
      await expect(jednostka).toHaveCSS('white-space', 'nowrap')

      // Dwa wiersze: "zł" i "/ 45 min". Nigdy trzy.
      const wiersze = await jednostka.evaluate((el) =>
        Math.round(el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight)),
      )
      expect(wiersze, `wiersze jednostki przy ${width}px`).toBe(2)
    }
  })
})

test.describe('07 cennik - motion', () => {
  /*
   * Cena jest odpowiedzia na najczestsze pytanie rodzica. Nie moze czekac
   * na koniec choreografii - po wejsciu sekcji w kadr wszystko ma byc
   * widoczne w ulamku sekundy, a nie po dwoch.
   */
  test('cala sekcja jest widoczna zaraz po wejsciu w kadr', async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')

    for (const selektor of ['.price--primary', '.price--secondary', '.billing__rule']) {
      await page.locator(selektor).first().scrollIntoViewIfNeeded()
      await page.waitForTimeout(1200)

      const przezroczystosc = await page
        .locator(selektor)
        .first()
        .evaluate((el) => Number(getComputedStyle(el).opacity))

      expect(przezroczystosc, `${selektor} w projekcie ${testInfo.project.name}`).toBe(1)
    }
  })

  test('przy reduced motion nic sie nie chowa', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'reduced-motion', 'dotyczy tylko tego projektu')

    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')

    const stan = await page.evaluate(() =>
      [...document.querySelectorAll('#cennik [data-animation]')].map((el) => ({
        opacity: getComputedStyle(el).opacity,
        translate: getComputedStyle(el).translate,
      })),
    )

    expect(stan.length).toBeGreaterThan(0)
    for (const el of stan) {
      expect(el.opacity).toBe('1')
      expect(el.translate).toBe('none')
    }
  })
})
