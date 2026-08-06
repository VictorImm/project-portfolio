# System Trace Portfolio

My personal portfolio as a software engineer. It covers my professional experience, technical background, selected projects, publications, and community work.

The site is a static single page built with Bootstrap, Lenis, GSAP, Atropos, custom CSS, and vanilla JavaScript. There is no package manager or build step.

## Run locally

From the project directory, start any static file server. For example:

```bash
python3 -m http.server 4173
```

Then open [http://localhost:4173](http://localhost:4173).

## Project structure

```text
index.html          Page content and structure
assets/css/site.css Styles, themes, and responsive layout
assets/js/site.js   Theme switcher, navigation, and scroll interactions
assets/img/         Favicon and image assets
projects/           Standalone project catalogue and case-study pages
projects/data.js    Public-safe case-study content, keyed by project slug
projects/README.md  How the case-study pages fit together and how to edit them
```

Bootstrap 5.3.8, GSAP 3.15.0, and Atropos 2.0.2 are loaded from jsDelivr; Lenis 1.3.25 is loaded from unpkg. Lenis shares GSAP's animation ticker so smooth scrolling, scroll scenes, and the SVG execution trace run through one frame loop. The site supports light and dark themes, remembers the visitor's choice, and follows the system preference on the first visit. Motion is reduced automatically when the visitor enables the relevant system accessibility preference, and the content remains readable if the motion libraries are unavailable.

My tenure at PT SPIL is calculated from 15 April 2025 and updated in the browser. Details covered by confidentiality agreements are intentionally kept at a general level.

---

*Vibe coded with Codex.*
