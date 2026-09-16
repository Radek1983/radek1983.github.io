import { expect, test } from '@playwright/test'

/**
 * 10 DODATKOWO · ANGIELSKI DLA SENIORÓW — układ zatwierdzony przez właściciela.
 *
 * Sekcja została przebudowana z jednej grupy na trzy równorzędne poziomy,
 * według obrazu referencyjnego właściciela. Dwie rzeczy są w niej wrażliwe
 * i obie wynikają z wyraźnego polecenia:
 *
 *   - NIGDZIE nie wolno podać granicy wieku. Nazwa oferty zostaje
 *     ("dla seniorów"), ale "60+" i każda inna dolna granica są zakazane:
 *     kurs ma być czytelny także dla osoby po pięćdziesiątce.
 *   - Poziomy są RÓWNORZĘDNE. Żaden nie jest domyślny, żaden nie dostaje
 *     własnego tła, obrysu ani koloru.
 *
 * Czego pilnujemy poza tym:
 *   1. trzy poziomy w zatwierdzonym brzmieniu i kolejności,
 *   2. kolumny równe co do piksela,
 *   3. kadr Terminalu prawą krawędzią na krawędzi okna,
 *   4. sekcja nie rośnie ponad budżet wysokości - kadr jest o 10% mniejszy
 *      od pełnej prawej połowy i tekst pod nim jest o tyle podciągnięty,
 *   5. zero kart: w sekcji nie ma zaokrąglonych prostokątów poza kapsułą CTA.
 *
 * Zmiana któregokolwiek punktu wymaga decyzji właściciela (CLAUDE.md §15, D16).
 */

const POZIOMY = [
  ['01', 'Początkująca'],
  ['02', 'Podstawowa'],
  ['03', 'Średniozaawansowana'],
]

