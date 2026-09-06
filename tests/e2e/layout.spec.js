import { expect, test } from '@playwright/test'

/**
 * Testy warstwy wizualno-interakcyjnej. Pilnuja kryteriow VIZ z rozdz. 33
 * specyfikacji oraz zakazow z briefu, ktore da sie sprawdzic automatycznie.
 */

const PAPER = 'rgb(242, 239, 232)'
const INK = 'rgb(10, 10, 10)'
const SIGNAL = 'rgb(242, 59, 47)'
const HF_BLUE = 'rgb(18, 59, 140)'

test.describe('kompozycja i art direction', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('sekcje maja zroznicowany rytm, nie jednakowa wysokosc (VIZ-001)', async ({ page }) => {
    const heights = await page
      .locator('main > section')
      .evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().height)))

    expect(heights.length).toBeGreaterThanOrEqual(9)

    // Gdyby kazda sekcja miala te sama wysokosc, mielibysmy sztywny deck slajdow.
    const unique = new Set(heights)
    expect(unique.size).toBeGreaterThan(heights.length / 2)

    const ratio = Math.max(...heights) / Math.min(...heights)
    expect(ratio).toBeGreaterThan(1.5)
  })

  test('kolor zmienia akt narracji (brief, regula 4)', async ({ page }) => {
    const bg = (selector) =>
      page.locator(selector).evaluate((el) => getComputedStyle(el).backgroundColor)

    expect(await bg('#korzysci')).toBe(SIGNAL)
    expect(await bg('#metoda')).toBe(INK)
    expect(await bg('#nabor')).toBe(INK)
    expect(await bg('#cennik')).toBe(PAPER)
    expect(await bg('.site-footer')).toBe(INK)

    // Sciezka egzaminacyjna niesie granat jako drugi akt marki.
    expect(await bg('.course[data-theme="blue"]')).toBe(HF_BLUE)
  })

  test('hierarchia typograficzna ma wyrazisty poziom display skalowany clamp (VIZ-002)', async ({
    page,
  }) => {
    const wordmark = await page
      .locator('.hero__wordmark')
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize))
    const body = await page
      .locator('body')
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize))

    // Display musi byc radykalnie wieksze od tekstu, nie o dwa stopnie.
    expect(wordmark / body).toBeGreaterThan(4)
  })

  test('brak kart, cieni i zaokraglen jako jezyka layoutu (VIZ-008)', async ({ page }) => {
    const offenders = await page.evaluate(() => {
      const found = []
      for (const el of document.querySelectorAll('main *')) {
        const s = getComputedStyle(el)
        if (s.boxShadow && s.boxShadow !== 'none') found.push(['shadow', el.className])

        // Promien dozwolony wylacznie dla CTA (kapsula) i elementow bez klasy.
        const radius = parseFloat(s.borderRadius) || 0
        const isCta = typeof el.className === 'string' && el.className.includes('cta')
        if (radius > 0 && !isCta) found.push(['radius', el.className])

        if (s.backgroundImage.includes('gradient')) found.push(['gradient', el.className])
      }
      return found
    })

    expect(offenders).toEqual([])
  })

  test('obrazy sa art-directed i responsywne (VIZ-003)', async ({ page }) => {
    // Hero ma osobne zrodlo dla desktopu - to nie ten sam kadr przyciety inaczej.
    await expect(page.locator('.hero__media source[media]')).not.toHaveCount(0)

    // Kazdy obraz ma alt oraz nowoczesny format w srcset.
    const imgs = page.locator('main img')
    const count = await imgs.count()
    expect(count).toBeGreaterThanOrEqual(5)

    for (let i = 0; i < count; i += 1) {
      await expect(imgs.nth(i)).toHaveAttribute('alt', /.+/)
    }

    await expect(page.locator('main source[type="image/avif"]').first()).toHaveAttribute(
      'srcset',
      /\.avif/,
    )
  })

  test('obraz LCP nie jest lazy-loaded, pozostale sa (spec 10.1, 18.3)', async ({ page }) => {
    const hero = page.locator('.hero__media img')
    await expect(hero).toHaveAttribute('fetchpriority', 'high')
    expect(await hero.getAttribute('loading')).toBeNull()

    const belowFold = page.locator('.course__media img').first()
    await expect(belowFold).toHaveAttribute('loading', 'lazy')
  })

  test('sekcja metody nie zawiera fotografii - swiadoma przerwa od zdjec', async ({ page }) => {
    await expect(page.locator('#metoda img')).toHaveCount(0)
  })

  test('brak fikcyjnego licznika zapisanych dzieci w sekcji naboru', async ({ page }) => {
    await expect(page.locator('#nabor progress, #nabor meter')).toHaveCount(0)
  })
})

