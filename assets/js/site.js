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
  const sections = [...document.querySelectorAll(".portfolio-section[id]")];
  const sectionLinks = [...document.querySelectorAll('.nav-link[href^="#"]')];
  const revealItems = [...document.querySelectorAll(".reveal")];
  const careerItems = [...document.querySelectorAll(".career-timeline .timeline-item")];
  const tenureNodes = [...document.querySelectorAll("[data-experience-since]")];
  const professionalFeature = document.querySelector(".professional-feature");
  const projectsStage = document.querySelector(".projects-stage");
  const projectsTrack = document.querySelector(".notes-grid");
  const projectPanels = [...document.querySelectorAll(".project-panel")];
  const projectsProgress = document.querySelector(".projects-progress span");
  const projectCurrIndex = document.querySelector("#project-curr-index");
  const prevProjBtn = document.querySelector(".js-prev-proj");
  const nextProjBtn = document.querySelector(".js-next-proj");

  let lenis = null;
  let lenisTicker = null;
  let motionMedia = null;
  let fallbackSectionObserver = null;
  let chromeTicking = false;
  let projectsScrollTrigger = null;

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
        // Theme still applies when storage is unavailable.
      }
    }
  };

  const updateTenures = () => {
    const now = new Date();

    tenureNodes.forEach((node) => {
      const [startYear, startMonth, startDay] = node.dataset.experienceSince.split("-").map(Number);
      const startDate = new Date(startYear, startMonth - 1, startDay);
      
      let years = now.getFullYear() - startYear;
      let months = now.getMonth() - (startMonth - 1);
      let days = now.getDate() - startDay;

      if (days < 0) {
        months -= 1;
        const prevMonthDays = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
        days += prevMonthDays;
      }
      if (months < 0) {
        years -= 1;
        months += 12;
      }

      years = Math.max(years, 0);
      months = Math.max(months, 0);
      days = Math.max(days, 0);

      const parts = [];
      if (years > 0) parts.push(`${years} ${years === 1 ? "yr" : "yrs"}`);
      if (months > 0) parts.push(`${months} ${months === 1 ? "mo" : "mos"}`);
      if (days > 0 || !parts.length) parts.push(`${days} ${days === 1 ? "day" : "days"}`);

      const totalDays = Math.max(0, Math.floor((now - startDate) / (1000 * 60 * 60 * 24)));

      node.textContent = parts.join(" ");
      node.setAttribute(
        "aria-label",
        `${parts.join(", ")} of active production software engineering experience`
      );
      node.title = `Calculated live since 15 April 2025 (${totalDays} active calendar days)`;
    });
  };

  const setActiveSection = (activeId) => {
    sections.forEach((section) => section.classList.toggle("is-active", section.id === activeId));
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

  // Interactive mouse spotlight & 3D floating parallax
  const float3DElements = [...document.querySelectorAll(".js-3d-float, .js-chip-float")];
  const bgParallaxPlanes = [...document.querySelectorAll(".js-bg-parallax")];
  let pointerTargetX = window.innerWidth / 2;
  let pointerTargetY = window.innerHeight * 0.3;
  let pointerCurrentX = pointerTargetX;
  let pointerCurrentY = pointerTargetY;
  let pointerAnimFrame = null;

  const updatePointerGlow = () => {
    pointerCurrentX += (pointerTargetX - pointerCurrentX) * 0.12;
    pointerCurrentY += (pointerTargetY - pointerCurrentY) * 0.12;

    root.style.setProperty("--pointer-x", `${pointerCurrentX.toFixed(1)}px`);
    root.style.setProperty("--pointer-y", `${pointerCurrentY.toFixed(1)}px`);

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const normX = (pointerCurrentX - centerX) / centerX;
    const normY = (pointerCurrentY - centerY) / centerY;

    // 3D Background Parallax Planes
    bgParallaxPlanes.forEach((plane) => {
      const depth = Number(plane.dataset.depth) || 20;
      const moveX = normX * depth;
      const moveY = normY * depth;
      const rotX = normY * -4.5;
      const rotY = normX * 4.5;
      plane.style.transform = `translate3d(${moveX.toFixed(1)}px, ${moveY.toFixed(1)}px, 0) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
    });

    // 3D Floating Geometric Objects & HUD Chips
    float3DElements.forEach((el) => {
      const depth = Number(el.dataset.depth) || 20;
      const moveX = normX * depth;
      const moveY = normY * depth;
      const rotX = normY * -12;
      const rotY = normX * 12;
      if (el.classList.contains("js-3d-float")) {
        el.style.transform = `translate3d(${moveX.toFixed(1)}px, ${moveY.toFixed(1)}px, ${depth}px) rotateX(${rotX.toFixed(1)}deg) rotateY(${rotY.toFixed(1)}deg)`;
      } else {
        el.style.transform = `translate3d(${moveX.toFixed(1)}px, ${moveY.toFixed(1)}px, ${(depth * 0.8).toFixed(1)}px)`;
      }
    });

    if (Math.abs(pointerTargetX - pointerCurrentX) > 0.1 || Math.abs(pointerTargetY - pointerCurrentY) > 0.1) {
      pointerAnimFrame = window.requestAnimationFrame(updatePointerGlow);
    } else {
      pointerAnimFrame = null;
    }
  };

  window.addEventListener("pointermove", (e) => {
    pointerTargetX = e.clientX;
    pointerTargetY = e.clientY;
    if (!pointerAnimFrame) {
      pointerAnimFrame = window.requestAnimationFrame(updatePointerGlow);
    }
  }, { passive: true });

  const startSmoothScroll = () => {
    if (reduceMotion.matches || lenis || typeof window.Lenis !== "function") return;

    const gsapReady = hasGsap();
    lenis = new window.Lenis({
      autoRaf: !gsapReady,
      anchors: { offset: -88 },
      lerp: 0.12,
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.2,
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

    if (!sections.length || typeof window.IntersectionObserver !== "function") return;
    fallbackSectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length) setActiveSection(visible[0].target.id);
      },
      { threshold: [0.15, 0.35, 0.55], rootMargin: "-20% 0px -48% 0px" }
    );
    sections.forEach((section) => fallbackSectionObserver.observe(section));
  };

  const destroyMotion = () => {
    fallbackSectionObserver?.disconnect();
    fallbackSectionObserver = null;
    motionMedia?.revert();
    motionMedia = null;
    projectsScrollTrigger = null;
    root.classList.remove("motion-ready");

    if (window.gsap) {
      window.gsap.set(
        [hero, ...revealItems, professionalFeature, projectsTrack, projectsProgress].filter(Boolean),
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
    const plugins = [ScrollTrigger, window.SplitText].filter(Boolean);
    gsap.registerPlugin(...plugins);
    root.classList.add("motion-ready");

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

        // Hero high-impact entrance
        if (window.SplitText) {
          document.querySelectorAll(".hero-line > span").forEach((line) => {
            const split = window.SplitText.create(line, {
              type: "words,chars",
              wordsClass: "hero-word",
              charsClass: "hero-char",
              aria: "auto",
              autoSplit: true,
              onSplit: (instance) => {
                gsap.fromTo(
                  instance.chars,
                  {
                    autoAlpha: 0,
                    y: 40,
                    rotateX: -45,
                    transformOrigin: "bottom center"
                  },
                  {
                    autoAlpha: 1,
                    y: 0,
                    rotateX: 0,
                    duration: 0.95,
                    stagger: 0.02,
                    ease: "power4.out"
                  }
                );
              }
            });
            localSplits.push(split);
          });
        }

        // Hero elements stagger
        gsap.fromTo(
          [".hero-kicker", ".hero-intro", ".hero-footer", ".hero-signal"],
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.12, ease: "power3.out", delay: 0.25 }
        );

        // Hero Parallax Scroll
        gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 0.25
          }
        })
          .fromTo(root, { "--hero-progress": 0 }, { "--hero-progress": 1, ease: "none" }, 0)
          .to(".hero-line:first-child", { yPercent: -18, ease: "none" }, 0)
          .to(".hero-line:nth-child(2)", { yPercent: -8, ease: "none" }, 0)
          .to(".hero-intro", { y: -36, autoAlpha: 0.3, ease: "none" }, 0)
          .to(".ambient-glow", { yPercent: 40, autoAlpha: 0.2, ease: "none" }, 0);

        // Staggered section reveals
        const standardReveals = revealItems.filter((item) => (
          !(desktop && item === professionalFeature) && !(desktop && item.classList.contains("note-link"))
        ));

        gsap.set(standardReveals, { autoAlpha: 0, y: 38, scale: 0.985 });
        ScrollTrigger.batch(standardReveals, {
          start: "top 88%",
          once: true,
          onEnter: (batch) => gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.88,
            stagger: 0.08,
            ease: "power3.out",
            overwrite: true
          })
        });

        // Section focus & active nav link trigger
        sections.forEach((section) => {
          const copyTargets = section.querySelectorAll(".section-heading, .section-lead");
          gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.25
            }
          })
            .fromTo(section, { "--section-focus": 0, "--section-haze-parallax": "42px" }, {
              "--section-focus": 1,
              "--section-haze-parallax": "0px",
              duration: 0.5,
              ease: "none"
            })
            .to(section, { "--section-focus": 0.1, "--section-haze-parallax": "-32px", duration: 0.5, ease: "none" });

          if (copyTargets.length) {
            gsap.fromTo(copyTargets, { y: 22 }, {
              y: -14,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.35
              }
            });
          }

          ScrollTrigger.create({
            trigger: section,
            start: "top 55%",
            end: "bottom 55%",
            onEnter: () => setActiveSection(section.id),
            onEnterBack: () => setActiveSection(section.id)
          });
        });

        // Timeline item progression
        careerItems.forEach((item) => {
          gsap.fromTo(item, { "--item-progress": 0 }, {
            "--item-progress": 1,
            ease: "none",
            scrollTrigger: {
              trigger: item,
              start: "top 74%",
              end: "bottom 44%",
              scrub: 0.18,
              toggleClass: { targets: item, className: "is-current" }
            }
          });
        });

        // Professional stack interactive visualization
        if (desktop && professionalFeature) {
          gsap.set(professionalFeature, { autoAlpha: 1, y: 0, scale: 1 });
          const lanes = professionalFeature.querySelectorAll(".stack-lane");
          const connectors = professionalFeature.querySelectorAll(".stack-connector");
          const professionalTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: professionalFeature,
              start: "top 14%",
              end: "+=85%",
              pin: true,
              scrub: 0.35,
              anticipatePin: 1,
              refreshPriority: 2
            }
          });

          professionalTimeline
            .fromTo(lanes, { autoAlpha: 0.3, x: 42 }, {
              autoAlpha: 1,
              x: 0,
              stagger: 0.3,
              duration: 0.75,
              ease: "power2.out"
            }, 0)
            .fromTo(connectors, { scaleY: 0, transformOrigin: "top" }, {
              scaleY: 1,
              stagger: 0.3,
              duration: 0.45,
              ease: "power2.inOut"
            }, 0.15)
            .fromTo(".professional-copy > *", { y: 22, autoAlpha: 0.5 }, {
              y: 0,
              autoAlpha: 1,
              stagger: 0.08,
              duration: 0.6,
              ease: "power2.out"
            }, 0);
        }

        // Horizontal Project Reel (Desktop Pinned Carousel)
        if (desktop && projectsStage && projectsTrack && projectPanels.length) {
          gsap.set(projectPanels, { autoAlpha: 1, y: 0, scale: 1 });
          const getProjectDistance = () => Math.max(0, projectsTrack.scrollWidth - projectsStage.clientWidth);

          projectsScrollTrigger = ScrollTrigger.create({
            trigger: projectsStage,
            start: "top 90px",
            end: () => `+=${Math.max(getProjectDistance(), window.innerHeight * 1.6)}`,
            pin: true,
            scrub: 0.35,
            anticipatePin: 1,
            refreshPriority: 1,
            invalidateOnRefresh: true,
            animation: gsap.to(projectsTrack, {
              x: () => -getProjectDistance(),
              ease: "none"
            }),
            onUpdate: (self) => {
              if (projectsProgress) gsap.set(projectsProgress, { scaleX: self.progress });
              const activeIndex = Math.min(projectPanels.length - 1, Math.round(self.progress * (projectPanels.length - 1)));
              projectPanels.forEach((panel, index) => panel.classList.toggle("is-current", index === activeIndex));
              if (projectCurrIndex) {
                projectCurrIndex.textContent = String(activeIndex + 1).padStart(2, "0");
              }
            }
          });

          // Interactive Next / Prev controls for horizontal projects
          const navigateProjects = (direction) => {
            if (!projectsScrollTrigger) return;
            const step = 1 / (projectPanels.length - 1);
            const currentProgress = projectsScrollTrigger.progress;
            const targetProgress = clamp(currentProgress + direction * step, 0, 1);
            const targetScroll = projectsScrollTrigger.start + targetProgress * (projectsScrollTrigger.end - projectsScrollTrigger.start);

            if (lenis) {
              lenis.scrollTo(targetScroll, { duration: 0.8, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
            } else {
              window.scrollTo({ top: targetScroll, behavior: "smooth" });
            }
          };

          prevProjBtn?.addEventListener("click", () => navigateProjects(-1));
          nextProjBtn?.addEventListener("click", () => navigateProjects(1));
        }

        // Atropos 3D Tilt for interactive project panels & visual windows
        if (desktop && finePointer && typeof window.Atropos === "function") {
          document.querySelectorAll(".js-atropos").forEach((element) => {
            localAtropos.push(window.Atropos({
              el: element,
              activeOffset: 32,
              rotateXMax: 4,
              rotateYMax: 4,
              duration: 340,
              shadow: false,
              highlight: true
            }));
          });
        }

        window.requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });

        return () => {
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
    window.clearTimeout(window.resizeTimer);
    window.resizeTimer = window.setTimeout(() => {
      window.ScrollTrigger?.refresh();
    }, 180);
  }, { passive: true });
  reduceMotion.addEventListener?.("change", syncExperience);

  // Ambient Horror Ghost Terminal Streamer
  const initHorrorTerminal = () => {
    const termNode = document.querySelector(".js-horror-terminal-text");
    if (!termNode) return;

    const logs = [
      "> [PANIC] daemon thread escaped isolated sandbox",
      "> 0x00007FFF: memory dump corrupted at block 0xDEADBEEF",
      "> Uncaught CursedEntityException: recursion into abyss",
      "> SELECT soul FROM pool WHERE state = 'CORRUPTED';",
      "> void* ptr = malloc(0); // cannot escape heap",
      "> [FATAL] Watchdog heartbeat failed. Watchdog is dead.",
      "> SIGSEGV in libdaemon.so: 666 threads zombie status",
      "> Bytecode verification bypassed: 0xCAFEBABE infected",
      "> [WARN] Kernel inode 0x666 leaked 1048576 handles"
    ];

    if (reduceMotion.matches) {
      termNode.textContent = logs[0];
      return;
    }

    let logIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const tick = () => {
      const currentLog = logs[logIndex];
      
      if (!isDeleting) {
        charIndex += 1;
        termNode.textContent = currentLog.slice(0, charIndex);

        if (charIndex === currentLog.length) {
          isDeleting = true;
          window.setTimeout(tick, 3200);
          return;
        }
      } else {
        charIndex -= 2;
        if (charIndex < 0) charIndex = 0;
        termNode.textContent = currentLog.slice(0, charIndex);

        if (charIndex === 0) {
          isDeleting = false;
          logIndex = (logIndex + 1) % logs.length;
          window.setTimeout(tick, 600);
          return;
        }
      }

      const speed = isDeleting ? 25 : Math.floor(Math.random() * 35) + 35;
      window.setTimeout(tick, speed);
    };

    tick();
  };

  updateChrome();
  updateTenures();
  initHorrorTerminal();
  window.setInterval(updateTenures, 60 * 60 * 1000);
  const year = document.querySelector("[data-current-year]");
  if (year) year.textContent = new Date().getFullYear();

  const fontsReady = document.fonts?.ready || Promise.resolve();
  fontsReady.finally(() => {
    syncExperience();
    window.requestAnimationFrame(() => root.classList.add("is-ready"));
  });
})();
