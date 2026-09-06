import { resolve } from 'node:path'
import { defineConfig } from 'vite'

const root = import.meta.dirname

/**
 * GitHub Pages nie pozwala ustawiac naglowkow HTTP, wiec CSP dostarczamy znacznikiem meta.
 * Osiagalny podzbior polityki - patrz docs/ADR/0003-naglowki-bezpieczenstwa-na-github-pages.md.
 * `frame-ancestors` jest w meta ignorowane (spec W3C CSP) i celowo go tu nie ma.
 */
const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self'",
  "font-src 'self'",
  "connect-src 'self'",
  "form-action 'self'",
  'upgrade-insecure-requests',
].join('; ')

/**
 * Wstrzykuje CSP wylacznie do builda. Tryb dev korzysta ze skryptow inline i WebSocketu
 * dla HMR, ktore scisla polityka by zablokowala.
 */
function cspPlugin() {
  return {
    name: 'high-five-csp',
    apply: 'build',
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: 'meta',
            attrs: { 'http-equiv': 'Content-Security-Policy', content: CSP },
            injectTo: 'head-prepend',
          },
        ],
      }
    },
  }
}

export default defineConfig(({ mode }) => ({
  plugins: [cspPlugin()],

  // User site GitHub Pages (radek1983.github.io) serwuje z korzenia domeny.
  // NIGDY '/radek1983.github.io/' - to wzorzec dla project site i zepsulby wszystkie assety.
  base: process.env.VITE_BASE ?? '/',

  // Brak fallbacku SPA - zgodnie z modelem statycznym i zachowaniem GitHub Pages.
  appType: 'mpa',

  build: {
    outDir: 'dist',
    emptyOutDir: true,

    // Zero data: URI w bundlu. Pozwala utrzymac CSP bez `img-src data:`
    // i daje assetom wlasne, hashowane nazwy plikow.
    assetsInlineLimit: 0,

    // Vite wstrzykuje inline <script> z polyfillem modulepreload.
    // Przy CSP bez 'unsafe-inline' zostalby zablokowany, wiec go wylaczamy.
    // Bezpieczne: kazda przegladarka z macierzy wsparcia obsluguje modulepreload natywnie.
    modulePreload: { polyfill: false },

    sourcemap: mode !== 'production',

    // Vite 8 opiera sie na rolldown - `rollupOptions` jest tylko przestarzalym aliasem.
    rolldownOptions: {
      input: {
        main: resolve(root, 'index.html'),
        notFound: resolve(root, '404.html'),
      },
    },
  },

  // Host przypiety jawnie na IPv4. Domyslny 'localhost' rozwiazuje sie na tej maszynie
  // do IPv6 (::1), a Playwright odpytuje 127.0.0.1 - serwer nigdy nie zostalby uznany za gotowy.
  server: { host: '127.0.0.1', port: 5173, strictPort: true },
  preview: { host: '127.0.0.1', port: 4173, strictPort: true },
}))
