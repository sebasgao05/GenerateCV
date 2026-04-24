# AGENTS.md - GenerateCV

## Project Type
Simple single-page HTML/CSS/JS CV generator (no build system, no package manager).

## Tech Stack
- Vanilla HTML, CSS, JavaScript
- jsPDF (local in `libs/jspdf.umd.min.js` for offline use)
- i18next for internationalization (ES/EN)

## Files
| Path | Purpose |
|------|---------|
| `index.html` | Main markup, form, preview container |
| `styles/main.css` | Styles (single-column, print-like CV) |
| `logic/app.js` | Form logic, i18n, PDF generation |
| `libs/jspdf.umd.min.js` | jsPDF bundled locally |

## Commands
- **Run**: Open `index.html` directly in browser (no server needed)
- **Dev**: Edit files and refresh browser

## Key Features
- All data persisted in `localStorage`
- Photo input as image file
- Clickable web/LinkedIn links in PDF
- Font selector (Times, Helvetica, Courier)
- Dark mode toggle

## No Build/Test Pipeline
This repo has no tests, linting, or build scripts. Changes are tested manually in browser.