# Revue — mise à jour de Paged.js (0.1.43 → 0.4.3)

> **Statut :** **migration faite (local)** le 2026-11-13 — bump + `media="all"` + séparation écran + corpus vérifié. Pas de commit ni de push.
> **Périmètre :** Paged.js embarqué dans **Repogo** (`assets/js/pagejs/paged.polyfill.js`) et donc l’aperçu A4 des CV Resugo sur les sites qui consomment Repogo.
> **Complète :** [`PRINT.md`](PRINT.md), [`PDF-MOTEURS-EVALUATION.md`](PDF-MOTEURS-EVALUATION.md), [`REVUE-PDF-LECTURE-VS-GENERATION.md`](../../lowtech-dev-method/docs/REVUE-PDF-LECTURE-VS-GENERATION.md).

---

## 1. État des lieux

| Élément | Fait vérifié (2026-11-12) |
| --- | --- |
| Version embarquée | **0.1.43** (`repogo/assets/js/pagejs/paged.polyfill.js`, 840 Ko) |
| Identique au npm ? | **Oui**, à une ligne vide près (`npm pack pagedjs@0.1.43`) — aucun patch local |
| Dernière stable npm | **0.4.3**, publiée le **2023-07-06** (MIT) |
| Version beta npm | **0.5.0-beta.2**, publiée le **2024-10-04** |
| Dépôt | actif (commits 2026), hébergé sur GitHub ; npm stable figé depuis 2023 |
| Écart | **153 commits** entre `v0.1.43` et `v0.4.3` |

**Thèmes de l’écart** (messages de commits, pas un changelog officiel) : module **footnotes**, `RenderResult`, pages nommées (dont imbriquées), fragmentation des **tableaux** (rowspan, `tbody`, `tr`), compteurs et `counter-reset` avec variables CSS, `string-set attr()`, boucles de `breakToken`, bleed, contenu marginal cloné une fois, hooks `finalizePage` / `onPageLayout` / `beforeRenderResult`.

## 2. Ce qui marche déjà — et le piège

POC Playwright sur trois pages **construites** du site `bertrandkeller.github.io` (rapport Air Liquide 14 p, article Eleventy 7 p, gazette Lowtus 5 p), en interceptant le polyfill :

| Scénario | Pages | Format page | Contenu | Erreurs console |
| --- | ---: | --- | --- | --- |
| 0.1.43 (actuel) | 14 / 7 / 5 | A4 794 × 1123 | 794 × 1123 | 0 |
| **0.4.3, CSS tel quel** | **10** / 7 / 5 | **Letter 816 × 1056** | **624 × 864**, marges 1 in | 0 (silencieux) |
| **0.4.3, `media=screen` retiré** | **14 / 7 / 5** | **A4 794 × 1123** | **794 × 1123** | 0 |

**Cause identifiée :** les feuilles print de Repogo sont chargées avec `media="screen"` (`layouts/_partials/print/main.html`, 6 occurrences : pagejs, pagejs-rs, courrier, record, peau org). **Paged.js 0.4.x ignore ces feuilles** ; le `@page { size: A4; margin: … }` n’est jamais lu et le moteur retombe sur son défaut **US Letter + marges 1 in**.

**Le piège :** l’article Eleventy garde **7 pages** dans les deux cas. Un contrôle au nombre de pages aurait validé une sortie au mauvais format. Il faut comparer **taille de page, marges et contenu**, pas seulement le compte.

**Correctif minimal testé :** retirer `media="screen"` sur les liens print (ou passer explicitement les feuilles dans `new Paged.Previewer().preview(content, stylesheets, renderTo)`). Après correctif, le rendu écran et le PDF redeviennent conformes.

## 3. Parité après correctif

| Contrôle | Résultat |
| --- | --- |
| Pages écran | 14 / 7 / 5 — identique |
| Texte total | 8 867 / 5 184 / 6 201 caractères — identique |
| Sommaire paginé (`afterPageLayout`) | 15 / 4 entrées — identique |
| Rôle et focus de l’aperçu (`afterRendered`) | `region`, `tabIndex=0` — identique |
| Clone mobile + bouton « Imprimer en A4 » | présents — identique |
| PDF Chromium A4 | 14 / 5 pages, `pdftotext -layout` **identique** |
| Rendu PDF échantillonné (72 dpi) | pages 1, 2, 3, 5, 10, 14 et gazette 1–5 **pixel-identiques** |
| Erreurs console | 0 |
| Coût | 921 702 octets (+7,3 % par rapport à 858 940) ; build minifié disponible à ~503 Ko |

