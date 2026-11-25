# Changelog — repogo

Format : [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/), versions
SemVer. Chaque entrée dit **quoi · où · migrer**. « Non publié » = ce que
reçoivent les sites qui suivent `main`. Politique :
`lowtech-dev-method/docs/TAGS-MODULES-HUGO.md`.

## Non publié

### Cassé

- **Retiré : `content/`** (`_index.md`). Hugo monte le contenu d'un
  thème chez chaque site qui l'importe : ces pages arrivaient chez tous les
  consommateurs ; il déclarait une sortie `pagejs` qui n'existe plus.
  Où : un site qui comptait sur l'accueil ou la page d'erreur du module.
  Migrer : écrire `content/_index.md` dans le site ; la page introuvable vient
  désormais du kit (`404.html`).
- **Plus de copies de la marque dans repogo** (jetons, base, composants, vues,
  partials de coque) : elles sont servies par `lowdit-kit`.
  Où : un site qui charge repogo **sans** `lowdit-kit` ni minigo.
  Migrer : ajouter le kit en dernier dans la liste des thèmes,
  `theme = ["github.com/lowdit/repogo", "github.com/lowdit/lowdit-kit"]`
  (ou garder minigo, qui l'apporte).
- **Classes `minigo-*` renommées `lowdit-*`** dans les gabarits (4 classes,
  correspondance 1:1).
  Où : CSS ou JS d'un site qui cible `.minigo-*`. Pas d'erreur au build : le
  style ne s'applique plus.
  Migrer : remplacer `minigo-` par `lowdit-` dans les sélecteurs du site.

### Ajouté

- Modèle `publisher` déclaré (`[params.lowdit.models.publisher]`).
- Feuille du modèle `assets/css/views/publisher.css`, venue de `lowdit-kit` (même
  chemin : transparent).
- `layouts/index.html` : l'accueil éditorial (`home/publisher`) s'affiche
  aussi sans minigo.
- `exampleSite` fonctionne sans minigo : `theme = ["github.com/lowdit/repogo", "github.com/lowdit/lowdit-kit"]`.

## v0.5.1

Dernière version distribuée avec des copies de la marque Brand. Historique antérieur : `git log`.
