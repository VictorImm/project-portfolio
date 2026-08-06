(() => {
  "use strict";

  const cases = window.PORTFOLIO_CASE_STUDIES || [];
  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", "\"": "&quot;"
  }[character]));

  const list = (items) => items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const catalogue = document.querySelector("#case-catalogue");
  const study = document.querySelector("#case-study");

  if (catalogue) {
    catalogue.innerHTML = cases.map((project, index) => `
      <a class="case-card" href="project.html?case=${encodeURIComponent(project.slug)}">
        <span class="case-card-index">${String(index + 1).padStart(2, "0")}</span>
        <span class="case-card-meta">${escapeHtml(project.year)}</span>
        <h2>${escapeHtml(project.title)}</h2>
        <p>${escapeHtml(project.summary)}</p>
        <span class="case-card-action">Read case study →</span>
      </a>`).join("");
  }

  if (study) {
    const slug = new URLSearchParams(window.location.search).get("case");
    const project = cases.find((item) => item.slug === slug);

    if (!project) {
      study.innerHTML = `<section class="case-not-found"><p class="eyebrow">Project not found</p><h1>Choose a case study from the catalogue.</h1><a class="case-back" href="index.html">View all projects</a></section>`;
      return;
    }

    document.title = `${project.title} — Victor Immanuel Sunarko`;
    study.innerHTML = `
      <header class="case-hero">
        <p class="eyebrow">${escapeHtml(project.year)}</p>
        <h1>${escapeHtml(project.title)}</h1>
        <p class="case-summary">${escapeHtml(project.summary)}</p>
      </header>
      <div class="case-flow" aria-label="Case study details">
        <section class="case-section"><p class="case-label">01 / Problem</p><div><h2>What needed attention</h2><p>${escapeHtml(project.problem)}</p></div></section>
        <section class="case-section"><p class="case-label">02 / User</p><div><h2>Who it was for</h2><p>${escapeHtml(project.user)}</p></div></section>
        <section class="case-section case-section-emphasis"><p class="case-label">03 / Solution</p><div><h2>The response</h2><p>${escapeHtml(project.solution)}</p></div></section>
        <section class="case-section"><p class="case-label">04 / Key features</p><div><h2>What the work included</h2><ul>${list(project.keyFeatures)}</ul></div></section>
        <section class="case-section"><p class="case-label">05 / Challenge</p><div><h2>What required care</h2><p>${escapeHtml(project.challenge)}</p></div></section>
        <section class="case-section case-section-impact"><p class="case-label">06 / Impact</p><div><h2>What it moved forward</h2><p>${escapeHtml(project.impact)}</p></div></section>
        <section class="case-section"><p class="case-label">07 / Tech choices</p><div><h2>Tools selected for the work</h2><ul class="tech-list">${list(project.techChoices)}</ul></div></section>
        <figure class="case-screenshot"><figcaption><span class="case-label">Visual record / pending</span><strong>Screenshot documentation will be added later.</strong><p>${escapeHtml(project.screenshotNote)}</p></figcaption></figure>
      </div>
      <nav class="case-footer-nav" aria-label="Project navigation"><a href="index.html">← All projects</a><a href="../index.html#notes">Portfolio overview</a></nav>`;
  }
})();
