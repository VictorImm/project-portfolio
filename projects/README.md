# Project case studies

This folder is intentionally plain static HTML, CSS, and JavaScript—there is no build step or generated output.

## Files and responsibility

- `index.html`: project catalogue; it links to each case study.
- `project.html`: the one reusable case-study page. It reads a project slug from `?case=<slug>`.
- `data.js`: all case-study copy and technology choices. Edit this file when updating content.
- `../assets/js/project-theme.js`: project-page theme toggle; it shares the `portfolio-theme` preference with the home page.
- `../assets/css/projects.css`: visual layout for catalogue and case-study pages.
- `../assets/js/projects.js`: renders the selected entry from `data.js`; it contains no project copy.

## Editing a case study

1. Find the matching `slug` in `data.js`.
2. Update the existing fields: `problem`, `user`, `solution`, `keyFeatures`, `challenge`, `impact`, and `techChoices`.
3. When a screenshot is ready, replace the `screenshotNote` text with an image path and alt text; the renderer has a deliberately visible placeholder until then.
4. Open `projects/project.html?case=<slug>` in a browser. The home-page project card uses the same slug.

The copy deliberately avoids unsupported metrics. Add numbers only when they are safe to publish and can be explained.
