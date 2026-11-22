// The Upper Room — shared interactions
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // Nav: scrolled state + mobile menu
  const nav = $(".nav");
  const bookbar = $(".bookbar");
  const onScroll = () => {
    const y = window.scrollY;
    nav && nav.classList.toggle("scrolled", y > 40);
    bookbar && bookbar.classList.toggle("show", y > window.innerHeight * 0.7);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const burger = $(".burger");
  if (burger && nav) {
    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open);
      document.body.style.overflow = open ? "hidden" : "";
    });
    $$(".nav-links a").forEach(a => a.addEventListener("click", () => {
      nav.classList.remove("open");
      document.body.style.overflow = "";
    }));
  }

  // Reveal on scroll
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach(el => io.observe(el));

  // Videos: only play while on screen (saves battery + data)
  const vio = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const v = e.target;
      if (e.isIntersecting) { v.play().catch(() => {}); } else { v.pause(); }
    });
  }, { threshold: 0.25 });
  $$("video[data-autoplay]").forEach(v => { v.muted = true; v.playsInline = true; vio.observe(v); });

  // Reels: tap to pause / play
  $$(".reel").forEach(r => {
    const v = $("video", r);
    r.addEventListener("click", () => {
      if (!v) return;
      if (v.paused) { v.play(); r.classList.remove("paused"); }
      else { v.pause(); r.classList.add("paused"); }
    });
  });

  // Service tabs
  $$("[data-tabs]").forEach(group => {
    const tabs = $$(".tab", group);
    const scope = group.parentElement;
    tabs.forEach(t => t.addEventListener("click", () => {
      tabs.forEach(x => x.setAttribute("aria-selected", x === t));
      $$(".panel", scope).forEach(p => p.classList.toggle("active", p.id === t.dataset.target));
    }));
  });

  // Highlight today's hours
  const day = new Date().toLocaleDateString("en-US", { weekday: "long", timeZone: "America/Los_Angeles" });
  $$(".hours li").forEach(li => { if (li.dataset.day === day) li.classList.add("today"); });

  // Year
  $$("[data-year]").forEach(el => (el.textContent = new Date().getFullYear()));
})();