**Différences observées, non bloquantes :**

- une `.pagedjs_footnote_area` **vide** est ajoutée sur chaque page (hauteur 0) — le module footnotes de 0.4.x s’active ;
- l’aperçu écran perd le décalage de 45 px entre pages (les pages sont collées en haut) — cosmétique, sans effet sur le PDF ;
- aucun test avec de **vraies notes de bas de page** : Repogo embarque `footnotesOrder()` / `footnotesAside()`, mais **ces fonctions ne sont appelées nulle part** (code mort). La mention « notes renumérotées par `main.js` » dans `PDF-MOTEURS-EVALUATION.md` est donc **périmée**.

## 4. Risques et parades

| Risque | Niveau | Parade |
| --- | --- | --- |
| Feuilles `media=screen` ignorées | **Bloquant** | Retirer l’attribut sur les 6 liens print ; test de taille de page obligatoire |
| Notes de bas de page (module 0.4.x) | Moyen | Corpus avec note réelle + `aside` ; décider si le JS mort est supprimé ou réactivé |
| Fragmentation tableaux / `break-inside` | Moyen | Corpus `POC-PDF-CORPUS` (tableau > 15 lignes, rowspan) |
| CSS de Repogo qui compense d’anciens bugs | Moyen | Les hacks (`break-after: avoid`, fragments orphelins Gazette) sont à rejouer, pas à supprimer à l’aveugle |
| Stable npm figé depuis 2023 | Faible (code vendorisé) | Épingler la version + checksum ; ne pas suivre `main` |
| 0.5.0-beta.2 | Éviter | Pas de stable ; ne pas prendre la beta pour un gain de tableaux non mesuré |

## 5. Recommandation

**Migrer vers 0.4.3, en un incrément contrôlé.** Le gain est reel (footnotes, tableaux, compteurs, boucles de fragmentation) et le risque est maîtrisé **à condition** de corriger le chargement CSS et de rejouer le corpus.

**Ne pas** passer à 0.5.0-beta.2. **Ne pas** profiter du bump pour refondre le CSS print.

### Migration appliquée (2026-11-13)

| Changement | Détail |
| --- | --- |
| Polyfill | `assets/js/pagejs/paged.polyfill.js` → **0.4.3** (npm, non minifié) ; SHA-1 `9cc6cf9a551b8fa1952263643e4731ef4a23559d` ; 921 702 octets |
| Chargement CSS print | `layouts/_partials/print/main.html` : 6 liens `media="screen"` → **`media="all"`** (courrier, record, peau org, pagejs, pagejs-rs, peau print) |
| Chargement CSS écran | Extraction des blocs `@media screen` vers `pagejs-screen.css`, `gazette-screen.css`, `courrier-screen.css`, liés en **`media="screen"`**. Paged.js 0.4.x retire les feuilles `media="all"` et **supprime `@media screen`** : sans cette séparation, l’aperçu perd son centrage et le lecteur mobile disparaît. |
| Impression du lecteur mobile | `display:none` dans un `<style media="print" data-pagedjs-ignore>` : Paged.js aplatit `@media print` dans son CSS global, donc un `!important` dans la feuille print cachait le lecteur **à l’écran**. |
| Repères ARIA | `afterRendered` sur tous les types : `role="main"`, nom accessible, `tabindex=0`, marges en `aria-hidden`, `role="doc-pagebreak"` par page, `main` clonés remplacés par des `div`. |
| Docs | `PRINT.md` et `PDF-MOTEURS-EVALUATION.md` alignés (version, code mort des notes) |

**Preuves exécutées :**

