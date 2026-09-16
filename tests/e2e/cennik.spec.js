import { expect, test } from '@playwright/test'

/**
 * /cennik/ — podstrona zatwierdzona przez właściciela.
 *
 * Przebudowana 16.09.2026 według obrazu referencyjnego. Strona niesie
 * WSZYSTKIE cztery kolory marki jako sekwencję aktów: beż → granat → czerń
 * → czerwień, i bardzo rozstrzeloną skalę typografii.
 *
 * Czego pilnujemy:
 *   1. pięć sekcji w tej kolejności i z tymi tłami,
 *   2. cztery stawki co do liczby — to jedyne miejsce w serwisie, gdzie
 *      stoją obok siebie,
 *   3. nigdzie nie wraca „cena nieustalona" ani „60+",
 *   4. geometria prawej kolumny hero: krawędź od nagłówka do przypisu,
 *      krótka kreska równo z literami, hasło w obrębie drugiego wiersza,
 *   5. zero kart — żadnych zaokrągleń poza kapsułą wezwania,
 *   6. stopka jest DOKŁADNIE ta sama co na innych stronach.
 *
 * Wyjątek dopuszczony przez właściciela: **podmiana odnośników**. Jeżeli
 * zmieni się adres którejś podstrony ofertowej, wolno poprawić `href`
 * tutaj i w asercji niżej. Każda inna zmiana wymaga jego decyzji
 * (CLAUDE.md §15, D17).
 */

const PAPER = 'rgb(242, 239, 232)'
const INK = 'rgb(10, 10, 10)'
const SIGNAL = 'rgb(242, 59, 47)'
const BLUE = 'rgb(18, 59, 140)'

