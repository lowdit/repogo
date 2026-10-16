# Repogo — vision et évolutions (univers Lowdit)

Repogo est le **thème Hugo d’impression** de l’écosystème Lowdit : il produit des documents HTML paginés (Paged.js) prêts pour l’export PDF. Il complète **Higo** (site public) et s’appuie sur les mêmes contenus Markdown, avec une couche **print** dédiée.

**Autonomie :** Repogo peut viser un site « rapports seuls » (liste + liens print), mais aujourd’hui il manque surtout layouts HTML, `i18n` et fonts embarquées — voir [`lowdit-brand/docs/ECOSYSTEME-THMES-ET-BRAND.md`](../../lowdit-brand/docs/ECOSYSTEME-THMES-ET-BRAND.md). Marque commune copiée depuis **`lowdit-brand`** via `sync-brand.sh` (sources `lowdit-brand/shared`).

**Composition site** (Sligo seul, cours Repogo+Sligo, hub AO, accueils non uniformes) : [`lowdit-brand/docs/UNIVERS-COMPOSITION-SITES.md`](../../lowdit-brand/docs/UNIVERS-COMPOSITION-SITES.md).

**Implémentation print et séparation thème / site org** : [`PRINT.md`](PRINT.md) · [`lowdit-brand/docs/COUCHES-SITE-PRINT.md`](../../lowdit-brand/docs/COUCHES-SITE-PRINT.md).

## Rôle dans l’écosystème

| Composant | Rôle |
|-----------|------|
| **Higo** | Présentation web, navigation, SEO |
| **Repogo** | Mise en page print : couverture, TOC, chapitres, formats spécialisés |
| **Resugo** | CV et pages « motivation » candidature (écran + print Resugo) |
| **Sligo** | Formations : présentation Reveal.js (cours, théorie, quiz interactifs) |
| **Site porteur** | Contenu, `data/orgs/`, assets CSS/logo par organisme |

Repogo reste **générique** : aucune identité FNE, A11y France, etc. dans le dépôt du thème. La **déclinaison organisme** vit dans chaque site (`org`, `data/orgs/*.yaml`, `assets/css/…`, `static/images/…`).

## Principe : une base, des déclinaisons

1. **Base Repogo** — layouts print, Paged.js, styles structurels (`pagejs.css`), partials par **type de document**.
2. **Peau organisme (site)** — logo, couleurs, en-têtes, mentions légales, signataire par défaut.
3. **Contenu** — front matter + corps Markdown ; le type de document choisit le partial et les CSS chargés.

Objectif : publier depuis le même outillage des **rapports**, **livres**, **lettres officielles**, **dossiers**, **comptes rendus**, **rapports d’audit**, **synthèses de pilotage**, **supports de cours**, **feuilles d’exercices**, **QCM** et **examens**, etc., sans dupliquer la chaîne Hugo/Paged.js.

**Couplage Sligo ↔ Repogo** : une **formation** (parcours pédagogique) partage un identifiant et des contenus Markdown ; **Sligo** sert la séance (slides, `quiz` cliquables, fragments) ; **Repogo** sert les **documents imprimables** dérivés (polycopié, travaux dirigés, sujet d’examen, corrigé formateur). Même source, deux sorties Hugo (`presentation` vs `print`).

## Types de documents (cible)

Signal principal proposé : **`document`** (ou `type` Hugo dédié si besoin).

| `document` | Usage | Partial cible (évolution) | CSS |
|------------|--------|---------------------------|-----|
| `report` / *(absent)* | Rapport, dossier, livre (couverture + TOC) | `print/main.html` (branche rapport) | `pagejs.css` + peau site `print/{org}.css` |
| `compte_rendu` / `cr` / `record` | CR de réunion, note sans couverture | `print/record.html` | `courrier.css` + `record.css` + peau `courrier/{org}.css` |
| `book` | Alias sémantique rapport long | idem `report` | idem |
| `letter` | Courrier administratif | `print/courrier.html` *(→ `letter.html`)* | `courrier.css` + peau `courrier/{org}.css` |
| `dossier` | Dossier argumentaire (sections + annexes) | `print/dossier.html` | à définir |
| `audit` | Rapport d’audit (gravité, findings, preuves) | `print/audit.html` | à définir |
| `brief` | Synthèse pilotage (1–3 pages, executive summary) | `print/brief.html` | à définir |
| `abstract` | Résumé / carousel (existant) | `main.html` + `abstract` | `pagejs-rs.css` |
| `course` | Polycopié / théorie (chapitres alignés sur une formation Sligo) | `print/course.html` | `pagejs.css` + `course.css` |
| `workbook` | Exercices avec espaces de réponse | `print/workbook.html` | `workbook.css` |
| `exam` | Sujet d’examen (QCM + questions ouvertes, durée, consignes) | `print/exam.html` | `exam.css` |
| `exam_key` | Corrigé / barème (sortie séparée, accès restreint côté site) | `print/exam-key.html` | `exam.css` |

