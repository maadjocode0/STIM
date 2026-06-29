/**
 * STIM — static page generator (dev convenience).
 * Emits plain, editable static HTML using one shared header/footer so the NAP
 * and navigation stay identical everywhere. index.html and contact/index.html
 * are maintained by hand; this script generates the other 14 pages.
 * Run from project root:  node tools/build-pages.js
 */
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const SITE = "https://stim.tn";

/* available WebP widths per image slug (see tools/optimize.js output) */
const IMG = {
  "hangar-metallique-montage-charpente":[400,800,1200],
  "charpente-metallique-hangar-ben-arous":[400,800,1200],
  "couverture-bac-acier-charpente-metallique":[400,800,1200],
  "montage-charpente-metallique-grue":[400,800,1200],
  "batiment-industriel-metallique-interieur":[400,800],
  "plancher-metallique-berges-du-lac-tunis":[400,800,1200],
  "ossature-metallique-batiment":[400,800],
  "auvent-metallique-galvanise-bord-de-mer":[400,800,1200],
  "couverture-bardage-auvent-industriel":[400,800,1200],
  "hangar-metallique-ossature-acier":[400,800],
  "hangar-metallique-double-nef":[400,800,1200],
  "hangar-metallique-grande-portee":[400,800],
  "charpente-process-agro-industriel":[400,800],
  "unite-industrielle-silos-charpente-metallique":[400,800],
  "passerelle-metallique-garde-corps-agro":[400,800],
  "tour-metallique-elevateur-silos":[400],
  "structure-process-agro-industrielle":[400,800],
  "mezzanine-metallique-plancher":[400],
  "ossature-toiture-surelevation-metallique":[400,800],
  "grue-mobile-stim-atelier":[400,800,1200],
  "atelier-fabrication-pont-roulant-stim":[400,800,1200],
  "atelier-fabrication-poutres-acier-stim":[400,800,1200],
  "grue-mobile-stim-parc-acier":[400,800,1200],
  "hangar-metallique-fini-interieur":[400,800],
  "hangar-metallique-bardage-exterieur":[400,800],
  "charpente-metallique-portique-toiture":[400,800],
};

function img(slug, alt, sizes = "100vw", { lazy = true, cls = "" } = {}) {
  const ws = IMG[slug] || [800];
  const max = ws[ws.length - 1];
  const srcset = ws.map((w) => `/assets/img/${slug}-${w}.webp ${w}w`).join(", ");
  return `<img ${cls ? `class="${cls}" ` : ""}${lazy ? 'loading="lazy" decoding="async" ' : ""}src="/assets/img/${slug}-${max}.webp" srcset="${srcset}" sizes="${sizes}" alt="${alt}">`;
}

const WA = "https://wa.me/21655326160?text=Bonjour%20STIM%2C%20je%20souhaite%20un%20devis%20pour%20un%20projet%20de%20charpente%20m%C3%A9tallique.";

const NAV = [
  ["/", "Accueil", "accueil"],
  ["/services/", "Services", "services"],
  ["/realisations/", "Réalisations", "realisations"],
  ["/zones-intervention/", "Zones", "zones"],
  ["/a-propos/", "À propos", "apropos"],
  ["/contact/", "Contact", "contact"],
];

const ICON_PHONE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L7.6 9.8a16 16 0 0 0 6 6l1.4-1.1a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z"/></svg>`;
const ICON_WA = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-2.8.9.9-2.8-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-5.8c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.6.1l-.8 1c-.2.2-.3.2-.6.1-1.3-.5-2.4-1.6-3-2.8-.1-.3 0-.4.1-.6l.4-.5.2-.5v-.5l-.8-2c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-1.4 1.4-1 3.5.1 4.9 1.6 2.1 3.4 3.2 5.6 3.9 1.4.4 1.9.3 2.5-.1.4-.3.9-.9 1-1.4.1-.4.1-.8 0-.9z"/></svg>`;

