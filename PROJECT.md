# Project: Lens Makers Retheming

## Architecture
- Mobile web app using React 18 and Babel Standalone loaded dynamically via index.html.
- Styling defined in styles.css and inline styles inside src/components/ and src/screens/.
- Data flow: Local products array from src/data/products.js, states in screen/component JS files.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | E2E Test Suite Setup | Design and code E2E tests for Tiers 1-4 based on user requirements | none | PLANNED |
| 2 | styles.css Retheming | Overhaul CSS variables in :root and override selectors to use new palette | M1 | PLANNED |
| 3 | React Components Retheming | Retheme inline styles and colors in src/components/ | M2 | PLANNED |
| 4 | React Screens Retheming | Retheme inline styles and colors in src/screens/ | M3 | PLANNED |
| 5 | E2E Verification | Ensure all Tier 1-4 tests pass on the rethemed app | M4 | PLANNED |
| 6 | Adversarial Hardening | Implement Tier 5 tests and fix any uncovered gaps | M5 | PLANNED |

## Interface Contracts
- CSS custom properties in styles.css are the source of truth for variables.
- Colors used:
  * --color-peach: #FFCA95
  * --color-coral: #FF7873
  * --color-magenta: #E22F80
  * --color-violet: #8140DC
  * App background base: warm cream/light warm tone (e.g. #FFFDF5)
  * Dark text: #1A0A1E or similar deep warm-dark
