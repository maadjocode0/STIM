# Site web STIM — Construction de charpente métallique

Site vitrine statique (HTML/CSS/JS, **sans framework, sans build obligatoire**) optimisé pour le référencement en Tunisie sur « construction de charpente métallique » et requêtes associées.

- **Entreprise :** STIM — Société Tunisienne d'Industrie Métallique (SUARL)
- **Domaine cible :** `stim.tn`
- **Stack :** HTML statique + 1 fichier CSS + 1 fichier JS. Hébergeable sur Netlify, Vercel ou Cloudflare Pages.

---

## 1. Lancer le site en local

Le site utilise des **chemins absolus** (`/assets/...`, `/services/...`). Il faut donc le servir par un petit serveur web — ne l'ouvrez pas en double-cliquant le fichier (`file://` ne fonctionnera pas).

```bash
# depuis le dossier du projet
npx http-server . -p 8080 -c-1
# puis ouvrez http://localhost:8080
```

Alternatives : extension **Live Server** (VS Code), ou `python -m http.server 8080`.

---

## 2. Structure du projet

```
/                              Accueil (index.html)
/services/                     Aperçu des services + 6 pages détaillées
/realisations/                 Galerie de réalisations
/zones-intervention/           Zones desservies (hub)
/charpente-metallique-*/       4 pages villes (Ben Arous, Tunis, Sfax, Sousse)
/a-propos/                     Présentation de l'entreprise
/contact/                      Formulaire de devis + carte
/404.html                      Page d'erreur
sitemap.xml · robots.txt · manifest.webmanifest
netlify.toml · vercel.json · _headers     Configurations de déploiement

assets/
  css/styles.css               Design system complet
  js/main.js                   Menu mobile, FAQ, envoi du formulaire
  img/                         Photos optimisées (WebP, plusieurs tailles)
  clients/                     Logos clients/références (WebP)
  logo/                        Logo STIM
  icons/                       Favicons + image de partage (og-image)

images/                        ⚙️ SOURCES (photos d'origine) — non publiées
tools/                         ⚙️ Scripts de génération (optionnels)
```

> **`images/` et `tools/` sont des dossiers de travail.** Ils ne sont pas nécessaires en production ; vous pouvez les exclure du déploiement si vous le souhaitez (le site fonctionne sans eux).

---

## 3. Modifier le contenu

### Textes, téléphones, adresse
Le site est en **HTML simple** : ouvrez le fichier `.html` voulu et modifiez le texte directement.

