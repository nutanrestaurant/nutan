/* =========================================================
   NUTAN RESTAURANT — MAIN SCRIPT
   ========================================================= */
(function () {
  "use strict";

  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Page loader ---------------- */
  window.addEventListener("load", () => {
    const loader = document.querySelector(".page-loader");
    if (loader) {
      setTimeout(() => loader.classList.add("is-hidden"), 250);
    }
  });

  /* ---------------- Sticky header ---------------- */
  const header = document.querySelector(".site-header");
  const setHeaderState = () => {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add("is-solid");
    else header.classList.remove("is-solid");
  };
  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  /* ---------------- Mobile drawer ---------------- */
  const menuToggle = document.querySelector(".menu-toggle");
  const drawer = document.querySelector(".drawer");
  const drawerOverlay = document.querySelector(".drawer-overlay");
  const drawerClose = document.querySelector(".drawer-close");

  drawer && drawer.setAttribute("aria-hidden", "true");

  const openDrawer = () => {
    drawer && drawer.classList.add("is-active");
    drawer && drawer.setAttribute("aria-hidden", "false");
    drawerOverlay && drawerOverlay.classList.add("is-active");
    menuToggle && menuToggle.classList.add("is-active");
    menuToggle && menuToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };
  const closeDrawer = () => {
    drawer && drawer.classList.remove("is-active");
    drawer && drawer.setAttribute("aria-hidden", "true");
    drawerOverlay && drawerOverlay.classList.remove("is-active");
    menuToggle && menuToggle.classList.remove("is-active");
    menuToggle && menuToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };
  menuToggle && menuToggle.addEventListener("click", () => {
    drawer && drawer.classList.contains("is-active") ? closeDrawer() : openDrawer();
  });
  drawerOverlay && drawerOverlay.addEventListener("click", closeDrawer);
  drawerClose && drawerClose.addEventListener("click", closeDrawer);
  document.querySelectorAll(".drawer nav a").forEach((a) => a.addEventListener("click", closeDrawer));
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });

  /* ---------------- Active nav link ---------------- */
  const navLinks = document.querySelectorAll(".main-nav a, .drawer nav a");
  const currentPage = (location.pathname.split("/").pop() || "index.html");
  navLinks.forEach((a) => {
    const href = a.getAttribute("href") || "";
    const hrefPage = href.split("#")[0] || "index.html";
    if (hrefPage === currentPage || (currentPage === "" && hrefPage === "index.html")) {
      a.classList.add("active");
    }
  });

  /* ---------------- Custom cursor ---------------- */
  if (!isTouch) {
    const dot = document.createElement("div");
    dot.className = "cursor-dot";
    const ring = document.createElement("div");
    ring.className = "cursor-ring";
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    document.body.classList.add("cursor-ready");

    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let ringX = mouseX, ringY = mouseY;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      dot.style.left = mouseX + "px";
      dot.style.top = mouseY + "px";
    });

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      ring.style.left = ringX + "px";
      ring.style.top = ringY + "px";
      requestAnimationFrame(animateRing);
    };
    animateRing();

    document.addEventListener("mousedown", () => ring.classList.add("is-down"));
    document.addEventListener("mouseup", () => ring.classList.remove("is-down"));

    const hoverTargets = "a, button, .dish-card, .feature-card, input, textarea, .menu-category-head, .gallery-grid a, .social, .float-btn";
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest && e.target.closest(hoverTargets)) ring.classList.add("is-active");
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest && e.target.closest(hoverTargets)) ring.classList.remove("is-active");
    });

    window.addEventListener("mouseleave", () => { dot.style.opacity = "0"; ring.style.opacity = "0"; });
    window.addEventListener("mouseenter", () => { dot.style.opacity = "1"; ring.style.opacity = "1"; });
  }

  /* ---------------- Scroll reveal ---------------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add("in-view"));
  } else if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el, i) => {
      el.style.setProperty("--reveal-delay", (i % 4) * 0.09 + "s");
      io.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  /* ---------------- Animated counters ---------------- */
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    const animateCount = (el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const duration = 1600;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        el.textContent = (target % 1 === 0 ? Math.floor(value) : value.toFixed(1)) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if ("IntersectionObserver" in window) {
      const cio = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            cio.unobserve(entry.target);
          }
        });
      }, { threshold: 0.6 });
      counters.forEach((el) => cio.observe(el));
    } else {
      counters.forEach(animateCount);
    }
  }

  /* ---------------- Tilt effect on cards ---------------- */
  if (!isTouch && !prefersReducedMotion) {
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${y * -8}deg) translateY(-6px)`;
      });
      card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });
  }

  /* ---------------- Marquee duplication (seamless loop) ---------------- */
  document.querySelectorAll(".marquee-track").forEach((track) => {
    track.innerHTML += track.innerHTML;
  });

  /* ---------------- Testimonials carousel ---------------- */
  const testiTrack = document.querySelector(".testi-track");
  if (testiTrack) {
    const slides = testiTrack.children.length;
    const dotsWrap = document.querySelector(".testi-dots");
    let idx = 0;
    let timer;

    if (dotsWrap) {
      dotsWrap.innerHTML = "";
      for (let i = 0; i < slides; i++) {
        const b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", "Go to testimonial " + (i + 1));
        if (i === 0) b.classList.add("is-active");
        b.addEventListener("click", () => goTo(i));
        dotsWrap.appendChild(b);
      }
    }

    function goTo(i) {
      idx = (i + slides) % slides;
      testiTrack.style.transform = `translateX(-${idx * 100}%)`;
      dotsWrap && [...dotsWrap.children].forEach((d, di) => d.classList.toggle("is-active", di === idx));
      resetTimer();
    }
    function next() { goTo(idx + 1); }
    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(next, 5500);
    }
    resetTimer();
  }

  /* ---------------- Lightbox for gallery ---------------- */
  const lightbox = document.querySelector(".lightbox");
  if (lightbox) {
    const lightboxImg = lightbox.querySelector("img");
    document.querySelectorAll(".gallery-grid a").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const src = link.getAttribute("href");
        lightboxImg.setAttribute("src", src);
        lightboxImg.setAttribute("alt", link.querySelector("img")?.alt || "Nutan Restaurant gallery photo");
        lightbox.classList.add("is-active");
        document.body.style.overflow = "hidden";
      });
    });
    const closeLightbox = () => {
      lightbox.classList.remove("is-active");
      document.body.style.overflow = "";
    };
    lightbox.querySelector(".lightbox-close")?.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });
  }

  /* ---------------- Order modal ---------------- */
  const orderModal = document.querySelector(".modal-overlay");
  if (orderModal) {
    const openers = document.querySelectorAll("[data-open-order]");
    const closeBtn = orderModal.querySelector(".modal-close");
    openers.forEach((btn) => btn.addEventListener("click", () => {
      orderModal.classList.add("is-active");
      document.body.style.overflow = "hidden";
    }));
    const closeModal = () => {
      orderModal.classList.remove("is-active");
      document.body.style.overflow = "";
    };
    closeBtn && closeBtn.addEventListener("click", closeModal);
    orderModal.addEventListener("click", (e) => { if (e.target === orderModal) closeModal(); });
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
  }

  /* ---------------- Back to top ---------------- */
  const toTopBtn = document.querySelector(".float-btn.totop");
  if (toTopBtn) {
    window.addEventListener("scroll", () => {
      toTopBtn.classList.toggle("is-visible", window.scrollY > 500);
    }, { passive: true });
    toTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ---------------- Contact form ---------------- */
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    const status = contactForm.querySelector(".form-status");
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      contactForm.querySelectorAll("[required]").forEach((input) => {
        const field = input.closest(".field");
        const isEmail = input.type === "email";
        const value = input.value.trim();
        const ok = value !== "" && (!isEmail || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
        field && field.classList.toggle("has-error", !ok);
        if (!ok) valid = false;
      });

      if (!valid) {
        status.textContent = "Please fill in all required fields correctly.";
        status.className = "form-status is-error";
        return;
      }

      status.textContent = "Thank you! Your message has been received — we'll get back to you shortly.";
      status.className = "form-status is-success";
      contactForm.reset();
      contactForm.querySelectorAll(".field").forEach((f) => f.classList.remove("has-error"));
    });

    contactForm.querySelectorAll("input, textarea").forEach((input) => {
      input.addEventListener("input", () => {
        input.closest(".field")?.classList.remove("has-error");
      });
    });
  }

  /* ---------------- Generic card filter (dishes / meals pages) ---------------- */
  document.querySelectorAll("[data-filter-bar]").forEach((bar) => {
    const targetSel = bar.dataset.filterBar;
    const cards = document.querySelectorAll(targetSel);
    bar.addEventListener("click", (e) => {
      const chip = e.target.closest(".filter-chip");
      if (!chip) return;
      bar.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      const cat = chip.dataset.filter;
      cards.forEach((card) => {
        const show = cat === "all" || card.dataset.cat === cat;
        card.style.display = show ? "" : "none";
      });
    });
  });

  /* ---------------- Current year in footer ---------------- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
