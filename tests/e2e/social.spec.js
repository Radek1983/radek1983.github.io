import { expect, test } from '@playwright/test'

/**
 * Karty społecznościowe i profil marki.
 *
 * Grafika podglądu jest JEDNA dla całego serwisu, a adres profilu żyje
 * w dwóch miejscach naraz: jako widoczny odnośnik w stopce i jako `sameAs`
 * w danych strukturalnych. Oba biorą wartość z `KONTAKT` w offers.mjs, więc
 * rozjechać się nie powinny — ten test pilnuje, żeby tak zostało także po
 * ręcznej edycji któregoś z nich.
 */

const OBRAZ = 'https://www.highfive.academy/social/og-image.png'
const ALT = 'High Five — szkoła języka angielskiego'
const PROFIL = 'https://www.facebook.com/highfive.goclaw'

/* Dziesięć stron indeksowalnych. 404 i strony przekierowujące mają
   `noindex` i świadomie nie niosą kart podglądu. */
const STRONY = [
  '/',
  '/oferta/',
  '/oferta/dzieci/',
  '/oferta/egzamin-osmoklasisty/',
  '/oferta/seniorzy/',
  '/oferta/online/',
  '/lokalizacje/',
  '/cennik/',
  '/kariera/',
  '/polityka-prywatnosci/',
]

const meta = (page, nazwa) =>
  page
    .locator(`meta[property="${nazwa}"], meta[name="${nazwa}"]`)
    .evaluateAll((el) => el.map((e) => e.getAttribute('content')))

test.describe('karty spolecznosciowe', () => {
  for (const url of STRONY) {
    test(`${url} ma komplet opisu grafiki`, async ({ page }) => {
      await page.goto(url)

      for (const [pole, oczekiwane] of [
        ['og:image', OBRAZ],
        ['og:image:secure_url', OBRAZ],
        ['og:image:type', 'image/png'],
        ['og:image:width', '1200'],
        ['og:image:height', '630'],
        ['og:image:alt', ALT],
        ['twitter:card', 'summary_large_image'],
        ['twitter:image', OBRAZ],
        ['twitter:image:alt', ALT],
      ]) {
        const wartosci = await meta(page, pole)
        expect(wartosci, `${pole} wystepuje dokladnie raz`).toHaveLength(1)
        expect(wartosci[0], pole).toBe(oczekiwane)
      }
    })
  }

  /*
   * Tytul i opis karty musza opisywac TE strone, a nie serwis ogolnie -
   * inaczej kazdy udostepniony odnosnik wyglada tak samo.
   */
  test('tytul i opis karty odpowiadaja metadanym strony', async ({ page }) => {
    for (const url of STRONY) {
      await page.goto(url)

      const tytul = await page.title()
      const opis = (await meta(page, 'description'))[0]

      expect((await meta(page, 'og:title'))[0], `og:title na ${url}`).toBe(tytul)
      expect((await meta(page, 'twitter:title'))[0], `twitter:title na ${url}`).toBe(tytul)
      expect((await meta(page, 'og:description'))[0], `og:description na ${url}`).toBe(opis)
      expect((await meta(page, 'twitter:description'))[0], `twitter:description na ${url}`).toBe(
        opis,
      )
    }
  })

  test('grafika podgladu istnieje i jest tym, czym sie deklaruje', async ({ request }) => {
    const odpowiedz = await request.get('/social/og-image.png')
    expect(odpowiedz.status()).toBe(200)
    expect(odpowiedz.headers()['content-type']).toContain('image/png')
  })
})

test.describe('profil marki', () => {
  test('stopka linkuje do profilu na kazdej stronie', async ({ page }) => {
    for (const url of STRONY) {
      await page.goto(url)

      const link = page.locator(`.site-footer a[href="${PROFIL}"]`)
      await expect(link, `odnosnik na ${url}`).toHaveCount(1)
      await expect(link).toHaveText('Facebook')
      await expect(link).toHaveAttribute('target', '_blank')
      // `me` mowi wyszukiwarce, ze to profil tej samej marki; `noopener` to higiena.
      await expect(link).toHaveAttribute('rel', /me/)
      await expect(link).toHaveAttribute('rel', /noopener/)
    }
  })

  /*
   * Ten sam adres w danych strukturalnych. Rozjazd miedzy widocznym
   * odnosnikiem a `sameAs` mowilby wyszukiwarce co innego niz czlowiekowi.
   */
  test('sameAs w danych strukturalnych wskazuje ten sam profil', async ({ page }) => {
    await page.goto('/')

    const organizacja = await page.evaluate(() =>
      [...document.querySelectorAll('script[type="application/ld+json"]')]
        .map((b) => JSON.parse(b.textContent))
        .find((o) => o['@type'] === 'EducationalOrganization'),
    )

    expect(organizacja.sameAs, 'sameAs istnieje').toBeTruthy()
    expect(organizacja.sameAs).toContain(PROFIL)

    const wStopce = await page
      .locator('.site-footer a[rel~="me"]')
      .evaluateAll((el) => el.map((e) => e.href))
    expect(organizacja.sameAs, 'ten sam adres co w stopce').toEqual(expect.arrayContaining(wStopce))
  })

  /*
   * Jeden Organization na serwis. Drugi rozmylby tozsamosc marki
   * miedzy dwa obiekty i Google nie wiedzialby, ktory jest wlasciwy.
   */
  test('Organization wystepuje tylko raz i tylko na stronie glownej', async ({ page }) => {
    for (const url of STRONY) {
      await page.goto(url)

      const ile = await page.evaluate(() =>
        [...document.querySelectorAll('script[type="application/ld+json"]')]
          .map((b) => JSON.parse(b.textContent)['@type'])
          .filter((t) => t === 'EducationalOrganization' || t === 'Organization'),
      )

      expect(ile.length, `Organization na ${url}`).toBe(url === '/' ? 1 : 0)
    }
  })
})
