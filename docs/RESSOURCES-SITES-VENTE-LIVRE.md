# Ressources — sites de vente de livres en ligne

> **Statut : PROPOSÉ** (2026-10-27).  
> Veille d'exemples pour le futur **site porteur livre** — cf. [`EVOLUTION-EDITORIALE.md`](EVOLUTION-EDITORIALE.md).  
> La **vente** reste hors dépôt Repogo (moteur print) : ces exemples alimentent la conception du site éditorial, pas le thème.

## Pourquoi cette veille

Le site livre visé par l'univers Lowdit est un **site statique Hugo** : il décrit, curationne et met en page ; il ne gère ni panier ni paiement. Les sites relevés ci-dessous montrent comment des acteurs du livre résolvent le chaînon « découverte → achat » — et la plupart **délèguent l'achat** à un tiers (librairie locale, plateforme mutualisée, service de paiement). C'est exactement le pattern compatible avec un site statique.

## Exemples relevés

### Découverte et curation (aucun panier, vente déléguée)

| Site | URL | Ce que c'est | À retenir pour le site livre |
|------|-----|--------------|------------------------------|
| **Shelf & Story** | <https://shelfandstory.com/> | Sélection hebdomadaire de livres jeunesse par des curateurs humains (bibliothécaire, libraire, instituteur) : 6 picks le dimanche, notes de sensibilité (deuils, danger, harcèlement — filtrables), import de bibliothèque (Yoto, Kindle, Apple Books, Libby…). Aucun panier : renvoi vers le **stock en direct des librairies locales** et vers le **prêt en bibliothèque**. | Le pattern le plus proche d'un site statique : la vente est déléguée, le site vend *le choix* et *l'expertise*. Notes « avant de lire » = champ à prévoir dans les métadonnées ouvrage (cf. `accessibility.status`). Différenciation assumée « pas d'algorithmes, que des humains ». Canaux alternatifs : extension Chrome, bot, MCP. |
| **The StoryGraph** | <https://thestorygraph.com/> | Suivi de lecture et découverte, alternative indépendante à Goodreads (sans Amazon) : recommandations par humeur, rythme et thèmes, avertissements de contenu, listes et défis de lecture, statistiques. | Fiche livre enrichie (humeur, avertissements) et argument d'indépendance ; modèle freemium (features stats payantes). |
| **Babelio** | <https://www.babelio.com/> | Communauté francophone (2,5 M lecteurs) : critiques de lecteurs, listes, calendrier des sorties, prix littéraires ; `Babelthèque` pour bibliothèques ; carnet de lecture `laboutiquebabelio.com`. | Avis lecteurs et listes de curateurs comme matière éditoriale du catalogue. |

### Plateformes mutualisées des librairies indépendantes

| Site | URL | Ce que c'est | À retenir pour le site livre |
|------|-----|--------------|------------------------------|
| **Leslibraires.fr** | <https://www.leslibraires.fr/> | Catalogue mutualisé de 400+ librairies indépendantes françaises (neuf, occasion, numérique) ; la commande est encaissée par une librairie du réseau. | Modèle « un catalogue, des librairies » : idéal pour un lien **« acheter auprès d'une librairie indépendante »** posé sur chaque fiche livre. |
| **Place des libraires** | <https://www.placedeslibraires.fr/> | Annuaire et stocks des librairies indépendantes de France. | Vérifier la disponibilité avant déplacement ; click & collecte. |
| **Bookshop.org** | <https://bookshop.org/> | Plateforme américano-britannique, B Corp, reversant l'essentiel de sa marge aux librairies indépendantes ; listes éditoriales curées. | Second point de vente mutualisé (anglophone) ; ses listes curées montrent le potentiel éditorial des sélections. |
| **Leslibraires.ca** | <https://www.leslibraires.ca/> | Version québécoise : 180+ librairies, papier et numérique. | Renvoi francophone nord-américain possible. |

### Librairie indépendante avec e-commerce propre

| Site | URL | Ce que c'est | À retenir pour le site livre |
|------|-----|--------------|------------------------------|
| **Librairie Mollat** | <https://www.mollat.com/> | Première librairie indépendante française (Bordeaux, 5 générations) : e-commerce complet, sélections rédigées par libraires, clic & collecte, listes scolaires. | Modèle cible si le site livre vend lui-même : fiches riches, sélections de libraires, retirage en magasin — mais e-commerce dynamique, pas statique. |
| **Shakespeare and Company** | <https://www.shakespeareandcompany.com/> | Librairie indépendante anglophone à Paris (1951) : commandes en ligne (hors stock annoncé honnêtement), staff picks, événements, podcasts, livres rares, abonnement annuel « Year of Reading ». | Un **site de contenu qui vend** : événements + listes + abonnement autour du livre ; la transparence sur la disponibilité fait partie du service. |

### Vente directe numérique (services externes à greffer)

| Service | URL | Ce que c'est | À retenir pour le site livre |
|---------|-----|--------------|------------------------------|
| **Payhip** | <https://payhip.com/> | Boutique numérique (ebooks) sans frais fixes, commission ~5 %, paiement Stripe/PayPal. | Vente directe d'un PDF/EPUB depuis un lien sur un site statique. |
| **Gumroad** | <https://gumroad.com/> | Vente directe de fichiers numériques, prix libre (pay-what-you-want), livraison du fichier. | Simple pour un livre produit via Repogo (PDF) — la relation client (email) reste en propre. |
| **Ko-fi** | <https://ko-fi.com/> | Soutien ponctuel + ventes simples de fichiers. | Version la plus légère, adaptée aux petits catalogues. |

## Lecture transversale

Trois niveaux de vente possibles pour le site porteur, du plus statique au plus lourd :

1. **Liens « où acheter »** — fiche livre renvoyant vers Leslibraires.fr, Bookshop.org ou la librairie locale (Stock direct chez Mollat ou Shakespeare and Company). Zéro traitement serveur ; pattern de Shelf & Story.
2. **Paiement hébergé** — Stripe Payment Links, Payhip, Gumroad pour un PDF/EPUB. Le site reste statique, le tiers encaisse.
3. **E-commerce complet** — panier, stock, livraison (Mollat). Hors périmètre d'un site statique et hors dépôt Repogo ([`EVOLUTION-EDITORIALE.md`](EVOLUTION-EDITORIALE.md) : ne pas implémenter la vente dans le thème).

Invariants remarqués chez plusieurs acteurs : **curation humaine** comme différenciateur (Shelf & Story, staff picks, sélections Mollat), **transparence sur la disponibilité** (stock librairie, « livre à commander »), **avertissements de contenu** (notes de sensibilité, content warnings) — tous des champs descriptifs exploitables en Hugo dans les métadonnées ouvrage.

## Liens

- [`EVOLUTION-EDITORIALE.md`](EVOLUTION-EDITORIALE.md) — répartition site porteur / moteur print
- [`VISION.md`](VISION.md) — types de documents et périmètre Repogo
- [`../../lowdit-brand/docs/COUCHES-SITE-PRINT.md`](../../lowdit-brand/docs/COUCHES-SITE-PRINT.md) — séparation thème / site / org
