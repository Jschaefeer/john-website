# Armonk-Somers Podiatry Website

Website for Dr. John O'Hanlon's podiatry practice, with offices in Somers and Armonk, NY. Plain static HTML, CSS and JavaScript, deployed to Vercel with no build step.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home: text hero, practice highlights with the office photo, services list, office hours, patient reviews |
| `about.html` | Dr. O'Hanlon's biography, credentials and the practice's mission |
| `services.html` | Filterable services list, a detail drawer per service (deep-linkable, e.g. `services.html#bunion-surgery`), and the "Ask the office" assistant |
| `insurance.html` | Searchable list of accepted plans, what to bring to a visit, and the payment policy |
| `contact.html` | Phone numbers, hours, maps, the Typeform message form, and links for new patients |
| `patient-form.html` | New patient form that generates a printable PDF in the browser (nothing is sent anywhere) |
| `404.html` | Not-found page (uses root-relative links so it works from any path) |

## Design system

Everything shared lives in `css/global.css`: color and type tokens, header, footer, buttons, and layout patterns. Each page has a small stylesheet of its own.

- **Colors:** off-white paper `#f6f6f3`, ink `#14171c`, blue accent `#0066cc`, near-black footer `#0f1216`
- **Layout:** thin divider lines and open columns rather than boxed cards
- **Type:** Hanken Grotesk for headlines and UI, Newsreader for editorial serif text, IBM Plex Mono for small labels (all from Google Fonts)
- **Icons:** inline SVG, no icon font

## JavaScript

| File | What it does |
| --- | --- |
| `js/main.js` | Mobile menu, header border on scroll, today's office hours, reviews carousel, scroll reveal |
| `js/services.js` | Service copy, category filters, and the detail drawer (native `<dialog>`) |
| `js/practice-chat.js` | Rule-based assistant for office logistics only; it never gives medical advice |
| `js/insurance.js` | Live plan search with match highlighting |
| `js/patient-form.js` | Renders the intake form, validates it, and builds the PDF with jsPDF |

## Editing notes

- The header and footer are repeated in every HTML page. When you change one, change all seven.
- Office hours appear in `index.html`, `contact.html` and `js/practice-chat.js`. Each `<tr data-day="N">` uses JavaScript day numbers (0 = Sunday), which is how the "Open today" label and today's highlighted row work.
- Photos are served as WebP with JPEG fallbacks (`img/hero.*`, `img/john.*`). The original PNGs are kept as source files.

## Local preview

```sh
python3 -m http.server 4173
# open http://localhost:4173
```

Site design by Buzzed Tech.
