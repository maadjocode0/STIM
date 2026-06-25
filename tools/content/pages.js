/* STIM — page renderers. Each returns {title,desc,urlPath,active,body,extraLD}. */

const SVC_ICON = {
  "hangars-metalliques": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 21V9l9-6 9 6v12"/><path d="M3 21h18"/><path d="M8 21v-6h8v6"/></svg>',
  "batiments-industriels": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 21V10l6-3v3l6-3v3l8-3v15z"/><path d="M2 21h20"/></svg>',
  "couverture-bardage": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 12 12 5l9 7"/><path d="M5 11v8h14v-8"/></svg>',
  "structures-agro-industrielles": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 21V7M19 21V7M5 7l7-4 7 4"/><path d="M5 12h14M5 16h14M3 21h18"/></svg>',
  "mezzanines-planchers": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 7h18M3 12h18M3 17h18"/><path d="M6 7v10M18 7v10"/></svg>',
  "escaliers-passerelles-garde-corps": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 20l4-4h3l4-4h3l4-4"/><path d="M3 20v-3M9 16v-3M15 12V9M21 8V5"/></svg>',
};

function svcCard(ctx, s) {
  return `<a class="card card--svc card--link reveal" href="/services/${s.slug}/">
    <span class="card__img">${ctx.img(s.hero, s.heroAlt, "(min-width:760px) 33vw, 100vw")}</span>
    <span class="card__body">
      <span class="card__ico" aria-hidden="true">${SVC_ICON[s.slug]}</span>
      <h3>${s.name}</h3>
      <p>${s.lead.split(":").slice(-1)[0].trim().replace(/\.$/, "")}.</p>
    </span>
  </a>`;
}

const processSteps = `<div class="steps">
  <div class="step reveal"><div class="step__n">ÉTAPE 01</div><h3>Étude &amp; conseil</h3><p>Analyse du besoin, visite de site et recommandations : portée, hauteur, charges, couverture.</p></div>
  <div class="step reveal"><div class="step__n">ÉTAPE 02</div><h3>Conception &amp; calcul</h3><p>Dimensionnement Eurocode 3, plans d'exécution et notes de calcul.</p></div>
  <div class="step reveal"><div class="step__n">ÉTAPE 03</div><h3>Fabrication atelier</h3><p>Débit, perçage, assemblage et soudure dans notre atelier de Ben Arous.</p></div>
  <div class="step reveal"><div class="step__n">ÉTAPE 04</div><h3>Traitement surface</h3><p>Protection anticorrosion : peinture industrielle ou galvanisation à chaud.</p></div>
  <div class="step reveal"><div class="step__n">ÉTAPE 05</div><h3>Transport &amp; montage</h3><p>Levage par nos grues mobiles et boulonnage haute résistance.</p></div>
  <div class="step reveal"><div class="step__n">ÉTAPE 06</div><h3>Couverture &amp; livraison</h3><p>Pose de la couverture et du bardage, contrôle final et réception.</p></div>
</div>`;

const clientsBand = `<ul class="clients">
  <li><img loading="lazy" src="/assets/clients/sotunol.webp" alt="Sotunol — Groupe Hamrouni" width="120" height="56"></li>
  <li><img loading="lazy" src="/assets/clients/moulin-dor.webp" alt="Moulin d'Or" width="120" height="56"></li>
  <li><img loading="lazy" src="/assets/clients/gca.webp" alt="Générale de Conserves Alimentaires (GCA)" width="120" height="56"></li>
  <li><img loading="lazy" src="/assets/clients/jouda.webp" alt="Jouda" width="120" height="56"></li>
  <li><img loading="lazy" src="/assets/clients/california.webp" alt="California Gym" width="120" height="56"></li>
  <li><img loading="lazy" src="/assets/clients/kdamak.webp" alt="K. Damak Shipping Company" width="120" height="56"></li>
  <li><img loading="lazy" src="/assets/clients/comet.webp" alt="Comet" width="120" height="56"></li>
  <li><img loading="lazy" src="/assets/clients/polyflex.webp" alt="Polyflex — Groupe Hamrouni" width="120" height="56"></li>
  <li><img loading="lazy" src="/assets/clients/chimicouleurs.webp" alt="Chimicouleurs Emballages" width="120" height="56"></li>
  <li><img loading="lazy" src="/assets/clients/mzabi.webp" alt="Groupe Mzabi — Dalmas" width="120" height="56"></li>
</ul>`;

