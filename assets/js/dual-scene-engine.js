/**
 * Dual-Scene Portfolio Engine — UI/UX Pro Max Standard
 * Ultra-Immersive Dual-Shutter Portal Transition Engine.
 */
(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const transitionOverlay = document.getElementById("cinemaPortalTransition");

    // 1. Arrival via reverse warp from Cinema (arriving on index.html)
    if (urlParams.get("transition") === "cyber" && transitionOverlay) {
      const titleElem = document.getElementById("portalTargetTitle");
      const specsElem = document.getElementById("portalTargetSpecs");
      if (titleElem) titleElem.textContent = "SYSTEMS & SOFTWARE ENGINEERING";
      if (specsElem) specsElem.textContent = "JVM PLATFORMS · RELATIONAL ENGINES · AUTOMATION";

      window.history.replaceState({}, document.title, window.location.pathname);

      // Trigger smooth opening glide (zero flicker)
      window.requestAnimationFrame(() => {
        document.documentElement.classList.remove("is-portal-transitioning");
        transitionOverlay.classList.add("is-opening");
        document.body.classList.add("site-revealed");

        window.setTimeout(() => {
          transitionOverlay.classList.remove("is-opening", "is-active");
        }, 560);
      });
    }

    // 2. Systems Realm Navigation (Scroll to approach)
    const enterEngButtons = document.querySelectorAll(".js-enter-realm[data-target='engineering']");
    enterEngButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const targetElem = document.querySelector("#approach");
        if (targetElem) {
          targetElem.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });

    // 3. Departure to Cinema Realm (cinema.html)
    const warpToCinemaLinks = document.querySelectorAll(".js-warp-to-cinema");
    warpToCinemaLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetUrl = link.getAttribute("href") || "cinema.html";

        if (transitionOverlay) {
          const titleElem = document.getElementById("portalTargetTitle");
          const specsElem = document.getElementById("portalTargetSpecs");
          if (titleElem) titleElem.textContent = "CINEMA & VISUAL STORYTELLING";
          if (specsElem) specsElem.textContent = "35MM PRIMES · NATURAL LIGHT · ORGANIC LUT";

          transitionOverlay.classList.remove("is-opening");
          transitionOverlay.classList.add("is-active");

          window.setTimeout(() => {
            window.location.href = targetUrl.includes("?") ? `${targetUrl}&transition=warp` : `${targetUrl}?transition=warp`;
          }, 450);
        } else {
          window.location.href = targetUrl;
        }
      });
    });
  });
})();