⚠️ **Le téléphone, l'adresse et l'e-mail (NAP) doivent rester identiques partout** (c'est important pour le SEO local). Ils apparaissent dans :
- le pied de page de **chaque** page (`<footer>`),
- la page `/contact/`,
- les données structurées `JSON-LD` en haut de chaque page (`<script type="application/ld+json">`).

Coordonnées actuelles (à vérifier/compléter — voir § 7) :
- Tél : **55 326 160** · 22 326 600 · 31 422 003 — WhatsApp : **55 326 160**
- E-mail : **contact@stim.tn**
- Adresse : **Rue de Mercure, Zone Industrielle, 2013 Ben Arous**
- GPS : **36.7534669, 10.2399379**

### Régénérer les pages secondaires (optionnel)
Les 14 pages (services, villes, réalisations, à propos, 404) sont produites à partir de gabarits dans `tools/content/`. Si vous préférez modifier le contenu en un seul endroit :

```bash
node tools/build-pages.js
```

Vous pouvez aussi tout éditer à la main dans les fichiers `.html` — au choix.

---

## 4. Remplacer / ajouter des photos

1. Déposez vos photos d'origine (JPEG/PNG) dans `images/`.
2. Mettez à jour la liste `PHOTOS` (et `CLIENTS` pour les logos) dans `tools/optimize.js`.
3. Lancez l'optimisation :
   ```bash
   node tools/optimize.js
   ```
   Cela crée des **WebP responsives** dans `assets/img/` (tailles 400/800/1200/1600 px selon l'original), les logos dans `assets/clients/`, les favicons et l'image de partage `og-image.jpg`.
4. Référencez la nouvelle image dans le HTML (attribut `alt` descriptif avec mots-clés).

> Prérequis : **Node.js** installé. La première exécution installe la librairie `sharp` (`cd tools && npm install`).

---

## 5. Connecter le formulaire de devis (Web3Forms)

Le formulaire `/contact/` envoie les demandes par e-mail via **Web3Forms** (gratuit, aucun serveur à gérer).

1. Allez sur **https://web3forms.com**, saisissez **contact@stim.tn** → vous recevez une **clé d'accès** (Access Key) par e-mail.
2. Ouvrez `contact/index.html`, trouvez la ligne :
   ```html
   <input type="hidden" name="access_key" value="VOTRE_CLE_WEB3FORMS">
   ```
   Remplacez `VOTRE_CLE_WEB3FORMS` par votre clé.
3. C'est tout : chaque demande arrive sur **contact@stim.tn**.

Tant que la clé n'est pas configurée, le formulaire affiche un message invitant à appeler/écrire (il ne plante pas).

> Vous pouvez aussi changer de service (Formspree, Netlify Forms). Avec Netlify Forms, ajoutez `netlify` au `<form>` et remplacez la logique d'envoi dans `assets/js/main.js`.

---

## 6. Déployer

Le site marche sur n'importe quel hébergeur statique (le formulaire est indépendant de l'hébergeur).

### Netlify (recommandé, le plus simple)
- **Glisser-déposer :** déposez le dossier du projet sur https://app.netlify.com/drop.
- **Ou via Git :** connectez le dépôt, build command vide, *publish directory* = `.`. Le fichier `netlify.toml` est déjà prêt.

### Vercel
Importez le projet (framework « Other »). `vercel.json` gère les URLs propres et le cache.

### Cloudflare Pages
Build command vide, *output directory* = `/`. Le fichier `_headers` gère le cache et la sécurité.

### Brancher le domaine .tn
1. Achetez/gérez `stim.tn` auprès d'un registrar agréé ATI (ex. via votre hébergeur tunisien).
2. Chez l'hébergeur (Netlify/Vercel/Cloudflare), ajoutez le domaine personnalisé et suivez les instructions DNS (enregistrements `A`/`CNAME`).
3. Activez le **HTTPS** (automatique sur ces plateformes).

---

## 7. ✅ À me fournir / vérifier (marqué `[À VÉRIFIER]` dans le site)

| Élément | Statut |
|---|---|
| Clé **Web3Forms** (formulaire) | à créer (§ 5) |
| Réseaux sociaux (Facebook / Instagram / LinkedIn) | liens à fournir (placeholders `#` dans le footer + `sameAs` du JSON-LD) |
| Horaires d'ouverture exacts | 8h–17h / sam 8h–13h supposés |
| Code postal du siège (2013 ?) | à confirmer |
| Délais de fabrication annoncés (3–6 sem.) | à confirmer |
| Nombre de structures livrées (« +100 ») | à confirmer (accueil) |
| Détails des références clients (ville/type) | à confirmer |

Cherchez `[À VÉRIFIER]` dans le code pour tout retrouver.

---

## 8. Checklist post-lancement (SEO)

- [ ] Brancher le domaine **stim.tn** + HTTPS.
- [ ] Créer **Google Search Console** (https://search.google.com/search-console), valider le domaine, **soumettre `https://stim.tn/sitemap.xml`**.
- [ ] Créer/optimiser la fiche **Google Business Profile** (https://business.google.com) : nom **STIM**, catégorie « Entreprise de construction métallique / Constructeur de structures métalliques », adresse Ben Arous, téléphone **55 326 160**, horaires, photos de chantiers. Le **NAP doit être identique** à celui du site.
- [ ] Créer **Bing Webmaster Tools** et y soumettre le sitemap.
- [ ] Vérifier l'indexation (`site:stim.tn` dans Google après quelques jours).
- [ ] Obtenir les **premiers avis Google** : demandez à vos clients satisfaits (Sotunol, GCA, Moulin d'Or…) un avis avec photo ; partagez le lien d'avis de la fiche.
- [ ] Inscrire STIM dans les **annuaires tunisiens** (Tunisie Annonce, pages jaunes locales, annuaires BTP) avec le même NAP.
- [ ] Mesurer la performance avec **PageSpeed Insights** (https://pagespeed.web.dev) et viser 90+ sur mobile.
- [ ] Renseigner les **réseaux sociaux** et les lier (footer + `sameAs`).

---

## 9. Vérifier la qualité (liens & images)

Un script vérifie que toutes les pages, images et liens internes répondent :

```bash
# le site doit tourner en local (npx http-server . -p 8080)
node tools/check.js http://localhost:8080
```

---

*Site réalisé avec une attention particulière au SEO technique (titres/descriptions uniques, JSON-LD LocalBusiness/Service/FAQ/Breadcrumb, sitemap, NAP cohérent), à la performance (WebP responsives, CSS/JS légers) et à l'accessibilité (sémantique, focus, `prefers-reduced-motion`).*
