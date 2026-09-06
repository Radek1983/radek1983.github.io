import { expect, test } from '@playwright/test'

test.describe('szkielet strony', () => {
  test('laduje sie bez bledow JS i ma jeden h1', async ({ page }) => {
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))

    await page.goto('/')

    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('h1')).toHaveText('Angielski po lekcjach. W tej samej szkole.')
    expect(errors).toEqual([])
  })

  test('kazdy link menu prowadzi do istniejacej sekcji', async ({ page }) => {
    await page.goto('/')

    const links = page.locator('.site-header nav a[href^="#"]')
    const count = await links.count()
    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < count; i += 1) {
      const href = await links.nth(i).getAttribute('href')
      await expect(page.locator(href)).toHaveCount(1)
    }
  })

  test('potwierdzone fakty sa w DOM, nie doczytywane przez JS', async ({ page }) => {
    await page.goto('/')
    const body = page.locator('body')

    await expect(body).toContainText('SP 402')
    await expect(body).toContainText('1 października')
    await expect(body).toContainText('minimum 5 dzieci')
    await expect(body).toContainText('55 zł')
    await expect(body).toContainText('50 zł')
  })

  test('CTA prowadzi do sekcji kontaktu z klikalnym telefonem i e-mailem', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('link', { name: 'Zgłoś dziecko do grupy' })).toHaveAttribute(
      'href',
      '#kontakt',
    )
    await expect(page.locator('#kontakt a[href^="tel:"]')).toHaveCount(1)
    await expect(page.locator('#kontakt a[href^="mailto:"]')).toHaveCount(1)
  })

  test('skip link jest pierwszym elementem w kolejnosci focusu', async ({ page }, testInfo) => {
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

  test('strona 404 dziala i ma wlasny naglowek', async ({ page }) => {
    await page.goto('/404.html')
    await expect(page.locator('h1')).toHaveText('Nie znaleziono strony')
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
