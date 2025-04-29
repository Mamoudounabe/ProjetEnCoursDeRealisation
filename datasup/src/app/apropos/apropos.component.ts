import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-apropos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './apropos.component.html',
  styleUrls: ['./apropos.component.css']
})
export class AproposComponent {
  showFAQ = false;
  showPrivacy = false;

  events = [
    {
      title: 'Démarrage du projet',
      date: 'Septembre 2024',
      description: `Lancement officiel du projet tutoré à l’Université de Bourgogne (UFR Sciences et Techniques, Département IEM). Répartition des rôles et définition des objectifs.`,
      completed: true
    },
    {
      title: 'Analyse des données open data',
      date: 'Octobre - Novembre 2024',
      description: `Exploration des jeux de données Parcoursup de 2020 à 2023. Conception d’un schéma de base de données avec Neo4j.`,
      completed: true
    },
    {
      title: 'Développement backend et API',
      date: 'Décembre 2024',
      description: `Mise en place de l’architecture FastAPI, connexion à la base de données Neo4j et structuration des endpoints nécessaires.`,
      completed: true
    },
    {
      title: 'Début du frontend et des visualisations',
      date: 'Janvier 2025',
      description: `Création des premiers composants Angular, intégration des graphiques interactifs avec Chart.js et D3.js.`,
      completed: true
    },
    {
      title: 'Cartographie interactive',
      date: 'Février 2025',
      description: `Ajout d’une carte avec Leaflet.js permettant de visualiser les admissions et formations par région.`,
      completed: true
    },
    {
      title: 'ETL, tests et automatisation',
      date: 'Mars 2025',
      description: `Mise en place du pipeline ETL, automatisation avec GitLab CI/CD, utilisation de Docker pour le déploiement.`,
      completed: true
    },
    {
      title: 'Finalisation et soutenance',
      date: 'Avril - Mai 2025',
      description: `Tests finaux, enrichissement de l’interprétation des données, génération de rapports, préparation de la soutenance.`,
      completed: true 
    }
  ];

  faqList = [
    {
      question: 'Quelle est la particularité de DataSup ?',
      answer: 'Il permet de visualiser les données Parcoursup de manière interactive, filtrées selon plusieurs critères.'
    },
    {
      question: 'Pourquoi certaines données sont absentes ?',
      answer: 'Certaines données ne sont pas publiées officiellement ou sont incomplètes sur les portails publics.'
    },
    {
      question: 'Quelles technologies utilisez-vous ?',
      answer: 'Nous utilisons Neo4j, FastAPI, Angular, Python, Docker, Chart.js, Leaflet.js et GitLab CI/CD.'
    }
  ];

  dataset = [
    { type: 'Formations', year: '2020', url: 'https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/fr-esr-parcoursup_2020/exports/csv?lang=fr', date: '16/01/2025' },
    { type: 'Formations', year: '2021', url: 'https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/fr-esr-parcoursup_2021/exports/csv?lang=fr', date: '16/01/2025' },
    { type: 'Formations', year: '2022', url: 'https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/fr-esr-parcoursup_2022/exports/csv?lang=fr', date: '16/01/2025' },
    { type: 'Formations', year: '2023', url: 'https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/fr-esr-parcoursup/exports/csv?lang=fr', date: '16/01/2025' }
  ];
}

