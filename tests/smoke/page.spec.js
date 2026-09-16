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
      /klas 1-7 po lekcjach w SP 402/,
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

    /*
     * "Klasy 1-7" plus osobny kurs dla klasy 8 zamiast zbiorczego "1-8".
     * Brief opisuje DWIE sciezki, a jedna etykieta je zacierala.
     */
    await expect(body).toContainText('klas 1-7')
    await expect(body).toContainText(/egzamin/i)
    await expect(body).toContainText('SP 402')
    await expect(body).toContainText('1 października')
    await expect(body).toContainText('minimum 5 dzieci')
    await expect(body).toContainText('55 zł')
    await expect(body).toContainText('50 zł')
    await expect(body).toContainText('egzaminu ósmoklasisty')
  })

  test('primary CTA prowadzi do sekcji kontaktu', async ({ page }) => {
    const cta = page.getByRole('link', { name: /Zapisz si/ }).first()
    await expect(cta).toHaveAttribute('href', '#kontakt')

    /*
     * Brzmienie zmienil wlasciciel: "Zglos dziecko" czytalo sie jak zgloszenie
     * na policje (ADR 0006). Zakaz z briefu dotyczy oslabienia konwersji -
     * podmiany na "Sprawdz poziom", "Umow konsultacje", "Trial". Nowa etykieta
     * nadal wzywa wprost do zapisu i nadal prowadzi do #kontakt, wiec te
     * asercje zostaja.
     */
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

    /*
     * Zastrzezenie o braku obietnicy wyniku przenioslo sie na podstrone
     * kursu egzaminacyjnego - tam, gdzie stoi jego opis. Strona glowna
     * pokazuje juz tylko skrot czterech sciezek. Pilnuje go test
     * w tests/e2e/pages.spec.js.
     */
  })

  test('relacja ze SP 402 jest opisana bez sugerowania oficjalnego partnerstwa', async ({
    page,
  }) => {
    await expect(page.locator('body')).toContainText(/nie jest oficjalnym serwisem/i)
  })

  /*
   * Telefon w sekcji kontaktu jest TEKSTEM - decyzja wlasciciela. Odnosnik
   * `tel:` zostaje w stopce, na kazdej stronie, wiec dotkniecie numeru na
   * telefonie nadal dzwoni, a wymog D2 jest spelniony bez JavaScriptu.
   */
  test('dane kontaktowe sa klikalne i obecne w DOM', async ({ page }) => {
    await expect(page.locator('#kontakt')).toContainText('+48 790 266 517')
    await expect(page.locator('#kontakt a[href^="mailto:"]').first()).toBeVisible()
    await expect(page.locator('.site-footer a[href^="tel:"]')).toHaveCount(1)
  })

  test('kazdy link nawigacji prowadzi do istniejacej sekcji lub podstrony', async ({
    page,
    request,
  }) => {
    /*
     * Menu ma trzy rodzaje pozycji: przycisk rozwijajacy ofere (bez adresu),
     * kotwice w glab strony glownej ("/#faq") i adresy podstron
     * ("/lokalizacje/"). Adresy sa bezwzgledne, bo to samo menu stoi
     * na dziewieciu stronach.
     *
     * Pozycje oferty sprawdza osobny zestaw w tests/e2e/pages.spec.js.
     */
    const href = await page
      .locator('.site-nav__link[href]')
      .evaluateAll((els) => els.map((el) => el.getAttribute('href')))
    expect(href.length).toBe(5)

    for (const adres of href) {
      if (adres.includes('#')) {
        const kotwica = '#' + adres.split('#')[1]
        await expect(page.locator(kotwica), adres).toHaveCount(1)
      } else {
        // Podstrona musi istniec pod swoim adresem, nie tylko w menu.
        const odpowiedz = await request.get(adres)
        expect(odpowiedz.status(), adres).toBe(200)
      }
    }
  })

  test('nabor jest informacja czasowa, a nie tematem przewodnim', async ({ page }) => {
    /*
     * Wlasciciel przenios nabor do paska faktow na gorze i usunal czerwony baner.
     * Nabor moze byc wiec widoczny, ale kazdy jego element musi dac sie usunac
     * po 1 pazdziernika. Piec elementow w czterech miejscach: dwie pozycje
     * w pasku, data i plakietka w sekcji 07 oraz jedno pytanie FAQ.
     */
    await expect(page.locator('[data-temporary="nabor-2026"]')).toHaveCount(5)

    // Warunek istotny: zadna wzmianka o naborze nie moze byc nieoznaczona,
    // bo wtedy zostalaby na stronie po usunieciu bloku czasowego.
    const nieoznaczone = await page.evaluate(() => {
      /*
       * Wzorzec celuje w datowane twierdzenia, nie w samo slowo "nabor".
       * Zdanie "status naboru" w final CTA jest stale i zostaje na stronie
       * takze po 1 pazdziernika - to opis procesu, nie termin.
       */
      const wzorzec = /nab[oó]r trwa|1 pa[zż]dziernika|pa[zż]dziernik[a]? 2026/i
      const out = []
      for (const el of document.querySelectorAll('main *, .ticker *, .site-footer *')) {
        if (el.children.length > 0) continue
        if (!wzorzec.test(el.textContent)) continue
        if (el.closest('[data-temporary="nabor-2026"]')) continue
        out.push(el.textContent.trim().slice(0, 60))
      }
      return out
    })
    expect(nieoznaczone).toEqual([])

    /*
     * Naglowek sekcji 08 opisuje warunek STALY, nie date - dlatego zostaje
     * na stronie takze po 1 pazdziernika. Brzmienie wlasciciel zmienil
     * 16.09.2026 z "Grupa rusza od piątego dziecka." na "5 dzieci
     * i startujemy."; warunek jest ten sam, wiec test pilnuje intencji
     * (minimum grupy bez daty), a nie konkretnego zdania.
     */
    await expect(page.locator('#nabor-title')).toContainText(/5\s*dzieci/i)
    await expect(page.locator('#nabor-title')).not.toContainText(/pa[zż]dziernik|2026/i)

    // Czerwony baner zostal usuniety - nabor nie ma wlasnego pasa na stronie.
    await expect(page.locator('.notice')).toHaveCount(0)
  })

  test('w pierwszym ekranie jest dokladnie jedno CTA zgloszeniowe', async ({ page }) => {
    /*
     * Wlasciciel zglosil trzy przyciski zgloszeniowe w jednym widoku. Docelowo
     * ma byc DOKLADNIE JEDEN - w pasku na gorze. Przycisk "Sprawdź grupy i ceny"
     * nie jest tu liczony: to akcja pomocnicza o innym celu i w innym kolorze.
     */
    const zgloszeniowe = await page.evaluate(() =>
      [...document.querySelectorAll('a.cta')]
        .filter((el) => /zapisz (si[eę]|dziecko)|zapytaj o zaj/i.test(el.textContent))
        .filter((el) => {
          const r = el.getBoundingClientRect()
          return r.top < window.innerHeight && r.bottom > 0 && el.offsetParent !== null
        })
        .map((el) => el.textContent.trim().replace(/\s+/g, ' ')),
    )
    expect(zgloszeniowe).toHaveLength(1)

    // Hero nie zawiera ani ceny, ani CTA zgloszeniowego - oba zyja dalej na stronie.
    const hero = await page.locator('.hero').innerText()
    expect(hero).not.toMatch(/55 z[lł]/)
    expect(hero).not.toMatch(/zapisz (si[eę]|dziecko)|zapytaj o zaj/i)
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