function header(active) {
  const links = NAV.map(([h, l, k]) => `<a href="${h}"${k === active ? ' aria-current="page"' : ""}>${l}</a>`).join("\n      ");
  return `<header class="site-header">
  <div class="container nav">
    <a class="brand" href="/" aria-label="STIM — Accueil">
      <span class="brand__logo"><img src="/assets/logo/stim-logo.webp" alt="Logo STIM" width="56" height="25"></span>
      <span class="brand__txt"><span class="brand__name">STIM</span><span class="brand__tag">Construction métallique</span></span>
    </a>
    <nav class="nav__links" aria-label="Navigation principale">
      ${links}
    </nav>
    <div class="nav__cta">
      <a class="nav__tel" href="tel:+21655326160" aria-label="Appeler STIM">${ICON_PHONE} 55 326 160</a>
      <a class="btn" href="/contact/">Devis gratuit</a>
    </div>
    <button class="burger" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="drawer"><span></span><span></span><span></span></button>
  </div>
</header>
<div class="scrim" hidden></div>
<aside class="drawer" id="drawer" aria-label="Menu mobile">
  <button class="drawer__close" aria-label="Fermer le menu">&times;</button>
  ${NAV.map(([h, l, k]) => `<a href="${h}"${k === active ? ' aria-current="page"' : ""}>${l === "Zones" ? "Zones d'intervention" : l}</a>`).join("\n  ")}
  <a class="btn" href="/contact/">Demander un devis</a>
  <a class="btn btn--wa" href="${WA}" rel="noopener">WhatsApp</a>
</aside>`;
}

function footer() {
  return `<footer class="footer">
  <div class="container">
    <div class="footer__top">
      <div class="footer__brand">
        <a class="brand" href="/" aria-label="STIM — Accueil"><span class="brand__logo"><img src="/assets/logo/stim-logo.webp" alt="Logo STIM" width="56" height="25"></span><span class="brand__txt"><span class="brand__name">STIM</span><span class="brand__tag">Construction métallique</span></span></a>
        <p>Société Tunisienne d'Industrie Métallique — conception, fabrication et montage de charpentes et structures métalliques depuis 2008.</p>
        <div class="footer__social" aria-label="Réseaux sociaux">
          <a href="#" aria-label="Facebook de STIM" rel="noopener" title="Facebook [À VÉRIFIER]"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 9h3l.5-3H14V4.5c0-.8.3-1.5 1.5-1.5H17V.3C16.7.2 15.8 0 14.8 0 12.5 0 11 1.4 11 4v2H8v3h3v9h3z"/></svg></a>
          <a href="#" aria-label="Instagram de STIM" rel="noopener" title="Instagram [À VÉRIFIER]"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a>
          <a href="#" aria-label="LinkedIn de STIM" rel="noopener" title="LinkedIn [À VÉRIFIER]"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.1c.5-1 1.8-2 3.6-2 3.9 0 4.6 2.5 4.6 5.8V21h-4v-5.3c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V21H9z"/></svg></a>
        </div>
      </div>
      <div><h4>Services</h4><nav aria-label="Services"><a href="/services/hangars-metalliques/">Hangars métalliques</a><br><a href="/services/batiments-industriels/">Bâtiments industriels</a><br><a href="/services/couverture-bardage/">Couverture &amp; bardage</a><br><a href="/services/structures-agro-industrielles/">Structures agro-industrielles</a><br><a href="/services/mezzanines-planchers/">Mezzanines &amp; planchers</a><br><a href="/services/escaliers-passerelles-garde-corps/">Escaliers &amp; passerelles</a></nav></div>
      <div><h4>Zones</h4><nav aria-label="Zones d'intervention"><a href="/charpente-metallique-ben-arous/">Ben Arous</a><br><a href="/charpente-metallique-tunis/">Tunis</a><br><a href="/charpente-metallique-sfax/">Sfax</a><br><a href="/charpente-metallique-sousse/">Sousse</a><br><a href="/zones-intervention/">Toute la Tunisie</a></nav></div>
      <div><h4>Contact</h4>
        <address class="footer__nap"><strong style="color:#fff">STIM</strong><br>Rue de Mercure, Zone Industrielle<br>2013 Ben Arous, Tunisie<br>Tél : <a href="tel:+21655326160">55 326 160</a> · <a href="tel:+21622326600">22 326 600</a><br><a href="tel:+21631422003">31 422 003</a><br>E-mail : <a href="mailto:contact@stim.tn">contact@stim.tn</a></address>
        <div class="btn-row" style="margin-top:1rem"><a class="btn btn--wa" href="https://wa.me/21655326160?text=Bonjour%20STIM%2C%20je%20souhaite%20un%20devis." rel="noopener">WhatsApp</a></div>
      </div>
    </div>
    <div class="footer__bottom">
      <span>© <span data-year>2026</span> STIM — Société Tunisienne d'Industrie Métallique. Tous droits réservés.</span>
      <span class="footer__legal">SUARL · Capital 200 000 DT · RC B 2480672008 · MF 1075327/P/A/M/000</span>
    </div>
  </div>
</footer>
<nav class="callbar" aria-label="Contact rapide">
  <a class="c-tel" href="tel:+21655326160">${ICON_PHONE} Appeler</a>
  <a class="c-wa" href="${WA}" rel="noopener">${ICON_WA} WhatsApp</a>
</nav>
<script src="/assets/js/main.js?v=2" defer></script>`;
}

