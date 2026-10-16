---
title: Repogo
description: Rapports web, chapitres et export print Paged.js.
layout: product
weight: 1
---

**Repogo** est le moteur d’édition Lowdit ; avec Minigo et la vue **publisher**, le site adopte une posture de **catalogue éditorial** (parution mise en avant, grille de publications). Voir `lowdit-brand/brand/VUES-PREMIUM.md`.

## Directement depuis GitHub (fork)

1. **Forker** [`lowdit/repogo`](https://github.com/lowdit/repogo).
2. **Settings → Pages → Source : GitHub Actions**.
3. Le workflow construit `exampleSite/` et publie la démo. Déposez vos rapports dans `exampleSite/content/reports/`.

## En local (dépôt cloné)

```bash
git clone https://github.com/lowdit/repogo
cd repogo/exampleSite
hugo server
```

## Dans votre propre site (module Hugo)

```toml
theme = ["repogo", "minigo"]

[params.lowdit]
  siteProfile = "publisher"
  view = "publisher"
```

Puis `hugo server` : vos rapports se construisent depuis `content/reports/`.

## GitHub Pages (votre site)

Le workflow construit `exampleSite/` par défaut ; passez à `.` dans `.github/hugo-site-dir` si votre `content/` est à la racine.
