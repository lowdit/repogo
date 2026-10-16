# Évolution éditoriale — Repogo et site livre

> **Statut : PROPOSÉ** (2026-10-16).  
> Repogo reste le **moteur print Hugo** ; le **livre/fascicule** vit dans un **site porteur** (option B/C : dépôt contenu dédié).

## Rôles (corrigés)

| Brique | Dépôt | Rôle |
|--------|-------|------|
| Design system | **`github.com/lowdit/lowdit-brand`** | Tokens, polices, vues CSS, doc composants — **pas** la structure du livre |
| Coque lecture | **Minigo** | Catalogue, vue `publisher`, Pagefind, liens export |
| Print HTML | **Repogo** | `print.html`, Paged.js, routage `document` |
| Contenu livre | **Site éditorial** (à créer) | Markdown, `book` metadata, shortcodes auteur |
| PDF fichier | **Pipeline externe** (future couche 3) | Prince / Playwright+dompdf / autre — voir [`PDF-MOTEURS-EVALUATION.md`](PDF-MOTEURS-EVALUATION.md) |
| EPUB | **Pipeline externe** | Pandoc ou générateur dédié — hors Repogo core |

Ne pas implémenter EPUB, vente, ni validation légale **dans** le dépôt Repogo.

## Empilement Hugo recommandé

```toml
theme = ["minigo", "repogo"]
```

Le `repogo/exampleSite` utilise aujourd’hui `["repogo", "minigo"]` — **à aligner** lors du prochain toucher exampleSite (Minigo doit gagner les layouts écran communs).

Brand (par copie, **pas** de module Hugo) :

```bash
lowdit-brand/scripts/sync-brand.sh <thème>
```

## Fichiers Repogo — périmètre d’évolution

| Zone | Évolution autorisée | Hors scope |
|------|---------------------|------------|
| `docs/` | Spec livre, moteurs PDF, a11y, POC | — |
| `layouts/_partials/print/` | Sémantique HTML (landmarks, lang) | Logique EPUB |
| `assets/css/pagejs.css` | `@page`, running headers | Copier les tokens brand (`sync-brand.sh`) |
| `scripts/pdf-eval/` | Harness évaluation dompdf | Dépendance npm runtime sur sites Hugo |
| `exampleSite/` | Corpus livre pilote multi-chapitres | Contenu client réel sans accord |

## Site éditorial (hors dépôt Repogo)

Arborescence cible :

```text
content/books/<slug>/
  _index.md          # métadonnées ouvrage + accessibility.status
  01-chapitre.md
  …
```

Shortcodes **figure**, **encadré**, **biblio** : **site** ou petit module Hugo `lowdit-book` — pas Repogo tant que non stabilisé.

## Liens

- [`PRINT.md`](PRINT.md) — usage actuel  
- [`VISION.md`](VISION.md) — types document (ne pas implémenter tout avant pilote)  
- [`POC-PDF-CORPUS.md`](POC-PDF-CORPUS.md) — corpus test PDF  
- [`TICKET-PDF-EVAL-01.md`](TICKET-PDF-EVAL-01.md) — premier incrément technique  