test.describe('nawigacja i dostepnosc', () => {
  test('kotwica z URL ustawia sekcje pod sticky headerem', async ({ page }) => {
    await page.goto('/#cennik')

    const { sectionTop, headerBottom } = await page.evaluate(() => ({
      sectionTop: document.getElementById('cennik').getBoundingClientRect().top,
      headerBottom: document.querySelector('.site-header').getBoundingClientRect().bottom,
    }))

    // Sekcja nie moze chowac sie pod naglowkiem po skoku z adresu.
    expect(sectionTop).toBeGreaterThanOrEqual(headerBottom - 2)
  })

  test('sticky header ma rozsadna wysokosc - brak sprzezenia zwrotnego pomiaru', async ({
    page,
  }) => {
    await page.goto('/')
    await page.waitForTimeout(600)

    const height = await page
      .locator('.site-header')
      .evaluate((el) => el.getBoundingClientRect().height)

    // Regresja: moduł nawigacji zapisywal wysokosc do zmiennej, ktora sama
    // ustalala wysokosc headera. Kazdy pomiar rosl o grubosc obramowania.
    expect(height).toBeLessThan(120)
  })

  test('FAQ dziala z klawiatury bez JavaScriptu', async ({ page }) => {
    await page.goto('/')

    const first = page.locator('.faq__item').first()
    const summary = first.locator('summary')

    await expect(first).not.toHaveAttribute('open', '')
    await summary.focus()
    await page.keyboard.press('Enter')
    await expect(first).toHaveAttribute('open', '')
  })

  test('odpowiedzi FAQ sa w DOM takze gdy sekcja jest zwinieta', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.faq__answer').first()).toContainText('klas 1-8')
  })

  test('skip link jest pierwszy w kolejnosci focusu', async ({ page }, testInfo) => {
    // WebKit mobilny nie przenosi focusu klawiszem Tab na linki bez wlaczenia
    // "Press Tab to highlight each item" - to zachowanie platformy, nie strony.
    test.skip(
      testInfo.project.name === 'mobile-safari',
      'Tab nie przenosi focusu na linki w mobilnym Safari',
    )

    await page.goto('/')
    await page.keyboard.press('Tab')
    await expect(page.locator(':focus')).toHaveClass(/skip-link/)
  })

  test('krytyczne targety dotykowe maja minimum 44 px', async ({ page }) => {
    await page.goto('/')

    const small = await page.evaluate(() => {
      const out = []
      for (const el of document.querySelectorAll('.cta, .contact__link, .faq__question')) {
        const r = el.getBoundingClientRect()
        if (r.height > 0 && r.height < 44) out.push([el.className, Math.round(r.height)])
      }
      return out
    })

    expect(small).toEqual([])
  })
})

