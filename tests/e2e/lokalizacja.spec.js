import { expect, test } from '@playwright/test'

/**
 * 09 LOKALIZACJE — stan zatwierdzony przez właściciela.
 *
 * Właściciel poprosił, żeby wezwanie "Wyznacz trasę" przestało być przyciskiem
 * obrysowym i wyglądało dokładnie jak wezwanie z hero: czarne tło, jasna
 * czcionka, czerwień po najechaniu. To ten sam wariant komponentu (`cta--ink`),
 * a nie osobne style - dzięki temu oba przyciski nie mogą się rozjechać.
 *
 * Czego pilnujemy:
 *   1. przycisk ma dokładnie te same kolory co wezwanie w hero,
 *   2. po najechaniu tło zmienia się na kolor sygnałowy,
 *   3. na stronie głównej nie wraca wariant obrysowy,
 *   4. odnośnik nadal prowadzi do trasy na adres SP 402 i otwiera się
 *      bezpiecznie w nowej karcie.
 *
 * Zmiana któregokolwiek punktu wymaga decyzji właściciela (CLAUDE.md §15, D15).
 */

const kolory = (page, selektor) =>
  page.evaluate((sel) => {
    const s = getComputedStyle(document.querySelector(sel))
    return { tlo: s.backgroundColor, tekst: s.color }
  }, selektor)

test.describe('09 lokalizacje - wezwanie zatwierdzone', () => {
  test('wyznacz trase ma te same kolory co wezwanie w hero', async ({ page }) => {
    await page.goto('/')

    const trasa = await kolory(page, '#lokalizacja .cta')
    const hero = await kolory(page, '.hero .cta')

    expect(trasa.tlo, 'tlo jak w hero').toBe(hero.tlo)
    expect(trasa.tekst, 'tekst jak w hero').toBe(hero.tekst)

    // INK i PAPER z palety marki - nie czerń przeglądarki i nie czysta biel.
    expect(trasa.tlo).toBe('rgb(10, 10, 10)')
    expect(trasa.tekst).toBe('rgb(242, 239, 232)')
  })

  test('po najechaniu tlo zmienia sie na kolor sygnalowy', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chromium', 'hover ma sens tylko na wskazniku')

    await page.goto('/')
    await page.locator('#lokalizacja .cta').hover()

    /*
     * expect.poll, bo tlo jest animowane przejsciem - pierwszy odczyt
     * potrafi zlapac wartosc w polowie drogi.
     */
    await expect
      .poll(async () => (await kolory(page, '#lokalizacja .cta')).tlo)
      .toBe('rgb(242, 59, 47)')
  })

  test('na stronie glownej nie zostal przycisk obrysowy', async ({ page }) => {
    await page.goto('/')

    /*
     * Wariant `cta--ghost` zyje dalej na podstronach i tam ma zostac.
     * Na stronie glownej wlasciciel go zdjal - to jedyne miejsce, gdzie stal.
     */
    await expect(page.locator('main .cta--ghost')).toHaveCount(0)
  })

  test('odnosnik prowadzi do trasy na adres SP 402', async ({ page }) => {
    await page.goto('/')

    const link = page.locator('#lokalizacja .cta')
    await expect(link).toHaveAttribute('href', /google\.com\/maps\/dir/)
    await expect(link).toHaveAttribute('href', /Nowaka-Jezioranskiego\+22/)
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', /noopener/)
  })
})
