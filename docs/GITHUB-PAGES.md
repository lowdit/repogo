# GitHub Pages — Repogo

- **Démo publiée (cible org)** : `https://lowdit.github.io/repogo/`
- **Source Hugo** : `exampleSite/` (`.github/hugo-site-dir`)
- **Build** : `./scripts/hugo-pages-build.sh "https://lowdit.github.io/repogo/"` (CI : `.github/workflows/gh-pages.yml`, Hugo **0.167.0** extended)
- **Activation** : Settings → Pages → GitHub Actions

Config prod : `exampleSite/config/production/hugo.toml` (modules `github.com/lowdit/repogo`, `github.com/lowdit/minigo`).

**Note exampleSite** : le rapport démo *Plateforme tests hybrides* utilise le shortcode `mermaid` ; une copie locale vit dans `exampleSite/layouts/shortcodes/mermaid.html` tant que le module Minigo publié ne l’expose pas encore via le module Hugo.
