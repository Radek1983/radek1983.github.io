import { expect, test } from '@playwright/test'

/**
 * 03 CO DZIECKO ZYSKUJE — układ zatwierdzony przez właściciela.
 *
 * Trzecia sekcja domknięta 14.09.2026, po hero i „Po lekcjach". Właściciel
 * poprosił, żeby jej już nie zmieniać i zabezpieczyć przed przypadkową
 * zmianą przy korekcie innych stron.
 *
 * Czego pilnujemy:
 *   1. trzy korzyści w pierwszej osobie, dokładnie w zatwierdzonym brzmieniu,
 *   2. żaden wiersz nie kończy się krótkim słowem (CLAUDE.md §5),
 *   3. marquee zostaje dekoracją — treść niesie nagłówek, nie pas,
 *   4. sekcja jest czerwonym aktem i nie ma siatki ikon (CLAUDE.md §8).
 *
 * Zmiana któregokolwiek punktu wymaga decyzji właściciela (CLAUDE.md §15, D9).
 */

const SIGNAL = 'rgb(242, 59, 47)'

const WIDOKI = [
  [1920, 1000],
  [1600, 950],
  [1440, 900],
  [1280, 800],
]

/* Lista z CLAUDE.md par. 5. Ostatni wiersz akapitu nie podlega regule. */
const KROTKIE = /(^|\s)(z|w|i|a|o|u|do|po|za|na|od|nie|dla|nr|np\.|im\.|ul\.)$/i

/** Wiersze akapitu tak, jak realnie zlamala je przegladarka. */
const wiersze = (page, selektor, indeks) =>
  page.evaluate(
    ({ sel, i }) => {
      const el = document.querySelectorAll(sel)[i]
      const wezel = el.firstChild
      const zakres = document.createRange()
      const linie = []
      let start = 0
      const tekst = wezel.textContent

      for (let k = 1; k <= tekst.length; k += 1) {
        zakres.setStart(wezel, start)
        zakres.setEnd(wezel, k)
        if (zakres.getClientRects().length > 1) {
          linie.push(
            tekst
              .slice(start, k - 1)
              .trim()
              .replace(/\s+/g, ' '),
          )
          start = k - 1
        }
      }
      linie.push(tekst.slice(start).trim().replace(/\s+/g, ' '))
      return linie
    },
    { sel: selektor, i: indeks },
  )

const KORZYSCI = [
  [
    'Mówię więcej.',
    'Dziecko regularnie używa angielskiego w praktyce, zamiast tylko rozwiązywać ćwiczenia.',
  ],
  [
    'Rozumiem więcej.',
    'Słownictwo i gramatyka pomagają dziecku rozumieć i komunikować się — nie są celem samym w sobie.',
  ],
  [
    'Czuję się pewniej.',
    'Regularny kontakt z językiem ułatwia pracę na lekcjach i przygotowanie do ważnych sprawdzianów.',
  ],
]

test.describe('03 korzysci - uklad zatwierdzony', () => {
  test('trzy korzysci w zatwierdzonym brzmieniu', async ({ page }) => {
    await page.goto('/')

    const pozycje = page.locator('.benefits__item')
    await expect(pozycje).toHaveCount(3)

    for (const [i, [naglowek, tresc]] of KORZYSCI.entries()) {
      await expect(pozycje.nth(i).locator('h3')).toHaveText(naglowek)
      await expect(pozycje.nth(i).locator('p')).toHaveText(tresc)
    }
  })

  /*
   * Regula z CLAUDE.md par. 5. Wlasciciel zglosil tu wiszace "do" - test jest
   * po to, zeby nie musial zglaszac kolejnych.
   */
  for (const [width, height] of WIDOKI) {
    test(`krotkie slowa nie zostaja na koncach wierszy przy ${width}x${height}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height })
      await page.goto('/')
      await page.evaluate(() => document.fonts.ready)

      for (let i = 0; i < 3; i += 1) {
        const linie = await wiersze(page, '.benefits__item p', i)
        const wiszace = linie.slice(0, -1).filter((l) => KROTKIE.test(l))
        expect(wiszace, `korzysc ${i + 1}: ${wiszace.join(' / ')}`).toEqual([])
      }
    })
  }

  /*
   * Pas typograficzny jest dekoracja. Gdyby niosl tresc, czytnik ekranu
   * przeczytalby ja dwa razy albo - przy wylaczonym JS - wcale.
   */
  test('marquee jest dekoracja, nie trescia', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('.benefits__marquee')).toHaveAttribute('aria-hidden', 'true')
    await expect(page.locator('#korzysci h2')).not.toHaveText('')
  })

  /*
   * Par. 8 wymienia "szesc ikonek korzysci" jako jawny anty-wzorzec, a par. 7
   * dopuszcza ikony wylacznie uzytkowe. Sekcja ma byc typografia na czerwieni.
   */
  test('czerwony akt bez siatki ikon', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('#korzysci')).toHaveCSS('background-color', SIGNAL)
    await expect(page.locator('#korzysci img, #korzysci svg')).toHaveCount(0)

    const ozdoby = await page.evaluate(
      () =>
        [...document.querySelectorAll('#korzysci .benefits__item')].filter((el) => {
          const cs = getComputedStyle(el)
          return parseFloat(cs.borderRadius) > 0 || cs.boxShadow !== 'none'
        }).length,
    )
    expect(ozdoby, 'zero kart').toBe(0)
  })
})
