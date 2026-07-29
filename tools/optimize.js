/**
 * STIM – Image optimisation pipeline
 * Converts source photos/logos to responsive WebP, builds favicons + OG image.
 * Run: node tools/optimize.js   (from project root, or `npm run build` in tools/)
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "images");
const OUT_IMG = path.join(ROOT, "assets", "img");
const OUT_CLIENTS = path.join(ROOT, "assets", "clients");
const OUT_LOGO = path.join(ROOT, "assets", "logo");
const OUT_ICONS = path.join(ROOT, "assets", "icons");

for (const d of [OUT_IMG, OUT_CLIENTS, OUT_LOGO, OUT_ICONS]) {
  fs.mkdirSync(d, { recursive: true });
}

const WIDTHS = [400, 800, 1200, 1600];
const QUALITY = 74;

// Source photo -> SEO-friendly slug
const PHOTOS = {
  "img1.jpeg": "hangar-metallique-montage-charpente",
  "img2.jpeg": "charpente-metallique-hangar-ben-arous",
  "img3.jpeg": "couverture-bac-acier-charpente-metallique",
  "img4.jpeg": "montage-charpente-metallique-grue",
  "img5.jpeg": "batiment-industriel-metallique-interieur",
  "img6.jpeg": "plancher-metallique-berges-du-lac-tunis",
  "img7.jpeg": "ossature-metallique-batiment",
  "img8.jpeg": "auvent-metallique-galvanise-bord-de-mer",
  "img9.jpeg": "couverture-bardage-auvent-industriel",
  "img10.jpeg": "hangar-metallique-ossature-acier",
  "img11.jpeg": "hangar-metallique-double-nef",
  "img12.jpeg": "hangar-metallique-grande-portee",
  "img13.jpeg": "charpente-process-agro-industriel",
  "img14.jpeg": "unite-industrielle-silos-charpente-metallique",
  "img15.jpeg": "passerelle-metallique-garde-corps-agro",
  "img16.jpeg": "tour-metallique-elevateur-silos",
  "img17.jpeg": "structure-process-agro-industrielle",
  "img18.jpeg": "mezzanine-metallique-plancher",
  "img20.jpeg": "ossature-toiture-surelevation-metallique",
  "img21.jpeg": "grue-mobile-stim-atelier",
  "img22.jpeg": "atelier-fabrication-pont-roulant-stim",
  "img23.jpeg": "atelier-fabrication-poutres-acier-stim",
  "img24.jpeg": "grue-mobile-stim-parc-acier",
  "img25.jpeg": "hangar-metallique-fini-interieur",
  "img26.jpeg": "hangar-metallique-bardage-exterieur",
  "img27.jpeg": "charpente-metallique-portique-toiture",
  "char1.jpg": "charpente-cintree-facade-hotel",
  "char2.jpg": "charpente-metallique-blanche-grande-portee",
  "char3.jpg": "auvent-metallique-bleu-station",
  "char4.jpg": "ossature-terrasse-metallique-bord-mer",
  "char5.jpg": "portiques-hangar-metallique-montage",
  "char6.jpg": "verriere-atrium-structure-acier",
  "char7.jpg": "chantier-hangar-metallique-stim",
  "char9.jpg": "portiques-acier-zone-industrielle",
  "char10.jpg": "ossature-hangar-poutres-treillis",
  "char11.jpg": "poutre-treillis-charpente-detail",
  "char12.jpg": "chantier-charpente-metallique-portiques",
  "char13.jpg": "levage-portiques-grue-mobile",
  "char14.jpg": "charpente-auvent-acier-bleu",
  "char15.jpg": "parc-stockage-acier-atelier",
  "char16.jpg": "interieur-hangar-montage-charpente",
  "char17.jpg": "bardage-interieur-hangar-metallique",
  "char18.jpg": "plateforme-metallique-cuve-process",
  "char20.jpg": "cuves-inox-charpente-support",
  "char21.jpg": "structure-process-pont-roulant",
  "char22.jpg": "batiment-industriel-bardage-blanc",
  "char23.jpg": "facade-bardage-hangar-industriel",
  "char24.jpg": "charpente-hangar-ossature-beton",
  "char25.jpg": "chaudronnerie-roulage-virole-acier",
  "char26.jpg": "grue-stim-levage-charpente",
  "char27.jpg": "grue-mobile-stim-levage-structure",
  "char28.jpg": "charpente-support-cuves-agro",
  "char29.jpg": "structure-metallique-process-etages",
  "char30.jpg": "hangars-industriels-bardage-allee",
};

const CLIENTS = {
  "KDAMAK.png": "kdamak",
  "COMET.png": "comet",
  "CALIFORNIA.png": "california",
  "JOUDA.jpg": "jouda",
  "GCA.jpg": "gca",
  "CHIMICOULEURS.png": "chimicouleurs",
  "polyflex.png": "polyflex",
  "sotunol.png": "sotunol",
  "moulin d'or.png": "moulin-dor",
  "MZABI.jpg": "mzabi",
};

async function buildPhotos() {
  const manifest = {};
  for (const [file, slug] of Object.entries(PHOTOS)) {
    const input = path.join(SRC, file);
    if (!fs.existsSync(input)) {
      console.warn("  ! missing", file);
      continue;
    }
    const meta = await sharp(input).metadata();
    // EXIF orientations 5-8 swap width/height once .rotate() is applied
    const swapped = (meta.orientation || 1) >= 5;
    const srcW = (swapped ? meta.height : meta.width) || 1600;
    const srcH = (swapped ? meta.width : meta.height) || 1200;
    const targets = WIDTHS.filter((w) => w <= srcW);
    if (targets.length === 0) targets.push(srcW);
    let generated = 0;
    for (const w of targets) {
      const out = path.join(OUT_IMG, `${slug}-${w}.webp`);
      if (fs.existsSync(out)) continue; // keep existing files byte-identical
      await sharp(input)
        .rotate()
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(out);
      generated++;
    }
    const maxW = targets[targets.length - 1];
    manifest[slug] = { widths: targets, w: maxW, h: Math.round((maxW * srcH) / srcW) };
    console.log(`  photo ${slug} -> ${targets.join(",")}${generated ? "" : " (déjà à jour)"}`);
  }
  const out = path.join(__dirname, "content", "img-manifest.json");
  const sorted = Object.fromEntries(Object.keys(manifest).sort().map((k) => [k, manifest[k]]));
  fs.writeFileSync(out, JSON.stringify(sorted, null, 1) + "\n");
  console.log(`  manifest -> ${path.relative(ROOT, out)} (${Object.keys(sorted).length} slugs)`);
}

async function buildClients() {
  for (const [file, slug] of Object.entries(CLIENTS)) {
    const input = path.join(SRC, file);
    if (!fs.existsSync(input)) {
      console.warn("  ! missing client", file);
      continue;
    }
    await sharp(input)
      .resize({ height: 160, withoutEnlargement: true, fit: "inside" })
      .webp({ quality: 92 })
      .toFile(path.join(OUT_CLIENTS, `${slug}.webp`));
    console.log(`  client ${slug}`);
  }
}

async function buildLogo() {
  const input = path.join(OUT_LOGO, "stim-logo.png");
  if (!fs.existsSync(input)) {
    console.warn("  ! logo png missing");
    return;
  }
  const meta = await sharp(input).metadata();
  console.log(`  logo source ${meta.width}x${meta.height} alpha=${meta.hasAlpha}`);
  await sharp(input)
    .trim({ threshold: 10 })
    .resize({ width: 520, withoutEnlargement: true })
    .webp({ quality: 92 })
    .toFile(path.join(OUT_LOGO, "stim-logo.webp"));
  console.log("  logo -> stim-logo.webp");
}

// On-brand "hangar portal" emblem used for favicons
const EMBLEM_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="13" fill="#16181B"/>
  <path d="M13 51 V27 L32 13 L51 27 V51" fill="none" stroke="#F5A300" stroke-width="5.5" stroke-linejoin="round" stroke-linecap="round"/>
  <path d="M13 51 H51" stroke="#F5A300" stroke-width="5.5" stroke-linecap="round"/>
  <path d="M22 51 V34 L32 27 L42 34 V51" fill="none" stroke="#C5CAD0" stroke-width="2.4" stroke-linejoin="round"/>
</svg>`;

async function buildIcons() {
  fs.writeFileSync(path.join(OUT_ICONS, "favicon.svg"), EMBLEM_SVG.trim());
  const svgBuf = Buffer.from(EMBLEM_SVG);
  const sizes = { "favicon-32.png": 32, "apple-touch-icon.png": 180, "icon-192.png": 192, "icon-512.png": 512 };
  for (const [name, size] of Object.entries(sizes)) {
    await sharp(svgBuf, { density: 384 }).resize(size, size).png().toFile(path.join(OUT_ICONS, name));
  }
  console.log("  icons -> favicon.svg + png set");
}

async function buildOG() {
  // 1200x630 social card from a strong hero photo + dark overlay + text
  const base = path.join(SRC, "char10.jpg");
  if (!fs.existsSync(base)) return;
  const W = 1200, H = 630;
  const photo = await sharp(base).rotate().resize({ width: W, height: H, fit: "cover", position: "centre" }).toBuffer();
  const overlay = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#0d0f11" stop-opacity="0.45"/>
        <stop offset="0.55" stop-color="#0d0f11" stop-opacity="0.75"/>
        <stop offset="1" stop-color="#0d0f11" stop-opacity="0.92"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#g)"/>
    <rect x="64" y="86" width="64" height="8" fill="#F5A300"/>
    <text x="64" y="150" font-family="Arial, sans-serif" font-size="34" letter-spacing="6" fill="#F5A300" font-weight="700">STIM</text>
    <text x="62" y="408" font-family="Arial, sans-serif" font-size="76" fill="#ffffff" font-weight="800">Construction de</text>
    <text x="62" y="492" font-family="Arial, sans-serif" font-size="76" fill="#ffffff" font-weight="800">charpente métallique</text>
    <text x="64" y="560" font-family="Arial, sans-serif" font-size="34" fill="#C5CAD0">Tunisie · Hangars · Bâtiments industriels · depuis 2008</text>
  </svg>`);
  await sharp(photo).composite([{ input: overlay }]).jpeg({ quality: 82 }).toFile(path.join(OUT_ICONS, "og-image.jpg"));
  console.log("  og-image.jpg");
}

(async () => {
  console.log("Building photos…");      await buildPhotos();
  console.log("Building client logos…"); await buildClients();
  console.log("Building STIM logo…");     await buildLogo();
  console.log("Building icons…");         await buildIcons();
  console.log("Building OG image…");       await buildOG();
  console.log("Done.");
})().catch((e) => { console.error(e); process.exit(1); });
