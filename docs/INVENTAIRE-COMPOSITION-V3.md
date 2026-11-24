# Inventaire — vague 3 composition CSS (Repogo)

> **Date :** 2026-11-13 · **Fil :** [`MIGRATION-UNIVERS-CSS.md`](../../lowdit-brand/docs/MIGRATION-UNIVERS-CSS.md) vague 3 (Repogo d’abord).
> **Périmètre :** écrons Hugo + CSS racine `repogo/` — hors `public/`, hors vague 5 (alias).

## Layouts (`repogo/layouts/`)

| Fichier | Rôle | Compositions cible | Classes métier conservées |
| --- | --- | --- | --- |
| `_default/single.html` | Rapport / chapitre écran | `.with-sidebar`, `.doc-body`, `.doc-nav` | `repogo-article`, `repogo-toc`, `repogo-article__body` |
| `_partials/home/publisher.html` | Accueil publisher | `.wrapper[data-width=full]`, `.with-sidebar`, `.cluster`, `.stack`, `.doc-body` | `pub-workspace`, `pub-catalog`, `pub-reader`, `pub-pinned`, … |
| `_partials/print/*` | Print gazette, courrier, CR | — (hors vague 3 écran) | `gazette-*`, `courrier-*`, `record-*` |
| Coque / listes / baseof | Hérités **minigo** | via thème | — |

## Feuilles CSS (`assets/css/`)

| Couche | Fichiers | Action vague 3 |
| --- | --- | --- |
| Tokens | `tokens/*` | Sync Brand — alias `lowdit-layout--*` conservés (vague 5) |
| Compositions | `compositions.css` | Sync Brand — `.wrapper`, `.with-sidebar`, `.grid`, `.stack`, `.cluster` |
| Prose | `lowdit-base.css` | Alias `.minigo-body` / `.lowdit-product__content` — ne pas supprimer |
| Composants | `components/*` | Sync Brand |
| Vues écran | `views/publisher.css` | Grille accueil → pont `.with-sidebar` ; lecture rapport inchangée métier |
| Print | `gazette.css`, `courrier.css`, `pagejs.css`, … | Hors scope vague 3 |

## Contenus `exampleSite/`

- Markdown : pas de classes de layout legacy (`lowdit-layout--*`, styles inline).
- Shortcode : `lowdit-diagram` + `mermaid` (exception documentée).

## Mappings appliqués (2026-11-13)

| Avant | Après |
| --- | --- |
| `minigo-body` (single) | `doc-body` |
| `pub-workspace__grid` (accueil) | `.with-sidebar` dans partial Repogo |
| `article.with-sidebar` (monobloc) | `article` + enfant `.with-sidebar` |

## Vérifications

```bash
hs test repogo          # build exampleSite
hs test build repogo    # optionnel — build sans serve
```

Navigateur humain : accueil + un rapport avec chapitres — **390 px**, **~1280 px**, `prefers-reduced-motion`.

## Suite (hors ce palier)

1. Sligo, Resugo, Fromago (même fil).
2. Vague 5 : suppression alias lorsque `rg` ne trouve plus de consommateurs actifs.
