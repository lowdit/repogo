# CSS et univers Lowdit — Repogo

Repogo consomme la couche Brand via `sync-brand.sh` (tokens, compositions,
composants, vues). Sa couche locale reste sous le préfixe `repogo-*` et
n’override jamais les primitives Brand.

## Composition

- La lecture d’un rapport utilise `article.repogo-article.with-sidebar` :
  `.repogo-toc` est la colonne secondaire, `.repogo-article__body` la colonne
  principale. La grille n’est plus calculée par `publisher.css`.
- Les compositions Brand (`.stack`, `.cluster`, `.grid`, `.wrapper`,
  `.with-sidebar`) sont disponibles via `compositions.css`.
- Aucun nouveau sélecteur `lowdit-product__*`, `lowdit-layout--*` ou
  `lowdit-table` n’est créé. Les alias Brand restent disponibles pour
  compatibilité, mais ne sont pas la cible.

## Exceptions locales Repogo

| Fichier | Propriétaire | Contrat |
| --- | --- | --- |
| `assets/css/views/publisher.css` | Repogo / Brand view partagée | Habillage publisher : `.repogo-article`, `.repogo-toc`, `.repogo-article__body` |
| `assets/css/courrier.css`, `gazette.css`, `record.css`, `pagejs*.css` | Repogo | Gabarits print et écrans associés ; hors Brand Core |
| `layouts/_default/single.html` | Repogo | `article.repogo-article.with-sidebar` |

Une exception locale ne redéfinit jamais `.stack`, `.grid`, `.wrapper`, les
tokens ou les blocks Brand.

## Vérification

```bash
cd /Users/bk/sites/hugo/repogo
hugo --source exampleSite --destination /tmp/repogo-public --cleanDestinationDir
```

Vérifier l’absence de `lowdit-product__*`, `lowdit-layout--*` et de
`style="..."` dans le contenu Markdown.
