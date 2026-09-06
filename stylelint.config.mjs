// Stylelint 17 jest ESM-only - stad rozszerzenie .mjs i `export default`.
export default {
  extends: ['stylelint-config-standard'],
  ignoreFiles: ['dist/**/*', 'node_modules/**/*'],
  rules: {
    // Tokeny projektu: --hf-*, --color-*, --space-*, --font-*, --step-*, --dur-*, --ease-*, --z-*
    'custom-property-pattern': '^(hf|color|space|font|step|dur|ease|z)-[a-z0-9-]+$',

    // .komponent, .komponent__element, .komponent--wariant, .is-stan (spec 7.2)
    'selector-class-pattern':
      '^(is-[a-z0-9-]+|[a-z][a-z0-9]*(-[a-z0-9]+)*(__[a-z0-9-]+)?(--[a-z0-9-]+)?)$',

    // Klika sie z warstwami kaskady i zagniezdzaniem; specyficznosc pilnujemy strukturalnie.
    'no-descending-specificity': null,

    // Specyfikacja techniczna rozdz. 5.6 pokazuje @import "./base/reset.css" bez url().
    // Dostosowujemy linter do speca, nie spec do domyslnych ustawien lintera.
    'import-notation': 'string',
  },
}
