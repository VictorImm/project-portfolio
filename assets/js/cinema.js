/**
 * Cinema Realm Interactive Engine — ESR Bespoke & PDA Architecture Standard
 * Manages:
 * 1. Dual Exhibition Modes: Architectural Monograph & Panoramic Filmstrip
 * 2. Magnetic Contextual Cursor Follower
 * 3. Ambient Micro-Video Previews on Hover
 * 4. Horizontal Filmstrip Drag & Wheel Inertia Scrubbing
 * 5. Fullscreen Darkroom Lightbox & Adaptive Video Modal Player
 * 6. Zero-Flicker Shutter Realm Transitions
 */
(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    // =========================================================================
    // 1. Dual-Shutter Realm Warp Transition Handlers (Zero Flicker)
    // =========================================================================
    const urlParams = new URLSearchParams(window.location.search);
    const transitionOverlay = document.getElementById("cinemaPortalTransition");

    if (urlParams.get("transition") === "warp" && transitionOverlay) {
      const titleElem = document.getElementById("portalTargetTitle");
      const specsElem = document.getElementById("portalTargetSpecs");
      if (titleElem) titleElem.textContent = "CINEMA & VISUAL STORYTELLING";
      if (specsElem) specsElem.textContent = "35MM PRIMES · NATURAL LIGHT · ORGANIC LUT";

      window.history.replaceState({}, document.title, window.location.pathname);

      window.requestAnimationFrame(() => {
        document.documentElement.classList.remove("is-portal-transitioning");
        transitionOverlay.classList.add("is-opening");

        window.setTimeout(() => {
          transitionOverlay.classList.remove("is-opening", "is-active");
        }, 560);
      });
    }

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

    const scrollButtons = document.querySelectorAll(".js-scroll-to-gallery");
    scrollButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(btn.getAttribute("href"));
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });

    // Kinetic Magnetic Action Buttons in Cinema Realm
    if (window.matchMedia("(pointer: fine)").matches) {
      const magneticCinemaButtons = document.querySelectorAll(".js-kinetic-magnetic");
      magneticCinemaButtons.forEach((btn) => {
        btn.addEventListener("mousemove", (e) => {
          const rect = btn.getBoundingClientRect();
          const relX = (e.clientX - rect.left - rect.width / 2) * 0.22;
          const relY = (e.clientY - rect.top - rect.height / 2) * 0.22;
          const moveX = Math.max(-6, Math.min(6, relX));
          const moveY = Math.max(-6, Math.min(6, relY));
          btn.style.transform = `translate3d(${moveX.toFixed(1)}px, ${moveY.toFixed(1)}px, 0)`;
        });
        btn.addEventListener("mouseleave", () => {
          btn.style.transform = "translate3d(0, 0, 0)";
        });
      });
    }

    // =========================================================================
    // 2. Magnetic Contextual Cursor Follower (Desktop)
    // =========================================================================
    const cursorFollower = document.getElementById("cinemaCursor");
    const cursorText = document.getElementById("cursorText");

    if (cursorFollower && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      let mouseX = -100;
      let mouseY = -100;
      let currentX = -100;
      let currentY = -100;
      let isCursorActive = false;

      window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!cursorFollower.classList.contains("is-visible")) {
          cursorFollower.classList.add("is-visible");
        }
      });

      document.addEventListener("mouseleave", () => {
        cursorFollower.classList.remove("is-visible");
      });

      // Smooth lerp cursor tracking
      const updateCursor = () => {
        currentX += (mouseX - currentX) * 0.22;
        currentY += (mouseY - currentY) * 0.22;
        cursorFollower.style.left = `${currentX}px`;
        cursorFollower.style.top = `${currentY}px`;
        requestAnimationFrame(updateCursor);
      };
      requestAnimationFrame(updateCursor);

      // Contextual Cursor Badges
      const interactiveTargets = document.querySelectorAll("[data-cursor]");
      interactiveTargets.forEach((el) => {
        el.addEventListener("mouseenter", () => {
          const text = el.getAttribute("data-cursor") || "VIEW";
          if (cursorText) cursorText.textContent = text;
          cursorFollower.classList.add("is-active");
        });
        el.addEventListener("mouseleave", () => {
          if (cursorText) cursorText.textContent = "EXPLORE";
          cursorFollower.classList.remove("is-active");
        });
      });
    }

    // =========================================================================
    // 3. Exhibition Dual View Switcher (Monograph vs Panoramic Filmstrip)
    // =========================================================================
    const viewButtons = document.querySelectorAll(".js-view-mode-btn");
    const monographView = document.getElementById("viewMonograph");
    const filmstripView = document.getElementById("viewFilmstrip");

    viewButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const mode = btn.dataset.view;

        viewButtons.forEach((b) => {
          b.classList.remove("is-active");
          b.setAttribute("aria-selected", "false");
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-selected", "true");

        if (mode === "monograph") {
          monographView?.classList.remove("is-hidden");
          filmstripView?.classList.add("is-hidden");
        } else if (mode === "filmstrip") {
          monographView?.classList.add("is-hidden");
          filmstripView?.classList.remove("is-hidden");
        }
      });
    });

    // =========================================================================
    // 4. Ambient Micro-Video Previews on Hover
    // =========================================================================
    const mediaWrappers = document.querySelectorAll(".monograph-media-wrapper");
    mediaWrappers.forEach((wrapper) => {
      const ambientVideo = wrapper.querySelector(".plate-ambient-video");
      if (ambientVideo) {
        wrapper.addEventListener("mouseenter", () => {
          ambientVideo.play().catch(() => {});
        });
        wrapper.addEventListener("mouseleave", () => {
          ambientVideo.pause();
        });
      }
    });

    // =========================================================================
    // 5. Panoramic Filmstrip Inertia Drag & Wheel Scrubbing
    // =========================================================================
    const filmstripContainer = document.getElementById("filmstripTrackContainer");
    const filmstripCounter = document.getElementById("filmstripCounter");
    const btnFilmPrev = document.querySelector(".js-film-prev");
    const btnFilmNext = document.querySelector(".js-film-next");

    if (filmstripContainer) {
      let isDown = false;
      let startX;
      let scrollLeft;

      filmstripContainer.addEventListener("mousedown", (e) => {
        isDown = true;
        filmstripContainer.classList.add("active");
        startX = e.pageX - filmstripContainer.offsetLeft;
        scrollLeft = filmstripContainer.scrollLeft;
      });

      filmstripContainer.addEventListener("mouseleave", () => {
        isDown = false;
        filmstripContainer.classList.remove("active");
      });

      filmstripContainer.addEventListener("mouseup", () => {
        isDown = false;
        filmstripContainer.classList.remove("active");
      });

      filmstripContainer.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - filmstripContainer.offsetLeft;
        const walk = (x - startX) * 1.5;
        filmstripContainer.scrollLeft = scrollLeft - walk;
      });

      // Wheel scrub support
      filmstripContainer.addEventListener("wheel", (e) => {
        if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
          // Horizontal tilt
          filmstripContainer.scrollLeft += e.deltaY;
          e.preventDefault();
        }
      }, { passive: false });

      // Arrow navigation buttons
      btnFilmPrev?.addEventListener("click", () => {
        filmstripContainer.scrollBy({ left: -420, behavior: "smooth" });
      });

      btnFilmNext?.addEventListener("click", () => {
        filmstripContainer.scrollBy({ left: 420, behavior: "smooth" });
      });

      // Update counter on scroll
      filmstripContainer.addEventListener("scroll", () => {
        const units = filmstripContainer.querySelectorAll(".filmstrip-frame-unit");
        const scrollPos = filmstripContainer.scrollLeft + filmstripContainer.offsetWidth / 3;
        let activeIdx = 0;

        units.forEach((u, i) => {
          if (u.offsetLeft <= scrollPos) {
            activeIdx = i;
          }
        });

        if (filmstripCounter) {
          filmstripCounter.textContent = `FRAME 0${activeIdx + 1} / 09 · SCROLL OR DRAG HORIZONTALLY`;
        }
      }, { passive: true });
    }

    // =========================================================================
    // 6. Cinematic Video Modal Player (Adaptive 9:16 & 16:9 Widescreen)
    // =========================================================================
    const videoModal = document.getElementById("cinemaVideoModal");
    const modalVideoPlayer = document.getElementById("modalVideoPlayer");
    const videoModalTitle = document.getElementById("videoModalTitle");
    const videoModalDate = document.getElementById("videoModalDate");
    const videoModalLocation = document.getElementById("videoModalLocation");
    const videoModalCamera = document.getElementById("videoModalCamera");
    const videoModalCaption = document.getElementById("videoModalCaption");
    const videoModalShell = videoModal ? videoModal.querySelector(".video-modal-shell") : null;

    const openVideoModal = (data) => {
      if (!videoModal || !modalVideoPlayer) return;

      videoModalTitle.textContent = data.title || "Cinematic Reel";
      videoModalDate.textContent = data.date || "2026";
      videoModalLocation.textContent = (data.location || "INDONESIA").toUpperCase();
      videoModalCamera.textContent = (data.camera || "SONY DSC-W310").toUpperCase();
      videoModalCaption.textContent = data.caption || "";

      modalVideoPlayer.src = data.videoSrc;
      modalVideoPlayer.load();

      modalVideoPlayer.onloadedmetadata = () => {
        if (modalVideoPlayer.videoWidth > modalVideoPlayer.videoHeight) {
          videoModalShell?.classList.add("is-landscape");
        } else {
          videoModalShell?.classList.remove("is-landscape");
        }
      };

      videoModal.classList.add("is-open");
      videoModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";

      const playPromise = modalVideoPlayer.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    };

    const closeVideoModal = () => {
      if (!videoModal || !modalVideoPlayer) return;
      modalVideoPlayer.pause();
      modalVideoPlayer.removeAttribute("src");
      modalVideoPlayer.load();

      videoModal.classList.remove("is-open");
      videoModal.setAttribute("aria-hidden", "true");
      videoModalShell?.classList.remove("is-landscape");
      document.body.style.overflow = "";
    };

    document.querySelectorAll(".js-open-video-modal").forEach((trigger) => {
      const handleTrigger = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const data = {
          videoSrc: trigger.dataset.videoSrc,
          title: trigger.dataset.title,
          date: trigger.dataset.date,
          location: trigger.dataset.location,
          camera: trigger.dataset.camera,
          caption: trigger.dataset.caption
        };
        openVideoModal(data);
      };

      trigger.addEventListener("click", handleTrigger);
      trigger.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleTrigger(e);
        }
      });
    });

    document.querySelectorAll(".js-close-video-modal").forEach((btn) => {
      btn.addEventListener("click", closeVideoModal);
    });

    // =========================================================================
    // 7. Fullscreen Darkroom Photo Lightbox (Metadata Telemetry & Keyboard Nav)
    // =========================================================================
    const photoLightbox = document.getElementById("cinemaPhotoLightbox");
    const lightboxActiveImg = document.getElementById("lightboxActiveImg");
    const lightboxActiveVideo = document.getElementById("lightboxActiveVideo");
    const lightboxCounter = document.getElementById("lightboxCounter");
    const lightboxFrameTitle = document.getElementById("lightboxFrameTitle");
    const lightboxFrameCaption = document.getElementById("lightboxFrameCaption");
    const lightboxSpecCamera = document.getElementById("lightboxSpecCamera");
    const lightboxSpecLight = document.getElementById("lightboxSpecLight");
    const lightboxSpecLocation = document.getElementById("lightboxSpecLocation");
    const lightboxIgLink = document.getElementById("lightboxIgLink");
    const btnToggleMotion = document.getElementById("btnToggleMotion");

    // Static Stills Registry (6 Works)
    const stillsRegistry = [
      {
        src: "assets/cinema/stills/Da5qlFSBU_s.jpg",
        title: "Quietly There",
        caption: "A building behind the trees, a quiet afternoon, and nothing particularly extraordinary. Maybe that's the point. Not every peaceful moment announces itself. Sometimes, you simply have to notice that it was already there.",
        camera: "Prime Optics · 4:5 Framing",
        specs: "Available Afternoon Light · Balanced Shadow",
        location: "Surabaya, ID",
        ig: "https://www.instagram.com/p/Da5qlFSBU_s/",
        motion: null
      },
      {
        src: "assets/cinema/stills/DYIIB74AY7L.jpg",
        title: "Momentary",
        caption: "Some moments are not meant to be captured perfectly. Only quietly witnessed. A sleeping cat, seen through the leaves — unaware of the camera, unaware of the moment. For a second, the world felt still.",
        camera: "Sony Cyber-shot DSC-W310",
        specs: "Focal Ambient · Soft Leaf Shadows",
        location: "Surabaya, ID",
        ig: "https://www.instagram.com/p/DYIIB74AY7L/",
        motion: null
      },
      {
        src: "assets/cinema/stills/DDiAI7vTb-4.jpg",
        title: "Lustrous Flower",
        caption: "A little light can change the way something ordinary is seen. A flower in the dark, lit from behind — somewhere between what is there and what the light reveals. Another experiment in light, form, and contrast.",
        camera: "Sony Cyber-shot DSC-W310",
        specs: "Darkroom Rim Lighting · Organic Contrast",
        location: "Surabaya, ID",
        ig: "https://www.instagram.com/p/DDiAI7vTb-4/",
        motion: null
      },
      {
        src: "assets/cinema/stills/C4bJ502vuMJ.jpg",
        title: "Steel Against the Sky",
        caption: "Some things become beautiful when you stop trying to look past them. Quietly standing above the rooftops — ordinary, familiar, yet somehow worth remembering.",
        camera: "Architectural Silhouette",
        specs: "Dusk Backlight · Minimal Horizon",
        location: "Surabaya, ID",
        ig: "https://www.instagram.com/p/C4bJ502vuMJ/",
        motion: null
      },
      {
        src: "assets/cinema/stills/DH2_0D5JrDo.jpg",
        title: "Misaligned",
        caption: "Not everything has to line up to feel intentional. A mirror cube placed slightly off — shadows missing their mark, lines meeting where they shouldn't. An exercise in composition, balance, and controlled imperfection. Sometimes, misalignment is the composition.",
        camera: "Sony Cyber-shot DSC-W310",
        specs: "Mirror Cube Shadows · Controlled Imperfection",
        location: "Studio Experiment",
        ig: "https://www.instagram.com/p/DH2_0D5JrDo/",
        motion: "assets/cinema/stills/DH2_0D5JrDo_motion.mp4"
      },
      {
        src: "assets/cinema/stills/DBgcGfyPxOd.jpg",
        title: "Sunlit Stillness",
        caption: "Some moments ask for nothing. No destination, no urgency — just a patch of grass, a little warmth, and the sun on your face. Perhaps that's all a quiet afternoon needs.",
        camera: "Sony Cyber-shot DSC-W310",
        specs: "Warm Afternoon Sun · Grass Texture",
        location: "Surabaya, ID",
        ig: "https://www.instagram.com/p/DBgcGfyPxOd/",
        motion: "assets/cinema/stills/DBgcGfyPxOd_motion.mp4"
      }
    ];

    let currentStillIndex = 0;
    let isMotionPlaying = false;

    const renderLightboxFrame = (index) => {
      if (index < 0 || index >= stillsRegistry.length) return;
      currentStillIndex = index;
      const item = stillsRegistry[index];

      lightboxCounter.textContent = `FRAME 0${index + 1} / 0${stillsRegistry.length}`;
      lightboxFrameTitle.textContent = item.title;
      lightboxFrameCaption.textContent = item.caption;
      lightboxSpecCamera.textContent = item.camera;
      lightboxSpecLight.textContent = item.specs;
      lightboxSpecLocation.textContent = item.location;

      if (lightboxIgLink) {
        lightboxIgLink.href = item.ig || "https://www.instagram.com/v_1ct0r/";
      }

      isMotionPlaying = false;
      if (item.motion) {
        btnToggleMotion.style.display = "inline-flex";
        btnToggleMotion.textContent = "PLAY MOTION LOOP ▶";
        lightboxActiveVideo.src = item.motion;
      } else {
        btnToggleMotion.style.display = "none";
        lightboxActiveVideo.removeAttribute("src");
      }

      lightboxActiveVideo.pause();
      lightboxActiveVideo.style.display = "none";
      lightboxActiveImg.style.display = "block";
      lightboxActiveImg.src = item.src;
      lightboxActiveImg.alt = item.title;
    };

    const openPhotoLightbox = (index) => {
      if (!photoLightbox) return;
      renderLightboxFrame(index);
      photoLightbox.classList.add("is-open");
      photoLightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };

    const closePhotoLightbox = () => {
      if (!photoLightbox) return;
      lightboxActiveVideo.pause();
      lightboxActiveVideo.removeAttribute("src");
      photoLightbox.classList.remove("is-open");
      photoLightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    const nextPhoto = () => {
      const nextIndex = (currentStillIndex + 1) % stillsRegistry.length;
      renderLightboxFrame(nextIndex);
    };

    const prevPhoto = () => {
      const prevIndex = (currentStillIndex - 1 + stillsRegistry.length) % stillsRegistry.length;
      renderLightboxFrame(prevIndex);
    };

    document.querySelectorAll(".js-open-photo-lightbox").forEach((trigger) => {
      const idx = parseInt(trigger.dataset.index, 10) || 0;
      trigger.addEventListener("click", () => openPhotoLightbox(idx));
      trigger.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openPhotoLightbox(idx);
        }
      });
    });

    document.querySelectorAll(".js-close-lightbox").forEach((btn) => {
      btn.addEventListener("click", closePhotoLightbox);
    });

    document.querySelector(".js-lightbox-next")?.addEventListener("click", (e) => {
      e.stopPropagation();
      nextPhoto();
    });

    document.querySelector(".js-lightbox-prev")?.addEventListener("click", (e) => {
      e.stopPropagation();
      prevPhoto();
    });

    btnToggleMotion?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!isMotionPlaying) {
        lightboxActiveImg.style.display = "none";
        lightboxActiveVideo.style.display = "block";
        lightboxActiveVideo.play().catch(() => {});
        btnToggleMotion.textContent = "VIEW STILL FRAME ◼";
        isMotionPlaying = true;
      } else {
        lightboxActiveVideo.pause();
        lightboxActiveVideo.style.display = "none";
        lightboxActiveImg.style.display = "block";
        btnToggleMotion.textContent = "PLAY MOTION LOOP ▶";
        isMotionPlaying = false;
      }
    });

    // Global Keyboard Navigation
    document.addEventListener("keydown", (e) => {
      if (photoLightbox?.classList.contains("is-open")) {
        if (e.key === "Escape") closePhotoLightbox();
        else if (e.key === "ArrowRight") nextPhoto();
        else if (e.key === "ArrowLeft") prevPhoto();
      } else if (videoModal?.classList.contains("is-open")) {
        if (e.key === "Escape") closeVideoModal();
      }
    });
  });
})();
