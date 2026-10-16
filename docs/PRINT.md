# Repogo — guide print (implémentation actuelle)

> **Mode d’emploi** pour développeurs et auteurs. Vision long terme : [`VISION.md`](VISION.md).  
> **Séparation des couches** (thème vs site org) : [`lowdit-brand/docs/COUCHES-SITE-PRINT.md`](../../lowdit-brand/docs/COUCHES-SITE-PRINT.md).

## Entrée

- Format Hugo **`print`** (`Output Format`), URL typique : `https://example.org/ma-page/print.html` (fichier `print.html` à côté de la page HTML).
- Layout : `layouts/_default/single.print.html` → partial **`print/main.html`**.

Activer sur le site :

```toml
[outputs]
  page = ["HTML", "print"]
```

---

## Routage (`document` et signaux)

Évalué en tête de `print/main.html` (basename `print` uniquement).

| Condition | Rendu | Partials / structure |
|-----------|--------|----------------------|
| `document: letter`, **`courrier: true`**, ou champ **`destinataire`** | Courrier | `print/courrier.html` |
| `document: compte_rendu`, **`cr`**, ou **`record`** | Compte rendu | `print/record.html` |
| *(autre / absent)* | Rapport | Couverture `#cover`, TOC, chapitres |

**Important :** `org` charge la peau CSS et la classe `org-{id}` ; il **ne** bascule **pas** vers le courrier.

Alias recommandés aujourd’hui :

| Usage | Valeur `document` |
|-------|-------------------|
| Rapport long, dossier, livre | *(omis)* ou `report` |
| CR de réunion, note sans couverture | `compte_rendu` |
| Courrier administratif | `letter` |

---

## Feuilles de style chargées

| Type | CSS Repogo (thème) | CSS site (peau org) |
|------|--------------------|---------------------|
| Courrier | `courrier.css` | `assets/css/courrier/{org}.css` si présent |
| Compte rendu | `courrier.css` + `record.css` | idem courrier |
| Rapport | `pagejs.css` (+ `pagejs-rs.css` si `abstract`) | `assets/css/print/{org}.css` si présent |

`{org}` = `or .Params.org site.Params.org`.

Accents CR : `--print-accent` ou `--repogo-accent` dans la peau org (voir `record.css`).

Polices : le site expose `/assets/css/fonts.css` (copié depuis `lowdit-brand` via `sync-brand.sh`).

---

## Données organisme

Fichier **`data/orgs/{id}.yaml`** sur le **site** :

```yaml
name: Mon association
sign: "Signataire par défaut"
url: https://example.org
color: "#A2191F"
```

Utilisation :

- Courrier : signature par défaut (`sign`), alt logo.
- Web / futur : couleurs, liens.

Logo print : **`static/images/courrier/{id}/logo.png`** (URL `/images/courrier/{id}/logo.png`).

---

## Front matter — compte rendu

```yaml
title: "CODERST — 8 octobre 2026"
document: compte_rendu
date: 2026-10-08
authors: ["Prénom Nom"]
org: mon-org
outputs: ["HTML", "print"]
```

Corps : Markdown classique (`##` sections). Pas de couverture ni TOC rapport.

---

## Front matter — courrier (params plats, implémentation actuelle)

```yaml
title: "Courrier — objet court"
document: letter
org: mon-org
lieu: Ville
date_courrier: 8 octobre 2026
destinataire: |
  Monsieur le Préfet,
objet: "…"
ref_courrier: "…"
vos_refs: "…"
cc: "…"
pj: "…"
appel: "Monsieur le Préfet,"
cloture: "Nous vous prions d’agréer…"
signature: "Mon org"
outputs: ["HTML", "print"]
```

Corps Markdown :

- Texte libre, ou
- Section **`## Corps`** : le partial extrait le contenu après ce titre et retire appel/clôture dupliqués si présents.

**Évolution prévue** (pas encore dans le code) : bloc YAML `letter:` — les champs plats resteront supportés.

---

## Front matter — rapport

```yaml
title: "Dossier technique"
description: "Sous-titre ou accroche couverture"
authors: ["…"]
org: mon-org
outputs: ["HTML", "print"]
```

Sections Hugo : pages enfants paginées en chapitres numérotés. Contenu page : une section `chapter` avec `.Content`.

---

## Surcharges site

Copier dans le site **uniquement si nécessaire** :

```text
layouts/_partials/print/<partial>.html
```

Hugo préfère le site au thème. Éviter de surcharger `main.html` pour une org — utiliser les peaux CSS.

---

## i18n

Repogo fournit `i18n/fr.yaml` et `en.yaml` (`toc-title`). Empiler Higo + Repogo : Repogo complète les clés manquantes.

---

## Tests avant publication

1. `hugo --minify` sans erreur.
2. Ouvrir `/…/print.html` pour un CR, un courrier, un rapport.
3. Vérifier pied de page org (CSS courrier) et couleurs rapport (`--repogo-*`).
4. Export PDF navigateur ou pipeline habituel.

### PDF fichier vs HTML print

| Sortie | Rôle | Accessibilité |
|--------|------|----------------|
| **`print.html` + Paged.js** | Prévisualisation paginée, export **Imprimer → PDF** | Par défaut **`non_verifie`** — voir [`ACCESSIBILITE-PDF.md`](ACCESSIBILITE-PDF.md) |
| **dompdf.js** (expérimental) | Harness [`scripts/pdf-eval/`](../scripts/pdf-eval/README.md) | Texte vectoriel **≠** PDF balisé — voir [`PDF-MOTEURS-EVALUATION.md`](PDF-MOTEURS-EVALUATION.md) |
| **Prince / autre CLI** | Pipeline release (hors thème) | Seul candidat pour viser contrôles **auto_partiel** tagged |

Repogo **ne versionne pas** de binaire PDF ; il produit le HTML print.

### Brand (polices et tokens)

Les polices Atkinson et tokens `--lowdit-*` viennent du dépôt graphique **`github.com/lowdit/lowdit-brand`**, copiés via `sync-brand.sh` (brand **n'est pas** un module Hugo). Repogo charge `assets/css/fonts.css` depuis le **site** publié, pas depuis ce dépôt directement.

---


## Fichiers Repogo (ne pas mettre dans le site)

| Fichier | Rôle |
|---------|------|
| `layouts/_partials/print/main.html` | Routage + HTML shell |
| `layouts/_partials/print/courrier.html` | Mise en page courrier |
| `layouts/_partials/print/record.html` | Mise en page CR |
| `assets/css/pagejs.css` | Rapport paginé |
| `assets/css/courrier.css` | Base courrier / CR |
| `assets/css/record.css` | Typo titres CR |
