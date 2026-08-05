(() => {
  "use strict";

  const root = document.documentElement;
  const themeToggle = document.querySelector(".theme-toggle");
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const nav = document.querySelector(".site-nav");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const hero = document.querySelector(".hero");
  const traceLayout = document.querySelector(".trace-layout");
  const traceRail = document.querySelector(".trace-rail");
  const traceSvg = document.querySelector(".trace-svg");
  const tracePathBase = document.querySelector(".trace-path-base");
  const tracePathActive = document.querySelector(".trace-path-active");
  const traceCursor = document.querySelector(".trace-cursor");
  const traceSections = [...document.querySelectorAll(".trace-section[id]")];
  const sectionLinks = [...document.querySelectorAll('.nav-link[href^="#"]')];
  const revealItems = [...document.querySelectorAll(".reveal")];
  const careerItems = [...document.querySelectorAll(".career-timeline .timeline-item")];
  const tenureNodes = [...document.querySelectorAll("[data-experience-since]")];
  const professionalFeature = document.querySelector(".professional-feature");
  const professionalVisual = document.querySelector(".professional-visual");
  const projectsStage = document.querySelector(".projects-stage");
  const projectsTrack = document.querySelector(".notes-grid");
  const projectPanels = [...document.querySelectorAll(".project-panel")];
  const projectsProgress = document.querySelector(".projects-progress span");

  let lenis = null;
  let lenisTicker = null;
  let motionMedia = null;
  let fallbackSectionObserver = null;
  let chromeTicking = false;
  let resizeTimer = null;

  const clamp = (number, min, max) => Math.min(Math.max(number, min), max);
  const hasGsap = () => Boolean(window.gsap && window.ScrollTrigger);

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

  const setActiveSection = (activeId) => {
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
  };

  const updateChrome = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pageProgress = scrollable > 0 ? window.scrollY / scrollable : 0;
    root.style.setProperty("--scroll-progress", clamp(pageProgress, 0, 1).toFixed(4));
    root.style.setProperty("--grid-shift", (pageProgress * 1.5).toFixed(4));
    nav?.classList.toggle("is-scrolled", window.scrollY > 32);
  };

  const requestChromeUpdate = () => {
    if (chromeTicking) return;

    chromeTicking = true;
    window.requestAnimationFrame(() => {
      updateChrome();
      chromeTicking = false;
    });
  };

  const updateTraceRailPosition = () => {
    if (!traceLayout) return;
    const firstContainer = traceLayout.querySelector(".container-xl");
    if (!firstContainer) return;

    const containerLeft = firstContainer.getBoundingClientRect().left;
    traceLayout.style.setProperty("--trace-rail-x", `${Math.max(16, Math.round(containerLeft - 18))}px`);
  };

  const updateTraceGeometry = () => {
    if (!traceLayout || !traceSvg || !tracePathBase || !tracePathActive) return;

    updateTraceRailPosition();
    const layoutBounds = traceLayout.getBoundingClientRect();
    const height = Math.max(Math.round(traceLayout.offsetHeight), 1);
    const center = 40;
    let previousY = 0;
    let route = `M ${center} 0`;

    traceSections.forEach((section, index) => {
      const node = section.querySelector(".trace-node");
      if (!node) return;

      const nodeBounds = node.getBoundingClientRect();
      const nodeY = clamp(nodeBounds.top - layoutBounds.top + nodeBounds.height / 2, previousY + 42, height - 20);
      const laneX = center + (index % 2 === 0 ? -22 : 22);
      const turnStart = Math.max(previousY + 22, nodeY - 76);
      const approach = Math.max(turnStart + 28, nodeY - 22);

      route += ` V ${turnStart.toFixed(2)}`;
      route += ` C ${center} ${(turnStart + 14).toFixed(2)}, ${laneX} ${(turnStart + 14).toFixed(2)}, ${laneX} ${(turnStart + 30).toFixed(2)}`;
      route += ` V ${approach.toFixed(2)}`;
      route += ` C ${laneX} ${(nodeY - 8).toFixed(2)}, ${center} ${(nodeY - 8).toFixed(2)}, ${center} ${nodeY.toFixed(2)}`;
      previousY = nodeY;
    });

    route += ` V ${height}`;
    traceSvg.setAttribute("viewBox", `0 0 80 ${height}`);
    tracePathBase.setAttribute("d", route);
    tracePathActive.setAttribute("d", route);
  };

  const startSmoothScroll = () => {
    if (reduceMotion.matches || lenis || typeof window.Lenis !== "function") return;

    const gsapReady = hasGsap();
    lenis = new window.Lenis({
      autoRaf: !gsapReady,
      anchors: { offset: -96 },
      lerp: 0.14,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      stopInertiaOnNavigate: true
    });

    root.classList.add("has-lenis");

    if (gsapReady) {
      lenis.on("scroll", window.ScrollTrigger.update);
      lenisTicker = (time) => lenis?.raf(time * 1000);
      window.gsap.ticker.add(lenisTicker);
      window.gsap.ticker.lagSmoothing(0);
    }
  };

  const stopSmoothScroll = () => {
    if (lenisTicker && window.gsap) window.gsap.ticker.remove(lenisTicker);
    lenisTicker = null;
    lenis?.destroy();
    lenis = null;
    root.classList.remove("has-lenis");
  };

  const initFallbackExperience = () => {
    root.classList.remove("motion-ready");
    revealItems.forEach((item) => item.classList.add("is-visible"));
    updateTraceGeometry();

    if (!traceSections.length || typeof window.IntersectionObserver !== "function") return;
    fallbackSectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length) setActiveSection(visible[0].target.id);
      },
      { threshold: [0.15, 0.35, 0.55], rootMargin: "-20% 0px -48% 0px" }
    );
    traceSections.forEach((section) => fallbackSectionObserver.observe(section));
  };

  const destroyMotion = () => {
    fallbackSectionObserver?.disconnect();
    fallbackSectionObserver = null;
    motionMedia?.revert();
    motionMedia = null;
    root.classList.remove("motion-ready");

    if (window.gsap) {
      window.gsap.set(
        [hero, ...revealItems, professionalFeature, projectsTrack, projectsProgress, traceCursor].filter(Boolean),
        { clearProps: "all" }
      );
    }

    projectPanels.forEach((panel) => panel.classList.remove("is-current"));
    careerItems.forEach((item) => item.classList.remove("is-current"));
  };

  const initMotion = () => {
    if (reduceMotion.matches || !hasGsap()) {
      initFallbackExperience();
      return;
    }

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const plugins = [ScrollTrigger, window.SplitText, window.DrawSVGPlugin, window.MotionPathPlugin].filter(Boolean);
    gsap.registerPlugin(...plugins);
    root.classList.add("motion-ready");
    updateTraceGeometry();

    motionMedia = gsap.matchMedia();
    motionMedia.add(
      {
        desktop: "(min-width: 992px)",
        finePointer: "(pointer: fine)",
        motion: "(prefers-reduced-motion: no-preference)"
      },
      (context) => {
        if (!context.conditions.motion) return undefined;

        const localAtropos = [];
        const localSplits = [];
        const { desktop, finePointer } = context.conditions;

        if (window.SplitText) {
          document.querySelectorAll(".hero-line > span").forEach((line) => {
            const split = window.SplitText.create(line, {
              type: "words",
              wordsClass: "hero-word",
              aria: "auto",
              autoSplit: true,
              onSplit: (instance) => gsap.fromTo(
                instance.words,
                { autoAlpha: 0, yPercent: 115, rotate: 1.5 },
                {
                  autoAlpha: 1,
                  yPercent: 0,
                  rotate: 0,
                  duration: 1.05,
                  stagger: 0.055,
                  ease: "power4.out"
                }
              )
            });
            localSplits.push(split);
          });
        }

        gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 0.25
          }
        })
          .fromTo(root, { "--hero-progress": 0 }, { "--hero-progress": 1, ease: "none" }, 0)
          .to(".hero-line:first-child", { yPercent: -14, ease: "none" }, 0)
          .to(".hero-line:nth-child(2)", { yPercent: -6, ease: "none" }, 0)
          .to(".hero-intro", { y: -42, autoAlpha: 0.35, ease: "none" }, 0);

        const standardReveals = revealItems.filter((item) => (
          !(desktop && item === professionalFeature) && !(desktop && item.classList.contains("note-link"))
        ));
        gsap.set(standardReveals, { autoAlpha: 0, y: 34, scale: 0.992 });
        ScrollTrigger.batch(standardReveals, {
          start: "top 88%",
          once: true,
          onEnter: (batch) => gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.82,
            stagger: 0.065,
            ease: "power3.out",
            overwrite: true
          })
        });

        traceSections.forEach((section) => {
          const copyTargets = section.querySelectorAll(".section-heading, .section-lead");
          gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.2
            }
          })
            .fromTo(section, { "--section-focus": 0, "--section-haze-parallax": "38px" }, {
              "--section-focus": 1,
              "--section-haze-parallax": "0px",
              duration: 0.5,
              ease: "none"
            })
            .to(section, { "--section-focus": 0.15, "--section-haze-parallax": "-28px", duration: 0.5, ease: "none" });

          if (copyTargets.length) {
            gsap.fromTo(copyTargets, { y: 18 }, {
              y: -12,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.3
              }
            });
          }

          ScrollTrigger.create({
            trigger: section,
            start: "top 58%",
            end: "bottom 58%",
            onEnter: () => setActiveSection(section.id),
            onEnterBack: () => setActiveSection(section.id)
          });
        });

        let traceDrawTween = null;
        let traceCursorTween = null;
        if (traceLayout && tracePathActive) {
          if (window.DrawSVGPlugin) gsap.set(tracePathActive, { drawSVG: "0%" });
          traceDrawTween = gsap.to(tracePathActive, {
            ...(window.DrawSVGPlugin ? { drawSVG: "100%" } : { strokeDashoffset: 0 }),
            ease: "none",
            scrollTrigger: {
              trigger: traceLayout,
              start: "top 46%",
              end: () => ScrollTrigger.maxScroll(window),
              invalidateOnRefresh: true,
              refreshPriority: -100,
              scrub: 0.16
            }
          });

          if (traceCursor && window.MotionPathPlugin) {
            gsap.set(traceCursor, { xPercent: -50, yPercent: -50 });
            traceCursorTween = gsap.to(traceCursor, {
              motionPath: {
                path: tracePathActive,
                align: tracePathActive,
                alignOrigin: [0.5, 0.5],
                autoRotate: false
              },
              ease: "none",
              scrollTrigger: {
                trigger: traceLayout,
                start: "top 46%",
                end: () => ScrollTrigger.maxScroll(window),
                invalidateOnRefresh: true,
                refreshPriority: -100,
                scrub: 0.12
              }
            });
          }
        }

        careerItems.forEach((item) => {
          gsap.fromTo(item, { "--item-progress": 0 }, {
            "--item-progress": 1,
            ease: "none",
            scrollTrigger: {
              trigger: item,
              start: "top 72%",
              end: "bottom 42%",
              scrub: 0.18,
              toggleClass: { targets: item, className: "is-current" }
            }
          });
        });

        if (desktop && professionalFeature) {
          gsap.set(professionalFeature, { autoAlpha: 1, y: 0, scale: 1 });
          const lanes = professionalFeature.querySelectorAll(".stack-lane");
          const connectors = professionalFeature.querySelectorAll(".stack-connector");
          const professionalTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: professionalFeature,
              start: "top 12%",
              end: "+=80%",
              pin: true,
              scrub: 0.32,
              anticipatePin: 1,
              refreshPriority: 2
            }
          });

          professionalTimeline
            .fromTo(lanes, { autoAlpha: 0.28, x: 36 }, {
              autoAlpha: 1,
              x: 0,
              stagger: 0.32,
              duration: 0.7,
              ease: "power2.out"
            }, 0)
            .fromTo(connectors, { scaleY: 0, transformOrigin: "top" }, {
              scaleY: 1,
              stagger: 0.32,
              duration: 0.4,
              ease: "power2.inOut"
            }, 0.18)
            .fromTo(".professional-copy > *", { y: 18, autoAlpha: 0.55 }, {
              y: 0,
              autoAlpha: 1,
              stagger: 0.08,
              duration: 0.55,
              ease: "power2.out"
            }, 0);
        }

        if (desktop && projectsStage && projectsTrack && projectPanels.length) {
          gsap.set(projectPanels, { autoAlpha: 1, y: 0, scale: 1 });
          const getProjectDistance = () => Math.max(0, projectsTrack.scrollWidth - projectsStage.clientWidth);
          gsap.to(projectsTrack, {
            x: () => -getProjectDistance(),
            ease: "none",
            scrollTrigger: {
              trigger: projectsStage,
              start: "top 96px",
              end: () => `+=${Math.max(getProjectDistance(), window.innerHeight * 1.5)}`,
              pin: true,
              scrub: 0.32,
              anticipatePin: 1,
              refreshPriority: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                if (projectsProgress) gsap.set(projectsProgress, { scaleX: self.progress });
                const activeIndex = Math.min(projectPanels.length - 1, Math.round(self.progress * (projectPanels.length - 1)));
                projectPanels.forEach((panel, index) => panel.classList.toggle("is-current", index === activeIndex));
              }
            }
          });
        }

        if (desktop && finePointer && typeof window.Atropos === "function") {
          document.querySelectorAll(".js-atropos").forEach((element) => {
            localAtropos.push(window.Atropos({
              el: element,
              activeOffset: 28,
              rotateXMax: 2,
              rotateYMax: 2,
              duration: 320,
              shadow: false,
              highlight: true
            }));
          });
        }

        const refreshTrace = () => {
          updateTraceGeometry();
          traceDrawTween?.invalidate();
          traceCursorTween?.invalidate();
        };
        ScrollTrigger.addEventListener("refresh", refreshTrace);
        window.requestAnimationFrame(() => {
          updateTraceGeometry();
          ScrollTrigger.refresh();
        });

        return () => {
          ScrollTrigger.removeEventListener("refresh", refreshTrace);
          localAtropos.forEach((instance) => instance?.destroy());
          localSplits.forEach((split) => split?.revert());
        };
      }
    );
  };

  const syncExperience = () => {
    destroyMotion();
    stopSmoothScroll();

    if (reduceMotion.matches) {
      initFallbackExperience();
      return;
    }

    startSmoothScroll();
    initMotion();
  };

  applyTheme(root.dataset.theme || (systemTheme.matches ? "dark" : "light"));
  themeToggle?.addEventListener("click", () => {
    applyTheme(root.dataset.theme === "dark" ? "light" : "dark", true);
  });
  systemTheme.addEventListener?.("change", (event) => {
    if (!getSavedTheme()) applyTheme(event.matches ? "dark" : "light");
  });

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

  window.addEventListener("scroll", requestChromeUpdate, { passive: true });
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      updateTraceGeometry();
      window.ScrollTrigger?.refresh();
    }, 180);
  }, { passive: true });
  reduceMotion.addEventListener?.("change", syncExperience);

  updateChrome();
  updateTenures();
  window.setInterval(updateTenures, 60 * 60 * 1000);
  const year = document.querySelector("[data-current-year]");
  if (year) year.textContent = new Date().getFullYear();

  const fontsReady = document.fonts?.ready || Promise.resolve();
  fontsReady.finally(() => {
    syncExperience();
    window.requestAnimationFrame(() => root.classList.add("is-ready"));
  });
})();
