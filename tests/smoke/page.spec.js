import { expect, test } from '@playwright/test'

/**
 * Testy tresci i SEO. Sprawdzaja, ze potwierdzone fakty sa w DOM
 * i ze nie pojawily sie tresci zabronione przez brief.
 */

test.describe('tresc i SEO', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('laduje sie bez bledow JS i ma dokladnie jeden h1', async ({ page }) => {
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))

    await page.reload()

    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('h1')).toHaveText('Angielski po lekcjach. W tej samej szkole.')
    expect(errors).toEqual([])
  })

  test('metadane SEO sa zgodne z copy deckiem', async ({ page }) => {
    await expect(page).toHaveTitle('High Five - angielski dla dzieci w SP 402 Warszawa')

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://radek1983.github.io/',
    )
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /klas 1-8 po lekcjach w SP 402/,
    )
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1)
    await expect(page.locator('html')).toHaveAttribute('lang', 'pl')
  })

  test('dane strukturalne opisuja SP 402 jako miejsce zajec, nie adres firmy', async ({ page }) => {
    const raw = await page.locator('script[type="application/ld+json"]').textContent()
    const data = JSON.parse(raw)

    expect(data['@type']).toBe('EducationalOrganization')
    expect(data.name).toBe('High Five')

    // Adres SP 402 moze wystapic WYLACZNIE pod `location`, nigdy jako `address`
    // organizacji - to wymog briefu i master promptu.
    // Od dodania oferty senioralnej `location` jest tablica dwoch miejsc zajec.
    const places = Array.isArray(data.location) ? data.location : [data.location]
    const sp402 = places.find((place) => place.name.includes('402'))
    expect(sp402.address.streetAddress).toContain('Nowaka-Jeziorańskiego')
    expect(data.address).toBeUndefined()

    // Zakaz wymyslonych ocen i opinii.
    expect(data.aggregateRating).toBeUndefined()
    expect(data.review).toBeUndefined()
  })

  test('wszystkie potwierdzone fakty sa w DOM, nie doczytywane przez JS', async ({ page }) => {
    const body = page.locator('body')

    await expect(body).toContainText('klas 1-8')
    await expect(body).toContainText('SP 402')
    await expect(body).toContainText('1 października')
    await expect(body).toContainText('minimum 5 dzieci')
    await expect(body).toContainText('55 zł')
    await expect(body).toContainText('50 zł')
    await expect(body).toContainText('egzaminu ósmoklasisty')
  })

  test('primary CTA jest niezmienione i prowadzi do sekcji kontaktu', async ({ page }) => {
    const cta = page.getByRole('link', { name: /Zgłoś dziecko do grupy/ }).first()
    await expect(cta).toHaveAttribute('href', '#kontakt')

    // Brief zabrania podmiany glownego CTA na inne wezwania.
    await expect(page.locator('body')).not.toContainText('Sprawdź poziom')
    await expect(page.locator('body')).not.toContainText('lekcja próbna')
    await expect(page.locator('body')).not.toContainText('darmowa lekcja')
  })

  test('nie publikujemy tresci zabronionych przez brief', async ({ page }) => {
    const text = (await page.locator('body').innerText()).toLowerCase()

    // Zasada anty-halucynacyjna: brak niepotwierdzonych obietnic i danych.
    for (const forbidden of [
      'gwarantujemy wynik',
      'doświadczeni lektorzy',
      'najwyższa jakość',
      'nowoczesne metody',
      'odrabianie',
      'materiały w cenie',
    ]) {
      expect(text).not.toContain(forbidden)
    }

    // Klasa 8 musi miec jawne zastrzezenie o braku obietnicy wyniku.
    expect(text).toContain('nie obiecujemy wyniku')
  })

  test('relacja ze SP 402 jest opisana bez sugerowania oficjalnego partnerstwa', async ({
    page,
  }) => {
    await expect(page.locator('body')).toContainText(/nie jest oficjalnym serwisem/i)
  })

  test('dane kontaktowe sa klikalne i obecne w DOM', async ({ page }) => {
    await expect(page.locator('#kontakt a[href^="tel:"]')).toHaveCount(1)
    await expect(page.locator('#kontakt a[href^="mailto:"]').first()).toBeVisible()
  })

  test('kazdy link nawigacji prowadzi do istniejacej sekcji', async ({ page }) => {
    const links = page.locator('.site-nav__link[href^="#"]')
    const count = await links.count()
    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < count; i += 1) {
      const href = await links.nth(i).getAttribute('href')
      await expect(page.locator(href)).toHaveCount(1)
    }
  })

  test('nabor jest informacja czasowa, a nie tematem przewodnim', async ({ page }) => {
    // Wlasciciel ustalil, ze nabor po 1 pazdziernika ma zniknac, wiec cala tresc
    // czasowa musi byc oznaczona i dac sie usunac w trzech miejscach.
    // Cztery elementy w trzech miejscach: pasek pod naglowkiem, data i plakietka
    // w sekcji 07 oraz jedno pytanie FAQ.
    const temporary = page.locator('[data-temporary="nabor-2026"]')
    await expect(temporary).toHaveCount(4)

    // Pasek informacyjny na gorze niesie wylacznie fakty stale.
    const ticker = await page.locator('.ticker').innerText()
    expect(ticker.toLowerCase()).not.toContain('nabór')
    expect(ticker.toLowerCase()).not.toContain('października')

    // Naglowek sekcji 07 opisuje warunek stały, nie date.
    await expect(page.locator('#nabor-title')).toContainText(/piątego dziecka/i)
  })

  test('strona 404 dziala i ma wlasny naglowek', async ({ page }) => {
    await page.goto('/404.html')
    await expect(page.locator('h1')).toHaveText('Nie ma tu nic.')
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex')
  })

  test('version.json jest poprawnym JSON-em z commit SHA', async ({ request }) => {
    const response = await request.get('/version.json')
    expect(response.ok()).toBeTruthy()

    const body = await response.json()
    expect(body).toHaveProperty('version')
    expect(body).toHaveProperty('commit')
    expect(body).toHaveProperty('builtAt')
  })
})
