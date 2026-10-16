# Évaluation des moteurs PDF — Repogo / Lowdit

> **Statut : PROPOSÉ** (2026-10-16). Document de décision technique — ne remplace pas un `NEXT` approuvé pour intégrer du code en production.  
> Complète [`PRINT.md`](PRINT.md), [`ACCESSIBILITE-PDF.md`](ACCESSIBILITE-PDF.md), [`POC-PDF-CORPUS.md`](POC-PDF-CORPUS.md).

## Contexte Lowdit

- **Repogo** produit aujourd’hui du **HTML print** (`outputFormats.print`) paginé avec **Paged.js** dans le navigateur — pas de fichier PDF versionné dans le dépôt ([`PRINT.md`](PRINT.md)).
- **Design system** : dépôt graphique [`github.com/lowdit/lowdit-brand`](https://github.com/lowdit/lowdit-brand) (tokens, polices, vues). Les sites consomment via **`sync-brand.sh`** (copie) — **brand n'est pas un module Hugo**, et ce n'est pas un « thème éditorial » ; ne pas confondre avec Repogo.
- **Crédibilité accessibilité** : un PDF « joli » ou « texte sélectionnable » **≠** PDF utilisable aux exigences revendiquées (PDF/UA, EAA selon cas). Voir [`ACCESSIBILITE-PDF.md`](ACCESSIBILITE-PDF.md).

---

## 1. dompdf.js — informations vérifiées

| Élément | Fait vérifié | Source |
|--------|--------------|--------|
| Nom npm | `dompdf.js` | `npm view dompdf.js` (2026-10-16) |
| Version récente | `2.0.7` (publiée ~2026-09-30) | npm |
| Dépôt | [github.com/lmn1919/dompdf.js](https://github.com/lmn1919/dompdf.js) | GitHub API |
| Licence | **MIT** | `package/LICENSE`, GitHub `license` |
| Mainteneur npm | utilisateur `dompdfjs` | npm metadata |
| Activité | ~1,7k stars, dernier push 2026-10-12, 6 issues ouvertes | GitHub API |
| **≠ dompdf PHP** | Projet distinct (Rust/WASM + TS, pas le moteur PHP historique) | README GitHub |
| Mode d’exécution | **Navigateur** : snapshot DOM → Worker → WASM → `Blob` PDF. **Pas d’API DOM en Node pur** | `dist/types/index.d.ts`, docs [dompdfjs.lisky.com.cn/docs.html](https://dompdfjs.lisky.com.cn/docs.html) |
| Distribution | npm, CDN jsdelivr, binaire ~4,7 Mo unpacked | npm pack |
| Dépendances runtime npm | **aucune** (`deps: none`) | npm |
| Métadonnées PDF | `PdfMetadataOptions` (title, author, subject, keywords, creator, producer) | `dist/types/snapshot.d.ts` |
| Accessibilité / balisage | **Aucune option** `StructTreeRoot`, tagged PDF, PDF/UA, rôle figure/table dans l’API TypeScript publiée | recherche dans `dist/types/*.d.ts` (2026-10-16) |

### Affirmations de la démo (à traiter comme **non prouvées pour Repogo**)

La page [dompdfjs.lisky.com.cn](https://dompdfjs.lisky.com.cn/) et la doc affirment notamment : vecteur, texte sélectionnable, pagination native, tableaux, SVG, multilingue, `divisionDisable` (anti-coupure), en-têtes/pieds, formulaires, chiffrement.

**Vérifié comme capacités *déclarées* du produit**, pas comme garanties pour :

- HTML issu de **Paged.js** (pages `.pagedjs_page`, notes renumérotées par `main.js`) ;
- CSS **`@page`** Repogo (`pagejs.css`) ;
- **Livres** vendus ou soumis à exigence PDF/UA.

Seule une **POC sur le corpus Repogo** ([`POC-PDF-CORPUS.md`](POC-PDF-CORPUS.md)) peut rapprocher démo ↔ Lowdit.

---

## 2. Tableau comparatif (Paged.js / dompdf.js / Prince)

Légende : **V** = vérifié dans notre stack ou doc officielle du moteur ; **D** = déclaration éditeur non reproduite chez nous ; **?** = expérimentation requise ; **—** = hors scope ou non documenté.

| Critère | Repogo + **Paged.js** (actuel) | **dompdf.js** 2.x | **PrinceXML** (réf. marché) |
|--------|--------------------------------|-------------------|------------------------------|
| Entrée | HTML print Hugo | `#content` DOM après layout navigateur | HTML/CSS (+ XML Prince) |
| PDF produit dans repo | Non (impression manuelle) | Non (Blob client) ; CI via Playwright possible | Oui (CLI serveur) |
| Pagination livre | **V** CSS Paged Media + JS handlers | **D** pagination moteur (line/block) | **V** moteur pro, `@page` |
| En-têtes / pieds / folios | **V** `@page` + handlers Repogo | **D** templates pageConfig | **V** |
| TOC / signets | **?** TOC JS ; signets PDF non outillés | **?** (metadata Info ; pas d’API signets structurés) | **V** |
| Notes de bas de page | **V** JS custom (`main.js`) — fragile multi-pages | **?** | **V** (footnotes CSS) |
| Tableaux multipages | **?** | **D** | **V** |
| SVG / polices / CJK | **V** via site + brand fonts | **D** fontConfig TTF | **V** |
| Fidélité CSS livre | **V** pour `@page` Paged Media | **?** sous-ensemble CSS snapshot | **V** large |
| Liens | **V** HTML | **D** hyperlinks | **V** |
| **Structure accessible PDF** (titres, figures, tables tagués) | **—** non garanti (impression navigateur) | **—** non documenté dans l’API | **V** options tagged PDF |
| CI / régression | **?** snapshots visuels print HTML | Playwright + wasm load | **V** CLI scriptable |
| Coût | OSS | OSS MIT | Licence commerciale |
| Intégration Hugo | **V** natif | JS post-build ou bouton export | étape build externe |
| Risque dépendance | Paged.js mature niche | Projet jeune (2025), mainteneur individuel | Vendor |

---

## 3. Accessibilité PDF — conclusion explicite

**dompdf.js :**

- **Prouvé** : PDF avec **texte vectoriel extractible** (typiquement) — ce n’est **pas** une preuve d’accessibilité.
- **Non prouvé** (sans tests sur corpus) : ordre de lecture logique, balises `/H1`, `/Figure`, `/Table`, `/Alt`, langue document, en-têtes de tableau dans le tag tree, conformité **PDF/UA**.
- **Non trouvé** dans l’API publique : génération ou préservation d’un **Tagged PDF** vérifiable veraPDF/PAC.

**Paged.js + impression navigateur :** même limite, avec en plus une **dépendance au moteur d’impression** (Chrome vs Firefox).

**PrinceXML :** seul candidat du tableau avec **intention explicite** de PDF structuré — au prix licence + pipeline serveur.

**Pour Lowdit (crédibilité a11y)** : tant qu’aucun moteur ne produit un tag tree vérifié automatiquement, la communication doit rester **« non revendiqué »** ou **« contrôles automatiques partiels »** — voir politique [`ACCESSIBILITE-PDF.md`](ACCESSIBILITE-PDF.md).

---

## 4. Challenge du prompt « mission complémentaire dompdf.js »

| Exigence du prompt | Avis critique |
|--------------------|---------------|
| Vérification manuelle + AT sur chaque édition | **Irréaliste** en pratique équipe ; garder le protocole comme **référence** mais **ne pas** bloquer la chaîne dessus. Prioriser **automatisé reproductible** + statut par défaut `non_verifie`. |
| POC obligatoire Paged.js **et** dompdf.js | Pertinent **une fois** sur corpus figé ; pas une migration avant résultats archivés. |
| Remplacer Paged.js si la démo est « plus belle » | **Refuser** — décision sur corpus + CI + a11y, pas sur la démo Orbit. |
| Intégration Hugo « moteur principal » | **Prématuré** — dompdf.js ne lit pas `@page` Paged Media ; double rendu CSS probable. |
| Confusion dompdf PHP | **Risque réel** — toujours nommer **dompdf.js** + repo `lmn1919/dompdf.js`. |

---

## 5. Recommandation architecturale

| Contexte | Décision | Code |
|----------|----------|------|
| Prototype / démo interne | **C** — expérimenter dompdf.js **hors** chemin utilisateur par défaut | harness [`scripts/pdf-eval/`](../scripts/pdf-eval/README.md) |
| Livre publié gratuit (web + « PDF maison ») | **Paged.js + export navigateur** ou bouton dompdf **expérimental** avec mention « non vérifié AT » | pas de promesse conformité |
| Livre **vendu** ou **crédibilité a11y** (EAA / PDF/UA) | **Ne pas** présenter dompdf.js comme moteur final ; viser **Prince** ou post-traitement + **veraPDF** sur échantillon | pipeline couche 3 séparé de Repogo |
| Moteur principal Repogo | **Conserver Paged.js** pour **prévisualisation paginée** alignée CSS livre | Repogo reste thème Hugo |

**Réutilisation HTML :** le HTML **sémantique** de lecture (Minigo) ou un **HTML print simplifié** (sans fragmentation Paged.js) peut alimenter **dompdf.js ou Prince** — éviter de snapshotter le DOM **après** Paged.js si la POC montre des écarts.

---

## 6. Ticket minimal — lancer l’évaluation

Voir [`TICKET-PDF-EVAL-01.md`](TICKET-PDF-EVAL-01.md).

**Hors scope ticket :** remplacer Paged.js, vendre des PDF, déclarer conformité EAA.
