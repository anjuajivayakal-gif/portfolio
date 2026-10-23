// ===== EDIT THIS: words shown in the typing effect on the Home section =====
const roles = ["Full Stack Developer", "Python Developer", "Problem Solver", "Quick Learner", "Team Player", "Clear Communicator"];

// --- Mobile menu ---
const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");
function setMenu(open) {
  menu.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", open);
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}
menuBtn.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

// --- Navbar background after scrolling ---
const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 20);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// --- Reveal on scroll ---
const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("show"); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  reveals.forEach((el, i) => { el.style.transitionDelay = (i % 3) * 80 + "ms"; io.observe(el); });
} else {
  reveals.forEach(el => el.classList.add("show"));
}

// --- Highlight the current section in the menu ---
const links = [...menu.querySelectorAll('a[href^="#"]')];
const sections = links.map(l => document.querySelector(l.getAttribute("href"))).filter(Boolean);
const spy = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + en.target.id));
  });
}, { rootMargin: "-45% 0px -50% 0px" });
sections.forEach(s => spy.observe(s));

// --- Typing effect ---
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const typed = document.getElementById("typed");
if (!reduce) {
  let r = 0, c = 0, deleting = false;
  (function tick() {
    const word = roles[r];
    c += deleting ? -1 : 1;
    typed.textContent = word.slice(0, c);
    let delay = deleting ? 45 : 90;
    if (!deleting && c === word.length) { deleting = true; delay = 1600; }
    else if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; delay = 400; }
    setTimeout(tick, delay);
  })();
}

// --- Project card tilt on hover (desktop only) ---
if (!reduce && window.matchMedia("(hover: hover)").matches) {
  document.querySelectorAll(".project").forEach(card => {
    card.addEventListener("mousemove", e => {
      const b = card.getBoundingClientRect();
      const x = (e.clientX - b.left) / b.width - 0.5;
      const y = (e.clientY - b.top) / b.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-6px)`;
    });
    card.addEventListener("mouseleave", () => { card.style.transform = ""; });
  });
}

// --- Tap a project card to show or hide its details (for touch screens) ---
document.querySelectorAll(".project").forEach(card => {
  card.addEventListener("click", e => {
    if (e.target.closest("a")) return;          // let links work normally
    card.classList.toggle("open");
  });
  card.addEventListener("keydown", e => {
    if (e.key === "Enter" && e.target === card) card.classList.toggle("open");
  });
});

// --- Scroll progress bar and back-to-top button ---
const progress = document.getElementById("progress");
const toTop = document.getElementById("toTop");
function updateScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
  toTop.classList.toggle("show", window.scrollY > 600);
}
window.addEventListener("scroll", updateScroll, { passive: true });
updateScroll();
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }));

// --- Light that follows the mouse on cards ---
document.querySelectorAll(".glow-card").forEach(card => {
  card.addEventListener("mousemove", e => {
    const b = card.getBoundingClientRect();
    card.style.setProperty("--mx", (e.clientX - b.left) + "px");
    card.style.setProperty("--my", (e.clientY - b.top) + "px");
  });
});

// --- Count-up numbers in the stats ---
const counters = document.querySelectorAll("[data-count]");
if (!reduce && "IntersectionObserver" in window) {
  const co = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target, end = parseFloat(el.dataset.count);
      const dec = parseInt(el.dataset.decimals || 0), suffix = el.dataset.suffix || "";
      const start = performance.now();
      (function step(now) {
        const t = Math.min((now - start) / 1400, 1);
        el.textContent = (end * (1 - Math.pow(1 - t, 3))).toFixed(dec) + suffix;
        if (t < 1) requestAnimationFrame(step);
      })(start);
      co.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(el => co.observe(el));
}
