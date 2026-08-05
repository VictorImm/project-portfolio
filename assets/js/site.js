(() => {
  "use strict";

  const root = document.documentElement;
  const themeToggle = document.querySelector(".theme-toggle");
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  const nav = document.querySelector(".site-nav");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const traceLayout = document.querySelector(".trace-layout");
  const traceSections = [...document.querySelectorAll(".trace-section[id]")];
  const sectionLinks = [...document.querySelectorAll('.nav-link[href^="#"]')];
  const revealItems = [...document.querySelectorAll(".reveal")];
  const projectChapters = [...document.querySelectorAll(".project-chapter")];
  const projectVisuals = [...document.querySelectorAll(".project-visual")];
  const careerItems = [...document.querySelectorAll(".career-timeline .timeline-item")];
  const hero = document.querySelector(".hero");
  const tenureNodes = [...document.querySelectorAll("[data-experience-since]")];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(pointer: fine)");
  let lenis = null;

  const clamp = (number, min, max) => Math.min(Math.max(number, min), max);

  const startSmoothScroll = () => {
    if (reduceMotion.matches || lenis || typeof window.Lenis !== "function") return;

    lenis = new window.Lenis({
      autoRaf: true,
      anchors: { offset: -96 },
      lerp: 0.14,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      stopInertiaOnNavigate: true
    });

    root.classList.add("has-lenis");
  };

  const syncSmoothScrollPreference = () => {
    if (reduceMotion.matches) {
      lenis?.destroy();
      lenis = null;
      root.classList.remove("has-lenis");
      return;
    }

    startSmoothScroll();
  };

  const getSavedTheme = () => {
    try {
      return localStorage.getItem("portfolio-theme");
    } catch {
      return null;
    }
  };

  const applyTheme = (theme, persist = false) => {
    const nextTheme = theme === "dark" ? "dark" : "light";
    const isDark = nextTheme === "dark";

    root.dataset.theme = nextTheme;
    themeColor?.setAttribute("content", isDark ? "#071321" : "#eef5ff");

    if (themeToggle) {
      const nextLabel = isDark ? "Switch to light mode" : "Switch to dark mode";
      themeToggle.setAttribute("aria-label", nextLabel);
      themeToggle.setAttribute("title", nextLabel);
      themeToggle.setAttribute("aria-pressed", String(isDark));
    }

    if (persist) {
      try {
        localStorage.setItem("portfolio-theme", nextTheme);
      } catch {
        // The selected theme still applies for this visit when storage is unavailable.
      }
    }
  };

  applyTheme(root.dataset.theme || (systemTheme.matches ? "dark" : "light"));

  themeToggle?.addEventListener("click", () => {
    applyTheme(root.dataset.theme === "dark" ? "light" : "dark", true);
  });

  systemTheme.addEventListener?.("change", (event) => {
    if (!getSavedTheme()) applyTheme(event.matches ? "dark" : "light");
  });

  const updateTenures = () => {
    const now = new Date();

    tenureNodes.forEach((node) => {
      const [year, month, day] = node.dataset.experienceSince.split("-").map(Number);
      let totalMonths = (now.getFullYear() - year) * 12 + (now.getMonth() - (month - 1));

      if (now.getDate() < day) totalMonths -= 1;
      totalMonths = Math.max(totalMonths, 0);

      const years = Math.floor(totalMonths / 12);
      const months = totalMonths % 12;
      const parts = [];

      if (years) parts.push(`${years} ${years === 1 ? "yr" : "yrs"}`);
      if (months || !parts.length) parts.push(`${months} ${months === 1 ? "mo" : "mos"}`);

      node.textContent = parts.join(" ");
      node.setAttribute(
        "aria-label",
        `${years} ${years === 1 ? "year" : "years"} and ${months} ${months === 1 ? "month" : "months"} of experience`
      );
      node.title = "Calculated from 15 April 2025 using the visitor’s system date";
    });
  };

  const setScrollState = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pageProgress = scrollable > 0 ? window.scrollY / scrollable : 0;
    root.style.setProperty("--scroll-progress", clamp(pageProgress, 0, 1).toFixed(4));
    root.style.setProperty("--grid-shift", (pageProgress * 1.5).toFixed(4));
    nav?.classList.toggle("is-scrolled", window.scrollY > 32);

    if (hero && !reduceMotion.matches) {
      const heroProgress = clamp(window.scrollY / Math.max(hero.offsetHeight, 1), 0, 1);
      root.style.setProperty("--hero-progress", heroProgress.toFixed(4));
    }

    if (traceLayout) {
      const firstTraceContainer = traceLayout.querySelector(".container-xl");
      if (firstTraceContainer) {
        const containerLeft = firstTraceContainer.getBoundingClientRect().left;
        const railX = Math.max(16, Math.round(containerLeft - 18));
        traceLayout.style.setProperty("--trace-rail-x", `${railX}px`);
      }

      const bounds = traceLayout.getBoundingClientRect();
      const traceHeight = Math.max(bounds.height, 1);
      const traceTop = window.scrollY + bounds.top;
      const traceStart = clamp(traceTop - window.innerHeight * 0.46, 0, scrollable);
      const traceEnd = Math.max(scrollable, traceStart + 1);
      const traceProgress = clamp((window.scrollY - traceStart) / (traceEnd - traceStart), 0, 1);
      const traceTravel = traceProgress * traceHeight;

      root.style.setProperty("--trace-travel", `${traceTravel.toFixed(2)}px`);
      root.style.setProperty("--trace-progress", traceProgress.toFixed(4));
    }

    if (!reduceMotion.matches) {
      const viewportFocus = window.innerHeight * 0.52;

      traceSections.forEach((section) => {
        const bounds = section.getBoundingClientRect();
        const centerOffset = bounds.top + bounds.height * 0.5 - window.innerHeight * 0.5;
        const parallaxProgress = clamp(centerOffset / Math.max(bounds.height + window.innerHeight, 1), -0.5, 0.5);
        const sectionFocus = 1 - clamp(Math.abs(centerOffset) / Math.max(bounds.height * 0.65 + window.innerHeight * 0.5, 1), 0, 1);
        const sectionParallax = -parallaxProgress * 28;
        section.style.setProperty("--section-parallax", `${sectionParallax.toFixed(2)}px`);
        section.style.setProperty("--section-haze-parallax", `${(sectionParallax * 1.8).toFixed(2)}px`);
        section.style.setProperty("--section-focus", sectionFocus.toFixed(4));
      });

      projectChapters.forEach((chapter) => {
        const bounds = chapter.getBoundingClientRect();
        const current = bounds.top <= viewportFocus && bounds.bottom >= viewportFocus;
        chapter.classList.toggle("is-current", current);
      });

      careerItems.forEach((item) => {
        const bounds = item.getBoundingClientRect();
        const progress = clamp((viewportFocus - bounds.top) / Math.max(bounds.height, 1), 0, 1);
        item.style.setProperty("--item-progress", progress.toFixed(4));
        item.classList.toggle("is-current", progress > 0.08 && progress < 0.95);
      });
    }
  };

  let ticking = false;
  const requestScrollUpdate = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        setScrollState();
        ticking = false;
      });
      ticking = true;
    }
  };

  navToggle?.addEventListener("click", () => {
    const willOpen = navToggle.getAttribute("aria-expanded") !== "true";
    navToggle.setAttribute("aria-expanded", String(willOpen));
    navMenu?.classList.toggle("is-open", willOpen);
  });

  navMenu?.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      navToggle?.setAttribute("aria-expanded", "false");
      navMenu.classList.remove("is-open");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navMenu?.classList.contains("is-open")) {
      navToggle?.setAttribute("aria-expanded", "false");
      navMenu.classList.remove("is-open");
      navToggle?.focus();
    }
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  if (reduceMotion.matches) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    document.querySelectorAll(".principle, .capability-grid, .timeline, .notes-grid, .evidence-list").forEach((group) => {
      [...group.querySelectorAll(":scope > .reveal, :scope > li.reveal")].forEach((item, index) => {
        item.style.setProperty("--reveal-delay", `${Math.min(index * 70, 280)}ms`);
      });
    });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  if (!reduceMotion.matches && finePointer.matches) {
    projectVisuals.forEach((visual) => {
      visual.addEventListener("pointermove", (event) => {
        const bounds = visual.getBoundingClientRect();
        const x = clamp((event.clientX - bounds.left) / bounds.width, 0, 1);
        const y = clamp((event.clientY - bounds.top) / bounds.height, 0, 1);
        visual.style.setProperty("--spot-x", `${(x * 100).toFixed(1)}%`);
        visual.style.setProperty("--spot-y", `${(y * 100).toFixed(1)}%`);
        visual.style.setProperty("--tilt-x", `${((0.5 - y) * 2.4).toFixed(2)}deg`);
        visual.style.setProperty("--tilt-y", `${((x - 0.5) * 2.4).toFixed(2)}deg`);
      });

      visual.addEventListener("pointerleave", () => {
        visual.style.setProperty("--tilt-x", "0deg");
        visual.style.setProperty("--tilt-y", "0deg");
      });
    });
  }

  if (traceSections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (!visible.length) return;

        const activeId = visible[0].target.id;
        traceSections.forEach((section) => section.classList.toggle("is-active", section.id === activeId));
        sectionLinks.forEach((link) => {
          const active = link.getAttribute("href") === `#${activeId}`;
          link.classList.toggle("active", active);
          if (active) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      },
      { threshold: [0.15, 0.35, 0.55], rootMargin: "-20% 0px -48% 0px" }
    );

    traceSections.forEach((section) => sectionObserver.observe(section));
  }

  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate, { passive: true });
  reduceMotion.addEventListener?.("change", syncSmoothScrollPreference);
  syncSmoothScrollPreference();
  window.requestAnimationFrame(() => root.classList.add("is-ready"));
  setScrollState();
  updateTenures();
  window.setInterval(updateTenures, 60 * 60 * 1000);

  const year = document.querySelector("[data-current-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
