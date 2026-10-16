---
title: "Plateforme de tests hybrides WCAG 2.2 — Dossier de conception"
type: report
document: report
description: "Architecture d'une plateforme combinant tests automatisés et tests manuels pour suivre la conformité de 11 services."
date: 2026-05-05
accent: "#7C3AED"
authors:
  - Idriss Marchand
  - Camille Vasseur
---

## Contexte

La conformité en accessibilité ne peut se réduire à une campagne ponctuelle : elle dépend d'un suivi continu. Ce dossier décrit la conception d'une **plateforme de tests hybrides** articulant détection automatisée et évaluation experte, afin de soutenir une démarche d'amélioration dans la durée.

Le dispositif couvre un périmètre de 11 services numériques répartis sur 4 périmètres métiers.

## Principes de conception

- **Automatiser le répétable** : les contrôles déterministes sont exécutés à chaque livraison.
- **Réserver l'humain au jugement** : les critères nécessitant une interprétation sont confiés aux experts.
- **Tracer et prioriser** : chaque anomalie est reliée à un critère WCAG et affectée d'une priorité.
- **Ouvrir la lecture** : un tableau de bord partagé rend l'état de conformité visible par tous.

## Architecture du dispositif

{{< mermaid >}}
flowchart LR
  A[Sources de code] --> B[Intégration continue]
  B --> C[Scanner automatisé]
  C --> D[Base d'anomalies]
  E[Audit expert] --> D
  F[Tests utilisateurs] --> D
  D --> G[Moteur de priorisation]
  G --> H[Tableau de bord]
  H --> I[Équipes projet]
  H --> J[Pilotage qualité]
{{< /mermaid >}}

Le flux part de l'intégration continue, enrichi par l'audit expert et les tests utilisateurs, puis converge vers une base d'anomalies unique dont découle le tableau de bord partagé.

## Répartition des efforts

| Volet | Nature | Volume estimé | Fréquence |
| --- | --- | --- | --- |
| Pré-audit automatisé | Outillé | 1 jour / service | À chaque livraison |
| Audit expert ciblé | Manuel | 1 jour / service | Trimestrielle |
| Tests utilisateurs | Manuel | 3 sessions | Semestrielle |
| Tableau de bord | Outillé | 5 jours | Continu |

## Anomalies et priorisation

Chaque anomalie est qualifiée selon quatre niveaux :

1. **Bloquante** — empêche la réalisation d'une tâche, correction immédiate.
2. **Majeure** — dégrade fortement l'usage, correction au prochain cycle.
3. **Mineure** — gêne sans bloquer, correction planifiée.
4. **Confort** — amélioration facultative, traitée en fond de backlog.

## Indicateurs de pilotage

- Taux de conformité pondéré par critère WCAG.
- Délai médian de correction par niveau de priorité.
- Nombre d'anomalies régressives détectées automatiquement.
- Taux d'adoption du tableau de bord par les équipes projet.

## Conditions de réussite

Le dispositif suppose une **montée en compétence** des équipes de production : sans formation, la détection d'anomalies ne produit pas d'amélioration durable du code. La plateforme est donc un outil au service d'une stratégie plus large, et non une fin en soi.
