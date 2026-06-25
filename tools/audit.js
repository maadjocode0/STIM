/** SEO audit: titres/desc uniques, 1 H1, canonical, JSON-LD valide. */
const BASE = (process.argv[2] || "http://localhost:8080").replace(/\/$/, "");

(async () => {
  const sm = await (await fetch(BASE + "/sitemap.xml")).text();
  const urls = (sm.match(/<loc>([^<]+)<\/loc>/g) || []).map((l) =>
    l.replace(/<\/?loc>/g, "").replace("https://stim.tn", ""));

  const titles = {}, descs = {}, warn = [];
  console.log("URL".padEnd(42), "Tlen", "Dlen", "H1", "LD", "Canon");
  for (const u of urls) {
    const html = await (await fetch(BASE + u)).text();
    const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || "";
    const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || "";
    const h1 = (html.match(/<h1[ >]/g) || []).length;
    const lds = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
    let ldOK = 0, ldBad = 0;
    lds.forEach((b) => {
      const json = b.replace(/<script type="application\/ld\+json">/, "").replace(/<\/script>/, "").trim();
      try { JSON.parse(json); ldOK++; } catch (e) { ldBad++; warn.push(`JSON-LD invalide sur ${u}: ${e.message}`); }
    });
    const canon = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || "";
    const canonOK = canon === "https://stim.tn" + u ? "ok" : "MISMATCH(" + canon + ")";
    const lang = (html.match(/<html lang="([^"]*)"/) || [])[1] || "";

    titles[title] = (titles[title] || 0) + 1;
    descs[desc] = (descs[desc] || 0) + 1;
    if (h1 !== 1) warn.push(`${u} a ${h1} H1`);
    if (title.length < 25 || title.length > 65) warn.push(`${u} titre ${title.length} car. : "${title}"`);
    if (desc.length < 70 || desc.length > 165) warn.push(`${u} description ${desc.length} car.`);
    if (ldBad) warn.push(`${u} : ${ldBad} bloc(s) JSON-LD invalide(s)`);
    if (lang !== "fr-TN") warn.push(`${u} lang="${lang}"`);
    console.log(u.padEnd(42), String(title.length).padStart(4), String(desc.length).padStart(4),
      String(h1).padStart(2), String(ldOK).padStart(2), canonOK);
  }

  const dupT = Object.entries(titles).filter(([, n]) => n > 1);
  const dupD = Object.entries(descs).filter(([, n]) => n > 1);
  if (dupT.length) warn.push("Titres dupliqués : " + dupT.map(([t]) => t).join(" | "));
  if (dupD.length) warn.push("Descriptions dupliquées (" + dupD.length + ")");

  console.log("\n" + (warn.length ? "⚠️  " + warn.length + " avertissement(s) :" : "✅ Aucun problème SEO détecté."));
  warn.forEach((w) => console.log("  -", w));
})();
