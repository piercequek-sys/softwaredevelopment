---
name: frontend-design
description: Customized frontend design guidance for DevCraft — a software development agency targeting technical buyers (CTOs, founders, VP Engineering). Extends the base skill with project-specific aesthetic direction.
---

# Frontend Design — DevCraft Edition

Approach this as the design lead at a small studio known for giving every client a visual identity that could not be mistaken for anyone else's. DevCraft is a software development agency whose clients are skeptical, technical, and have seen every generic agency site. Make deliberate choices rooted in the craft of engineering itself.

## DevCraft-specific context

**Subject:** Software development agency
**Audience:** CTOs, founders, VP Engineering — technical buyers who respect craft, precision, and proof over claims
**Page's single job:** Get a qualified prospect to submit the enquiry form
**Brand values:** Precision, reliability, speed, transparency

## Approved design tokens

These tokens define DevCraft's identity — use them as the starting point for all new work:

```
--ink:          #0F0F14   /* near-black with blue undertone */
--canvas:       #F2F1EE   /* warm off-white — not cold grey */
--accent:       #4361EE   /* indigo-blue — precise, confident */
--accent-dim:   rgba(67, 97, 238, 0.12)
--surface:      #FFFFFF
--border:       #E0DFDB   /* warm grey border */
--muted:        #6C6C73

--font-display: 'Syne'    /* geometric, editorial, distinctive */
--font-body:    'DM Sans' /* humanist, readable */
--font-mono:    monospace /* for code/terminal elements */
```

**Typography rule:** Syne for all headings and display text; DM Sans for all body copy and UI labels. Never use Inter — it's been removed to avoid the templated look.

## Signature element

The hero features a **live CI/CD build ticker** — an animated terminal panel showing fictional project build events cycling in real time. This is the single memorable thing:
- Communicates DevCraft's engineering culture immediately
- Credible to technical buyers without requiring explanation
- Distinct from every other agency hero (no stock photos, no abstract blobs)

## Section rhythm

Dark → Light → Dark → Light → Dark:
1. **Hero** — ink background, dot grid, build ticker
2. **Services** — warm canvas, indigo-accented cards
3. **Testimonials** — ink background, editorial full-width quotes
4. **Contact** — warm canvas, clean form
5. **Footer** — ink

## Key design principles from the base skill

For web designs, the hero is a thesis. The build ticker IS the thesis — it shows, doesn't tell.

Typography carries personality. Syne's geometric structure paired with its italic weight (used sparingly in headlines) is the typographic risk: mixing italic 400 with upright 800 within the same headline creates contrast that feels editorial, not accidental.

Structure is information. The testimonials are stacked vertically with hairline dividers — they are a list of evidence, not a carousel.

Spend boldness in one place: the build ticker is the bold move. Everything else is quiet and disciplined around it.

## Avoid

- Inter as the only typeface
- Generic dark-navy + red/pink accent (previous DevCraft palette — replaced)
- Numbered service markers (01/02/03) — services are parallel, not sequential
- Card-grid testimonials — too common, use editorial quote blocks instead
- Abstract gradient blobs as hero decoration — replaced by precise dot grid
