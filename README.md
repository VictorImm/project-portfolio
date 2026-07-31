# System Trace Portfolio

A static, single-page software engineer portfolio built with modified Bootstrap,
custom CSS, and progressive JavaScript.

## Preview locally

Serve the project root with any static server, for example:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Current content status

The portfolio is populated from Victor Immanuel Sunarko's publicly indexed
LinkedIn profile and an integrated March 2025 CV source. It currently includes:

- NDA-safe professional PT SPIL experience as the primary portfolio focus
- Condensed pre-SPIL experience for Xeno, Telkom Indonesia, and iGS
- Education, technical capabilities, certifications, and languages
- Projects, publications with DOI links, and volunteer work
- LinkedIn, GitHub, and Google Developer Profile links
- Persistent light and dark themes, with the visitor's system preference as the initial default

PT SPIL tenure is calculated in the browser from 15 April 2025. The displayed
year-and-month duration updates automatically from the visitor's system date.

PT SPIL responsibilities, newer professional outcomes, project screenshots,
profile photography, and a public-safe résumé still need verified source
material. The raw CV source was removed from the deployable project after
integration because it contained a residential address and phone number.

Earlier case studies are condensed into the home page so professional PT SPIL
experience remains the primary emphasis.

## Project structure

```text
index.html          Home and scroll-based narrative
assets/css/site.css Visual system and responsive behavior
assets/js/site.js   Theme state, scroll progress, trace state, reveals, and mobile navigation
assets/img/         Favicon
```

Bootstrap 5.3.8 is pinned through jsDelivr with Subresource Integrity. The site does not require a package manager or build step.
