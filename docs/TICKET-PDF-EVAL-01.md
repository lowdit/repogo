# TICKET-PDF-EVAL-01 — Évaluer dompdf.js sur corpus Repogo

> **Statut : proposé** — à promouvoir en `NEXT` approuvé avant merge code production.  
> **Dépôt :** `repogo` (+ artifact binaire PDF hors Git si volumineux).

## Objectif utilisateur

Savoir si **dompdf.js** mérite une **intégration optionnelle** (export PDF Blob) pour les fascicules Lowdit, **sans** remplacer Paged.js ni promettre un PDF accessible.

## Livrables

1. PDF archivés : Paged.js (Chrome) + dompdf.js 2.0.7 sur [`fixtures/book-corpus.html`](../scripts/pdf-eval/fixtures/book-corpus.html).  
2. Grille remplie dans [`POC-PDF-CORPUS.md`](POC-PDF-CORPUS.md).  
3. Rapport veraPDF (sortie texte) sur chaque PDF — profil indiqué.  
4. Mise à jour [`PDF-MOTEURS-EVALUATION.md`](PDF-MOTEURS-EVALUATION.md) : section « Résultats POC » avec date.  
5. Décision explicite **B / C / D** (cf. doc moteurs) — **pas A** sans tagging prouvé.

## Changements code autorisés

- `scripts/pdf-eval/*` (harness, README, fixture HTML)  
- **Pas** de bouton export dans Minigo/Repogo production  
- **Pas** de dépendance `dompdf.js` dans le thème Hugo distribué (devDependency locale au harness OK)

## Acceptation testable

- [ ] `npm install` dans `scripts/pdf-eval` réussit  
- [ ] Harness ouvre en local, produit un Blob PDF > 50 Ko  
- [ ] Corpus contient tous les éléments listés dans POC-PDF-CORPUS  
- [ ] veraPDF exécuté (ou documenté « outil absent » + alternative)  
- [ ] Conclusion accessibilité : **non revendiquée** sauf preuve tag tree  

## Risques

- WASM + Worker : CSP en production Hugo  
- Écart CSS `@page` Repogo vs snapshot DOM  
- Fausse confiance « texte sélectionnable »  

## Hors scope

- Migration Paged.js  
- PrinceXML licence  
- EPUB  
- Intégration vente  

## Estimation

1–2 jours humain/IA (dont essentiellement comparaison visuelle + veraPDF).