/* ---------------- Services hub ---------------- */
exports.servicesHub = (ctx, SERVICES) => {
  const body = `
<section class="page-hero">
  <div class="container">${ctx.crumbHTML([{ name: "Accueil", url: "/" }, { name: "Services", url: "/services/" }])}</div>
  <div class="container page-hero__inner">
    <span class="eyebrow">Nos métiers</span>
    <h1>Nos services de construction métallique en Tunisie</h1>
    <p>De l'étude au montage, STIM couvre toute la chaîne de la construction métallique : hangars, bâtiments industriels, couverture, structures de process, mezzanines et ouvrages de sécurité.</p>
  </div>
</section>
<section class="section light">
  <div class="container">
    <div class="grid cols-3">${SERVICES.map((s) => svcCard(ctx, s)).join("\n")}</div>
  </div>
</section>
<section class="section paper2">
  <div class="container center">
    <div class="eyebrow">Notre méthode</div>
    <div class="section-head"><h2>Un process maîtrisé de bout en bout</h2><p>Le même interlocuteur, de l'acier brut au bâtiment livré.</p></div>
    ${processSteps}
  </div>
</section>
${ctx.ctaBand}`;
  return {
    title: "Services de Construction Métallique en Tunisie | STIM",
    desc: "Services STIM en Tunisie : hangars métalliques, bâtiments industriels, couverture & bardage, structures agro-industrielles, mezzanines et passerelles.",
    urlPath: "/services/", active: "services", body,
    extraLD: ctx.breadcrumbLD([{ name: "Accueil", url: "/" }, { name: "Services", url: "/services/" }]),
  };
};