- `exampleSite` : `hugo --minify` OK ; 5 rapports — 3 / 4 / 4 / 5 / 5 pages, A4 794 × 1123, texte identique, 0 erreur.
- PDF des 5 rapports : A4, `pdftotext` identique, **21 pages pixel-identiques** à 60 dpi.
- Site réel (rapport, article, gazette) : 14 / 7 / 5 pages, A4, PDF identique, pages échantillonnées pixel-identiques.
- **Gain démontré — notes** : sur un document de test, 0.1.43 laisse la note **dans le paragraphe** ; 0.4.3 la place dans `.pagedjs_footnote_area` en bas de page.
- **Non démontré — rowspan** : un tableau `rowspan` de test (2 pages) produit le même découpage dans les deux versions ; les correctifs tableaux restent un gain de robustesse, pas une différence visible sur ce cas.
- **Après correctif écran** : 390 px → lecteur mobile visible, aperçu masqué ; 1400 px → aperçu centré, lecteur masqué. Vérifié sur rapport, gazette, courrier et CR.
- **ARIA mesuré** (rapport 5 pages) : 1 seul `role="main"` visible, 5 `doc-pagebreak`, 80 marges `aria-hidden`, 0 erreur console.
- **Clone mobile** : `for="m-champ-test"`, `aria-describedby="m-aide-test"`, `aria-labelledby="m-titre-test"` vérifiés après préfixage.
- **Sommaire** : clic sur un lien → `document.activeElement` = le `H2` cible, `tabindex="-1"`.
- **Notes** : document de test → 2 appels `doc-noteref` nommés, 2 notes `doc-endnote` avec retour, zone `doc-endnotes`.
- **PDF après correctif** : 21 pages pixel-identiques, `pdftotext` identique, aucune trace de « Lecture mobile ».

### Incrément proposé (fait en local, à valider)

```yaml
id: P-repogo-pagedjs-043-01
statut: fait (local)   # 2026-11-13 — bump + media=all + split écran ; 21 pages PDF pixel-identiques ; lecteur mobile 390 px OK ; navigateur humain à valider
cible: cursor
depot: repogo + lowtech-dev-method (NEXT)
type: dette technique — mise à jour Paged.js vendorisé
famille-collecte: noyau-observer
objectif: >-
  Remplacer paged.polyfill.js 0.1.43 par 0.4.3 (npm, checksum documenté),
  passer les feuilles print en media="all" pour que @page soit lu, et isoler
  les règles écran dans des feuilles media="screen" (0.4.x supprime @media screen).
  Rejouer le corpus : rapport, article, gazette, CR/courrier, mobile 390 px.
lire:
  - repogo/docs/REVUE-MAJ-PAGEDJS.md
  - repogo/layouts/_partials/print/main.html
  - repogo/assets/css/pagejs.css
fin:
  - pages et format A4 identiques sur le corpus (taille de page, pas seulement le compte)
  - PDF : pdftotext identique + échantillon pixel-identique
  - notes de bas de page : décision testée (module 0.4.x ou JS maison)
  - aperçu 1400 px centré et lecteur mobile 390 px fonctionnel
  - repères ARIA : un seul main, pages labellisées, marges masquées
  - clone mobile : références for/aria-* réécrites
  - sommaire : focus sur le titre cible
  - notes : doc-noteref / doc-endnote / retour
  - Pas commit, push ni publication sans accord explicite
hors-perimetre:
  - 0.5.0-beta
  - refonte CSS print / gazette
  - moteur PDF (Prince, dompdf.js)
verification:
  palier: C
  auto:
    - "hugo --minify (exampleSite)"
    - "PDF : pdftotext + pdftoppm diff (POC Playwright hors dépôt)"
    - "Playwright 390 / 1400 px : lecteur mobile vs aperçu A4"
  humain:
    - Navigateur 1400 — /print.html rapport, notes, gazette
    - Navigateur 390 — lecture linéaire courrier / CR
relation:
  revue: REVUE-MAJ-PAGEDJS
```

**Effort estimé :** 0,5–1 jour (corpus + captures + PDF + décision notes), hors rédaction du script de snapshot si automatisé.

## 6. Accessibilité — constats et améliorations

### Ce que Paged.js ne fournit pas

- **Aucun ARIA** dans le polyfill 0.4.3 : pas de rôle sur `.pagedjs_page`, pas de libellé de page, pas de sémantique de note. Les folios et titres courants sont du contenu généré CSS, restitué de façon inégale par les lecteurs d’écran.
- **Landmarks dupliqués** : la fragmentation clone le `<main>` source sur chaque page. Un rapport de 5 pages produisait **5 repères `main` visibles** (mesuré), ce qui est invalide.
- **Pas de navigation clavier** page précédente/suivante, pas d’annonce de changement de page.
- **Notes** : 0.4.3 les place visuellement en bas de page, mais sans `doc-noteref` / `doc-endnote` ni lien de retour.

