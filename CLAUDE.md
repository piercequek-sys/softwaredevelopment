# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static marketing landing page for "DevCraft" — a software development agency. No build tools, frameworks, or dependencies. Pure HTML, CSS, and JavaScript.

## Running the Site

Open directly in a browser:
```
open index.html
```

Or serve locally (avoids font/CORS quirks):
```
python3 -m http.server 8080
```

## Architecture

Two files drive everything:

- **[index.html](index.html)** — single-page layout with five sections in order: Nav, Hero, Services (3 cards), Testimonials (3 cards), Contact form, Footer. The form references `script.js` via a `defer` script tag for validation/submission logic.
- **[styles.css](styles.css)** — all styles. Design tokens live in `:root` CSS custom properties at the top of the file (colours, shadows, radii, typography). Sections are separated by comment banners for easy navigation.

**CSS conventions:**
- BEM-like naming: `.block`, `.block__element`, `.block--modifier`
- Responsive via `@media (min-width: …)` breakpoints (mobile-first): 640 px, 768 px, 900 px, 1024 px
- Accent colour is `--accent: #e94560`; primary dark is `--primary: #1a1a2e`

**script.js** is referenced but does not yet exist — it should handle contact form validation and submission (fields: name, email, phone, service, message). On success, hide the form and show `#form-success`.
