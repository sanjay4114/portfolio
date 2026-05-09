/* Sanjay Portfolio — main.js (Vanilla JS)
   - particles background
   - typing effect
   - navbar scroll state + smooth scroll polish
   - GSAP micro motion + parallax
   - skillbar animation
   - theme toggle (persisted)
   - loader
   - cursor
   - form validation + toast
*/

(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const state = {
    theme: "dark",
    typingTimer: null,
  };

  function prefersReducedMotion() {
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }

  function setTheme(theme) {
    const safe = theme === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", safe);
    state.theme = safe;
    try {
      localStorage.setItem("theme", safe);
    } catch {
      // ignore
    }

    const toggle = $("#themeToggle");
    if (toggle) {
      const icon = toggle.querySelector("i");
      if (icon) icon.className = safe === "light" ? "bi bi-sun-fill me-1" : "bi bi-moon-stars-fill me-1";
    }
  }

  function initTheme() {
    let saved = null;
    try {
      saved = localStorage.getItem("theme");
    } catch {
      // ignore
    }

    if (saved === "light" || saved === "dark") {
      setTheme(saved);
      return;
    }

    // Default to dark (requirement), but respect OS when user never set it.
    const osPrefersLight = window.matchMedia?.("(prefers-color-scheme: light)")?.matches ?? false;
    setTheme(osPrefersLight ? "light" : "dark");
  }

  function initNavbar() {
    const nav = $("#mainNav");
    if (!nav) return;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY > 16;
          nav.classList.toggle("nav-scrolled", scrolled);

          const back = $("#backToTop");
          if (back) back.classList.toggle("is-visible", window.scrollY > 520);
          ticking = false;
        });
        ticking = true;
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Close mobile nav on link click
    const navLinks = $("#navLinks");
    const navLinkEls = $$(".nav-link", nav);
    navLinkEls.forEach((a) => {
      a.addEventListener("click", () => {
        if (!navLinks) return;
        const isShown = navLinks.classList.contains("show");
        if (!isShown) return;
        const bsCollapse = bootstrap?.Collapse?.getOrCreateInstance(navLinks);
        bsCollapse?.hide();
      });
    });
  }

  function initBackToTop() {
    const btn = $("#backToTop");
    if (!btn) return;
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  function initAOS() {
    if (!window.AOS) return;
    window.AOS.init({
      duration: 850,
      easing: "ease-out-cubic",
      once: true,
      offset: 80,
      disable: prefersReducedMotion(),
    });
  }

  function initParticles() {
    const el = $("#particles");
    if (!el) return;
    if (typeof window.particlesJS !== "function") return;
    if (prefersReducedMotion()) return;

    window.particlesJS("particles", {
      particles: {
        number: { value: 52, density: { enable: true, value_area: 900 } },
        color: { value: ["#7c5cff", "#00e5ff", "#00ffa8"] },
        shape: { type: "circle" },
        opacity: { value: 0.35, random: true },
        size: { value: 2.2, random: true },
        line_linked: { enable: true, distance: 140, color: "#00e5ff", opacity: 0.18, width: 1 },
        move: { enable: true, speed: 1.2, direction: "none", random: false, straight: false, out_mode: "out" },
      },
      interactivity: {
        detect_on: "canvas",
        events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" }, resize: true },
        modes: { grab: { distance: 160, line_linked: { opacity: 0.22 } }, push: { particles_nb: 2 } },
      },
      retina_detect: true,
    });
  }

  function initTyping() {
    const target = $("#typingTarget");
    if (!target) return;

    const phrases = ["Full Stack Java Developer", "Spring Boot Developer", "React Developer"];
    const separator = " | ";

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeSpeed = 58;
    const deleteSpeed = 34;
    const holdMs = 900;

    const tick = () => {
      const current = phrases[phraseIndex];
      const shown = isDeleting ? current.slice(0, Math.max(0, charIndex - 1)) : current.slice(0, charIndex + 1);
      target.textContent = shown;

      if (!isDeleting) {
        charIndex += 1;
        if (charIndex >= current.length) {
          isDeleting = true;
          state.typingTimer = window.setTimeout(tick, holdMs);
          return;
        }
        state.typingTimer = window.setTimeout(tick, typeSpeed);
        return;
      }

      // deleting
      charIndex -= 1;
      if (charIndex <= 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        // Add separator pause by briefly showing the full composite on transitions
        target.textContent = phrases.map((p, i) => (i === phraseIndex ? "" : p)).filter(Boolean).join(separator).slice(0, 0);
        state.typingTimer = window.setTimeout(tick, 260);
        return;
      }
      state.typingTimer = window.setTimeout(tick, deleteSpeed);
    };

    // Start with a tiny delay for smoother entrance.
    state.typingTimer = window.setTimeout(tick, 420);
  }

  function initSkillBars() {
    const items = $$(".skillbar");
    if (!items.length) return;

    const animate = (el) => {
      const level = Number(el.getAttribute("data-level") || "0");
      const fill = $(".fill", el);
      const label = $(".level", el);
      if (!fill || !label) return;

      // Trigger fill
      fill.style.width = `${Math.max(0, Math.min(100, level))}%`;

      // Count up
      const start = performance.now();
      const dur = 900;
      const from = 0;
      const to = level;

      const step = (t) => {
        const p = Math.min(1, (t - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        const v = Math.round(from + (to - from) * eased);
        label.textContent = `${v}%`;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animate(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.25 }
    );

    items.forEach((el) => io.observe(el));
  }

  function initGSAP() {
    if (!window.gsap) return;
    if (prefersReducedMotion()) return;

    // Soft hero parallax based on mouse position
    const heroCard = $(".hero-card");
    const heroGradient = $(".hero-gradient");
    if (heroCard) {
      let raf = 0;
      const onMove = (e) => {
        const rect = document.body.getBoundingClientRect();
        const mx = (e.clientX / window.innerWidth - 0.5) * 2;
        const my = (e.clientY / window.innerHeight - 0.5) * 2;

        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          window.gsap.to(heroCard, {
            rotateY: mx * 5,
            rotateX: my * -4,
            x: mx * 6,
            y: my * 6,
            duration: 0.55,
            ease: "power3.out",
          });
          if (heroGradient) {
            window.gsap.to(heroGradient, {
              x: mx * 16,
              y: my * 10,
              duration: 0.75,
              ease: "power3.out",
            });
          }
        });
      };

      window.addEventListener("mousemove", onMove, { passive: true });
      window.addEventListener(
        "mouseleave",
        () => {
          window.gsap.to(heroCard, { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 0.6, ease: "power3.out" });
          if (heroGradient) window.gsap.to(heroGradient, { x: 0, y: 0, duration: 0.7, ease: "power3.out" });
        },
        { passive: true }
      );
    }

    // Scroll parallax for section backgrounds/cards (lightweight)
    const parallaxEls = [".hero-gradient", ".floating-socials"].map((s) => $(s)).filter(Boolean);
    if (parallaxEls.length) {
      let ticking = false;
      const onScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const y = window.scrollY || 0;
            parallaxEls.forEach((el, i) => {
              const f = i === 0 ? 0.08 : 0.05;
              el.style.transform = `translate3d(0, ${y * f}px, 0)`;
            });
            ticking = false;
          });
          ticking = true;
        }
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
  }

  function initCursor() {
    const dot = $(".cursor-dot");
    const ring = $(".cursor-ring");
    if (!dot || !ring) return;
    if (window.matchMedia?.("(pointer: coarse)")?.matches) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    const speed = 0.2;

    const show = () => {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    const move = (e) => {
      x = e.clientX;
      y = e.clientY;
      dot.style.transform = `translate(${x}px, ${y}px)`;
      show();
    };

    const loop = () => {
      rx += (x - rx) * speed;
      ry += (y - ry) * speed;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", move, { passive: true });
    requestAnimationFrame(loop);

    const hoverables = "a, button, .skill-card, .project-card, .contact-chip";
    $$(hoverables).forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => ring.classList.remove("is-hover"));
    });
  }

  function initInteractiveCards() {
    const cards = $$(".project-card, .skill-card");
    if (!cards.length) return;

    cards.forEach((card) => {
      const reset = () => {
        card.style.transform = "none";
      };

      card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rotateY = (x - 0.5) * 12;
        const rotateX = -(y - 0.5) * 10;
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      }, { passive: true });

      card.addEventListener("mouseleave", reset, { passive: true });
    });
  }

  function initHeroCounters() {
    const counters = $$(".stat-value");
    if (!counters.length) return;

    const animate = (el) => {
      const target = Number(el.dataset.count || "0");
      let current = 0;
      const duration = 1200;
      const start = performance.now();

      const loop = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        current = Math.floor(progress * target);
        el.textContent = String(current);
        if (progress < 1) {
          requestAnimationFrame(loop);
        } else {
          el.textContent = String(target);
        }
      };

      requestAnimationFrame(loop);
    };

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animate(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((el) => observer.observe(el));
  }

  function initProjectModal() {
    const modalEl = $("#projectModal");
    if (!modalEl || !window.bootstrap) return;

    const modalInstance = new bootstrap.Modal(modalEl);
    const title = $("#projectModalLabel");
    const category = $("#projectModalCategory");
    const description = $("#projectModalDescription");
    const features = $("#projectModalFeatures");
    const tech = $("#projectModalTech");
    const links = $("#projectModalLinks");

    const projectData = {
      taskManagement: {
        category: "Featured Project",
        title: "Task Management System",
        description: "A full-stack task management platform built with React JS, Spring Boot, and MySQL, including secure authentication and responsive UI.",
        features: [
          "Secure authentication with role-based access",
          "Full CRUD workflow for tasks",
          "Responsive dashboard UI using Bootstrap",
          "Deployed live for real-user testing",
        ],
        tech: ["React JS", "Spring Boot", "MySQL", "JWT", "Bootstrap"],
        links: [
          { label: "GitHub", url: "https://github.com/sanjay4114/Task-management-system-react", style: "outline-neon" },
          { label: "Live App", url: "https://task-management-system-react-1.onrender.com", style: "neon" },
        ],
      },
      employeeManagement: {
        category: "Full Stack App",
        title: "Employee Management System",
        description: "A React and Spring Boot application for managing employee records with search, edit, and delete functionality backed by MySQL.",
        features: [
          "Employee CRUD operations",
          "Search and filter functionality",
          "Secure REST API integration",
          "Responsive UI for mobile and desktop",
        ],
        tech: ["React", "Spring Boot", "MySQL", "REST APIs", "Bootstrap"],
        links: [
          { label: "GitHub", url: "https://github.com/sanjay4114/Employee-Management-System", style: "outline-neon" },
        ],
      },
      ongoingProjects: {
        category: "Work in Progress",
        title: "Ongoing Full Stack Projects",
        description: "Building advanced web applications with Spring Boot, React, and cloud deployment patterns for production readiness.",
        features: [
          "Microservices-ready architecture",
          "Accessible and responsive design",
          "API-first integration strategy",
          "Deployment-ready CI/CD workflows",
        ],
        tech: ["Java", "Spring Boot", "Docker", "React", "Cloud"],
        links: [
          { label: "GitHub", url: "https://github.com/sanjay4114", style: "outline-neon" },
        ],
      },
    };

    const buildTags = (items) => items.map((item) => `<span class="badge badge-tech me-1 mb-1">${item}</span>`).join("");

    $$(".project-detail-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const key = button.dataset.projectKey;
        const data = projectData[key];
        if (!data) return;

        if (title) title.textContent = data.title;
        if (category) category.textContent = data.category;
        if (description) description.textContent = data.description;
        if (features) features.innerHTML = data.features.map((item) => `<li>${item}</li>`).join("");
        if (tech) tech.innerHTML = buildTags(data.tech);
        if (links) {
          links.innerHTML = data.links
            .map(
              (item) =>
                `<a class="btn btn-sm btn-${item.style} flex-fill" href="${item.url}" target="_blank" rel="noreferrer">${item.label}</a>`
            )
            .join("");
        }

        modalInstance.show();
      });
    });
  }

  function initForm() {
    const form = $("#contactForm");
    if (!form) return;
    const toast = $("#formToast");

    const showToast = (msg, kind = "info") => {
      if (!toast) return;
      toast.textContent = msg;
      toast.className = `form-toast mt-3 ${kind}`;
    };

    let isSubmitting = false;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (isSubmitting) {
        return;
      }

      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        showToast("Please fix the highlighted fields, then try again.", "warn");
        return;
      }

      isSubmitting = true;
      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = true;
      }

      const formData = new FormData(form);
      
      // IMPORTANT: Get your free access key from https://web3forms.com/
      // and replace the string below. It will send emails directly to the address you register with.
      formData.append("access_key", "4e5c00b2-c1df-4412-a36d-39b1d6a3b4a9");
      
      // We don't need to convert to JSON for Web3Forms, it accepts FormData directly.
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();

        if (response.ok) {
          showToast("Message sent successfully!", "success");
          form.reset();
          form.classList.remove("was-validated");
        } else {
          showToast(result.message || "Failed to send message. Please try again.", "error");
        }
      } catch (error) {
        console.error('Error sending message:', error);
        showToast("Network error. Please check your connection and try again.", "error");
      } finally {
        isSubmitting = false;
        if (submitButton) {
          submitButton.disabled = false;
        }
      }
    });
  }

  function initThemeToggle() {
    const toggle = $("#themeToggle");
    if (!toggle) return;
    toggle.addEventListener("click", () => setTheme(state.theme === "dark" ? "light" : "dark"));
  }

  function initFooterYear() {
    const el = $("#year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  function initLoader() {
    const loader = $("#pageLoader");
    if (!loader) return;
    const hide = () => loader.classList.add("is-hidden");

    // Ensure loader doesn't get stuck
    window.setTimeout(hide, 2600);
    window.addEventListener("load", () => window.setTimeout(hide, 450), { once: true });
  }

  function initTerminal() {
    const input = $("#terminalInput");
    const output = $("#terminalOutput");
    if (!input || !output) return;

    // Focus input when clicking anywhere inside the terminal card
    const card = document.querySelector(".terminal-card");
    if (card) {
      card.addEventListener("click", () => {
        input.focus();
      });
    }

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault(); // Prevents default form submissions or action events
        const cmd = input.value.trim().toLowerCase();
        input.value = "";
        
        const line = document.createElement("p");
        line.className = "mb-1";
        line.innerHTML = `<span class="prompt text-neon">sanjay:~$</span> ${cmd}`;
        output.appendChild(line);

        const response = document.createElement("p");
        response.className = "dim small mb-2";

        switch(cmd) {
          case "help":
            response.innerHTML = "Available commands:<br>- <span class='text-neon'>skills</span>: View tech stack<br>- <span class='text-neon'>about</span>: Brief bio<br>- <span class='text-neon'>projects</span>: View main projects<br>- <span class='text-neon'>clear</span>: Clear terminal";
            break;
          case "skills":
            response.innerHTML = "Backend: Java, Spring Boot, REST APIs<br>Frontend: HTML, CSS, JS, React JS<br>Database: MySQL, Spring Data JPA<br>Tools: Git, Docker, Postman";
            break;
          case "about":
            response.innerHTML = "Full Stack Java Developer Intern @ Vybog, Chennai. Building scalable backend REST APIs and responsive React applications.";
            break;
          case "projects":
            response.innerHTML = "1. Task Management System<br>2. Employee Management System<br>Scroll to Projects section...";
            window.location.hash = "#projects";
            break;
          case "clear":
            output.innerHTML = "";
            return;
          default:
            response.innerHTML = `Command not found: "${cmd}". Type "help" for a list of commands.`;
        }
        output.appendChild(response);
        output.parentElement.scrollTop = output.parentElement.scrollHeight;
      }
    });
  }

  function init() {
    initTheme();
    initLoader();
    initNavbar();
    initBackToTop();
    initThemeToggle();
    initFooterYear();
    initAOS();
    initParticles();
    initTyping();
    initSkillBars();
    initGSAP();
    initInteractiveCards();
    initHeroCounters();
    initProjectModal();
    initCursor();
    initForm();
    initTerminal();
  }

  document.addEventListener("DOMContentLoaded", init, { once: true });
})();