test.describe('/cennik/ - strona zatwierdzona', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cennik/')
  })

  test('piec sekcji w kolejnosci i w kolorach marki', async ({ page }) => {
    const tla = await page.evaluate(() =>
      [...document.querySelectorAll('main > section')].map(
        (s) => getComputedStyle(s).backgroundColor,
      ),
    )

    expect(tla).toHaveLength(5)
    expect(tla[0], 'hero na bezu').toBe(PAPER)
    expect(tla[1], 'klasy 1-7 na bezu').toBe(PAPER)
    expect(tla[2], 'zasady na granacie').toBe(BLUE)
    expect(tla[3], 'pozostale zajecia na czerni').toBe(INK)
    expect(tla[4], 'wezwanie na czerwieni').toBe(SIGNAL)
  })

  test('cztery stawki co do liczby', async ({ page }) => {
    const liczby = await page.evaluate(() =>
      [...document.querySelectorAll('.rates__figure, .offers__figure')].map((e) => e.textContent),
    )
    expect(liczby).toEqual(['55', '50', '80', '45', '120'])

    const jednostki = await page.evaluate(() =>
      [...document.querySelectorAll('.rates__per, .offers__per')].map((e) => e.textContent.trim()),
    )
    expect(jednostki).toEqual(['/ 45 min', '/ 45 min', '/ 90 min', '/ 60 min', '/ 60 min'])

    // Stawka podstawowa jest jedynym akcentem czerwieni w typografii cennika.
    await expect(page.locator('.rates__price--accent .rates__figure')).toHaveCSS('color', SIGNAL)
  })

  test('nie wraca brak ceny ani granica wieku', async ({ page }) => {
    const tekst = await page.locator('main').innerText()

    expect(tekst, 'brak "ceny nieustalonej"').not.toMatch(/nieustalon|nie zosta[lł]a jeszcze/i)
    expect(tekst, 'brak "60+"').not.toMatch(/\d\s*\+/)
    expect(tekst, 'brak granicy wieku').not.toMatch(/emeryt|osob starszych|osób starszych/i)
  })

  test('trzy zasady rozliczen w zatwierdzonym brzmieniu', async ({ page }) => {
    const zasady = page.locator('.rules__rule')
    await expect(zasady).toHaveCount(3)

    for (const [i, [numer, nazwa]] of [
      ['01', 'Rozliczenie z góry'],
      ['02', 'Bez stałego ryczałtu'],
      ['03', 'Korekta w kolejnym miesiącu'],
    ].entries()) {
      await expect(zasady.nth(i).locator('.rules__number')).toHaveText(numer)
      await expect(zasady.nth(i).locator('.rules__name')).toHaveText(nazwa)
    }

    /*
     * Rozliczenie idzie Z GORY - zdanie "placisz tylko za odbyte zajecia"
     * byloby uproszczeniem, ktore wlasciciel wprost odrzucil.
     */
    await expect(page.locator('#cennik-zasady')).toContainText(/w\s*kalendarzu/i)
  })

  test('w zadnej sekcji nie ma kart ani zaokraglonych ramek', async ({ page }) => {
    const winni = await page.evaluate(() =>
      [...document.querySelectorAll('main *')]
        .filter((el) => !el.closest('.cta'))
        .filter((el) => parseFloat(getComputedStyle(el).borderTopLeftRadius) > 2)
        .map((el) => (el.className || el.tagName).toString().slice(0, 40)),
    )
    expect(winni).toEqual([])
  })

  /*
   * Wyjatek dopuszczony przez wlasciciela: te adresy wolno podmienic, gdy
   * zmieni sie routing. Sama OBECNOSC odnosnika w kazdym module jest juz
   * czescia zatwierdzonego ukladu.
   */
  test('kazdy modul prowadzi dalej', async ({ page }) => {
    for (const [tekst, adres] of [
      ['Zobacz zajęcia →', '/oferta/dzieci/'],
      ['Zobacz kurs →', '/oferta/egzamin-osmoklasisty/'],
      ['Zobacz online →', '/oferta/online/'],
    ]) {
      await expect(page.locator(`main a:text-is("${tekst}")`).first()).toHaveAttribute(
        'href',
        adres,
      )
    }

    const cta = page.locator('.rate-cta .cta')
    await expect(cta).toHaveAttribute('href', '/#kontakt')
    await expect(cta).toHaveCSS('background-color', INK)
  })

  test('stopka jest dokladnie ta sama co na stronie glownej', async ({ page }) => {
    const zCennika = await page.locator('.site-footer').innerHTML()
    await page.goto('/')
    const zGlownej = await page.locator('.site-footer').innerHTML()

    expect(zCennika, 'stopka bez zmian - warunek postawiony przez wlasciciela').toBe(zGlownej)
  })

  test.describe('geometria desktopowa', () => {
    test.skip(({ isMobile }) => isMobile, 'uklad wielokolumnowy dziala od 62rem')

    for (const [width, height] of [
      [1920, 1080],
      [1440, 900],
      [1280, 800],
    ]) {
      test(`kolumny rowne we wszystkich trzech gridach przy ${width}x${height}`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height })
        await page.goto('/cennik/')
        await page.evaluate(() => document.fonts.ready)

        for (const sel of ['.rates__tier', '.rules__rule', '.offers__offer']) {
          const szerokosci = await page.evaluate(
            (s) =>
              [...document.querySelectorAll(s)].map((e) =>
                Math.round(e.getBoundingClientRect().width),
              ),
            sel,
          )
          expect(szerokosci, `${sel} → ${szerokosci}`).toHaveLength(3)
          expect(new Set(szerokosci).size, `${sel} ma nierowne kolumny`).toBe(1)
        }

        const nadmiar = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        )
        expect(nadmiar, 'brak poziomego scrolla').toBeLessThanOrEqual(0)
      })
    }

    /*
     * Prawa kolumna hero. Wlasciciel zglaszal po kolei kazdy z tych punktow,
     * wiec kazdy ma tu wlasna asercje.
     */
    test('prawa kolumna hero trzyma geometrie z projektu', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 })
      await page.goto('/cennik/')
      await page.evaluate(() => document.fonts.ready)

      const m = await page.evaluate(() => {
        const r = (s) => document.querySelector(s).getBoundingClientRect()
        const t = document.querySelector('.rate-hero__title')
        const ct = getComputedStyle(t)
        const gora = t.getBoundingClientRect().top + parseFloat(ct.paddingBlockStart)
        const wiersz = parseFloat(ct.lineHeight)
        return {
          krawedzOdNaglowka: Math.round(r('.rate-hero__aside').top - r('.rate-hero__title').top),
          krawedzDoPrzypisu: Math.round(
            r('.rate-hero__aside').bottom - r('.rate-hero__note').bottom,
          ),
          kreskaVsLitery: Math.round(r('.rate-hero__dash').left - r('.rate-hero__values').left),
          haslo: Math.round(r('.rate-hero__claim').top),
          drugiWierszOd: Math.round(gora + wiersz),
          drugiWierszDo: Math.round(gora + 2 * wiersz),
        }
      })

      // Krawedz zaczyna sie przy naglowku, a nie przy gornej krawedzi pasa.
      expect(Math.abs(m.krawedzOdNaglowka), 'start krawedzi').toBeLessThanOrEqual(16)

      // I konczy sie na ostatnim wierszu przypisu, a nie na dolnej krawedzi pasa.
      expect(Math.abs(m.krawedzDoPrzypisu), 'koniec krawedzi').toBeLessThanOrEqual(16)

      // Krotka kreska rowno z litera, nie na srodku kolumny - <hr> ma auto!
      expect(m.kreskaVsLitery, 'kreska wyrownana do lewej').toBe(0)

      // "Lepszy" mniej wiecej na wysokosci DRUGIEGO wiersza naglowka.
      expect(
        m.haslo,
        `haslo ${m.haslo}, wiersz 2: ${m.drugiWierszOd}-${m.drugiWierszDo}`,
      ).toBeGreaterThanOrEqual(m.drugiWierszOd - 16)
      expect(m.haslo).toBeLessThanOrEqual(m.drugiWierszDo)

      // Kropka to jedyny akcent koloru w hero.
      await expect(page.locator('.rate-hero__dot')).toHaveCSS('color', SIGNAL)
    })
  })
})
