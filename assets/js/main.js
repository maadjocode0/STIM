/* STIM — interactions (vanilla, no dependencies) */
(function () {
  "use strict";

  /* ---- Mobile drawer ---- */
  var burger = document.querySelector(".burger");
  var drawer = document.getElementById("drawer");
  var scrim = document.querySelector(".scrim");
  function setMenu(open) {
    if (!drawer) return;
    drawer.classList.toggle("open", open);
    if (scrim) scrim.classList.toggle("open", open);
    if (burger) burger.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (burger) burger.addEventListener("click", function () {
    setMenu(burger.getAttribute("aria-expanded") !== "true");
  });
  if (scrim) scrim.addEventListener("click", function () { setMenu(false); });
  var closeBtn = document.querySelector(".drawer__close");
  if (closeBtn) closeBtn.addEventListener("click", function () { setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  if (drawer) drawer.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { setMenu(false); });
  });

  /* ---- Current year ---- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---- Sticky header state ---- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", function () { window.requestAnimationFrame(onScroll); }, { passive: true });
    onScroll();
  }

  var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Animated stat counters ---- */
  function animateCount(el) {
    if (el.dataset.counted) return;
    var m = el.textContent.trim().match(/^(\D*?)(\d[\d\s]*)(\D*)$/);
    if (!m) return;
    var prefix = m[1], suffix = m[3], target = parseInt(m[2].replace(/\s/g, ""), 10);
    if (isNaN(target) || (m[2].replace(/\s/g, "").length >= 4 && target >= 1900)) return; // skip years
    el.dataset.counted = "1";
    if (prefersReduced) return;
    var dur = 1200, start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = prefix + Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---- Reveal on scroll (+ staggered siblings) & counters ----
     A tiny rAF-throttled scroll/resize check — robust everywhere and never
     leaves content hidden (no IntersectionObserver dependency). */
  var reveals = document.querySelectorAll(".reveal");
  reveals.forEach(function (el) {
    var p = el.parentElement; if (!p) return;
    var sibs = Array.prototype.filter.call(p.children, function (c) { return c.classList.contains("reveal"); });
    var i = sibs.indexOf(el);
    if (i > 0) el.style.transitionDelay = Math.min(i * 70, 420) + "ms";
  });
  var counters = document.querySelectorAll(".hero__stat b, .stat b");
  function inView(el, margin) { var r = el.getBoundingClientRect(); return r.top < (window.innerHeight - (margin || 0)) && r.bottom > 0; }
  function checkReveals() {
    var k;
    for (k = 0; k < reveals.length; k++) { if (!reveals[k].classList.contains("in") && inView(reveals[k], 40)) reveals[k].classList.add("in"); }
    for (k = 0; k < counters.length; k++) { if (!counters[k].dataset.counted && inView(counters[k], 0)) animateCount(counters[k]); }
  }
  var ticking = false;
  function onScrollResize() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { checkReveals(); ticking = false; });
  }
  window.addEventListener("scroll", onScrollResize, { passive: true });
  window.addEventListener("resize", onScrollResize);
  checkReveals();
  requestAnimationFrame(checkReveals);

  /* ---- Clients logo carousel (plusieurs logos visibles, défile un par un) ---- */
  document.querySelectorAll(".logo-carousel, .photo-carousel").forEach(function (root) {
    var track = root.querySelector(".lc-track");
    var slides = root.querySelectorAll(".lc-slide");
    var prev = root.querySelector(".lc-prev");
    var next = root.querySelector(".lc-next");
    var vp = root.querySelector(".lc-viewport");
    var counter = root.querySelector(".lc-counter");
    var n = slides.length;
    if (!track || !vp || n < 2) return;
    var idx = 0, timer = null;
    var interval = parseInt(root.getAttribute("data-interval"), 10) || 4000;
    function stepPx() {
      var a = slides[0].getBoundingClientRect(), b = slides[1].getBoundingClientRect();
      return Math.abs(b.left - a.left) || a.width;
    }
    function perView() {
      var s = stepPx();
      return s > 0 ? Math.max(1, Math.round(vp.getBoundingClientRect().width / s)) : 1;
    }
    function maxIdx() { return Math.max(0, n - perView()); }
    function render() { track.style.transform = "translateX(" + (-idx * stepPx()) + "px)"; }
    function go(i) { var m = maxIdx(); idx = i < 0 ? m : (i > m ? 0 : i); render(); if (counter) counter.textContent = (idx + 1) + " / " + n; }
    function start() { if (prefersReduced) return; stop(); timer = setInterval(function () { go(idx + 1); }, interval); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function restart() { stop(); start(); }
    if (next) next.addEventListener("click", function () { go(idx + 1); restart(); });
    if (prev) prev.addEventListener("click", function () { go(idx - 1); restart(); });
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", start);
    document.addEventListener("visibilitychange", function () { if (document.hidden) stop(); else start(); });
    var sx = null;
    vp.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; stop(); }, { passive: true });
    vp.addEventListener("touchend", function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) go(dx < 0 ? idx + 1 : idx - 1);
      sx = null; start();
    }, { passive: true });
    var rt;
    window.addEventListener("resize", function () {
      clearTimeout(rt);
      rt = setTimeout(function () { if (idx > maxIdx()) idx = maxIdx(); render(); }, 150);
    });
    go(0);
    track.classList.add("anim");
    start();
  });

  /* ---- Devis form -> Web3Forms ---- */
  var form = document.getElementById("devis-form");
  if (form) {
    var status = form.querySelector(".form__status");
    var submitBtn = form.querySelector('[type="submit"]');
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var key = form.querySelector('[name="access_key"]').value.trim();
      var labelDefault = submitBtn ? submitBtn.textContent : "";
      function show(type, msg) {
        if (!status) return;
        status.className = "form__status " + type;
        status.textContent = msg;
      }
      // Garde-fou : clé non configurée
      if (!key || key.indexOf("VOTRE_CLE") === 0) {
        show("err", "Le formulaire n'est pas encore connecté. Appelez-nous au 55 326 160 ou écrivez à contact@stim.tn.");
        return;
      }
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Envoi en cours…"; }
      var data = Object.fromEntries(new FormData(form).entries());
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data)
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res.success) {
            form.reset();
            show("ok", "Merci ! Votre demande de devis a bien été envoyée. Nous vous recontactons sous 24 h ouvrées.");
          } else {
            show("err", "Une erreur est survenue. Réessayez ou contactez-nous au 55 326 160.");
          }
        })
        .catch(function () {
          show("err", "Connexion impossible. Vérifiez votre réseau ou appelez le 55 326 160.");
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = labelDefault; }
        });
    });
  }
})();