État actuel (`print/main.html`, URL `…/print.html`) :

| `document` (ou signal) | Rendu | CSS |
|------------------------|--------|-----|
| *(absent)* ou `report` | Rapport : couverture, TOC, chapitres | `pagejs.css` + `assets/css/print/{org}.css` (site) |
| `letter`, `courrier: true`, ou `destinataire` | Courrier | `courrier.css` + `assets/css/courrier/{org}.css` (site) |
| `compte_rendu`, `cr`, ou `record` | Compte rendu (sans couverture/TOC) | `courrier.css` + `record.css` + peau org courrier |

Logo org : `static/images/courrier/{org}/logo.png` sur le site. `org` (page ou `site.Params.org`) ajoute la classe `org-{id}` et charge les peaux CSS du site.

## Front matter cible (exemples)

### Compte rendu (`document: compte_rendu`)

```yaml
title: "CODERST — 8 octobre 2026"
document: compte_rendu   # alias : cr, record
date: 2026-10-08
authors: ["Bertrand Keller"]
org: fne-ain
outputs: ["HTML", "print"]
```

### Courrier (`document: letter`)

**Aujourd’hui** : params **plats** (voir [`PRINT.md`](PRINT.md)). **Cible** : bloc `letter:` structuré avec rétrocompat.

```yaml
title: "Courrier — demande d’audience"
document: letter
org: fne-ain
lieu: Bourg-en-Bresse
date_courrier: 2026-10-08
destinataire: |
  Monsieur le Préfet, …
objet: "…"
ref_courrier: "…"
vos_refs: "…"
cloture: "Nous vous prions d’agréer…"
signature: "FNE Ain"
outputs: ["HTML", "print"]
```

Corps Markdown = texte du courrier, ou section `## Corps` pour extraction automatique.

### Dossier / audit / brief

Même idée : champs communs (`title`, `date`, `authors`, `org`) + bloc typé (`audit:`, `brief:`, …) pour métadonnées que le partial sait afficher.

### Formation Sligo — lien et déclinaisons print

Identifiant commun (ex. `formation: accessibilite-niveau-1`) sur la section Hugo ou le front matter :

```yaml
title: "Accessibilité — module 3 : formulaires"
document: workbook   # ou course | exam | exam_key
formation: accessibilite-niveau-1
module: 3
role: exercises      # theory | course | exercises | exam (aligné sur le parcours Sligo)
sligo_ref: /formations/accessibilite/module-3/   # URL ou path de la présentation miroir
outputs: ["HTML", "print"]
```

**Rôles pédagogiques** (même formation, plusieurs fichiers) :

| `role` | Sligo (écran) | Repogo (print) |
|--------|----------------|----------------|
| `theory` | Slides expositives, `statement`, `compare` | Polycopié `document: course` |
| `course` | Démo live, `code`, `steps` | Handout condensé ou slides-notes |
| `exercises` | `quiz` interactif (feedback immédiat) | `workbook` : QCM cases à cocher, lignes pour réponses courtes |
| `exam` | (optionnel : mode révision sans correction) | `exam` : consignes, durée, numérotation, pas de correction |
| `exam_key` | — | `exam_key` : barème, réponses attendues, commentaires pédagogiques |

**QCM / exercices en Markdown (cible Repogo)** — blocs typés réutilisables à la source ou en shortcode Hugo :

```yaml
exam:
  duration: "1h30"
  total_points: 20
  instructions: "Documents interdits. Répondez sur la feuille."
questions:
  - id: q1
    type: qcm
    points: 2
    stem: "Quelle est la première étape du RGAA pour un site existant ?"
    choices:
      - "Audit initial"
      - "Mise en conformité sans diagnostic"
      - "Refonte graphique seule"
    correct: 0          # réservé exam_key / générateur corrigé
  - id: q2
    type: open
    points: 4
    stem: "Citez deux critères WCAG liés aux formulaires."
    lines: 6            # hauteur réponse print
```

