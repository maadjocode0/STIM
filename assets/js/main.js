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
