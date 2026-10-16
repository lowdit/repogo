# Corpus POC — comparer Paged.js et dompdf.js

> **Statut : PROPOSÉ** (2026-10-16).  
> HTML de référence : [`../scripts/pdf-eval/fixtures/book-corpus.html`](../scripts/pdf-eval/fixtures/book-corpus.html).

## Objectif

Un **seul** document HTML représentatif d’un **livre technique** Lowdit, indépendant de la démo Orbit de dompdf.js.

## Contenu obligatoire du corpus

- [ ] Page de titre + métadonnées (titre, auteur, langue `fr`)  
- [ ] Table des matières (liste de liens internes)  
- [ ] Titres `h1`–`h4`  
- [ ] Paragraphe long (> 2 pages A4)  
- [ ] Figure **informative** (`img` + `alt` + `figcaption`)  
- [ ] Figure **décorative** (`alt=""` + `role="presentation"`)  
- [ ] Tableau avec `<th scope="col">` (> 15 lignes pour stress multipage)  
- [ ] Note de bas de page (Goldmark `[^1]`)  
- [ ] Liens interne et externe  
- [ ] Liste, `blockquote`, encadré (`aside` ou classe admonition)  
- [ ] Bloc `<pre><code>`  
- [ ] Accents français + paragraphe EN court  
- [ ] Bloc `divisionDisable` ou classe Repogo **anti-coupure** (à mapper après test)

## Deux branches de rendu

### A — Repogo / Paged.js (référence visuelle actuelle)

1. Intégrer le corpus dans un site Hugo ou page `print.html` Repogo.  
2. Ouvrir `/…/print.html`, laisser Paged.js paginer.  
3. Exporter PDF via **Imprimer → Enregistrer en PDF** (Chrome, noter version).  
4. Archiver : `artifacts/pagedjs-chrome-<date>.pdf`.

### B — dompdf.js (évaluation)

1. Servir `book-corpus.html` en statique (`npx serve scripts/pdf-eval/fixtures`).  
2. Page harness [`../scripts/pdf-eval/harness.html`](../scripts/pdf-eval/harness.html) : bouton export dompdf.js.  
3. Archiver : `artifacts/dompdfjs-<version>-<date>.pdf`.

## Grille de comparaison (remplir après POC)

| Critère | Paged.js + Chrome | dompdf.js | Notes / preuve |
|---------|-------------------|-----------|----------------|
| Pagination visuelle | | | |
| En-tête / pied de page | | | |
| Tableau multipage | | | |
| Notes | | | |
| SVG / polices brand | | | |
| Liens cliquables | | | |
| Tag tree (PAC/veraPDF) | | | |
| Ordre extraction texte | | | |
| Temps export (pages N) | | | |
| Taille fichier | | | |

## Méthode accessibilité (automatique d’abord)

1. veraPDF (profil documenté dans le rapport).  
2. Si tagging présent : PAC sur 5 pages.  
3. Manuel **uniquement** si passage en statut `revendique` ([`ACCESSIBILITE-PDF.md`](ACCESSIBILITE-PDF.md)).

Ne pas conclure avant **deux PDF archivés** + logs outils.