function orgLD() {
  return `<script type="application/ld+json">
{"@context":"https://schema.org","@type":"GeneralContractor","@id":"https://stim.tn/#organization","name":"STIM — Société Tunisienne d'Industrie Métallique","url":"https://stim.tn/","logo":"https://stim.tn/assets/logo/stim-logo.png","telephone":"+21655326160","email":"contact@stim.tn","foundingDate":"2008","address":{"@type":"PostalAddress","streetAddress":"Rue de Mercure, Zone Industrielle","addressLocality":"Ben Arous","postalCode":"2013","addressCountry":"TN"},"geo":{"@type":"GeoCoordinates","latitude":36.7534669,"longitude":10.2399379},"areaServed":{"@type":"Country","name":"Tunisie"}}
</script>`;
}

function breadcrumbLD(items) {
  const el = items.map((it, i) => `{"@type":"ListItem","position":${i + 1},"name":"${it.name}","item":"${SITE}${it.url}"}`).join(",");
  return `<script type="application/ld+json">
{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[${el}]}
</script>`;
}

function crumbHTML(items) {
  const parts = items.map((it, i) =>
    i === items.length - 1 ? `<span aria-current="page">${it.name}</span>` : `<a href="${it.url}">${it.name}</a> <span>/</span>`
  ).join(" ");
  return `<nav class="crumb" aria-label="Fil d'Ariane">${parts}</nav>`;
}

function faqLD(faq) {
  const el = faq.map((f) => `{"@type":"Question","name":${JSON.stringify(f.q)},"acceptedAnswer":{"@type":"Answer","text":${JSON.stringify(f.a.replace(/<[^>]+>/g, ""))}}}`).join(",");
  return `<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[${el}]}
</script>`;
}

function faqHTML(faq) {
  return `<div class="faq">${faq.map((f, i) => `<details${i === 0 ? " open" : ""}><summary>${f.q}</summary><div class="faq__a">${f.a}</div></details>`).join("")}</div>`;
}

const ctaBand = `<section class="cta-band">
  <div class="container section--tight cta-band__in">
    <div><h2>Un projet de charpente métallique ?</h2><p>Décrivez votre besoin ou envoyez vos plans : devis gratuit sous 24 h ouvrées, partout en Tunisie.</p></div>
    <div class="btn-row"><a class="btn btn--lg" href="/contact/">Demander un devis</a><a class="btn btn--ghost btn--lg" href="tel:+21655326160">Appeler maintenant</a></div>
  </div>
</section>`;

function doc({ title, desc, urlPath, active, body, extraLD = "" }) {
  const canonical = `${SITE}${urlPath}`;
  return `<!DOCTYPE html>
<html lang="fr-TN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${canonical}">
<meta name="theme-color" content="#16181b">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="alternate" hreflang="fr-tn" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="STIM">
<meta property="og:locale" content="fr_TN">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="https://stim.tn/assets/icons/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="https://stim.tn/assets/icons/og-image.jpg">
<link rel="icon" href="/assets/icons/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/assets/icons/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/assets/icons/apple-touch-icon.png">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800;900&family=IBM+Plex+Mono:wght@500;600&family=Inter:wght@400;500;600&display=swap">
<link rel="stylesheet" href="/assets/css/styles.css?v=2">
<noscript><style>.reveal{opacity:1;transform:none}</style></noscript>
${orgLD()}
${extraLD}
</head>
<body>
<a class="skip" href="#main">Aller au contenu</a>
${header(active)}
<main id="main">
${body}
</main>
${footer()}
</body>
</html>
`;
}

function write(rel, html) {
  const file = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  console.log("  wrote", rel);
}

/* ---------------- page data ---------------- */
const SERVICES = require("./content/services.js");
const CITIES = require("./content/cities.js");
const PAGES = require("./content/pages.js");

const ctx = { img, crumbHTML, breadcrumbLD, faqLD, faqHTML, ctaBand, SITE };

console.log("Generating pages…");
write("services/index.html", doc(PAGES.servicesHub(ctx, SERVICES)));
SERVICES.forEach((s) => write(`services/${s.slug}/index.html`, doc(PAGES.servicePage(ctx, s, SERVICES))));
write("realisations/index.html", doc(PAGES.realisations(ctx)));
write("zones-intervention/index.html", doc(PAGES.zonesHub(ctx, CITIES)));
CITIES.forEach((c) => write(`${c.slug}/index.html`, doc(PAGES.cityPage(ctx, c, CITIES, SERVICES))));
write("a-propos/index.html", doc(PAGES.about(ctx)));
write("404.html", doc(PAGES.notFound(ctx)));
console.log("Done.");
