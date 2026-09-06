/**
 * Punkt wejscia. Wylacznie import i inicjalizacja modulow - zero logiki sekcji (spec 5.7).
 *
 * Blad pojedynczego modulu nie moze zablokowac pozostalych ani tresci strony (spec 8.4).
 */

import { initAnimations } from './modules/animations.js'
import { initNavigation } from './modules/navigation.js'
import { initAccessibility } from './modules/accessibility.js'

function safeInit(name, fn) {
  try {
    fn()
  } catch (error) {
    console.error(`[high-five] modul "${name}" nie wystartowal:`, error)
  }
}

function bootstrap() {
  safeInit('accessibility', initAccessibility)
  safeInit('navigation', initNavigation)
  safeInit('animations', initAnimations)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true })
} else {
  bootstrap()
}
