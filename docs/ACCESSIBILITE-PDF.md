# Accessibilité PDF — politique Repogo / Lowdit

> **Statut : PROPOSÉ** (2026-10-16).  
> Aligné avec l’esprit a11yNot (*connaissance de test*, pas verdict marketing) et [`lowtech-dev-method/docs/PROJET-FUTUR-PUBLICATIONS-HUGO-LOWDIT.md`](../../lowtech-dev-method/docs/PROJET-FUTUR-PUBLICATIONS-HUGO-LOWDIT.md).

## Principe réaliste

Une **vérification manuelle complète** (lecteur d’écran sur PDF, ordre de lecture page par page) **ne sera pas** faite systématiquement sur chaque édition. Le protocole manuel reste **documenté sous le coude** pour les éditions à enjeu ; la chaîne repose sur :

1. **HTML source** aussi sémantique que possible (Repogo + conventions auteur).
2. **Contrôles automatiques** reproductibles en CI ou avant release.
3. **Statut public honnête** par édition — jamais « conforme » par défaut.

---

## Ce qui ne prouve pas l’accessibilité

- Texte sélectionnable ou recherche dans le PDF  
- Rendu vectoriel  
- `alt` présent dans le HTML source  
- Mise en page visuellement correcte  
- Export sans erreur JavaScript  
- Succès d’un validateur **non** calibré PDF/UA ou EPUB  

---

## Niveaux de déclaration (par édition)

À porter dans le **site éditorial** (front matter ou `data/editions/*.yaml`), pas dans Repogo en dur.

| Statut | Signification | Peut être affiché comme |
|--------|---------------|-------------------------|
| `non_produit` | Pas de PDF public | — |
| `non_verifie` | PDF disponible, **aucun** contrôle archivé | « PDF fourni sans évaluation accessibilité » |
| `auto_partiel` | Checks auto OK sur **échantillon** (voir liste) | « Contrôles automatiques partiels (détail) » |
| `revendique` | Balisage vérifié + protocole complet exécuté | Uniquement après preuves archivées |

**Interdit** sans dossier de preuve : « PDF accessible », « conforme RGAA/EAA/PDF/UA ».

---

## Contrôles automatiques recommandés (PDF)

Exécuter sur **fichier PDF archivé** (artifact release), pas sur la démo du fournisseur.

| Outil | Ce qu’il apporte | Ce qu’il ne prouve pas |
|-------|------------------|------------------------|
| [veraPDF](https://verapdf.org/) (profil choisi) | Structure, tagging partiel, conformité PDF/A ou UA **selon profil** | Lisibilité réelle AT |
| PAC (PDF Accessibility Checker) | Tag tree, ordre de lecture (échantillon) | Couverture WCAG contenu |
| Extraction texte (`pdftotext -layout`) | Ordre brut extractible | Sémantique |

**Seuil minimal Lowdit « auto_partiel »** (proposition) :

- veraPDF sur **1 PDF** du corpus release : **0 erreurs bloquantes** sur le profil documenté dans le rapport ;
- script maison : présence **langue** document, **titre** métadonnées, **aucune page image-only** sur échantillon de 5 pages.

Si veraPDF échoue ou tagging absent → rester en `non_verifie`.

---

## Protocole manuel (réserve — éditions à enjeu)

À lancer **optionnellement** avant statut `revendique` :

1. PAC ou équivalent : tag tree titres, listes, tableaux, figures.  
2. Ordre de lecture manuel sur 3 pages problématiques (tableau, note, figure).  
3. **Un** lecteur d’écran sur **HTML web** (prioritaire) ; PDF AT seulement si le canal PDF est le produit principal.

Rapport : date, outil, version, hash du PDF, anomalies, **non-corrections** acceptées.

---

## Conséquences par moteur (rappel)

| Moteur | Attente accessibilité PDF |
|--------|---------------------------|
| Paged.js + Imprimer | **non_verifie** par défaut |
| dompdf.js | **non_verifie** ; texte extractible ≠ balisé |
| Prince (ou équivalent) | peut viser **auto_partiel** si tagged + veraPDF OK |

Détail comparatif : [`PDF-MOTEURS-EVALUATION.md`](PDF-MOTEURS-EVALUATION.md).
