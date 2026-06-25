/**
 * STIM — vérificateur de liens & ressources internes.
 * Usage : node tools/check.js [baseUrl]   (défaut http://localhost:8080)
 * Le site doit être servi en local (npx http-server . -p 8080).
 */
const BASE = (process.argv[2] || "http://localhost:8080").replace(/\/$/, "");

const pages = new Set();   // pages HTML à explorer
const assets = new Set();  // ressources à vérifier
const seenPage = new Set();
const refs = {};           // url -> page référente
const results = [];

function local(u) {
  if (!u) return null;
  if (u.startsWith("#") || u.startsWith("mailto:") || u.startsWith("tel:") || u.startsWith("http")) return null;
  if (!u.startsWith("/")) return null;
  return u.split("#")[0];
}
function isPage(u) { return u.endsWith("/") || u.endsWith(".html"); }

function extract(html, base) {
  const urls = new Set();
  const re = /(?:href|src)="([^"]+)"/g;
  let m;
  while ((m = re.exec(html))) { const u = local(m[1]); if (u) urls.add(u); }
  // srcset : on prend chaque candidat
  const rs = /srcset="([^"]+)"/g;
  while ((m = rs.exec(html))) {
    m[1].split(",").forEach((c) => { const u = local(c.trim().split(/\s+/)[0]); if (u) urls.add(u); });
  }
  return [...urls];
}

async function head(url) {
  try {
    const r = await fetch(BASE + url, { redirect: "manual" });
    return r.status;
  } catch (e) { return "ERR:" + e.message; }
}

async function crawl(url, ref) {
  if (seenPage.has(url)) return;
  seenPage.add(url);
  let res;
  try { res = await fetch(BASE + url); } catch (e) { results.push([url, "ERR", ref]); return; }
  if (res.status !== 200) { results.push([url, res.status, ref]); return; }
  const html = await res.text();
  for (const u of extract(html, url)) {
    refs[u] = refs[u] || url;
    if (isPage(u)) pages.add(u); else assets.add(u);
  }
}

(async () => {
  // amorçage via sitemap
  try {
    const sm = await (await fetch(BASE + "/sitemap.xml")).text();
    (sm.match(/<loc>([^<]+)<\/loc>/g) || []).forEach((l) => {
      const u = l.replace(/<\/?loc>/g, "").replace(BASE, "").replace("https://stim.tn", "");
      if (u.startsWith("/")) pages.add(u);
    });
  } catch (_) {}
  pages.add("/");

  // explorer les pages (jusqu'à stabilisation)
  let prev = 0;
  while (pages.size !== prev) {
    prev = pages.size;
    for (const p of [...pages]) await crawl(p, refs[p] || "(seed)");
  }

  // vérifier les ressources
  const assetResults = [];
  for (const a of [...assets]) {
    const s = await head(a);
    if (s !== 200) assetResults.push([a, s, refs[a]]);
  }

  console.log(`\nPages HTML explorées : ${seenPage.size}`);
  console.log(`Ressources vérifiées : ${assets.size}`);
  const pageErrs = results.filter((r) => r[1] !== 200);
  if (pageErrs.length) { console.log("\n❌ Pages en erreur :"); pageErrs.forEach((r) => console.log("  ", r[1], r[0], "← réf", r[2])); }
  else console.log("✅ Toutes les pages répondent 200.");
  if (assetResults.length) { console.log("\n❌ Ressources cassées :"); assetResults.forEach((r) => console.log("  ", r[1], r[0], "← réf", r[2])); }
  else console.log("✅ Toutes les ressources internes répondent 200.");

  process.exit(pageErrs.length + assetResults.length ? 1 : 0);
})();
