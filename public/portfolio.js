// ===== Personal settings: fill these in, then save =====
// Leave a value empty ("") to hide that item.
const CONFIG = {
  github: "https://github.com/carlangelomaniangap",       // e.g. "https://github.com/your-username"
  githubUser: "carlangelomaniangap",   // e.g. "your-username": shows your latest public repos in the Work section
  linkedin: "https://www.linkedin.com/in/carlangelomaniangap",     // e.g. "https://www.linkedin.com/in/your-name"
  resume: "resume.pdf",       // e.g. "resume.pdf" (place the file next to index.html)
  formEndpoint: "",  // optional, e.g. a Formspree URL. Empty = opens the visitor's email app
  booking: "",       // e.g. "https://cal.com/your-name/15min" shows a "Book a call" button
  plausible: "",     // e.g. "your-site.com": privacy-friendly analytics (Plausible)
  goatcounter: ""    // e.g. "your-code": privacy-friendly analytics (GoatCounter)
};

// ===== Project details (optional): fill in only what is true and safe to share =====
// Keys are the project names in lowercase with dashes. Empty values stay hidden.
// "result" also appears as a small line on the project card.
const PROJECT_DETAILS = {
  "coreops": { role: "", problem: "", built: "", result: "" },
  "logix": { role: "", problem: "", built: "", result: "" },
  "shopify-integration": { role: "", problem: "", built: "", result: "" },
  "workflow-automation": { role: "", problem: "", built: "", result: "" },
  "hr-workflow-integration": { role: "", problem: "", built: "", result: "" },
  "tallypoint-and-connected-applications": { role: "", problem: "", built: "", result: "" },
  "web-registration-app": { role: "", problem: "", built: "", result: "" }
};

// ===== Optional sections: leave empty to keep them hidden =====
// NOW: [{ label: "Learning", text: "Next.js and TypeScript" }]
const NOW = [];
// TESTIMONIALS: [{ quote: "…", name: "Full name", role: "Title, Company" }] (get permission first)
const TESTIMONIALS = [];

const caseStudyNode = (slug) => {
  const d = PROJECT_DETAILS[slug];
  if (!d || !(d.role || d.problem || d.built)) return null;
  const box = document.createElement("div"); box.className = "case-study";
  const h = document.createElement("h4"); h.textContent = "Case study"; box.appendChild(h);
  [["My role", d.role], ["The problem", d.problem], ["What I built", d.built], ["Result", d.result]].forEach(([k, v]) => {
    if (!v) return;
    const row = document.createElement("div"); const dt = document.createElement("span"); dt.textContent = k;
    const dd = document.createElement("p"); dd.textContent = v; row.append(dt, dd); box.appendChild(row);
  });
  return box;
};

(() => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
      });
    });
  }

  const revealItems = document.querySelectorAll(".reveal");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Scroll to page sections without leaving a #fragment in the address bar.
  // Shareable project dialogs use a query parameter instead.
  const cleanSectionUrl = () => history.replaceState(history.state, "", location.pathname + location.search);
  const scrollToHash = (hash, behavior = reduceMotion ? "auto" : "smooth") => {
    if (hash === "#top") {
      window.scrollTo({ top: 0, behavior });
      cleanSectionUrl();
      return true;
    }
    const target = document.querySelector(hash);
    if (!target) return false;
    target.scrollIntoView({ behavior, block: "start" });
    cleanSectionUrl();
    return true;
  };
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href^='#']");
    if (!link) return;
    const hash = link.getAttribute("href");
    if (!hash || hash === "#" || !scrollToHash(hash)) return;
    event.preventDefault();
  });
  if (location.hash && !location.hash.startsWith("#project-")) {
    const initialHash = location.hash;
    requestAnimationFrame(() => scrollToHash(initialHash, "auto"));
  }

  if ("IntersectionObserver" in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const copyButton = document.querySelector("#copy-email");
  const copyStatus = document.querySelector("#copy-status");

  if (copyButton && copyStatus) {
    copyButton.addEventListener("click", async () => {
      const email = copyButton.dataset.email;

      try {
        await navigator.clipboard.writeText(email);
        copyStatus.textContent = "Email address copied to clipboard.";
      } catch {
        copyStatus.textContent = `Email: ${email}`;
      }
    });
  }
  // ===== Upgrades =====
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const header = document.querySelector(".site-header");
  const bar = document.querySelector(".progress");
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Highlight current section in the nav
  const navAnchors = [...document.querySelectorAll(".nav-links a[href^='#']")];
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navAnchors.forEach((a) => a.classList.toggle("is-current", a.getAttribute("href") === "#" + entry.target.id && !a.classList.contains("nav-contact")));
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    document.querySelectorAll("main section[id]").forEach((s) => spy.observe(s));
  }

  // Project filters
  const filters = document.querySelectorAll(".filter");
  const cards = document.querySelectorAll(".project-card");
  const fstate = { cat: "all", tag: "" };
  const tagsOf = (card) => [...card.querySelectorAll(".tag-row span")].map((x) => x.textContent.trim());
  const applyFilters = () => {
    cards.forEach((card) => {
      const show = (fstate.cat === "all" || card.dataset.cat.split(" ").includes(fstate.cat)) && (!fstate.tag || tagsOf(card).includes(fstate.tag));
      card.hidden = !show; card.classList.remove("is-entering");
      if (show) card.classList.add("is-visible", "is-entering");
    });
    const empty = document.querySelector("#filter-empty");
    if (empty) empty.hidden = [...cards].some((c) => !c.hidden);
  };
  filters.forEach((btn) => btn.addEventListener("click", () => {
    filters.forEach((b) => { const on = b === btn; b.classList.toggle("is-active", on); b.setAttribute("aria-pressed", String(on)); });
    fstate.cat = btn.dataset.filter; applyFilters();
  }));
  // Second row: filter by tag (built from the project cards themselves)
  (() => {
    const tags = [...new Set([...cards].flatMap(tagsOf))];
    const catRow = document.querySelector(".filters"); if (!catRow || tags.length < 2) return;
    const row = document.createElement("div"); row.className = "filters tag-filters reveal is-visible"; row.setAttribute("role", "group"); row.setAttribute("aria-label", "Filter projects by tag");
    const lab = document.createElement("span"); lab.className = "tag-filter-label"; lab.textContent = "Tag"; row.appendChild(lab);
    tags.forEach((t) => {
      const b = document.createElement("button"); b.type = "button"; b.className = "filter"; b.textContent = t; b.setAttribute("aria-pressed", "false");
      b.addEventListener("click", () => {
        fstate.tag = fstate.tag === t ? "" : t;
        row.querySelectorAll(".filter").forEach((x) => { const on = x.textContent === fstate.tag; x.classList.toggle("is-active", on); x.setAttribute("aria-pressed", String(on)); });
        applyFilters();
      });
      row.appendChild(b);
    });
    catRow.after(row);
    const none = document.createElement("p"); none.id = "filter-empty"; none.className = "section-note"; none.hidden = true; none.textContent = "No projects match both filters. Try a different tag or category.";
    document.querySelector(".project-grid").before(none);
  })();

  // Count-up for the "06+" stat once the hero is on screen
  const stat = [...document.querySelectorAll(".mini-stats b")].find((b) => b.textContent.trim() === "06");
  if (stat && !reduceMotion) {
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / 1200, 1);
      stat.textContent = String(Math.round(6 * (1 - Math.pow(1 - t, 3)))).padStart(2, "0");
      if (t < 1) requestAnimationFrame(tick);
    };
    stat.textContent = "00";
    requestAnimationFrame(tick);
  }

  // Mouse-driven effects (desktop only): glow, card tilt, chip parallax, card spotlight
  if (finePointer && !reduceMotion) {
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);
    window.addEventListener("pointermove", (e) => {
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      glow.classList.add("on");
    }, { passive: true });
    document.addEventListener("pointerleave", () => glow.classList.remove("on"));

    const visual = document.querySelector(".hero-visual");
    const core = document.querySelector(".hero-visual .core-card");
    const chips = document.querySelectorAll(".floating-chip");
    if (visual && core) {
      visual.addEventListener("pointermove", (e) => {
        const r = visual.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        core.style.transform = `perspective(900px) rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 10).toFixed(2)}deg)`;
        chips.forEach((chip, i) => { const d = (i % 2 ? -1 : 1) * (10 + i * 3); chip.style.translate = `${x * d}px ${y * d}px`; });
      });
      visual.addEventListener("pointerleave", () => {
        core.style.transform = "";
        chips.forEach((chip) => { chip.style.translate = ""; });
      });
    }

    document.querySelectorAll(".project-card, .skill-panel").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    });
  }
  // ===== Upgrades round 2 =====
  // Typing effect (static first word when motion is reduced)
  const typed = document.querySelector("#typed");
  if (typed && !reduceMotion) {
    const words = ["JavaScript", "React.js", "Next.js", "PHP", "Laravel", "MySQL", "n8n", "Shopify", "Odoo"];
    let w = 0, c = 0, deleting = false;
    const step = () => {
      const word = words[w];
      c += deleting ? -1 : 1;
      typed.textContent = word.slice(0, c);
      let delay = deleting ? 45 : 95;
      if (!deleting && c === word.length) { deleting = true; delay = 1400; }
      else if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; delay = 350; }
      setTimeout(step, delay);
    };
    typed.textContent = "";
    setTimeout(step, 600);
  }

  // Back to top
  const toTop = document.querySelector("#to-top");
  window.addEventListener("scroll", () => toTop.classList.toggle("show", window.scrollY > 700), { passive: true });
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

  // Project detail dialog
  const dialog = document.querySelector("#project-dialog");
  const dialogBody = document.querySelector("#dialog-body");
  const disclaimer = document.querySelector(".portfolio-disclaimer");
  let lastCard = null;
  const slugOf = (card) => card.querySelector("h3").textContent.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const stepProject = (dir) => {
    const list = [...cards].filter((c) => !c.hidden);
    const i = list.indexOf(lastCard);
    if (i > -1 && list.length > 1) openProject(list[(i + dir + list.length) % list.length]);
  };
  const openProject = (card) => {
    lastCard = card;
    dialogBody.innerHTML = "";
    ["project-top", "project-visual", "project-info"].forEach((cls) => {
      const part = card.querySelector("." + cls);
      if (part) dialogBody.appendChild(part.cloneNode(true));
    });
    { const cs = caseStudyNode(slugOf(card)); if (cs) dialogBody.appendChild(cs); }
    if (disclaimer) { const n = document.createElement("p"); n.className = "dialog-note"; n.textContent = disclaimer.textContent; dialogBody.appendChild(n); }
    const actions = document.createElement("div");
    actions.className = "dialog-actions";
    actions.innerHTML = '<a class="button button-primary" href="#contact">Discuss a project</a><button type="button" class="button button-quiet" data-copylink>Copy link</button><span class="dialog-spacer"></span><button type="button" class="button button-quiet" data-dir="-1" aria-label="Previous project">‹ Previous</button><button type="button" class="button button-quiet" data-dir="1" aria-label="Next project">Next ›</button>';
    actions.firstChild.addEventListener("click", () => dialog.close());
    actions.querySelectorAll("[data-dir]").forEach((b) => b.addEventListener("click", () => stepProject(Number(b.dataset.dir))));
    actions.querySelector("[data-copylink]").addEventListener("click", async () => {
      const shareUrl = new URL(location.href);
      shareUrl.hash = "";
      shareUrl.searchParams.set("project", slugOf(card));
      const link = shareUrl.toString();
      try { await navigator.clipboard.writeText(link); toast("Project link copied"); } catch { toast("Link: " + link); }
    });
    dialogBody.appendChild(actions);
    const projectUrl = new URL(location.href);
    projectUrl.hash = "";
    projectUrl.searchParams.set("project", slugOf(card));
    history.replaceState(null, "", projectUrl.pathname + projectUrl.search);
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
  };
  cards.forEach((card) => {
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-haspopup", "dialog");
    card.addEventListener("click", () => openProject(card));
    card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openProject(card); } });
  });
  document.querySelector("#dialog-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener("close", () => lastCard && lastCard.focus());
  dialog.addEventListener("close", () => {
    const cleanUrl = new URL(location.href);
    cleanUrl.hash = "";
    cleanUrl.searchParams.delete("project");
    history.replaceState(null, "", cleanUrl.pathname + cleanUrl.search);
  });
  dialog.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") stepProject(1); else if (e.key === "ArrowLeft") stepProject(-1); });

  // Magnetic buttons (desktop)
  if (finePointer && !reduceMotion) {
    document.querySelectorAll(".button").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        btn.style.translate = `${((e.clientX - r.left) / r.width - 0.5) * 10}px ${((e.clientY - r.top) / r.height - 0.5) * 8}px`;
      });
      btn.addEventListener("pointerleave", () => { btn.style.translate = ""; });
    });
  }

  // Copy-email confirmation on the button itself
  const copyBtn = document.querySelector("#copy-email");
  if (copyBtn) {
    const original = copyBtn.innerHTML;
    copyBtn.addEventListener("click", () => {
      copyBtn.classList.add("is-copied");
      copyBtn.innerHTML = 'Copied <span aria-hidden="true">✓</span>';
      setTimeout(() => { copyBtn.classList.remove("is-copied"); copyBtn.innerHTML = original; }, 2000);
    });
  }
  // ===== Upgrades round 3 =====
  // Light / dark theme (dark is the original look)
  const root = document.documentElement;
  const themeBtn = document.querySelector("#theme-toggle");
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const syncTheme = () => {
    const light = root.dataset.theme === "light";
    themeBtn.innerHTML = `<span aria-hidden="true">${light ? "☾" : "☀"}</span>`;
    themeBtn.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
    if (themeMeta) themeMeta.content = light ? "#F7F8F3" : "#10141D";
  };
  syncTheme();
  themeBtn.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
    try { localStorage.setItem("theme", root.dataset.theme); } catch {}
    syncTheme();
  });

  // Click a skill to highlight the projects that mention it
  const skillStatus = document.querySelector("#skill-status");
  const pills = document.querySelectorAll(".skill-list span");
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  let picked = null;
  const clearPick = () => {
    picked = null;
    pills.forEach((p) => { p.classList.remove("is-picked"); p.setAttribute("aria-pressed", "false"); });
    cards.forEach((c) => c.classList.remove("is-match", "is-dim"));
    document.querySelectorAll(".tag-row span, .stack-row span").forEach((t) => t.classList.remove("is-picked"));
    skillStatus.textContent = "";
  };
  pills.forEach((pill) => {
    pill.tabIndex = 0;
    pill.setAttribute("role", "button");
    pill.setAttribute("aria-pressed", "false");
    const pick = () => {
      if (picked === pill) return clearPick();
      clearPick();
      picked = pill;
      pill.classList.add("is-picked");
      pill.setAttribute("aria-pressed", "true");
      const name = pill.textContent.trim();
      const re = new RegExp("(^|[^A-Za-z0-9])" + esc(name) + "($|[^A-Za-z0-9])", "i");
      let count = 0;
      cards.forEach((card) => {
        const hit = re.test(card.textContent);
        card.classList.toggle("is-match", hit);
        card.classList.toggle("is-dim", !hit);
        if (hit) { count++; card.classList.add("is-visible"); }
        card.querySelectorAll(".tag-row span, .stack-row span").forEach((t) => t.classList.toggle("is-picked", hit && t.textContent.trim().toLowerCase() === name.toLowerCase()));
      });
      skillStatus.innerHTML = count
        ? `${name}: mentioned in ${count} project${count > 1 ? "s" : ""}. <a href="#work">View projects</a><button type="button">Clear</button>`
        : `${name} is part of my wider skills and isn't named in a project card. <button type="button">Clear</button>`;
      skillStatus.querySelector("button").addEventListener("click", clearPick);
    };
    pill.addEventListener("click", pick);
    pill.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } });
  });

  // Timeline draws itself as you scroll
  const timeline = document.querySelector(".timeline");
  if (timeline && !reduceMotion) {
    const items = timeline.querySelectorAll(".timeline-item");
    const draw = () => {
      const r = timeline.getBoundingClientRect();
      const line = window.innerHeight * 0.65;
      const pct = Math.max(0, Math.min(1, (line - r.top) / r.height));
      timeline.style.setProperty("--draw", (pct * 100).toFixed(1) + "%");
      items.forEach((item) => item.classList.toggle("is-reached", item.getBoundingClientRect().top < line));
    };
    window.addEventListener("scroll", draw, { passive: true });
    window.addEventListener("resize", draw);
    draw();
  } else if (timeline) {
    timeline.querySelectorAll(".timeline-item").forEach((i) => i.classList.add("is-reached"));
  }
  // ===== Upgrades round 4 =====
  const $q = (s) => document.querySelector(s);

  // Resume + social links, shown only when configured
  if (CONFIG.resume) { const r = $q("#resume-btn"); r.href = CONFIG.resume; r.hidden = false; }
  const socials = [["GitHub", CONFIG.github], ["LinkedIn", CONFIG.linkedin]].filter(([, u]) => u);
  if (socials.length) {
    const box = $q("#social-links");
    socials.forEach(([label, url]) => { const a = document.createElement("a"); a.href = url; a.textContent = label; a.target = "_blank"; a.rel = "noopener noreferrer"; box.appendChild(a); });
    box.hidden = false;
  }

  // Headline intro: lines reveal one after another
  const h1 = $q(".hero h1");
  if (h1 && !reduceMotion) {
    [...h1.childNodes].forEach((node) => {
      if (node.nodeType === 3 && node.textContent.trim()) {
        const s = document.createElement("span"); s.className = "hl"; s.textContent = node.textContent; node.replaceWith(s);
      } else if (node.nodeName === "SPAN") node.classList.add("hl", "hl-2");
    });
  }

  // Hero: data packets travel between CoreOps and each connected tool
  const visualEl = $q(".hero-visual"), flow = visualEl && visualEl.querySelector(".flow-lines");
  const coreEl = visualEl && visualEl.querySelector(".core-card");
  if (flow && coreEl) {
    const NS = "http://www.w3.org/2000/svg";
    const chipList = [...visualEl.querySelectorAll(".floating-chip")];
    const parts = chipList.map(() => {
      const line = document.createElementNS(NS, "line"), dot = document.createElementNS(NS, "circle");
      dot.setAttribute("r", "3.5"); flow.append(line, dot); return { line, dot };
    });
    let running = false;
    const draw = (time) => {
      const vr = visualEl.getBoundingClientRect(), cr = coreEl.getBoundingClientRect();
      const cx = cr.left + cr.width / 2 - vr.left, cy = cr.top + cr.height / 2 - vr.top;
      chipList.forEach((chip, i) => {
        const r = chip.getBoundingClientRect(), x = r.left + r.width / 2 - vr.left, y = r.top + r.height / 2 - vr.top;
        const { line, dot } = parts[i];
        line.setAttribute("x1", cx); line.setAttribute("y1", cy); line.setAttribute("x2", x); line.setAttribute("y2", y);
        if (reduceMotion) { dot.style.display = "none"; return; }
        let t = ((time / 2800) + i * 0.27) % 1; if (i % 2) t = 1 - t;
        dot.setAttribute("cx", cx + (x - cx) * t); dot.setAttribute("cy", cy + (y - cy) * t);
        dot.style.opacity = Math.sin(Math.PI * t).toFixed(2);
      });
    };
    const loop = (time) => { if (!running) return; draw(time); requestAnimationFrame(loop); };
    if (reduceMotion) { draw(0); window.addEventListener("resize", () => draw(0)); }
    else if ("IntersectionObserver" in window) {
      new IntersectionObserver(([e]) => { const was = running; running = e.isIntersecting; if (running && !was) requestAnimationFrame(loop); }).observe(visualEl);
    } else { running = true; requestAnimationFrame(loop); }
  }

  // Contact form: validate, then send or open the visitor's email app
  const form = $q("#contact-form"), formStatus = $q("#form-status");
  const EMAIL = $q("#copy-email").dataset.email;
  const setErr = (id, msg) => { $q("#e-" + id).textContent = msg; const input = $q("#f-" + id); input.closest(".field").classList.toggle("has-error", !!msg); input.setAttribute("aria-invalid", msg ? "true" : "false"); if (msg) input.setAttribute("aria-describedby", "e-" + id); };
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    if (data.company) return;
    const name = data.name.trim(), email = data.email.trim(), message = data.message.trim();
    setErr("name", name ? "" : "Enter your name.");
    setErr("email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Enter a valid email address, like name@example.com.");
    setErr("message", message.length >= 10 ? "" : "Write at least a short sentence (10 characters).");
    const bad = form.querySelector(".has-error input, .has-error textarea");
    if (bad) { bad.focus(); formStatus.textContent = ""; return; }
    if (CONFIG.formEndpoint) {
      formStatus.textContent = "Sending…";
      try {
        const res = await fetch(CONFIG.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ name, email, topic: data.topic, message }) });
        if (!res.ok) throw new Error();
        form.reset(); formStatus.textContent = "Message sent. Thank you, I'll reply by email.";
      } catch { formStatus.textContent = `Couldn't send the message. Please email ${EMAIL} directly.`; }
    } else {
      const subject = `Portfolio message: ${data.topic}`;
      const body = `${message}\n\nFrom: ${name} (${email})`;
      formStatus.textContent = "Opening your email app…";
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
  });
  form.querySelectorAll("input, textarea").forEach((f) => f.addEventListener("input", () => { if (f.id.startsWith("f-")) setErr(f.id.slice(2), ""); }));

  // Command menu (Ctrl/Cmd + K)
  const cmd = $q("#cmd"), cmdInput = $q("#cmd-input"), cmdList = $q("#cmd-list"), cmdTrigger = $q("#cmd-trigger");
  if (/Mac|iPhone|iPad/.test(navigator.platform)) cmdTrigger.textContent = "⌘ K";
  const goTo = (sel) => () => document.querySelector(sel).scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  const commands = [
    ...[["About", "#about"], ["Selected work", "#work"], ["Workflow demo", "#workflow"], ["Skills", "#skills"], ["Experience", "#experience"], ["Contact", "#contact"]].map(([l, s]) => ({ label: "Go to " + l, hint: "Section", run: goTo(s) })),
    ...[...cards].map((card) => ({ label: "Open project: " + card.querySelector("h3").textContent, hint: "Project", run: () => openProject(card) })),
    { label: "Toggle light / dark theme", hint: "Action", run: () => themeBtn.click() },
    { label: "Copy email address", hint: "Action", run: () => copyBtn.click() },
    { label: "Share portfolio", hint: "Action", run: () => document.querySelector("#share-btn").click() },
    { label: "Open at-a-glance summary", hint: "Panel", run: () => openSummary() },
    { label: "Display settings (theme, text size, motion)", hint: "Panel", run: () => openSettings() },
    { label: "Keyboard shortcuts", hint: "Panel", run: () => helpDlg.showModal() },
    { label: "Back to top", hint: "Action", run: () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }) },
    ...(CONFIG.resume ? [{ label: "Download résumé", hint: "Link", run: () => $q("#resume-btn").click() }] : []),
    ...socials.map(([l, u]) => ({ label: "Open " + l, hint: "Link", run: () => window.open(u, "_blank", "noopener") })),
  ];
  let shown = [], sel = 0;
  const render = () => {
    const q = cmdInput.value.trim().toLowerCase();
    shown = commands.filter((c) => c.label.toLowerCase().includes(q));
    sel = Math.min(sel, Math.max(shown.length - 1, 0));
    cmdList.innerHTML = "";
    if (!shown.length) { const li = document.createElement("li"); li.className = "cmd-empty"; li.textContent = "No matching commands."; cmdList.appendChild(li); return; }
    shown.forEach((c, i) => {
      const li = document.createElement("li"); li.setAttribute("role", "option"); li.id = "cmd-" + i; li.setAttribute("aria-selected", String(i === sel));
      li.innerHTML = `<span></span><small></small>`; li.firstChild.textContent = c.label; li.lastChild.textContent = c.hint;
      li.addEventListener("click", () => run(i)); li.addEventListener("pointermove", () => { if (sel !== i) { sel = i; render(); } });
      cmdList.appendChild(li);
    });
    cmdInput.setAttribute("aria-activedescendant", "cmd-" + sel);
    if (cmdList.children[sel]) cmdList.children[sel].scrollIntoView({ block: "nearest" });
  };
  const run = (i) => { const c = shown[i]; if (!c) return; cmd.close(); setTimeout(c.run, 60); };
  const openCmd = () => { if (cmd.open) return; cmdInput.value = ""; sel = 0; render(); cmd.showModal(); cmdInput.focus(); };
  cmdTrigger.addEventListener("click", openCmd);
  document.addEventListener("keydown", (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); if (cmd.open) cmd.close(); else openCmd(); } });
  cmdInput.addEventListener("input", () => { sel = 0; render(); });
  cmdInput.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(sel + 1, shown.length - 1); render(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(sel - 1, 0); render(); }
    else if (e.key === "Enter") { e.preventDefault(); run(sel); }
  });
  cmd.addEventListener("click", (e) => { if (e.target === cmd) cmd.close(); });
  // ===== Upgrades round 5 =====
  // Hero background: a quiet node network that reacts to the cursor
  const canvas = document.querySelector(".net-bg");
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d"), heroEl = canvas.parentElement;
    let w = 0, h = 0, dots = [], rgb = "230,36,41", mouse = { x: -999, y: -999 }, live = false;
    const readColor = () => {
      const c = getComputedStyle(root).getPropertyValue("--accent").trim();
      const m = /^#([0-9a-f]{6})$/i.exec(c);
      if (m) rgb = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16)).join(",");
    };
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2), r = heroEl.getBoundingClientRect();
      w = r.width; h = r.height; canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(70, Math.max(24, (w * h) / 16000)));
      dots = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25 }));
      paint();
    };
    const paint = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < dots.length; i++) {
        const a = dots[i];
        for (let j = i + 1; j < dots.length; j++) {
          const b = dots[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) { ctx.strokeStyle = `rgba(${rgb},${(1 - d / 130) * .22})`; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        }
        const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (dm < 170) { ctx.strokeStyle = `rgba(${rgb},${(1 - dm / 170) * .5})`; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
        ctx.fillStyle = `rgba(${rgb},.55)`; ctx.beginPath(); ctx.arc(a.x, a.y, 1.6, 0, 6.283); ctx.fill();
      }
    };
    const tickNet = () => {
      if (!live) return;
      dots.forEach((d) => { d.x += d.vx; d.y += d.vy; if (d.x < 0 || d.x > w) d.vx *= -1; if (d.y < 0 || d.y > h) d.vy *= -1; });
      paint(); requestAnimationFrame(tickNet);
    };
    readColor(); resize();
    window.addEventListener("resize", resize);
    themeBtn.addEventListener("click", () => { readColor(); paint(); });
    window.addEventListener("themechange", () => { readColor(); paint(); });
    if (!reduceMotion && "IntersectionObserver" in window) {
      window.addEventListener("pointermove", (e) => { const r = heroEl.getBoundingClientRect(); mouse = { x: e.clientX - r.left, y: e.clientY - r.top }; }, { passive: true });
      new IntersectionObserver(([e]) => { const was = live; live = e.isIntersecting && !document.hidden; if (live && !was) requestAnimationFrame(tickNet); }).observe(heroEl);
      document.addEventListener("visibilitychange", () => { if (document.hidden) live = false; });
    }
  }

  // Hero chips: select one to see what it does
  const chipInfo = document.querySelector("#chip-info");
  const CHIP_TEXT = {
    shopify: ["Shopify", "Order management, inventory transfers, abandoned checkouts, and product pull-outs, connected to CoreOps."],
    odoo: ["Odoo", "Time-off approval and synchronization flows between CoreOps and Odoo."],
    n8n: ["n8n", "Automations connected to CoreOps for execution monitoring, SMS logs, customer messaging records, and marketing attribution."],
    logix: ["LogiX", "Order booking and delivery management connected to the Tinapaislife website, including rider assignment, delivery tracking, and proof uploads."],
  };
  const heroChips = document.querySelectorAll(".floating-chip");
  const closeChip = () => { chipInfo.hidden = true; heroChips.forEach((c) => { c.classList.remove("is-open"); c.setAttribute("aria-expanded", "false"); }); };
  heroChips.forEach((chip) => {
    const key = chip.textContent.trim().split(/\s+/).pop().toLowerCase();
    if (!CHIP_TEXT[key]) return;
    chip.tabIndex = 0; chip.setAttribute("role", "button"); chip.setAttribute("aria-expanded", "false");
    const toggle = (e) => {
      e.stopPropagation();
      const wasOpen = chip.classList.contains("is-open");
      closeChip();
      if (wasOpen) return;
      chipInfo.innerHTML = ""; const t = document.createElement("h3"), p = document.createElement("p");
      t.textContent = CHIP_TEXT[key][0]; p.textContent = CHIP_TEXT[key][1]; chipInfo.append(t, p);
      chipInfo.hidden = false; chip.classList.add("is-open"); chip.setAttribute("aria-expanded", "true");
    };
    chip.addEventListener("click", toggle);
    chip.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(e); } });
  });
  document.addEventListener("click", closeChip);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeChip(); });

  // Share button (uses the device's share sheet when available)
  const shareBtn = document.querySelector("#share-btn");
  shareBtn.addEventListener("click", async () => {
    const data = { title: document.title, text: "Portfolio of Carl Angelo M. Maniangap, Software Developer", url: location.href.split("#")[0] };
    try {
      if (navigator.share) await navigator.share(data);
      else { await navigator.clipboard.writeText(data.url); copyStatus.textContent = "Portfolio link copied to clipboard."; }
    } catch (err) { if (err && err.name !== "AbortError") copyStatus.textContent = `Link: ${data.url}`; }
  });

  // Cursor ring (desktop mouse only)
  if (finePointer && !reduceMotion) {
    const ring = document.createElement("div"); ring.className = "cursor-ring"; document.body.appendChild(ring);
    let tx = 0, ty = 0, rx = 0, ry = 0, spinning = false;
    const follow = () => { rx += (tx - rx) * .2; ry += (ty - ry) * .2; ring.style.transform = `translate(${rx}px, ${ry}px)`; if (Math.abs(tx - rx) + Math.abs(ty - ry) > .1) requestAnimationFrame(follow); else spinning = false; };
    window.addEventListener("pointermove", (e) => {
      tx = e.clientX; ty = e.clientY; ring.classList.add("on");
      ring.classList.toggle("big", !!e.target.closest("a, button, [role='button'], .project-card, input, textarea, select"));
      if (!spinning) { spinning = true; requestAnimationFrame(follow); }
    }, { passive: true });
    document.addEventListener("pointerleave", () => ring.classList.remove("on"));
  }

  // Open a project from a clean share link such as ?project=coreops.
  const sharedProject = new URLSearchParams(location.search).get("project") || (location.hash.startsWith("#project-") ? location.hash.slice(9) : "");
  if (sharedProject) {
    const target = [...cards].find((c) => slugOf(c) === sharedProject);
    if (target) setTimeout(() => openProject(target), 400);
  }
  // ===== Upgrades round 6: UI =====
  const closeOnBackdrop = (d) => d.addEventListener("click", (e) => { if (e.target === d || e.target.closest("[data-close]")) d.close(); });

  // At-a-glance summary, built from the page content so it never goes out of date
  const summaryDlg = $q("#summary"), summaryBody = $q("#summary-body");
  const mk = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const block = (title) => { const b = mk("section", "sum-block"); b.appendChild(mk("h3", "", title)); return b; };
  const buildSummary = () => {
    summaryBody.innerHTML = "";
    const top = mk("div");
    top.append(mk("h2", "sum-name", document.title.split("—")[0].trim()), mk("p", "sum-role", ($q(".hero .status, .hero .eyebrow") || { textContent: "" }).textContent.replace(/\s+/g, " ").trim()));
    const lead = $q(".about-content .lead"); if (lead) top.appendChild(mk("p", "sum-lead", lead.textContent.trim()));
    summaryBody.appendChild(top);

    const exp = block("Experience"), expUl = mk("ul");
    document.querySelectorAll(".timeline-item").forEach((it) => {
      const li = mk("li"); li.appendChild(mk("b", "", it.querySelector("h3").textContent));
      li.appendChild(mk("small", "", `${it.querySelector(".timeline-company").textContent} · ${it.querySelector(".timeline-date").textContent}`)); expUl.appendChild(li);
    });
    exp.appendChild(expUl); summaryBody.appendChild(exp);

    const sk = block("Skills"), skUl = mk("ul");
    document.querySelectorAll(".skill-panel").forEach((p) => {
      const li = mk("li", "sum-skill"); li.appendChild(mk("b", "", p.querySelector("h3").textContent));
      const chips = mk("div", "sum-chips"); p.querySelectorAll(".skill-list span").forEach((s) => chips.appendChild(mk("span", "", s.textContent))); li.appendChild(chips); skUl.appendChild(li);
    });
    sk.appendChild(skUl); summaryBody.appendChild(sk);

    const pr = block("Projects"), prUl = mk("ul");
    cards.forEach((card) => {
      const li = mk("li"); li.appendChild(mk("b", "", card.querySelector("h3").textContent));
      const first = card.querySelector(".project-info p").textContent.split(/(?<=\.)\s/)[0];
      li.appendChild(mk("small", "", first));
      li.style.cursor = "pointer"; li.addEventListener("click", () => { summaryDlg.close(); openProject(card); });
      prUl.appendChild(li);
    });
    pr.appendChild(prUl); summaryBody.appendChild(pr);
  };
  const openSummary = () => { if (!summaryDlg.open) { buildSummary(); summaryDlg.showModal(); } };
  $q("#sum-email").href = "mailto:" + $q("#copy-email").dataset.email;
  $q("#sum-copy").addEventListener("click", (e) => { copyBtn.click(); e.currentTarget.textContent = "Copied ✓"; setTimeout(() => { e.currentTarget.textContent = "Copy email"; }, 2000); });
  $q("#sum-print").addEventListener("click", () => { document.body.classList.add("print-summary"); window.print(); });
  window.addEventListener("afterprint", () => document.body.classList.remove("print-summary"));
  [$q("#summary-btn"), $q("#bar-summary")].forEach((b) => b.addEventListener("click", openSummary));
  closeOnBackdrop(summaryDlg);

  // Display settings: theme, text size, motion (saved on this device)
  const settingsDlg = $q("#settings");
  const defaults = { size: "m", motion: "full" };
  let prefs = { ...defaults };
  try { prefs = { ...defaults, ...JSON.parse(localStorage.getItem("prefs") || "{}") }; } catch {}
  const zoomFor = { s: 0.92, m: 1, l: 1.12 };
  const themeMode = () => { try { return localStorage.getItem("theme") || "dark"; } catch { return "dark"; } };
  const applyTheme = (mode) => {
    try { localStorage.setItem("theme", mode); } catch {}
    root.dataset.theme = mode === "system" ? (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark") : mode;
    syncTheme(); window.dispatchEvent(new Event("themechange"));
  };
  const syncSettings = () => {
    settingsDlg.querySelectorAll("[data-pref]").forEach((g) => {
      const cur = g.dataset.pref === "theme" ? themeMode() : prefs[g.dataset.pref];
      g.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.value === cur)));
    });
  };
  const applyPrefs = () => {
    root.dataset.motion = prefs.motion; document.body.style.zoom = zoomFor[prefs.size] === 1 ? "" : zoomFor[prefs.size];
    try { localStorage.setItem("prefs", JSON.stringify(prefs)); } catch {}
    syncSettings();
  };
  settingsDlg.querySelectorAll("[data-pref] button").forEach((b) => b.addEventListener("click", () => {
    const key = b.closest("[data-pref]").dataset.pref;
    if (key === "theme") applyTheme(b.dataset.value); else { prefs[key] = b.dataset.value; applyPrefs(); }
    syncSettings();
  }));
  $q("#prefs-reset").addEventListener("click", () => { prefs = { ...defaults }; applyTheme("dark"); applyPrefs(); });
  matchMedia("(prefers-color-scheme: light)").addEventListener("change", () => { if (themeMode() === "system") applyTheme("system"); });
  themeBtn.addEventListener("click", syncSettings);
  const openSettings = () => { if (!settingsDlg.open) { syncSettings(); settingsDlg.showModal(); } };
  $q("#settings-btn").addEventListener("click", openSettings);
  closeOnBackdrop(settingsDlg);
  applyPrefs();

  // Side dot navigation + bottom bar follow the current section
  const trackers = document.querySelectorAll("#dot-nav a, #bottom-bar a");
  if ("IntersectionObserver" in window) {
    const watch = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) trackers.forEach((a) => a.classList.toggle("is-current", a.dataset.target === e.target.id)); });
    }, { rootMargin: "-40% 0px -55% 0px" });
    ["home", "about", "work", "workflow", "skills", "experience", "contact"].forEach((id) => { const s = document.getElementById(id); if (s) watch.observe(s); });
  }
  // ===== Update: workflow demo =====
  const SCEN = {
    shopify: { steps: [
      { sys: "Shopify", title: "Order placed", detail: "A customer completes checkout on the online store.", log: "Order received from the online store" },
      { sys: "CoreOps", title: "Order synced", detail: "The order reaches CoreOps for order management.", log: "Order record created in CoreOps" },
      { sys: "CoreOps", title: "Inventory updated", detail: "Stock levels and transfers are adjusted.", log: "Inventory adjusted for the ordered items" },
      { sys: "CoreOps", title: "Ready for fulfillment", detail: "The team can see the order and act on it.", log: "Order marked ready for fulfillment" },
    ] },
    logix: { steps: [
      { sys: "Tinapaislife", title: "Order booked", detail: "An order is booked from the website.", log: "Order booking received from the website" },
      { sys: "LogiX", title: "Booking created", detail: "The booking appears in the delivery app.", log: "Delivery booking created" },
      { sys: "LogiX", title: "Rider assigned", detail: "A rider is assigned to the delivery.", log: "Rider assigned" },
      { sys: "LogiX", title: "Delivery tracked", detail: "Progress is tracked until it is delivered.", log: "Delivery status updated" },
      { sys: "LogiX", title: "Proof uploaded", detail: "Proof of delivery is attached to the order.", log: "Proof of delivery uploaded" },
      { sys: "LogiX", title: "Report updated", detail: "Delivery reports include the finished order.", log: "Delivery report updated" },
    ] },
    timeoff: { steps: [
      { sys: "CoreOps", title: "Request submitted", detail: "An employee files a time-off request.", log: "Time-off request submitted" },
      { sys: "CoreOps", title: "Approval review", detail: "The request goes through the approval workflow.", log: "Request routed for approval" },
      { sys: "Odoo", title: "Validated in Odoo", detail: "The approved request is validated in Odoo.", log: "Request validated" },
      { sys: "CoreOps", title: "Synced back", detail: "The result is synchronized back to CoreOps.", log: "Approval status synchronized" },
      { sys: "CoreOps", title: "Schedule updated", detail: "Attendance and schedule monitoring reflect the leave.", log: "Schedule updated" },
    ] },
    sms: { steps: [
      { sys: "CoreOps", title: "Template ready", detail: "A reusable message template is selected. Templates can be imported from Excel or drafted with optional OpenAI assistance.", log: "Message template selected" },
      { sys: "n8n", title: "Workflow triggered", detail: "An n8n workflow starts the message run.", log: "Workflow triggered" },
      { sys: "n8n", title: "Message sent", detail: "The customer message is sent.", log: "Customer message sent" },
      { sys: "CoreOps", title: "SMS logged", detail: "The message is recorded in customer messaging records.", log: "SMS log saved" },
      { sys: "CoreOps", title: "Attribution recorded", detail: "Marketing attribution and workflow monitoring update.", log: "Attribution recorded, workflow monitored" },
    ] },
    tallyout: { steps: [
      { sys: "CoreOps", title: "B2B order ready", detail: "A business-to-business order is prepared in CoreOps.", log: "B2B order ready for outgoing stock" },
      { sys: "TallyPoint", title: "Outgoing items scanned", detail: "Products leaving the warehouse are scanned by barcode.", log: "Outgoing product barcodes scanned" },
      { sys: "TallyPoint", title: "Outgoing count recorded", detail: "The scanned quantities are saved.", log: "Outgoing count recorded" },
      { sys: "CoreOps", title: "Order updated", detail: "The outgoing scan is available in CoreOps for the B2B order.", log: "Outgoing scan received in CoreOps" },
    ] },
    tallyin: { steps: [
      { sys: "CoreOps", title: "Return expected", detail: "A returned stock transfer is waiting to be received.", log: "Returned stock transfer pending" },
      { sys: "TallyPoint", title: "Returned items scanned", detail: "Returned products are scanned by barcode on arrival.", log: "Returned product barcodes scanned" },
      { sys: "TallyPoint", title: "Incoming count recorded", detail: "The scanned quantities are saved.", log: "Incoming count recorded" },
      { sys: "CoreOps", title: "Return received", detail: "The returned stock transfer is reflected in CoreOps.", log: "Incoming scan received in CoreOps" },
    ] },
    tallycount: { steps: [
      { sys: "TallyPoint", title: "Count session started", detail: "A stock count begins for an inventory location.", log: "Inventory count started" },
      { sys: "TallyPoint", title: "Barcode scanned", detail: "Each product barcode is scanned during counting.", log: "Product barcode scanned" },
      { sys: "TallyPoint", title: "Count recorded", detail: "The counted quantity is saved.", log: "Product count recorded" },
      { sys: "SCM", title: "Count available", detail: "The inventory count is available in SCM.", log: "Inventory count received in SCM" },
    ] },
  };
  const wfEls = { steps: $q("#wf-steps"), log: $q("#wf-log"), result: $q("#wf-result"), status: $q("#wf-status"), bar: $q("#wf-bar"), run: $q("#wf-run"), step: $q("#wf-step"), reset: $q("#wf-reset") };
  let wfKey = "shopify", wfNext = 0, wfRunning = false, wfBusy = false, wfTimer = null, wfClock = 0;
  const wfList = () => SCEN[wfKey].steps;
  const STATE_LABEL = { waiting: "Waiting", running: "Running…", done: "Done" };
  const wfButtons = () => {
    const n = wfList().length;
    wfEls.run.textContent = wfRunning ? "Pause" : wfNext >= n ? "Replay" : wfNext > 0 ? "Resume" : "Run workflow";
    wfEls.step.disabled = wfBusy || wfRunning || wfNext >= n;
  };
  const wfSetState = (i, state) => {
    const li = wfEls.steps.children[i]; li.dataset.state = state;
    li.querySelector(".wf-dot").textContent = state === "done" ? "✓" : String(i + 1);
    li.querySelector(".wf-state").textContent = STATE_LABEL[state];
  };
  const wfLog = (sys, text) => {
    const line = mk("div", "wf-line"); line.append(mk("span", "t", `t+${(wfClock / 1000).toFixed(1)}s`), mk("span", "s", sys), mk("span", "", text));
    wfEls.log.appendChild(line); wfEls.log.scrollTop = wfEls.log.scrollHeight;
  };
  const wfRender = () => {
    clearTimeout(wfTimer); wfNext = 0; wfRunning = false; wfBusy = false; wfClock = 0;
    wfEls.steps.innerHTML = ""; wfEls.log.innerHTML = "";
    wfList().forEach((s, i) => {
      const li = mk("li", "wf-step"), dot = mk("span", "wf-dot", String(i + 1)), main = mk("div", "wf-main");
      dot.setAttribute("aria-hidden", "true");
      main.append(mk("span", "wf-sys", s.sys), mk("b", "", s.title), mk("small", "", s.detail));
      li.append(dot, main, mk("span", "wf-state", STATE_LABEL.waiting)); li.dataset.state = "waiting"; wfEls.steps.appendChild(li);
    });
    wfEls.result.textContent = "Select Run workflow to start, or Step to move one stage at a time.";
    wfEls.bar.style.width = "0%"; wfEls.status.textContent = "Ready"; wfButtons();
  };
  const wfFinish = () => {
    wfRunning = false;
    const systems = [...new Set(wfList().map((s) => s.sys))];
    wfLog("✓", "Workflow complete");
    wfEls.result.innerHTML = ""; const strong = mk("strong", "", "Workflow complete. ");
    wfEls.result.append(strong, document.createTextNode(`${wfList().length} steps across ${systems.join(", ")}. Simulated for illustration.`));
    wfEls.status.textContent = "Workflow complete"; wfButtons();
  };
  const wfDo = () => {
    const steps = wfList(), i = wfNext;
    if (i >= steps.length || wfBusy) return;
    wfBusy = true; wfSetState(i, "running"); wfEls.status.textContent = `Step ${i + 1} of ${steps.length}: ${steps[i].title}`; wfButtons();
    wfTimer = setTimeout(() => {
      wfClock += 800; wfSetState(i, "done"); wfLog(steps[i].sys, steps[i].log);
      wfNext = i + 1; wfBusy = false; wfEls.bar.style.width = (wfNext / steps.length * 100) + "%";
      if (wfNext >= steps.length) return wfFinish();
      if (wfRunning) wfTimer = setTimeout(wfDo, 300);
      else { wfEls.status.textContent = `Paused after step ${wfNext} of ${steps.length}`; wfButtons(); }
    }, 750);
  };
  wfEls.run.addEventListener("click", () => {
    if (wfNext >= wfList().length) wfRender();
    if (wfRunning) { wfRunning = false; wfEls.status.textContent = wfBusy ? "Pausing after this step…" : "Paused"; wfButtons(); return; }
    wfRunning = true; wfButtons(); wfDo();
  });
  wfEls.step.addEventListener("click", () => { wfRunning = false; wfDo(); });
  wfEls.reset.addEventListener("click", wfRender);
  const scenBtns = document.querySelectorAll("[data-scen]");
  scenBtns.forEach((b) => b.addEventListener("click", () => {
    wfKey = b.dataset.scen;
    scenBtns.forEach((o) => { const on = o === b; o.classList.toggle("is-active", on); o.setAttribute("aria-pressed", String(on)); });
    wfRender();
  }));
  wfRender();
  // ===== Update: toast, shortcuts, GitHub, offline =====
  const toastEl = $q("#toast"); let toastTimer;
  const toast = (msg) => { if (!msg) return; toastEl.textContent = msg; toastEl.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2600); };
  [copyStatus, formStatus].forEach((n) => new MutationObserver(() => { if (n.textContent) toast(n.textContent); }).observe(n, { childList: true, characterData: true, subtree: true }));
  themeBtn.addEventListener("click", () => toast(root.dataset.theme === "light" ? "Light theme" : "Dark theme"));
  window.addEventListener("themechange", () => toast(root.dataset.theme === "light" ? "Light theme" : "Dark theme"));

  // Keyboard shortcuts
  const helpDlg = $q("#help");
  closeOnBackdrop(helpDlg);
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey || e.target.closest("input, textarea, select, [contenteditable]")) return;
    const anyOpen = document.querySelector("dialog[open]");
    if (e.key === "?") { e.preventDefault(); if (helpDlg.open) helpDlg.close(); else if (!anyOpen) helpDlg.showModal(); return; }
    if (anyOpen) return;
    const k = e.key.toLowerCase();
    if (k === "/") { e.preventDefault(); openCmd(); }
    else if (k === "t") themeBtn.click();
    else if (k === "s") openSummary();
    else if (k === "d") openSettings();
  });

  // Latest GitHub repositories (only when CONFIG.githubUser is set)
  if (CONFIG.githubUser) {
    const user = CONFIG.githubUser.trim(), box = $q("#gh"), grid = $q("#gh-grid");
    const show = (repos) => {
      const list = repos.filter((r) => !r.fork && !r.archived && /^https:\/\/github\.com\//.test(r.html_url)).slice(0, 6);
      if (!list.length) return;
      grid.innerHTML = "";
      list.forEach((r) => {
        const a = mk("a", "gh-card"); a.href = r.html_url; a.target = "_blank"; a.rel = "noopener noreferrer";
        const meta = mk("div", "gh-meta");
        if (r.language) meta.appendChild(mk("span", "lang", r.language));
        meta.appendChild(mk("span", "", `★ ${r.stargazers_count}`));
        meta.appendChild(mk("span", "", "Updated " + new Date(r.pushed_at).toLocaleDateString(undefined, { month: "short", year: "numeric" })));
        a.append(mk("b", "", r.name), mk("p", "", r.description || "No description yet."), meta); grid.appendChild(a);
      });
      $q("#gh-all").href = CONFIG.github || `https://github.com/${encodeURIComponent(user)}`;
      box.hidden = false;
    };
    const key = "gh:" + user;
    let cached = null;
    try { cached = JSON.parse(sessionStorage.getItem(key) || "null"); } catch {}
    if (cached && Date.now() - cached.t < 600000) show(cached.data);
    else fetch(`https://api.github.com/users/${encodeURIComponent(user)}/repos?sort=pushed&per_page=30`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => { try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), data })); } catch {} show(data); })
      .catch(() => {});
  }

  // ===== Update: local time, save contact, share-to-LinkedIn =====
  // Live Manila time in the hero so visitors know when to expect a reply
  const timeEl = $q("#local-time");
  if (timeEl) {
    const fmt = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Manila" });
    const tickTime = () => { timeEl.textContent = fmt.format(new Date()) + " PHT"; };
    tickTime(); setInterval(tickTime, 30000);
  }

  // Save contact (vCard): name, role, email, location and public links only
  const makeVCard = () => {
    const lines = ["BEGIN:VCARD", "VERSION:3.0", "N:Maniangap;Carl Angelo;M.;;", "FN:Carl Angelo M. Maniangap",
      "TITLE:Software Developer", "EMAIL;TYPE=INTERNET:" + ($q("#copy-email").dataset.email || "")];
    if (CONFIG.github) lines.push("URL:" + CONFIG.github);
    if (CONFIG.linkedin) lines.push("URL:" + CONFIG.linkedin);
    lines.push("END:VCARD");
    return lines.join("\r\n");
  };
  const saveContact = () => {
    const blob = new Blob([makeVCard()], { type: "text/vcard" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "Carl-Angelo-Maniangap.vcf";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast("Contact card downloaded");
  };
  const vBtn = $q("#vcard-btn"); if (vBtn) vBtn.addEventListener("click", saveContact);
  commands.push({ label: "Save contact (vCard)", hint: "Action", run: saveContact });

  // Open the project popup on first visit hint: press "?" for shortcuts (shown once per device)
  try {
    if (!localStorage.getItem("hint-shortcuts") && matchMedia("(hover: hover)").matches) {
      setTimeout(() => { toast("Tip: press Ctrl/Cmd + K to jump anywhere"); localStorage.setItem("hint-shortcuts", "1"); }, 4500);
    }
  } catch {}

  // ===== Update v12: recruiter view, résumé preview, results, extras, analytics =====
  // Results line on project cards (only when filled in PROJECT_DETAILS)
  cards.forEach((card) => {
    const d = PROJECT_DETAILS[slugOf(card)];
    if (d && d.result) { const p = document.createElement("p"); p.className = "project-result"; p.textContent = "Result: " + d.result; card.querySelector(".project-info").appendChild(p); }
  });

  // Now + testimonials (hidden when empty)
  if (NOW.length || TESTIMONIALS.length) {
    const sec = document.createElement("section"); sec.className = "section extras-section"; sec.id = "extras";
    const wrap = document.createElement("div"); wrap.className = "container";
    if (NOW.length) {
      const h = document.createElement("div"); h.className = "extras-block";
      const t = document.createElement("p"); t.className = "eyebrow"; t.textContent = "NOW"; h.appendChild(t);
      const ul = document.createElement("ul"); ul.className = "now-list";
      NOW.forEach(({ label, text }) => { const li = document.createElement("li"); const b = document.createElement("b"); b.textContent = label; li.append(b, " " + text); ul.appendChild(li); });
      h.appendChild(ul); wrap.appendChild(h);
    }
    if (TESTIMONIALS.length) {
      const h = document.createElement("div"); h.className = "extras-block";
      const t = document.createElement("p"); t.className = "eyebrow"; t.textContent = "KIND WORDS"; h.appendChild(t);
      const grid = document.createElement("div"); grid.className = "quote-grid";
      TESTIMONIALS.forEach(({ quote, name, role }) => {
        const f = document.createElement("figure"); const q = document.createElement("blockquote"); q.textContent = quote;
        const c = document.createElement("figcaption"); const n = document.createElement("b"); n.textContent = name; c.append(n, role ? " · " + role : "");
        f.append(q, c); grid.appendChild(f);
      });
      h.appendChild(grid); wrap.appendChild(h);
    }
    sec.appendChild(wrap); $q("#contact").before(sec);
  }

  // Booking button
  if (CONFIG.booking) {
    const a = document.createElement("a"); a.className = "button button-outline"; a.href = CONFIG.booking; a.target = "_blank"; a.rel = "noopener noreferrer"; a.textContent = "Book a call ↗";
    $q("#vcard-btn").before(a);
    commands.push({ label: "Book a call", hint: "Link", run: () => window.open(CONFIG.booking, "_blank", "noopener") });
  }

  // Résumé preview popup
  if (CONFIG.resume) {
    const dlg = document.createElement("dialog"); dlg.className = "resume-dialog"; dlg.id = "resume-dialog"; dlg.setAttribute("aria-labelledby", "resume-title");
    dlg.innerHTML = '<div class="resume-head"><h2 id="resume-title">Résumé</h2><span class="dialog-spacer"></span><a class="button button-quiet" data-dl download>Download</a><a class="button button-quiet" data-tab target="_blank" rel="noopener">Open in new tab ↗</a><button type="button" class="button button-quiet" data-close>Close</button></div><div class="resume-body"></div>';
    dlg.querySelector("[data-dl]").href = CONFIG.resume; dlg.querySelector("[data-tab]").href = CONFIG.resume;
    document.body.appendChild(dlg); closeOnBackdrop(dlg);
    const body = dlg.querySelector(".resume-body");
    const openResume = () => {
      if (!body.firstChild) {
        const o = document.createElement("object"); o.type = "application/pdf"; o.data = CONFIG.resume + "#view=FitH"; o.setAttribute("aria-label", "Résumé PDF");
        const fb = document.createElement("p"); fb.className = "section-note"; fb.append("Your browser can't show the PDF here. ");
        const l = document.createElement("a"); l.href = CONFIG.resume; l.textContent = "Open or download the résumé."; fb.appendChild(l); o.appendChild(fb); body.appendChild(o);
      }
      dlg.showModal();
    };
    const pb = document.createElement("button"); pb.type = "button"; pb.className = "button button-outline"; pb.innerHTML = 'Preview résumé <span aria-hidden="true">▤</span>';
    pb.addEventListener("click", openResume); $q("#vcard-btn").before(pb);
    commands.push({ label: "Preview résumé", hint: "Panel", run: openResume });
  }

  // Recruiter view: skills, experience and contact first; decorative sections hidden
  const docBody = document.body;
  const rvBar = document.createElement("div"); rvBar.className = "recruiter-bar"; rvBar.hidden = true;
  rvBar.innerHTML = '<span><b>Recruiter view</b> · skills, experience and contact first</span><button type="button" class="button button-quiet">Back to full view</button>';
  $q("#main").prepend(rvBar);
  const setRecruiter = (on, announce) => {
    docBody.classList.toggle("recruiter", on); rvBar.hidden = !on;
    const u = new URL(location.href); if (on) u.searchParams.set("view", "recruiter"); else u.searchParams.delete("view");
    history.replaceState(null, "", u.pathname + u.search);
    if (rBtn) rBtn.textContent = on ? "Full view" : "Recruiter view";
    if (announce) { toast(on ? "Recruiter view on" : "Full view"); window.scrollTo({ top: 0, behavior: "auto" }); }
  };
  const toggleRecruiter = () => setRecruiter(!docBody.classList.contains("recruiter"), true);
  rvBar.querySelector("button").addEventListener("click", toggleRecruiter);
  const rBtn = document.createElement("button"); rBtn.type = "button"; rBtn.className = "inline-link"; rBtn.textContent = "Recruiter view";
  const avail = $q(".availability"); if (avail) { const tail = document.createElement("span"); tail.className = "nowrap"; tail.append("· ", rBtn); avail.append(" ", tail); }
  rBtn.addEventListener("click", toggleRecruiter);
  commands.push({ label: "Toggle recruiter view", hint: "Action", run: toggleRecruiter });
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey || e.target.closest("input, textarea, select, [contenteditable]") || document.querySelector("dialog[open]")) return;
    if (e.key.toLowerCase() === "r") toggleRecruiter();
  });
  if (new URLSearchParams(location.search).get("view") === "recruiter") setRecruiter(true, false);

  // Privacy-friendly analytics (only when configured)
  const addScript = (attrs) => { const sc = document.createElement("script"); sc.defer = true; Object.entries(attrs).forEach(([k, v]) => sc.setAttribute(k, v)); document.head.appendChild(sc); };
  if (CONFIG.plausible) addScript({ src: "https://plausible.io/js/script.js", "data-domain": CONFIG.plausible });
  if (CONFIG.goatcounter) addScript({ src: "https://gc.zgo.at/count.js", "data-goatcounter": "https://" + CONFIG.goatcounter + ".goatcounter.com/count" });

  // ===== Update v14: systems map, contact draft, focus chips =====
  (() => {
    const host = document.querySelector("#workflow .container"), anchor = host && host.querySelector(".wf");
    if (!anchor) return;
    const NODES = {
      coreops: { label: "CoreOps", sub: "Core app", pos: [50, 50], desc: "A business app for operations, e-commerce, HR, inventory, finance, and reporting. I develop and maintain features in it and connect it with other apps.",
        links: ["Shopify: orders, inventory transfers, abandoned checkouts, product pull-outs", "Odoo: time-off approval and synchronization workflows", "n8n: SMS logs, execution monitoring, marketing attribution", "LogiX: order booking and delivery management", "TallyPoint: outgoing B2B orders and incoming returned-stock transfers"], scen: [] },
      shopify: { label: "Shopify", sub: "E-commerce", pos: [16, 17], desc: "The online store. I co-developed the workflows that connect it with CoreOps and maintain them.", links: ["Order management", "Inventory transfers, abandoned checkouts, and product pull-outs"], scen: [["Run the Shopify order demo", "shopify"]] },
      odoo: { label: "Odoo", sub: "HR / ERP", pos: [16, 50], desc: "An app involved in HR workflows. I worked on approval and synchronization flows between CoreOps and Odoo.", links: ["Time-off approval and synchronization with CoreOps", "Related attendance and schedule monitoring features in CoreOps"], scen: [["Run the time-off demo", "timeoff"]] },
      n8n: { label: "n8n", sub: "Automation", pos: [16, 83], desc: "Workflow automation connected to CoreOps for messaging records and monitoring.", links: ["SMS logs and customer messaging records", "Workflow execution monitoring and marketing attribution"], scen: [["Run the customer SMS demo", "sms"]] },
      logix: { label: "LogiX", sub: "Delivery", pos: [84, 17], desc: "Order booking and delivery management connected to the Tinapaislife website.", links: ["Rider assignment, delivery tracking, proof uploads, cancellations", "Delivery reports"], scen: [["Run the delivery demo", "logix"]] },
      tally: { label: "TallyPoint", sub: "Barcodes", pos: [84, 50], desc: "A barcode utility developed by my manager. My contribution was integrating it with CoreOps. It runs in three modes.", links: ["Outgoing: B2B orders, integrated with CoreOps", "Incoming: returned-stock transfers, integrated with CoreOps", "Inventory count: stock counting in SCM"], scen: [["Outgoing demo", "tallyout"], ["Incoming demo", "tallyin"], ["Inventory count demo", "tallycount"]] },
      scm: { label: "SCM", sub: "Inventory", pos: [84, 83], desc: "An inventory app. TallyPoint also supports inventory counting in SCM.", links: ["Inventory counting supported by TallyPoint"], scen: [["Run the inventory count demo", "tallycount"]] },
    };
    const EDGES = [["coreops", "shopify"], ["coreops", "odoo"], ["coreops", "n8n"], ["coreops", "logix"], ["coreops", "tally"], ["tally", "scm"]];
    const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt) e.textContent = txt; return e; };
    const wrap = el("div", "sysmap reveal is-visible"); wrap.id = "sysmap";
    const head = el("div", "sysmap-head"); head.append(el("p", "eyebrow", "HOW THE APPS CONNECT"), el("p", "section-note", "Select an app to see how it connects with the others. This is a simplified view of my work."));
    const stage = el("div", "sysmap-stage");
    const svgNS = "http://www.w3.org/2000/svg", svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 100 100"); svg.setAttribute("preserveAspectRatio", "none"); svg.setAttribute("aria-hidden", "true");
    const lines = EDGES.map(([a, b]) => { const l = document.createElementNS(svgNS, "line"); l.setAttribute("x1", NODES[a].pos[0]); l.setAttribute("y1", NODES[a].pos[1]); l.setAttribute("x2", NODES[b].pos[0]); l.setAttribute("y2", NODES[b].pos[1]); svg.appendChild(l); return [a, b, l]; });
    stage.appendChild(svg);
    const detail = el("div", "sysmap-detail"); detail.setAttribute("aria-live", "polite");
    const btns = {};
    Object.entries(NODES).forEach(([key, n]) => {
      const b = el("button", "sys-node" + (key === "coreops" ? " is-core" : "")); b.type = "button"; b.style.left = n.pos[0] + "%"; b.style.top = n.pos[1] + "%";
      b.append(el("b", "", n.label), el("small", "", n.sub)); b.setAttribute("aria-pressed", "false"); b.addEventListener("click", () => pick(key)); stage.appendChild(b); btns[key] = b;
    });
    const pick = (key) => {
      const n = NODES[key];
      Object.entries(btns).forEach(([k, b]) => { b.setAttribute("aria-pressed", String(k === key)); b.classList.toggle("is-linked", EDGES.some(([a, c]) => (a === key && c === k) || (c === key && a === k))); });
      lines.forEach(([a, c, l]) => l.classList.toggle("on", a === key || c === key));
      detail.innerHTML = ""; detail.append(el("h3", "", n.label), el("p", "", n.desc));
      const ul = el("ul"); n.links.forEach((t) => ul.appendChild(el("li", "", t))); detail.appendChild(ul);
      if (n.scen.length) {
        const row = el("div", "sysmap-actions");
        n.scen.forEach(([label, id]) => { const a = el("button", "button button-quiet", label + " ↓"); a.type = "button"; a.addEventListener("click", () => { const sb = document.querySelector(`[data-scen="${id}"]`); if (sb) sb.click(); anchor.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" }); }); row.appendChild(a); });
        detail.appendChild(row);
      }
    };
    wrap.append(head, el("div", "sysmap-body")); wrap.lastChild.append(stage, detail);
    anchor.before(wrap); pick("coreops");
    commands.push({ label: "See how the apps connect", hint: "Section", run: () => wrap.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" }) });
  })();

  // Contact form: keep an unsent draft on this device, and show a message counter
  (() => {
    const f = $q("#contact-form"), msg = $q("#f-message"); if (!f || !msg) return;
    const KEY = "contact-draft", ids = ["f-name", "f-email", "f-topic", "f-message"];
    msg.maxLength = 1000;
    const note = document.createElement("p"); note.className = "form-note";
    note.textContent = CONFIG.formEndpoint ? "Your message is sent to me directly." : "This form opens your email app with your message filled in. Nothing is sent until you send it from there.";
    const submitBtn = f.querySelector("button[type=submit]"); if (submitBtn) submitBtn.before(note);
    const count = document.createElement("p"); count.className = "char-count"; count.setAttribute("aria-hidden", "true"); msg.after(count);
    const upd = () => { count.textContent = msg.value.length + " / 1000"; };
    let saved = null; try { saved = JSON.parse(localStorage.getItem(KEY) || "null"); } catch {}
    if (saved) { ids.forEach((id) => { if (saved[id]) $q("#" + id).value = saved[id]; }); if (saved["f-message"]) toast("Restored your unsent message"); }
    upd();
    let t; f.addEventListener("input", () => { upd(); clearTimeout(t); t = setTimeout(() => { try { localStorage.setItem(KEY, JSON.stringify(Object.fromEntries(ids.map((id) => [id, $q("#" + id).value])))); } catch {} }, 400); });
    f.addEventListener("reset", () => { try { localStorage.removeItem(KEY); } catch {} setTimeout(upd, 0); });
  })();

  // Works offline once visited (needs the site to be served over https)
  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }
})();
