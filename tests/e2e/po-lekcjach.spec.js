import { expect, test } from '@playwright/test'

/**
 * 02 PO LEKCJACH — układ zatwierdzony przez właściciela.
 *
 * Sekcja została domknięta po serii poprawek robionych na żywo i właściciel
 * poprosił, żeby jej już nie ruszać — także przy pracy nad innymi sekcjami.
 * Ten plik jest zabezpieczeniem tamtej decyzji.
 *
 * Cztery rzeczy, o które chodziło:
 *   1. wszystkie przerwy między blokami mają DOKŁADNIE tę samą wysokość,
 *   2. puenta stoi w dwóch wierszach, z podziałem po „pośpiechu,",
 *   3. żaden wiersz nie kończy się krótkim słowem (CLAUDE.md §5),
 *   4. hasło sekcji zostaje w rejestrze plakatowym.
 *
 * Zmiana któregokolwiek punktu wymaga decyzji właściciela, nie poprawki
 * „przy okazji" (CLAUDE.md §15, D8).
 */

const WIDOKI = [
  [1920, 1000],
  [1600, 950],
  [1440, 900],
  [1280, 800],
]

/*
 * Slowa, ktore nie moga zostac na koncu wiersza. Lista z CLAUDE.md par. 5.
 * Sprawdzamy TYLKO konce wierszy, ktore maja nastepnik - ostatni wiersz
 * akapitu konczy sie kropka i nie podlega regule.
 */
const KROTKIE = /(^|\s)(z|w|i|a|o|u|do|po|za|na|od|nie|dla|nr|np\.|im\.|ul\.)$/i

/**
 * Wiersze akapitu tak, jak realnie zlamala je przegladarka.
 *
 * Range + getClientRects zamiast liczenia z wysokosci: potrzebujemy TRESCI
 * kazdego wiersza, a nie samej ich liczby, zeby sprawdzic, czym sie konczy.
 */
const wiersze = (page, selektor) =>
  page.evaluate((sel) => {
    const el = document.querySelector(sel)
    const wezel = el.firstChild
    const zakres = document.createRange()
    const linie = []
    let start = 0
    const tekst = wezel.textContent

    for (let i = 1; i <= tekst.length; i += 1) {
      zakres.setStart(wezel, start)
      zakres.setEnd(wezel, i)
      if (zakres.getClientRects().length > 1) {
        linie.push(
          tekst
            .slice(start, i - 1)
            .trim()
            .replace(/\s+/g, ' '),
        )
        start = i - 1
      }
    }
    linie.push(tekst.slice(start).trim().replace(/\s+/g, ' '))
    return linie
  }, selektor)

const AKAPITY = [
  '.after-school__block:nth-of-type(1) p',
  '.after-school__block:nth-of-type(2) p',
  '.after-school__block:nth-of-type(3) p',
  '.after-school__punch',
  '.after-school__coda',
]