### Corrigé dans Repogo (2026-11-13)

- Séparation **print / écran** : le lecteur mobile et l’aperçu centré fonctionnent à nouveau sous 0.4.3.
- Handler extrait dans **`assets/js/pagejs/repogo-a11y.js`** : le polyfill reste intact, l’accessibilité devient une extension testable et réutilisable.
- `afterRendered` commun à tous les types : `role="main"` + nom accessible + `tabindex=0`, marges en `aria-hidden`, `doc-pagebreak` par page, `main` clonés neutralisés.
- **Clone mobile** : les `id` sont préfixés `m-`, et les références (`for`, `headers`, `aria-labelledby`, `aria-describedby`, `aria-controls`, etc.) sont réécrites.
- **Sommaire** : après clic, le focus passe sur le titre cible (`tabindex="-1"`), au lieu de rester sur le lien.
- **Notes** : les appels Paged.js deviennent `doc-noteref`, les notes `doc-endnote` avec un lien de retour, et la zone `doc-endnotes`. Le retour est masqué à l’impression.
- Lecteur mobile **courrier / CR** : il était sans CSS (donc dupliqué à l’écran) ; il a maintenant une feuille écran et un masquage print fiable.
- Vérifications : 390 / 1400 px, rapport, gazette, courrier, CR ; PDF sans duplication ; clone `for`/`aria-*` réécrits ; focus sommaire effectif ; notes sémantiques sur document de test.

### Reste à faire, par priorité

| Prio | Amélioration | Où | Effort |
| --- | --- | --- | --- |
| **Fait** | Réécriture des références du clone mobile (`for`, `headers`, `aria-labelledby`, `aria-describedby`, etc.). | `repogo-a11y.js` | fait |
| **Fait** | Focus sur le titre cible après clic dans le sommaire. | `repogo-a11y.js` | fait |
| **Fait** | Sémantique des notes : `doc-noteref`, `doc-endnote`, retour vers l’appel, zone `doc-endnotes`. | `repogo-a11y.js` | fait |
| **P1** | Offrir une **lecture linéaire** aussi sur grand écran (bascule visible), pas seulement ≤ 820 px : c’est la vue la plus robuste pour les aides techniques. | template + CSS | 1 j |
| **P1** | Navigation clavier entre pages + annonce « Page N sur M ». | handler Paged.js | 1 j |
| **P2** | Contribution amont : rôles page/marges, préservation des landmarks, notes sémantiques, option `linear`. | Paged.js | amont |
| **P2** | PDF balisé : Paged.js ne le produit pas ; l’export navigateur reste `non_verifie` (voir `ACCESSIBILITE-PDF.md`). | pipeline PDF | hors thème |

**Limite de méthode :** ces vérifications sont DOM/CSS/Playwright, pas des tests NVDA, VoiceOver ou JAWS. Aucun statut « accessible » n’est revendiqué.

## 7. Preuves et limites

- **Fait :** versions npm, taille, absence de patch local, 153 commits, comportement des trois pages du site réel, correctif `media`, parité texte/PDF/pixels, `exampleSite` (5 rapports, 21 pages PDF), démonstration des notes de bas de page.
- **Non fait :** courrier/CR (aucune page construite disponible sur ce site), Safari/Firefox, impression physique, corpus `POC-PDF-CORPUS` complet, notes de bas de page dans un vrai rapport Repogo (seulement le document de test).
- **Non conclu :** gain visuel des correctifs tableaux de 0.4.3 sur nos documents (le corpus testé n’a pas déclenché de différence).

## Sources

- `npm view pagedjs` (0.4.3, 2023-07-06 ; beta 0.5.0-beta.2, 2024-10-04) ; `npm pack` 0.1.43 et 0.4.3.
- [Paged.js](https://pagedjs.org/) · dépôt GitHub `pagedjs/pagedjs` (compare `v0.1.43...v0.4.3`, 153 commits).
- Repogo : [`layouts/_partials/print/main.html`](../layouts/_partials/print/main.html), [`assets/css/pagejs.css`](../assets/css/pagejs.css), [`docs/PRINT.md`](PRINT.md).
- POC local : serveur statique `bertrandkeller.github.io/public`, Playwright/Chromium, interception du polyfill et de `media=screen`; PDF via `page.pdf()` ; comparaison `pdftotext` / `pdftoppm` / Pillow.
