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
    /* Pagination en tirets (diaporamas photo uniquement) */
    var dashes = null;
    if (root.classList.contains("photo-carousel")) {
      dashes = document.createElement("div");
      dashes.className = "lc-dashes";
      for (var d = 0; d < n; d++) (function (i) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "lc-dash";
        b.setAttribute("aria-label", "Aller à la photo " + (i + 1) + " sur " + n);
        b.addEventListener("click", function () { go(i); restart(); });
        dashes.appendChild(b);
      })(d);
      root.appendChild(dashes);
    }
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
    function go(i) {
      var m = maxIdx(); idx = i < 0 ? m : (i > m ? 0 : i); render();
      if (counter) counter.textContent = (idx + 1) + " / " + n;
      if (dashes) for (var k = 0; k < dashes.children.length; k++) dashes.children[k].classList.toggle("is-active", k === idx);
    }
    function start() { if (prefersReduced) return; stop(); timer = setInterval(function () { go(idx + 1); }, interval); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function restart() { stop(); start(); }
    if (next) next.addEventListener("click", function () { go(idx + 1); restart(); });
    if (prev) prev.addEventListener("click", function () { go(idx - 1); restart(); });
    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); go(idx + 1); restart(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); go(idx - 1); restart(); }
    });
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    root.addEventListener("focusin", function () { stop(); track.setAttribute("aria-live", "polite"); });
    root.addEventListener("focusout", function () { track.setAttribute("aria-live", "off"); start(); });
    track.setAttribute("aria-live", "off");
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

  /* ---- Galerie : filtres par catégorie ---- */
  var chipsBar = document.querySelector(".chips");
  var galleryRoot = document.querySelector("[data-lightbox]");
  if (chipsBar && galleryRoot) {
    var chips = chipsBar.querySelectorAll(".chip");
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var f = chip.getAttribute("data-filter");
        chips.forEach(function (c) {
          var on = c === chip;
          c.classList.toggle("is-active", on);
          c.setAttribute("aria-pressed", on ? "true" : "false");
        });
        galleryRoot.querySelectorAll(".gallery__item").forEach(function (it) {
          it.classList.toggle("is-hidden", f !== "all" && it.getAttribute("data-cat") !== f);
        });
      });
    });
  }

  /* ---- Lightbox (galerie réalisations) ---- */
  if (galleryRoot && window.HTMLDialogElement) {
    var lb = document.createElement("dialog");
    lb.className = "lightbox";
    lb.setAttribute("aria-label", "Photo agrandie");
    lb.innerHTML =
      '<figure><img alt=""><figcaption><span class="lb-cap"></span><span class="lb-count"></span></figcaption></figure>' +
      '<button type="button" class="lc-arrow lb-prev" aria-label="Photo précédente"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg></button>' +
      '<button type="button" class="lc-arrow lb-next" aria-label="Photo suivante"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button>' +
      '<button type="button" class="lb-close" aria-label="Fermer">&times;</button>';
    document.body.appendChild(lb);
    var lbImg = lb.querySelector("img");
    var lbCap = lb.querySelector(".lb-cap");
    var lbCount = lb.querySelector(".lb-count");
    var lbItems = [], lbIdx = 0;
    function visibleItems() {
      return Array.prototype.filter.call(
        galleryRoot.querySelectorAll(".gallery__item"),
        function (a) { return !a.classList.contains("is-hidden"); }
      );
    }
    function lbShow(i) {
      var n = lbItems.length;
      lbIdx = (i + n) % n;
      var a = lbItems[lbIdx];
      var thumb = a.querySelector("img");
      lbImg.src = a.getAttribute("href");
      lbImg.alt = thumb ? thumb.alt : "";
      lbCap.textContent = thumb ? thumb.alt : "";
      lbCount.textContent = (lbIdx + 1) + " / " + n;
    }
    galleryRoot.addEventListener("click", function (e) {
      var a = e.target.closest ? e.target.closest(".gallery__item") : null;
      if (!a) return;
      e.preventDefault();
      lbItems = visibleItems();
      lbShow(lbItems.indexOf(a));
      lb.showModal();
    });
    lb.querySelector(".lb-prev").addEventListener("click", function () { lbShow(lbIdx - 1); });
    lb.querySelector(".lb-next").addEventListener("click", function () { lbShow(lbIdx + 1); });
    lb.querySelector(".lb-close").addEventListener("click", function () { lb.close(); });
    lb.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); lbShow(lbIdx + 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); lbShow(lbIdx - 1); }
    });
    lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener("close", function () { lbImg.src = ""; });
  }

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
