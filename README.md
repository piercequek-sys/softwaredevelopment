# DevCraft

A static marketing landing page for **DevCraft** — a software development agency.

## Live Site

[https://piercequek-sys.github.io/softwaredevelopment/](https://piercequek-sys.github.io/softwaredevelopment/)

## Screenshot

![DevCraft landing page](screenshot.png)

## Tech Stack

Pure HTML, CSS, and JavaScript — no frameworks or build tools.

## Project Structure

```
├── index.html      # Single-page layout (Nav, Hero, Services, Testimonials, Contact, Footer)
├── styles.css      # All styles with CSS custom properties and mobile-first responsive design
└── script.js       # Contact form validation and submission (coming soon)
```

## Running Locally

Open directly in a browser:
```bash
open index.html
```

Or serve locally to avoid font/CORS quirks:
```bash
python3 -m http.server 8080
```

## Deployment

Deployed automatically to GitHub Pages via GitHub Actions on every push to `main`.
