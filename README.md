# Armonk-Somers Podiatry Website

Website for Dr. John O'Hanlon's podiatry practice, with offices in Somers and Armonk, NY. Plain static HTML, CSS and JavaScript, deployed to Vercel with no build step.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home: statement and office photo, office cards with today's hours, Dr. O'Hanlon panel, services list, patient reviews |
| `about.html` | Dr. O'Hanlon's biography, credentials and the practice's mission |
| `services.html` | Services in three groups of expandable sections (each linkable, e.g. `services.html#bunion-surgery`), and the "Ask the office" assistant |
| `insurance.html` | Insurer logos, searchable list of accepted plans, what to bring, payment policy, ways to pay and billing questions |
| `contact.html` | Phone numbers, hours, maps, the Typeform message form, and links for new patients |
| `patient-form.html` | New patient form that generates a printable PDF in the browser (nothing is sent anywhere) |
| `404.html` | Not-found page (uses root-relative links so it works from any path) |

## Design system

Everything shared lives in `css/global.css`: color and type tokens, header, footer, buttons, and layout patterns. Each page has a small stylesheet of its own.

- **Colors:** off-white paper `#f6f6f3`, ink `#14171c`, blue accent `#0066cc`, near-black footer `#0f1216`
- **Layout:** modeled on anthropic.com: heading-left / content-right sections divided by hairlines, expandable sections for detail, a few tinted feature cards, a dark call-to-action band
- **Type:** Hanken Grotesk for headlines and UI, Newsreader for editorial serif text, IBM Plex Mono for small labels (all from Google Fonts)
- **Icons:** inline SVG, no icon font. Service and payment icons are from [Lucide](https://lucide.dev) (ISC license), used sparingly
- **Insurance logos:** `img/insurance/` (Aetna, Blue Cross Blue Shield, Cigna, EmblemHealth, Medicare, UnitedHealthcare), shown in grayscale and in color on hover
- **Credential logos:** `img/credentials/` (American Board of Podiatric Medicine medallion, New York Yankees, Northwell / Northern Westchester Hospital mark)
- **Motion:** scroll-in animations on the home page only; expandable sections animate their height (`initAccordions` in `js/main.js`)
- **Pay a bill:** every "Pay a bill" link uses Curalta's online payment portal. In the HTML it's repeated in each page; in `js/practice-chat.js` it's set once

## JavaScript

| File | What it does |
| --- | --- |
| `js/main.js` | Mobile menu, header border on scroll, today's office hours, reviews carousel, opening an expandable section from a `#link`, scroll reveal |
| `js/practice-chat.js` | Rule-based assistant for office logistics only; it never gives medical advice |
| `js/insurance.js` | Live plan search with match highlighting |
| `js/patient-form.js` | Renders the intake form, validates it, and builds the PDF with jsPDF |

## Editing notes

- The header and footer are repeated in every HTML page. When you change one, change all seven.
- Office hours appear in `index.html`, `contact.html` and `js/practice-chat.js`. Each hours row has `data-days="1 3 5"` with JavaScript day numbers (0 = Sunday), which is how the "Open today" label and today's highlighted row work.
- Photos are served as WebP with JPEG fallbacks (`img/hero.*`, `img/john.*`). The original PNGs are kept as source files.

## Local preview

```sh
python3 -m http.server 4173
# open http://localhost:4173
```

Site design by Buzzed Tech.