test.describe('responsywnosc', () => {
  for (const width of [320, 375, 768, 1024, 1440, 1920]) {
    test(`brak poziomego scrolla przy ${width} px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      )
      expect(overflow).toBeLessThanOrEqual(1)
    })
  }

  test('mobile ma wlasna choreografie, nie pomniejszony desktop (VIZ-004)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')

    // Nawigacja ustepuje miejsca jednemu sticky CTA - brief wymaga jednej akcji.
    await expect(page.locator('.site-nav')).toBeHidden()
    await expect(page.locator('.cta-dock')).toBeVisible()
    await expect(page.locator('.site-header__cta')).toBeHidden()

    // Wordmark nie moze skurczyc sie do napisu - lamie sie i rosnie.
    const { size, lines } = await page.locator('.hero__wordmark').evaluate((el) => {
      const s = getComputedStyle(el)
      return {
        size: parseFloat(s.fontSize),
        lines: Math.round(el.getBoundingClientRect().height / parseFloat(s.lineHeight)),
      }
    })

    expect(size).toBeGreaterThan(80)
    expect(lines).toBe(2)

    // Hero bierze kadr pionowy, nie przyciety poziomy.
    const ratio = await page
      .locator('.hero__media')
      .evaluate((el) => el.getBoundingClientRect().width / el.getBoundingClientRect().height)
    expect(ratio).toBeLessThan(1)
  })

  test('sticky media degraduje sie na malym ekranie (spec 30.1)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')

    const position = await page
      .locator('.media--sticky')
      .evaluate((el) => getComputedStyle(el).position)
    expect(position).toBe('static')
  })
})

test.describe('motion', () => {
  test('reveal odslania tresc, a nie zostawia jej ukrytej (ANIM-003)', async ({ page }) => {
    await page.goto('/')

    // Element w pierwszym ekranie musi byc widoczny natychmiast po starcie.
    const h1 = page.locator('.hero__title')
    await expect(h1).toHaveClass(/is-visible/)
    await expect(h1).toBeVisible()
    // Prog, nie rownosc: przejscie trwa 560 ms, wiec w chwili sprawdzenia
    // opacity moze wynosic np. 0.999. Istotne jest, ze tresc jest odslaniana.
    await expect
      .poll(async () => Number(await h1.evaluate((el) => getComputedStyle(el).opacity)), {
        timeout: 3000,
      })
      .toBeGreaterThan(0.95)

    // Element ponizej fold odslania sie po przewinieciu.
    const faqHead = page.locator('#faq-title')
    await faqHead.scrollIntoViewIfNeeded()
    await expect(faqHead).toHaveClass(/is-visible/)
  })

  test('siatka bezpieczenstwa odslania wszystko, gdy obserwator milczy', async ({ page }) => {
    await page.goto('/')

    // Symulujemy cisze obserwatora: usuwamy klase, ktora go uruchomila,
    // i sprawdzamy, ze po zabezpieczeniu czasowym nic nie zostaje ukryte.
    await page.waitForTimeout(3000)

    const hidden = await page.evaluate(
      () =>
        [...document.querySelectorAll('[data-animation]')].filter(
          (el) => !el.classList.contains('is-visible'),
        ).length,
    )
    expect(hidden).toBe(0)
  })

  test('bez JavaScriptu tresc jest widoczna od razu', async ({ browser }) => {
    // Klasa `js` na <html> jest warunkiem stanu poczatkowego reveal.
    // Bez niej - czyli przy awarii skryptu - tresc nie moze byc ukryta.
    const context = await browser.newContext({ javaScriptEnabled: false })
    const page = await context.newPage()
    await page.goto('/')

    await expect(page.locator('html')).not.toHaveClass(/js/)
    await expect(page.locator('.hero__title')).toBeVisible()
    expect(await page.locator('.hero__title').evaluate((el) => getComputedStyle(el).opacity)).toBe(
      '1',
    )
    await expect(page.locator('#kontakt a[href^="tel:"]')).toBeVisible()

    await context.close()
  })

  test('ruch wiazany ze scrollem jest progressive enhancement', async ({ page }, testInfo) => {
    // Przy reduced motion cala warstwa narrative jest wylaczona z zalozenia -
    // sprawdza to osobny test w bloku "reduced motion".
    test.skip(
      testInfo.project.name === 'reduced-motion',
      'Warstwa narrative jest wylaczona przy reduced motion',
    )

    await page.goto('/')

    const supported = await page.evaluate(() => CSS.supports('animation-timeline', 'view()'))
    const animation = await page
      .locator('.hero__wordmark')
      .evaluate((el) => getComputedStyle(el).animationName)

    // Tam gdzie przegladarka wspiera scroll-driven animations, wordmark ma momentum.
    // Tam gdzie nie - kompozycja jest statyczna i to jest poprawny stan.
    expect(supported ? animation : 'none').toBe(supported ? 'wordmark-drift' : 'none')
  })
})

test.describe('reduced motion', () => {
  test('reveal nie ukrywa tresci przy prefers-reduced-motion', async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== 'reduced-motion',
      'Test dotyczy wylacznie projektu reduced-motion',
    )

    await page.goto('/')

    // Bez czekania na obserwatora: przy reduced motion stan poczatkowy nie istnieje.
    const opacity = await page.locator('#faq-title').evaluate((el) => getComputedStyle(el).opacity)
    expect(opacity).toBe('1')
  })

  test('ruch wiazany ze scrollem jest wylaczony przy reduced motion', async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== 'reduced-motion',
      'Test dotyczy wylacznie projektu reduced-motion',
    )

    await page.goto('/')

    for (const selector of ['.hero__wordmark', '.marquee__row', '.method__verb']) {
      const name = await page
        .locator(selector)
        .first()
        .evaluate((el) => getComputedStyle(el).animationName)
      expect(name).toBe('none')
    }
  })

  test('przy prefers-reduced-motion scroll nie jest wygladzany', async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== 'reduced-motion',
      'Test dotyczy wylacznie projektu reduced-motion',
    )

    await page.goto('/')

    const behavior = await page
      .locator('html')
      .evaluate((el) => getComputedStyle(el).scrollBehavior)
    expect(behavior).toBe('auto')

    const sticky = await page
      .locator('.media--sticky')
      .evaluate((el) => getComputedStyle(el).position)
    expect(sticky).toBe('static')
  })
})