/* ---------------- Service detail ---------------- */
exports.servicePage = (ctx, s, SERVICES) => {
  const related = SERVICES.filter((x) => x.slug !== s.slug).map((x) =>
    `<a class="pill" href="/services/${x.slug}/">${x.name}</a>`).join(" ");
  const sectionsHTML = s.sections.map((sec) => `
    <h2>${sec.h2}</h2>
    ${sec.paragraphs.map((p) => `<p>${p}</p>`).join("\n")}
    ${sec.list ? `<ul>${sec.list.map((li) => `<li>${li}</li>`).join("")}</ul>` : ""}`).join("\n");
  const galleryHTML = s.gallery.map(([slug, alt]) =>
    `<figure class="shot">${ctx.img(slug, alt, "(min-width:720px) 33vw, 100vw")}<figcaption>${alt}</figcaption></figure>`).join("\n");

  const body = `
<section class="page-hero">
  <div class="container">${ctx.crumbHTML([{ name: "Accueil", url: "/" }, { name: "Services", url: "/services/" }, { name: s.name, url: `/services/${s.slug}/` }])}</div>
  <div class="container page-hero__inner">
    <span class="eyebrow">Service</span>
    <h1>${s.h1}</h1>
    <p>${s.lead}</p>
    <div class="btn-row" style="margin-top:1.6rem"><a class="btn" href="/contact/">Demander un devis gratuit</a><a class="btn btn--ghost" href="tel:+21655326160">Appeler</a></div>
  </div>
</section>
<section class="section light">
  <div class="container split">
    <div class="prose">${s.intro.map((p) => `<p class="lead" style="color:var(--txt-light-dim)">${p}</p>`).join("")}
      <div class="card" style="background:var(--paper-2);border-color:var(--paper-3);margin-top:1.5rem">
        <strong style="display:block;margin-bottom:.6rem">Points forts</strong>
        <ul class="ticks">${s.bullets.map((b) => `<li><span>${b}</span></li>`).join("")}</ul>
      </div>
    </div>
    <div><figure class="shot" style="aspect-ratio:4/3;border-radius:var(--radius)">${ctx.img(s.hero, s.heroAlt, "(min-width:920px) 45vw, 100vw")}</figure></div>
  </div>
</section>
<section class="section">
  <div class="container prose" style="max-width:none">${sectionsHTML}</div>
</section>
<section class="section darker">
  <div class="container">
    <div class="eyebrow">En images</div>
    <div class="section-head"><h2>Exemples de réalisations</h2></div>
    <div class="gallery">${galleryHTML}</div>
    <div class="btn-row" style="margin-top:1.6rem"><a class="btn btn--ghost" href="/realisations/">Toutes nos réalisations</a></div>
  </div>
</section>
<section class="section light">
  <div class="container">
    <div class="eyebrow">FAQ</div>
    <div class="section-head"><h2>Questions fréquentes</h2></div>
    ${ctx.faqHTML(s.faq)}
    <div style="margin-top:2rem"><h3 style="font-size:1.1rem;margin-bottom:.8rem">Autres services</h3><div class="btn-row">${related}</div></div>
  </div>
</section>
${ctx.ctaBand}`;

  const serviceLD = `<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Service","name":${JSON.stringify(s.name + " en Tunisie")},"serviceType":${JSON.stringify(s.name)},"provider":{"@id":"https://stim.tn/#organization"},"areaServed":{"@type":"Country","name":"Tunisie"},"description":${JSON.stringify(s.metaDesc)},"url":${JSON.stringify(`https://stim.tn/services/${s.slug}/`)}}
</script>`;

  return {
    title: s.metaTitle, desc: s.metaDesc, urlPath: `/services/${s.slug}/`, active: "services", body,
    extraLD: ctx.breadcrumbLD([{ name: "Accueil", url: "/" }, { name: "Services", url: "/services/" }, { name: s.name, url: `/services/${s.slug}/` }]) + "\n" + serviceLD + "\n" + ctx.faqLD(s.faq),
  };
};

/* ---------------- Réalisations ---------------- */
exports.realisations = (ctx) => {
  const shots = [
    ["hangar-metallique-montage-charpente", "Montage de la charpente métallique d'un hangar industriel", "span2 row2"],
    ["tour-metallique-elevateur-silos", "Tour métallique d'élévation et silos agro-industriels", "row2"],
    ["hangar-metallique-fini-interieur", "Intérieur d'un hangar métallique terminé, grande portée", ""],
    ["couverture-bardage-auvent-industriel", "Auvent industriel en charpente métallique et bac acier", ""],
    ["charpente-process-agro-industriel", "Charpente de process pour unité agro-industrielle", ""],
    ["hangar-metallique-double-nef", "Hangar métallique à double nef en construction", ""],
    ["plancher-metallique-berges-du-lac-tunis", "Plancher métallique sur ossature acier à Tunis", ""],
    ["unite-industrielle-silos-charpente-metallique", "Unité industrielle avec silos et charpente métallique", ""],
    ["couverture-bac-acier-charpente-metallique", "Couverture en bac acier sur charpente métallique", ""],
    ["passerelle-metallique-garde-corps-agro", "Passerelle métallique avec garde-corps sur site industriel", ""],
    ["montage-charpente-metallique-grue", "Montage d'une charpente métallique à la grue", "span2"],
    ["hangar-metallique-bardage-exterieur", "Bardage extérieur d'un hangar métallique", ""],
    ["mezzanine-metallique-plancher", "Mezzanine métallique et plancher acier", ""],
    ["atelier-fabrication-pont-roulant-stim", "Atelier de fabrication STIM avec pont roulant", ""],
    ["structure-process-agro-industrielle", "Structure de process agro-industrielle multi-niveaux", ""],
    ["auvent-metallique-galvanise-bord-de-mer", "Auvent métallique galvanisé en bord de mer", ""],
    ["charpente-metallique-portique-toiture", "Portiques et toiture en charpente métallique", ""],
    ["grue-mobile-stim-atelier", "Grue mobile STIM devant l'atelier", ""],
  ];
  const gal = shots.map(([slug, alt, cls]) =>
    `<figure class="shot ${cls}">${ctx.img(slug, alt, "(min-width:720px) 33vw, 100vw")}<figcaption>${alt}</figcaption></figure>`).join("\n");
  const body = `
<section class="page-hero">
  <div class="container">${ctx.crumbHTML([{ name: "Accueil", url: "/" }, { name: "Réalisations", url: "/realisations/" }])}</div>
  <div class="container page-hero__inner">
    <span class="eyebrow">Réalisations</span>
    <h1>Nos réalisations en charpente métallique</h1>
    <p>Hangars, bâtiments industriels, structures de process et ouvrages métalliques : un aperçu de chantiers conçus, fabriqués et montés par STIM partout en Tunisie.</p>
  </div>
</section>
<section class="section darker">
  <div class="container"><div class="gallery">${gal}</div></div>
</section>
<section class="section light section--tight">
  <div class="container center">
    <div class="eyebrow">Ils nous ont fait confiance</div>
    <div class="section-head" style="margin-bottom:2rem"><h2 style="font-size:clamp(1.5rem,1.2rem + 1.4vw,2rem)">Des références dans l'industrie &amp; l'agro-alimentaire</h2></div>
    ${clientsBand}
  </div>
</section>
${ctx.ctaBand}`;
  return {
    title: "Réalisations en Charpente Métallique en Tunisie | STIM",
    desc: "Galerie des réalisations STIM : hangars, bâtiments industriels, structures agro-industrielles et ouvrages métalliques livrés en Tunisie depuis 2008.",
    urlPath: "/realisations/", active: "realisations", body,
    extraLD: ctx.breadcrumbLD([{ name: "Accueil", url: "/" }, { name: "Réalisations", url: "/realisations/" }]),
  };
};

/* ---------------- Zones hub ---------------- */
exports.zonesHub = (ctx, CITIES) => {
  const cards = CITIES.map((c) =>
    `<a class="card card--link reveal" href="/${c.slug}/"><span class="card__num">${c.region.toUpperCase()}</span><h3>${c.name}</h3><p>${c.lead.split(".")[0]}.</p></a>`).join("\n");
  const others = ["Ariana", "Manouba", "Nabeul", "Bizerte", "Monastir", "Mahdia", "Kairouan", "Gabès", "Médenine", "Zaghouan"]
    .map((g) => `<li>${g}</li>`).join("");
  const body = `
<section class="page-hero">
  <div class="container">${ctx.crumbHTML([{ name: "Accueil", url: "/" }, { name: "Zones d'intervention", url: "/zones-intervention/" }])}</div>
  <div class="container page-hero__inner">
    <span class="eyebrow">Zones d'intervention</span>
    <h1>La charpente métallique partout en Tunisie</h1>
    <p>Implantée en zone industrielle de Ben Arous, STIM fabrique en atelier puis livre et monte ses structures dans le Grand Tunis et sur tout le territoire tunisien.</p>
  </div>
</section>
<section class="section">
  <div class="container">
    <div class="grid cols-4">${cards}</div>
  </div>
</section>
<section class="section light">
  <div class="container split">
    <div>
      <div class="eyebrow">Tout le territoire</div>
      <h2 class="section-head" style="margin-bottom:1rem">Et dans les autres gouvernorats</h2>
      <p class="lead" style="color:var(--txt-light-dim)">Au-delà de nos zones principales, STIM intervient dans l'ensemble de la Tunisie. Nous étudions chaque projet en intégrant la logistique de transport et de montage.</p>
      <ul class="prose" style="columns:2;max-width:30rem">${others}</ul>
      <div class="btn-row"><a class="btn" href="/contact/">Vérifier votre zone</a></div>
    </div>
    <div class="map-embed"><iframe title="Localisation de STIM à Ben Arous" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=36.7534669,10.2399379&z=15&output=embed"></iframe></div>
  </div>
</section>
${ctx.ctaBand}`;
  return {
    title: "Zones d'Intervention en Tunisie | STIM Charpente Métallique",
    desc: "STIM réalise vos charpentes métalliques à Ben Arous, Tunis, Sfax, Sousse et dans toute la Tunisie. Fabrication en atelier, transport et montage sur site.",
    urlPath: "/zones-intervention/", active: "zones", body,
    extraLD: ctx.breadcrumbLD([{ name: "Accueil", url: "/" }, { name: "Zones d'intervention", url: "/zones-intervention/" }]),
  };
};

/* ---------------- City page ---------------- */
exports.cityPage = (ctx, c, CITIES, SERVICES) => {
  const svcLinks = SERVICES.map((s) => `<a class="pill" href="/services/${s.slug}/">${s.name}</a>`).join(" ");
  const nearby = c.nearby.map((n) => `<li>${n}</li>`).join("");
  const body = `
<section class="page-hero">
  <div class="container">${ctx.crumbHTML([{ name: "Accueil", url: "/" }, { name: "Zones", url: "/zones-intervention/" }, { name: c.name, url: `/${c.slug}/` }])}</div>
  <div class="container page-hero__inner">
    <span class="eyebrow">${c.region}</span>
    <h1>Charpente métallique à ${c.name}</h1>
    <p>${c.lead}</p>
    <div class="btn-row" style="margin-top:1.6rem"><a class="btn" href="/contact/">Devis gratuit à ${c.name}</a><a class="btn btn--ghost" href="tel:+21655326160">Appeler</a></div>
  </div>
</section>
<section class="section light">
  <div class="container split">
    <div class="prose">${c.paragraphs.map((p) => `<p class="lead" style="color:var(--txt-light-dim)">${p}</p>`).join("")}</div>
    <div><figure class="shot" style="aspect-ratio:4/3;border-radius:var(--radius)">${ctx.img(c.hero, c.heroAlt, "(min-width:920px) 45vw, 100vw")}</figure></div>
  </div>
</section>
<section class="section">
  <div class="container">
    <div class="eyebrow">Sur place</div>
    <h2 class="section-head" style="margin-bottom:1.4rem">${c.sectorsTitle}</h2>
    <div class="card" style="max-width:46rem"><ul class="ticks">${c.sectors.map((s) => `<li><span>${s}</span></li>`).join("")}</ul></div>
    <h3 style="margin:2rem 0 .8rem">Nos services disponibles à ${c.name}</h3>
    <div class="btn-row">${svcLinks}</div>
    <h3 style="margin:2rem 0 .8rem">Communes &amp; zones desservies autour de ${c.name}</h3>
    <ul class="prose" style="columns:2;max-width:26rem">${nearby}</ul>
  </div>
</section>
<section class="section light">
  <div class="container">
    <div class="eyebrow">FAQ</div>
    <div class="section-head"><h2>${c.name} — questions fréquentes</h2></div>
    ${ctx.faqHTML(c.faq)}
  </div>
</section>
${ctx.ctaBand}`;
  const serviceLD = `<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Service","name":${JSON.stringify("Charpente métallique à " + c.name)},"serviceType":"Construction de charpente métallique","provider":{"@id":"https://stim.tn/#organization"},"areaServed":{"@type":"City","name":${JSON.stringify(c.name)}},"description":${JSON.stringify(c.metaDesc)},"url":${JSON.stringify(`https://stim.tn/${c.slug}/`)}}
</script>`;
  return {
    title: c.metaTitle, desc: c.metaDesc, urlPath: `/${c.slug}/`, active: "zones", body,
    extraLD: ctx.breadcrumbLD([{ name: "Accueil", url: "/" }, { name: "Zones", url: "/zones-intervention/" }, { name: c.name, url: `/${c.slug}/` }]) + "\n" + serviceLD + "\n" + ctx.faqLD(c.faq),
  };
};

/* ---------------- À propos ---------------- */
exports.about = (ctx) => {
  const body = `
<section class="page-hero">
  <div class="container">${ctx.crumbHTML([{ name: "Accueil", url: "/" }, { name: "À propos", url: "/a-propos/" }])}</div>
  <div class="container page-hero__inner">
    <span class="eyebrow">L'entreprise</span>
    <h1>STIM, votre partenaire en construction métallique depuis 2008</h1>
    <p>Société Tunisienne d'Industrie Métallique — un atelier, un bureau d'études et des équipes de montage réunis pour livrer des structures fiables, partout en Tunisie.</p>
  </div>
</section>
<section class="section">
  <div class="container">
    <div class="stats">
      <div class="stat"><b>2008</b><span>année de création</span></div>
      <div class="stat"><b>60</b><span>soudeurs, monteurs &amp; chaudronniers</span></div>
      <div class="stat"><b>6</b><span>familles de structures métalliques</span></div>
      <div class="stat"><b>Tunisie</b><span>zone d'intervention</span></div>
    </div>
  </div>
</section>
<section class="section light">
  <div class="container split">
    <div class="prose">
      <h2>Une entreprise industrielle intégrée</h2>
      <p>Fondée en 2008 et implantée en zone industrielle de Ben Arous, STIM (Société Tunisienne d'Industrie Métallique) conçoit, fabrique et monte des charpentes et structures métalliques. Notre force : réunir sous un même toit l'étude, la fabrication et le montage.</p>
      <p>Cette intégration nous donne le contrôle de la qualité et des délais à chaque étape — un avantage décisif pour les industriels qui ne peuvent pas se permettre d'arrêter leur production.</p>
      <h2>Des équipes qualifiées</h2>
      <p>STIM, c'est une équipe de <strong>60 ouvriers</strong> — soudeurs, monteurs, chaudronniers et métalliers — formés à nos exigences de qualité et de sécurité. Notre atelier est équipé de ponts roulants et de machines de débit, et nous disposons de nos propres grues mobiles pour le levage sur chantier.</p>
      <h2>Qualité &amp; normes</h2>
      <p>Nos structures sont dimensionnées selon les règles de calcul de l'Eurocode 3, avec prise en compte des charges climatiques tunisiennes. Les assemblages sont réalisés par soudure et boulonnerie haute résistance, puis protégés par peinture industrielle ou galvanisation à chaud selon l'environnement.</p>
    </div>
    <div>
      <figure class="shot" style="aspect-ratio:4/3;border-radius:var(--radius);margin-bottom:.9rem">${ctx.img("atelier-fabrication-poutres-acier-stim", "Atelier de fabrication STIM : assemblage de poutres en acier", "(min-width:920px) 45vw, 100vw")}</figure>
      <figure class="shot" style="aspect-ratio:16/10;border-radius:var(--radius)">${ctx.img("grue-mobile-stim-atelier", "Grue mobile STIM utilisée pour le montage sur chantier", "(min-width:920px) 45vw, 100vw")}</figure>
    </div>
  </div>
</section>
<section class="section">
  <div class="container">
    <div class="eyebrow">Pourquoi nous choisir</div>
    <h2 class="section-head" style="margin-bottom:1.4rem">Nos engagements</h2>
    <div class="grid cols-3">
      <div class="card reveal"><h3>Maîtrise complète</h3><p>Étude, fabrication et montage par une seule entreprise : un seul interlocuteur, une responsabilité claire.</p></div>
      <div class="card reveal"><h3>Délais tenus</h3><p>La fabrication en atelier et nos moyens de levage propres réduisent les aléas et raccourcissent les délais.</p></div>
      <div class="card reveal"><h3>Durabilité</h3><p>Aciers, calculs et traitements anticorrosion choisis pour la longévité, y compris en milieu agressif ou côtier.</p></div>
    </div>
  </div>
</section>
<section class="section light section--tight">
  <div class="container center">
    <div class="eyebrow">Ils nous ont fait confiance</div>
    <div class="section-head" style="margin-bottom:2rem"><h2 style="font-size:clamp(1.5rem,1.2rem + 1.4vw,2rem)">Des références dans l'industrie tunisienne</h2><p style="color:var(--txt-light-dim)">Groupe Hamrouni (Sotunol, Polyflex, Polymousse, Chimicouleurs Emballages, R.C.S.), GCA / Jouda, California Gym, K. Damak Shipping, Comet, Moulin d'Or, Groupe Mzabi / Dalmas, Concorde Berges du Lac. <span title="À vérifier" style="color:var(--accent)">[À VÉRIFIER]</span></p></div>
    ${clientsBand}
  </div>
</section>
${ctx.ctaBand}`;
  return {
    title: "À propos de STIM | Construction Métallique en Tunisie depuis 2008",
    desc: "STIM, Société Tunisienne d'Industrie Métallique : 60 ouvriers, un atelier à Ben Arous et un bureau d'études intégré. Charpente métallique de qualité depuis 2008.",
    urlPath: "/a-propos/", active: "apropos", body,
    extraLD: ctx.breadcrumbLD([{ name: "Accueil", url: "/" }, { name: "À propos", url: "/a-propos/" }]) +
      `\n<script type="application/ld+json">{"@context":"https://schema.org","@type":"AboutPage","name":"À propos de STIM","url":"https://stim.tn/a-propos/","about":{"@id":"https://stim.tn/#organization"}}</script>`,
  };
};

/* ---------------- 404 ---------------- */
exports.notFound = (ctx) => {
  const body = `
<section class="page-hero">
  <div class="container page-hero__inner" style="text-align:center;margin-inline:auto">
    <span class="eyebrow" style="justify-content:center">Erreur 404</span>
    <h1>Cette page est introuvable</h1>
    <p style="margin-inline:auto">La page que vous cherchez a peut-être été déplacée. Revenez à l'accueil ou contactez-nous directement.</p>
    <div class="btn-row" style="justify-content:center;margin-top:1.6rem"><a class="btn" href="/">Retour à l'accueil</a><a class="btn btn--ghost" href="/contact/">Nous contacter</a></div>
  </div>
</section>
<section class="section">
  <div class="container center">
    <div class="eyebrow" style="justify-content:center">Aller directement à</div>
    <div class="btn-row" style="justify-content:center;flex-wrap:wrap">
      <a class="pill" href="/services/">Services</a>
      <a class="pill" href="/realisations/">Réalisations</a>
      <a class="pill" href="/zones-intervention/">Zones</a>
      <a class="pill" href="/a-propos/">À propos</a>
      <a class="pill" href="/contact/">Contact</a>
    </div>
  </div>
</section>`;
  return { title: "Page introuvable (404) | STIM", desc: "La page demandée est introuvable sur le site de STIM.", urlPath: "/404.html", active: "", body, extraLD: "" };
};
