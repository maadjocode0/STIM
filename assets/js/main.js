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

  /* ---- Reveal on scroll ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
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