test.describe('10 seniorzy - uklad zatwierdzony', () => {
  test('nigdzie nie ma granicy wieku', async ({ page }) => {
    await page.goto('/')

    const tekst = await page.locator('#seniorzy').innerText()

    expect(tekst, 'brak "60+"').not.toMatch(/\d\s*\+/)
    expect(tekst, 'brak dolnej granicy wieku').not.toMatch(
      /od\s+\d+\s*(lat|roku)|powyżej\s+\d+|emeryt|osób starszych/i,
    )

    // Nazwa oferty ma zostac - to ona, a nie wiek, opisuje kurs.
    expect(tekst).toMatch(/ANGIELSKI DLA\s+SENIORÓW/i)
  })

  test('trzy poziomy w zatwierdzonym brzmieniu i kolejnosci', async ({ page }) => {
    await page.goto('/')

    const poziomy = page.locator('.seniors__level')
    await expect(poziomy).toHaveCount(3)

    for (const [i, [numer, nazwa]] of POZIOMY.entries()) {
      await expect(poziomy.nth(i).locator('.seniors__level-number')).toHaveText(numer)
      await expect(poziomy.nth(i).locator('.seniors__level-name')).toHaveText(nazwa)
    }
  })

  test('zaden poziom nie jest wyrozniony', async ({ page }) => {
    await page.goto('/')

    /*
     * Rownorzednosc jest warunkiem tresciowym, nie estetycznym: wyroznienie
     * jednej grupy czytaloby sie jak sugestia, ktora rodzic ma wybrac.
     */
    const style = await page.evaluate(() =>
      [...document.querySelectorAll('.seniors__level')].map((el) => {
        const s = getComputedStyle(el)
        return {
          tlo: s.backgroundColor,
          obrys: s.borderTopWidth + s.borderRightWidth + s.borderBottomWidth + s.borderLeftWidth,
          kolorNazwy: getComputedStyle(el.querySelector('.seniors__level-name')).color,
        }
      }),
    )

    for (const s of style.slice(1)) {
      expect(s.tlo, 'to samo tlo').toBe(style[0].tlo)
      expect(s.obrys, 'ten sam obrys').toBe(style[0].obrys)
      expect(s.kolorNazwy, 'ten sam kolor nazwy').toBe(style[0].kolorNazwy)
    }
  })

  test('w sekcji nie ma kart ani zaokraglonych ramek', async ({ page }) => {
    await page.goto('/')

    /*
     * Projekt referencyjny obrysowywal kazdy poziom zaokraglonym prostokatem.
     * Kontrakt (§7) ustawia promien na 0 i dopuszcza kapsule WYLACZNIE dla CTA,
     * a §8 wymienia siatke kart jako anty-wzorzec.
     */
    const winni = await page.evaluate(() =>
      [...document.querySelectorAll('#seniorzy *')]
        .filter((el) => !el.closest('.cta'))
        .filter((el) => parseFloat(getComputedStyle(el).borderTopLeftRadius) > 2)
        .map((el) => (el.className || el.tagName).toString().slice(0, 40)),
    )

    expect(winni).toEqual([])
  })

  test.describe('geometria desktopowa', () => {
    test.skip(({ isMobile }) => isMobile, 'uklad wielokolumnowy dziala od 62rem')

    for (const [width, height] of [
      [1920, 1080],
      [1440, 900],
      [1280, 800],
    ]) {
      test(`kolumny rowne, kadr przy krawedzi okna przy ${width}x${height}`, async ({ page }) => {
        await page.setViewportSize({ width, height })
        await page.goto('/')
        await page.evaluate(() => document.fonts.ready)

        const m = await page.evaluate(() => {
          const kadr = document.querySelector('.seniors__media').getBoundingClientRect()
          const tekst = document.querySelector('.seniors__intro').getBoundingClientRect()
          return {
            szerokosci: [...document.querySelectorAll('.seniors__level')].map((el) =>
              Math.round(el.getBoundingClientRect().width),
            ),
            odPrawej: Math.round(document.documentElement.clientWidth - kadr.right),
            odstepOdTekstu: Math.round(kadr.left - tekst.right),
            proporcjaKadru: kadr.width / kadr.height,
          }
        })

        expect(new Set(m.szerokosci).size, `kolumny ${m.szerokosci}`).toBe(1)

        // Prawa krawedz na krawedzi okna - wspolna os ze zdjeciami hero i sekcji 02.
        expect(m.odPrawej, 'kadr przy krawedzi okna').toBeLessThanOrEqual(0)

        /*
         * Kadr zostal zmniejszony o 10% od lewej, wiec miedzy nim a kolumna
         * tekstowa musi zostac widoczna przerwa. Bez tego zmniejszenie
         * cofneloby sie niezauwazone.
         */
        expect(m.odstepOdTekstu, 'przerwa miedzy tekstem a kadrem').toBeGreaterThanOrEqual(60)

        expect(Math.abs(m.proporcjaKadru - 16 / 9), 'proporcja 16:9').toBeLessThan(0.05)
      })
    }

    /*
     * Budzet wysokosci. Kadr o 10% wiekszy dokladal 39 px przy 1440 px -
     * ten prog to wylapie, a jednoczesnie zostawia miejsce na naturalne
     * roznice miedzy przegladarkami.
     */
    test('sekcja nie rosnie ponad budzet wysokosci', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 })
      await page.goto('/')
      await page.evaluate(() => document.fonts.ready)

      const wysokosc = await page.evaluate(() => document.querySelector('#seniorzy').offsetHeight)

      expect(wysokosc, `sekcja ${wysokosc} px`).toBeLessThanOrEqual(830)
    })
  })

  test('wezwanie prowadzi na podstrone seniorow', async ({ page }) => {
    await page.goto('/')

    const cta = page.locator('#seniorzy .cta')
    await expect(cta).toHaveText(/ZOBACZ ZAJĘCIA DLA SENIORÓW/i)
    await expect(cta).toHaveAttribute('href', '/oferta/seniorzy/')
  })
})
