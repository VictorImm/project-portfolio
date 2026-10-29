/**
 * Cinema Realm Interactive Engine — UI/UX Pro Max Standard
 * Manages video modals, photography lightbox, category filters,
 * and ultra-immersive warp transitions between Code and Cinema realms.
 */
(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    // 1. Check if user arrived via warp transition
    const urlParams = new URLSearchParams(window.location.search);
    const transitionOverlay = document.getElementById("cinemaPortalTransition");

    if (urlParams.get("transition") === "warp" && transitionOverlay) {
      const titleElem = document.getElementById("portalTargetTitle");
      const specsElem = document.getElementById("portalTargetSpecs");
      if (titleElem) titleElem.textContent = "CINEMA & VISUAL STORYTELLING";
      if (specsElem) specsElem.textContent = "35MM PRIMES · NATURAL LIGHT · ORGANIC LUT";

      // Clean URL param
      window.history.replaceState({}, document.title, window.location.pathname);

      // Trigger smooth opening glide (zero flicker)
      window.requestAnimationFrame(() => {
        document.documentElement.classList.remove("is-portal-transitioning");
        transitionOverlay.classList.add("is-opening");

        window.setTimeout(() => {
          transitionOverlay.classList.remove("is-opening", "is-active");
        }, 560);
      });
    }

    // 2. Warp Transition Back to Code Portfolio (index.html)
    const codeSwitchButtons = document.querySelectorAll(".js-switch-to-code");
    codeSwitchButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const targetUrl = btn.getAttribute("href") || "index.html";

        if (transitionOverlay) {
          const titleElem = document.getElementById("portalTargetTitle");
          const specsElem = document.getElementById("portalTargetSpecs");
          if (titleElem) titleElem.textContent = "SYSTEMS & SOFTWARE ENGINEERING";
          if (specsElem) specsElem.textContent = "JVM PLATFORMS · RELATIONAL ENGINES · AUTOMATION";

          transitionOverlay.classList.remove("is-opening");
          transitionOverlay.classList.add("is-active");

          window.setTimeout(() => {
            window.location.href = targetUrl.includes("?") ? `${targetUrl}&transition=cyber` : `${targetUrl}?transition=cyber`;
          }, 450);
        } else {
          window.location.href = targetUrl;
        }
      });
    });

    // 3. Photography Category Filtering
    const filterButtons = document.querySelectorAll(".js-photo-filter");
    const photoCards = document.querySelectorAll(".js-photo-card");

    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.dataset.filter;
        photoCards.forEach((card) => {
          if (filter === "all" || card.dataset.category === filter) {
            card.style.display = "";
            card.style.opacity = "0";
            card.style.transform = "translateY(15px)";
            window.requestAnimationFrame(() => {
              card.style.transition = "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
              card.style.opacity = "1";
              card.style.transform = "none";
            });
          } else {
            card.style.display = "none";
          }
        });
      });
    });

    // 4. Cinema Lightbox Modal (Image & Video)
    const lightboxModal = document.getElementById("cinemaLightboxModal");
    const lightboxImg = document.getElementById("lightboxImage");
    const lightboxVideo = document.getElementById("lightboxVideo");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const lightboxClose = document.getElementById("lightboxClose");

    const openLightbox = (type, src, title, meta) => {
      if (!lightboxModal) return;

      lightboxCaption.innerHTML = `<strong>${title}</strong><span>${meta}</span>`;

      if (type === "video") {
        lightboxImg.style.display = "none";
        lightboxVideo.style.display = "block";
        lightboxVideo.src = src;
        lightboxVideo.play().catch(() => {});
      } else {
        lightboxVideo.style.display = "none";
        lightboxVideo.pause();
        lightboxImg.style.display = "block";
        lightboxImg.src = src;
      }

      lightboxModal.classList.add("is-open");
      document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
      if (!lightboxModal) return;
      lightboxModal.classList.remove("is-open");
      if (lightboxVideo) {
        lightboxVideo.pause();
        lightboxVideo.src = "";
      }
      document.body.style.overflow = "";
    };

    document.querySelectorAll(".js-open-cinema-lightbox").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const type = trigger.dataset.type || "image";
        const src = trigger.dataset.src || "";
        const title = trigger.dataset.title || "";
        const meta = trigger.dataset.meta || "";
        openLightbox(type, src, title, meta);
      });
    });

    lightboxClose?.addEventListener("click", closeLightbox);
    lightboxModal?.addEventListener("click", (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightboxModal?.classList.contains("is-open")) {
        closeLightbox();
      }
    });

    // 5. Floating Dock Highlight on Scroll
    const sections = document.querySelectorAll("section[id]");
    const dockSwitchBtns = document.querySelectorAll(".js-dock-switch");

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            dockSwitchBtns.forEach((btn) => {
              const target = btn.getAttribute("href");
              btn.classList.toggle("active", target === `#${entry.target.id}`);
            });
          }
        });
      }, { threshold: 0.25 });

      sections.forEach((s) => observer.observe(s));
    }
  });
})();