test.describe('02 po lekcjach - uklad zatwierdzony', () => {
  /*
   * Uklad dwukolumnowy zyje od 62rem; na telefonie sekcja stackuje sie
   * i mierzone tu odstepy oraz podzial wierszy po prostu nie istnieja.
   */
  test.skip(({ isMobile }) => isMobile, 'uklad dwukolumnowy dziala od 62rem')

  /*
   * Sedno poprawki. Puenta miala wczesniej wlasny, wiekszy margines, wiec
   * ostatnia przerwa byla o polowe wyzsza od pozostalych. Wlasciciel wymaga
   * rytmu rownego co do piksela.
   */
  for (const [width, height] of WIDOKI) {
    test(`przerwy miedzy blokami sa identyczne przy ${width}x${height}`, async ({ page }) => {
      await page.setViewportSize({ width, height })
      await page.goto('/')
      await page.evaluate(() => document.fonts.ready)

      /*
       * Pomiar z offsetow, nie z prostokatow ekranowych.
       *
       * Bloki maja `data-animation`, wiec dopoki nie wejda w kadr, niosa
       * `translate` warstwy reveal - a prostokat klienta to przesuniecie
       * uwzglednia. Pod obciazeniem pelnego przebiegu czesc blokow byla
       * odsloniona, a czesc jeszcze nie, i trzy rowne przerwy raportowaly
       * sie jako rozne. Offsety sa wielkosciami LAYOUTU i nie maja tego szumu.
       */
      const przerwy = await page.evaluate(() => {
        const off = (el) => {
          let y = 0
          for (let n = el; n; n = n.offsetParent) y += n.offsetTop
          return y
        }
        const b = [...document.querySelectorAll('.after-school__block')]
        const out = []
        for (let i = 1; i < b.length; i += 1) {
          out.push(off(b[i]) - (off(b[i - 1]) + b[i - 1].offsetHeight))
        }
        return out
      })

      expect(przerwy.length, 'cztery bloki, trzy przerwy').toBe(3)

      /*
       * Tolerancja JEDNEGO piksela, nie równość co do jedynki.
       *
       * Odstęp jest wartością ułamkową (`clamp` w `vh`), a offsety są
       * całkowite - trzy identyczne przerwy raportowały się jako 59, 59, 58.
       * To zaokrąglenie, nie nierówny rytm. Większa różnica nadal oznacza,
       * że któryś blok dołożył własny margines, i test to złapie.
       */
      const rozstrzal = Math.max(...przerwy) - Math.min(...przerwy)
      expect(rozstrzal, `przerwy: ${przerwy.join(', ')}`).toBeLessThanOrEqual(1)
    })
  }

  test('zaden blok nie doklada wlasnego marginesu do rytmu', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')

    const marginesy = await page.evaluate(() =>
      [...document.querySelectorAll('.after-school__block')].map((el) => {
        const cs = getComputedStyle(el)
        return [cs.marginBlockStart, cs.marginBlockEnd].join(' ')
      }),
    )

    // Jedynym zrodlem odstepu jest `gap` w .after-school__text.
    expect(new Set(marginesy).size, marginesy.join(' | ')).toBe(1)
    expect(marginesy[0]).toBe('0px 0px')
  })

  /*
   * Podzial puenty jest wyborem redakcyjnym, nie przypadkiem: pierwszy wiersz
   * konczy sie na "pospiechu,". Pilnuje go miara 24ch - przy 20ch zdanie
   * lamalo sie na trzy wiersze, z samotnym "wiecej" w srodku.
   */
  for (const [width, height] of WIDOKI) {
    test(`puenta ma dwa wiersze z podzialem po "pospiechu," przy ${width}x${height}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height })
      await page.goto('/')
      await page.evaluate(() => document.fonts.ready)

      const linie = await wiersze(page, '.after-school__punch')

      expect(linie).toEqual(['Mniej wożenia, mniej pośpiechu,', 'więcej spokojnego popołudnia.'])
    })
  }

  /*
   * Regula z CLAUDE.md par. 5, wprowadzona przez wlasciciela po tym, jak
   * zglaszal takie miejsca zdanie po zdaniu. Test jest tu po to, zeby nie
   * musial zglaszac ich ponownie.
   */
  for (const [width, height] of WIDOKI) {
    test(`krotkie slowa nie zostaja na koncach wierszy przy ${width}x${height}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height })
      await page.goto('/')
      await page.evaluate(() => document.fonts.ready)

      for (const selektor of AKAPITY) {
        const linie = await wiersze(page, selektor)
        const wiszace = linie.slice(0, -1).filter((l) => KROTKIE.test(l))
        expect(wiszace, `${selektor}: ${wiszace.join(' / ')}`).toEqual([])
      }
    })
  }

  test('haslo sekcji zostaje w rejestrze plakatowym', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')

    const haslo = page.locator('.after-school__claim')
    await expect(haslo).toContainText('Mniej logistyki.')
    await expect(haslo).toContainText('Znane miejsce.')
    await expect(haslo).toContainText('Więcej ciągłości.')

    const stopien = await haslo.evaluate((el) => parseFloat(getComputedStyle(el).fontSize))
    expect(stopien, 'stopien plakatowy').toBeGreaterThanOrEqual(64)
  })

  test('tresc konczaca sekcje jest ta zatwierdzona przez wlasciciela', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('.after-school__coda')).toHaveText(
      'Angielski staje się naturalną częścią dnia dziecka — wpisuje się w jego codzienny rytm, bez dodatkowych dojazdów i pośpiechu. Nie jest kolejnym obowiązkiem do odhaczenia.',
    )
  })
})