En **Sligo**, la même question peut vivre dans une slide `quiz` (choix + `explanation` après clic). Repogo ne duplique pas la logique JS : il **rend la même sémantique** en mise page papier (numéros, cases, grilles de points).

**Principes couplage** :

- Une **formation** = arborescence `content/formations/{id}/` avec sous-pages ou bundles par module.
- **`sligo_ref` / `repogo_ref`** croisés pour navigation web (Higo) : « Voir les slides », « Télécharger le sujet PDF ».
- Les **quiz Sligo** restent interactifs ; les **examens Repogo** privilégient l’impression et la correction manuelle ou ultérieure (export corrigé séparé).
- Accessibilité : énoncés identiques Sligo/print ; contrastes et numérotation stables pour salles d’examen.

## Organismes (`org`)

Convention **site** (Repogo ne contient aucun `{id}` org) :

- **`data/orgs/{id}.yaml`** — nom, signataire (`sign`), URLs, couleurs.
- **`assets/css/courrier/{id}.css`** — pied de page / `@page` courrier et CR.
- **`assets/css/print/{id}.css`** — accents rapport (`--repogo-*`).
- **`static/images/courrier/{id}/logo.png`** — logo en-tête.

Détail et checklists : [`COUCHES-SITE-PRINT.md`](../../lowdit-brand/docs/COUCHES-SITE-PRINT.md).

Multi-organisme : un même repo (ex. blog perso, association) peut mélanger `org: fne-ain`, `org: a11y-france`, etc.

## Réservation du mot `letter`

- **Repogo** : `document: letter` + bloc `letter:` = courrier administratif PDF.
- **Resugo** : pages candidature « lettre de motivation » → param **`motivation_letter: true`** (liste Resugo) et contenu **`motivation:`** (déjà en place). Ne plus utiliser `letter:` dans le front matter Resugo pour éviter la collision sémantique.

## Routage print (`print/main.html`)

**En production** (détail : [`PRINT.md`](PRINT.md)) :

```text
letter / courrier / destinataire  → print/courrier.html
compte_rendu / cr / record        → print/record.html
default / report / book           → couverture + TOC + chapitres
```

**À venir** : `brief`, `audit`, `course`, `workbook`, `exam` → partials dédiés.

Surcharge ponctuelle : `layouts/_partials/print/` sur le **site** (éviter de fork `main.html` pour une org).

## Formats de sortie Hugo

Déjà en place dans `config.toml` du thème :

- **`print`** — document complet paginé ;
- **`abstract`** — variante résumé (CSS `pagejs-rs.css`).

Extensions possibles : `print-a4` / `print-us` via `outputFormats` si besoin de médias distincts.

## Feuille de route (non exhaustive)

1. **Spec `document` + blocs typés** — letter en premier (migration depuis params plats `destinataire`, `objet`, …).
2. **Renommer / alias** — `courrier.html` → `letter.html` ; CSS `courrier.css` → `letter.css` (aliases de compatibilité une version).
3. **Corriger les partials** — contexte Hugo (ex. ne pas tester `.Params` sur une string corps).
4. **Archetypes site** — `archetypes/coderst.md`, `archetypes/letter.md` avec `org` et outputs print.
5. **Types audit / brief / dossier** — partials et CSS incrementaux, réutilisation TOC et couverture.
6. **Formation Sligo** — spec `formation` + `questions` / QCM ; partials `exam`, `workbook` ; exemples miroir d’une présentation Sligo existante (`quiz` → print).
7. **Documentation utilisateur** — [`PRINT.md`](PRINT.md) + [`COUCHES-SITE-PRINT.md`](../../lowdit-brand/docs/COUCHES-SITE-PRINT.md) ; compléter types audit/exam quand implémentés.
8. **Tests visuels** — pages fixture dans `repogo/content/` ou site demo Lowdit (dont un mini-examen QCM).

## Critères de design

- **Déclinable** : zéro marque org en dur dans Repogo.
- **Lowdit** : même stack Hugo, conventions partagées avec Higo/Resugo.
- **Contenu source unique** : le web peut rester Higo ; le PDF ne recopie pas Word.
- **Évolutif** : nouveau type = nouveau partial + CSS, sans casser report/book.

---

*Document de référence pour orienter les PR sur [lowdit/repogo](https://github.com/lowdit/repogo). À ajuster après retours terrain (FNE, A11y France, audits, pilotage).*
