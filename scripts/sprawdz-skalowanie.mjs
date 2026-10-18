/* global document, getComputedStyle */
/*
 * SKALOWANIE UKLADU: szerokosc okna, powiekszenie przegladarki.
 *
 * Powstalo 14.10.2026, razem ze zmiana, ktora kasuje puste marginesy na
 * monitorach szerszych niz 1536 px. Sprawdza trzy rzeczy naraz:
 *
 *   1. MARGINES - czy kontener wypelnia okno az do granicy 2560 px.
 *   2. PROPORCJE - czy pismo i odstepy rosna razem z okanem, a nie stoja.
 *   3. POWIEKSZENIE - czy przy zoomie przegladarki (czyli przy malym
 *      i NISKIM oknie CSS) nic nie chowa sie za przyklejonym paskiem
 *      i nic nie jest ucinane.
 *
 * Punkt trzeci jest tu, bo wlasnie tam ta zmiana moze zaszkodzic: skalowanie
 * liczy sie z SZEROKOSCI okna, a zabraknac moze WYSOKOSCI.
 *
 * Uzycie:
 *   node scripts/sprawdz-skalowanie.mjs
 *   LOKALNY_HOST=https://www.highfive.academy node scripts/sprawdz-skalowanie.mjs
 */

import { chromium } from '@playwright/test'

const CEL = process.env.LOKALNY_HOST ?? 'http://127.0.0.1:5173'

/* Granica, powyzej ktorej marginesy moga wracac - decyzja wlasciciela. */
const GRANICA = 3840

const SZEROKOSCI = [1280, 1440, 1536, 1745, 1920, 2240, 2560, 2866, 3440, 3840]

/*
 * Powiekszenie przegladarki na ekranie 1920x1080 z obszarem tresci ~856 px.
 * Przy zoomie z% okno CSS to 1920/z na 856/z - czyli malejace i NISKIE.
 */
const POWIEKSZENIA = [100, 110, 125, 133, 150, 175, 200]

const STRONY = ['/', '/oferta/dzieci/', '/oferta/seniorzy/', '/kariera/']

const przegladarka = await chromium.launch()
const strona = await przegladarka.newPage()

let bledy = 0

/* --- 1 i 2: margines i proporcje --- */

console.log('MARGINES I PROPORCJE')
console.log(
  'okno'.padEnd(8) + 'korzen'.padEnd(9) + 'kontener'.padEnd(11) + 'margines'.padEnd(11) + 'ocena',
)

for (const w of SZEROKOSCI) {
  await strona.setViewportSize({ width: w, height: Math.round((w * 9) / 16) })
  await strona.goto(CEL + '/', { waitUntil: 'networkidle', timeout: 45000 })
  await strona.evaluate(() => document.fonts.ready)

  const m = await strona.evaluate(() => {
    const k = document.querySelector('main .container').getBoundingClientRect()
    return {
      korzen: parseFloat(getComputedStyle(document.documentElement).fontSize),
      kontener: Math.round(k.width),
      margines: Math.round(k.left),
    }
  })

  const oczekiwany = w <= GRANICA ? 0 : Math.round((w - GRANICA) / 2)
  const ok = Math.abs(m.margines - oczekiwany) <= 2
  if (!ok) bledy += 1

  console.log(
    `${w}`.padEnd(8) +
      `${m.korzen.toFixed(1)}`.padEnd(9) +
      `${m.kontener}`.padEnd(11) +
      `${m.margines}`.padEnd(11) +
      (ok ? 'ok' : `BLAD - oczekiwano ${oczekiwany}`),
  )
}

/* --- 3: powiekszenie przegladarki --- */

console.log('')
console.log('POWIEKSZENIE PRZEGLADARKI (ekran 1920x1080)')

for (const sciezka of STRONY) {
  const uwagi = []

  for (const z of POWIEKSZENIA) {
    const w = Math.round(1920 / (z / 100))
    const h = Math.round(856 / (z / 100))
    await strona.setViewportSize({ width: w, height: h })
    await strona.goto(CEL + sciezka, { waitUntil: 'networkidle', timeout: 45000 })
    await strona.evaluate(() => document.fonts.ready)
    await strona.waitForTimeout(300)

    const r = await strona.evaluate(() => {
      const belka = document.querySelector('.site-header')
      const dolBelki = belka ? belka.getBoundingClientRect().bottom : 0
      const problemy = []

      for (const sel of ['.hero__wordmark', 'h1', '.page-hero__text > *:first-child']) {
        const el = document.querySelector(sel)
        if (!el) continue
        const rr = el.getBoundingClientRect()
        if (rr.top < dolBelki - 1)
          problemy.push(`${sel} ${Math.round(dolBelki - rr.top)} px za belka`)
      }

      for (const el of document.querySelectorAll('section, .hero, .page-hero')) {
        const cs = getComputedStyle(el)
        if (cs.overflowY === 'visible' && cs.overflowX === 'visible') continue
        const nadmiar = el.scrollHeight - el.clientHeight
        if (nadmiar > 4) problemy.push(`${el.id || el.className.split(' ')[0]} ucina ${nadmiar} px`)
      }

      const poziomo = document.documentElement.scrollWidth - document.documentElement.clientWidth
      if (poziomo > 1) problemy.push(`przepelnienie poziome ${poziomo} px`)

      return problemy
    })

    if (r.length) uwagi.push(`  ${z}%  ${w}x${h}  ${r.join('; ')}`)
  }

  if (uwagi.length) {
    bledy += uwagi.length
    console.log(`${sciezka}  — ${uwagi.length} uwag`)
    uwagi.forEach((u) => console.log(u))
  } else {
    console.log(`${sciezka}  bez przyciec na calym zakresie 100-200%`)
  }
}

console.log('')
console.log(bledy === 0 ? 'SKALOWANIE POPRAWNE' : `uwag lacznie: ${bledy}`)

await przegladarka.close()
