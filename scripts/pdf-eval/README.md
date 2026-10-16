# Harness d’évaluation PDF (dompdf.js vs Repogo)

Évaluation **hors produit** — voir [`../../docs/PDF-MOTEURS-EVALUATION.md`](../../docs/PDF-MOTEURS-EVALUATION.md).

## Prérequis

- Node 18+  
- Navigateur Chromium (pour dompdf.js ; l’API exige DOM + Worker + WASM)  
- Optionnel : veraPDF en CLI pour tagging  

## Installation (local)

```bash
cd repogo/scripts/pdf-eval
npm install
```

## Lancer

```bash
npm run serve
# Ouvrir http://localhost:4173/harness.html
# Exporter via le bouton ; comparer avec print.html Repogo sur le même contenu
```

## Fichiers

| Fichier | Rôle |
|---------|------|
| `fixtures/book-corpus.html` | Corpus livre technique neutre |
| `harness.html` | Charge dompdf.js depuis npm et exporte `#book-corpus` |
| `package.json` | devDependency `dompdf.js` pinée |

## CI (future)

Playwright : charger harness, cliquer export, sauver PDF artifact, lancer veraPDF. Non implémenté dans ce ticket.

## Prince (hors harness)

Si licence disponible : même HTML → `prince book-corpus.html -o prince.pdf` pour third datapoint.
