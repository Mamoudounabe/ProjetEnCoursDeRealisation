import { Component, OnInit, ElementRef, ViewChild, Input, ChangeDetectionStrategy, signal } from '@angular/core';
import { AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Formation } from '../../core/models/formation.model';
import { FormationService } from '../../core/services/formations.service';
import { ActivatedRoute } from '@angular/router';
import { Chart, registerables, ChartOptions, ChartType } from 'chart.js';
import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from '../../../environments/config';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { NgChartsModule } from 'ng2-charts';
import { ChartDataset, ChartData } from 'chart.js';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ApiService } from '../../core/services/api.service';
import { faSignal } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { faChartBar } from '@fortawesome/free-solid-svg-icons';
import { toInteger } from 'lodash';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';


@Component({
    selector: 'app-geo-details',
    imports: [ MatInputModule,
        MatFormFieldModule,
        MatOptionModule,
        MatSelectModule,
        MatAutocompleteModule,
        FormsModule,
        ReactiveFormsModule,
        NgChartsModule,
        MatTabsModule,
        MatButtonToggleModule,
        MatCheckboxModule,
        CommonModule,
        FontAwesomeModule,
        MatGridListModule,
        MatToolbarModule,
        MatIconModule,
        RouterModule],
    templateUrl: './geo-details.component.html',
    styleUrl: './geo-details.component.css'
})
export class GeoDetailsComponent implements OnInit {

/*

chart: any;

  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit(): void {
    const regionName = this.route.snapshot.paramMap.get('region');
    if (regionName) { 
      this.getNbFilieresParRegion(regionName);
    }
  }

  /**
   * Pour chaque année définie, appel l'endpoint getNbFilieresParRegion afin d'obtenir
   * le nombre de filières "Public" et "Privé" et ensuite affiche ces données dans un graphique.
   * @param region Nom de la région à rechercher.
   *//*
  getNbFilieresParRegion(region: string): void {
    const years = ['2020', '2021', '2022', '2023'];
    const publicCounts: number[] = [];
    const privateCounts: number[] = [];
    let completedRequests = 0;

    years.forEach(year => {
      this.apiService.getNbFilieresParRegion(region, year).subscribe({
        next: (response: any[]) => {
          // On s'attend à recevoir un tableau avec un objet contenant { TotalPrive, TotalPublic }
          if (response && response.length > 0) {
            const result = response[0];
            publicCounts.push(result.TotalPublic);
            privateCounts.push(result.TotalPrive);
          } else {
            publicCounts.push(0);
            privateCounts.push(0);
          }
          completedRequests++;
          if (completedRequests === years.length) {
            this.renderChart(years, publicCounts, privateCounts);
          }
        },
        error: (err) => {
          console.error(`Erreur pour l'année ${year}:`, err);
          // En cas d'erreur, on pousse des zéros dans les tableaux de données.
          publicCounts.push(0);
          privateCounts.push(0);
          completedRequests++;
          if (completedRequests === years.length) {
            this.renderChart(years, publicCounts, privateCounts);
          }
        }
      });
    });
  }

  /**
   * Affiche le graphique en mode stacked (empilé) en utilisant Chart.js.
   * Chaque barre correspond à une année et est décomposée en deux segments :
   * Public (en bleu) et Privé (en orange).
   * @param years Tableau des années (ex: ['2020', '2021', '2022', '2023']).
   * @param publicCounts Tableau des effectifs pour la partie "Public".
   * @param privateCounts Tableau des effectifs pour la partie "Privé".
   *//*
  renderChart(years: string[], publicCounts: number[], privateCounts: number[]): void {
    const canvas = document.getElementById('formationChart') as HTMLCanvasElement;
    
    if (!canvas) {
      console.error("Canvas non trouvé !");
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error("Impossible d'obtenir le contexte 2D !");
      return;
    }

    // Détruire l'ancien graphique s'il existe
    if (this.chart) {
      this.chart.destroy();
    }

    // Création d'un graphique en barres empilées
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: years,
        datasets: [
          {
            label: 'Public',
            data: publicCounts,
            backgroundColor: 'rgba(54, 162, 235, 0.7)', // Bleu
            stack: 'stack1'
          },
          {
            label: 'Privé',
            data: privateCounts,
            backgroundColor: 'rgba(255, 159, 64, 0.7)', // Orange
            stack: 'stack1'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          }
        },
        scales: {
          x: {
            stacked: true
          },
          y: {
            stacked: true,
            beginAtZero: true
          }
        }
      }
    });
  }
*/




// Graphique pour les filières Public/Privé
chart: any;
// Graphique pour les types de filières selon la formation sélectionnée
typeChart: any;

// Liste des formations disponibles pour le second graphique
formationTypes: string[] = [
  'Année de Réussite', 
  'Année Préparatoire', 
  'BPJEPS', 
  'BTS', 
  'BUT', 
  'C.M.I', 
  'CPGE', 
  'CUPGE', 
  'Classe préparatoire', 
  'Conservation-restauration des biens culturels', 
  'Cycle pluridisciplinaire d\'Etudes Supérieures', 
  'D.E', 
  'DEJEPS', 
  'DEUST', 
  'DN MADE', 
  'DTS', 
  'DUT', 
  'Diplome National d\'art', 
  'Diplome d\'Etablissement', 
  'Diplome d\'Université', 
  'Diplome de spécialisation professionnelle', 
  'Double licence', 
  'FCIL', 
  'Formation Supérieures de Spécialisation', 
  'Formation d\'ingenieur', 
  'Formation des écoles de commerce et de management', 
  'Formation des écoles supérieurs d\'art', 
  'licence', 
  'Mention complémentaire', 
  'Sciences Po / Instituts d\'études politiques'
];
selectedFormation: string = this.formationTypes[0];

// La région récupérée depuis les paramètres de la route
region: string = '';
// Les années utilisées pour les graphiques
years: string[] = ['2020', '2021', '2022', '2023'];

constructor(
  private route: ActivatedRoute,
  private apiService: ApiService
) { }

ngOnInit(): void {
  const regionName = this.route.snapshot.paramMap.get('region');
  if (regionName) { 
    this.region = regionName;
    this.getNbFilieresParRegion(this.region);
    this.getNbFilieresParTypeChart(this.region, this.selectedFormation);
  }
}

/**
 * Récupère pour chaque année le nombre de filières de type Public/Privé et affiche le graphique correspondant.
 * Utilise l'endpoint getNbFilieresParRegion.
 */
getNbFilieresParRegion(region: string): void {
  const publicCounts: number[] = [];
  const privateCounts: number[] = [];
  let completedRequests = 0;

  this.years.forEach(year => {
    this.apiService.getNbFilieresParRegion(region, year).subscribe({
      next: (response: any[]) => {
        if (response && response.length > 0) {
          const result = response[0];
          publicCounts.push(result.TotalPublic);
          privateCounts.push(result.TotalPrive);
        } else {
          publicCounts.push(0);
          privateCounts.push(0);
        }
        completedRequests++;
        if (completedRequests === this.years.length) {
          this.renderPublicPrivateChart(this.years, publicCounts, privateCounts);
        }
      },
      error: (err) => {
        console.error(`Erreur pour l'année ${year}:`, err);
        publicCounts.push(0);
        privateCounts.push(0);
        completedRequests++;
        if (completedRequests === this.years.length) {
          this.renderPublicPrivateChart(this.years, publicCounts, privateCounts);
        }
      }
    });
  });
}

/**
 * Affiche le graphique empilé pour les filières Public et Privé.
 */
renderPublicPrivateChart(years: string[], publicCounts: number[], privateCounts: number[]): void {
  const canvas = document.getElementById('formationChart') as HTMLCanvasElement;
  if (!canvas) {
    console.error("Canvas 'formationChart' non trouvé !");
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error("Impossible d'obtenir le contexte 2D !");
    return;
  }

  if (this.chart) {
    this.chart.destroy();
  }

  this.chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: years,
      datasets: [
        {
          label: 'Public',
          data: publicCounts,
          backgroundColor: 'rgba(54, 162, 235, 0.7)', // Bleu
          stack: 'stack1'
        },
        {
          label: 'Privé',
          data: privateCounts,
          backgroundColor: 'rgba(255, 159, 64, 0.7)', // Orange
          stack: 'stack1'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' }
      },
      scales: {
        x: { stacked: true },
        y: { stacked: true, beginAtZero: true }
      }
    }
  });
}

/**
 * Récupère pour chaque année le nombre de filières correspondant au type de formation sélectionné.
 * Utilise l'endpoint getNbFilieresParType.
 */
getNbFilieresParTypeChart(region: string, formationType: string): void {
  const typeCounts: number[] = [];
  let completedRequests = 0;

  this.years.forEach(year => {
    this.apiService.getNbFilieresParType(region, year, formationType).subscribe({
      next: (response: any[]) => {
        if (response && response.length > 0) {
          // L'endpoint retourne { TotalType: number }
          const result = response[0];
          typeCounts.push(result.TotalType);
        } else {
          typeCounts.push(0);
        }
        completedRequests++;
        if (completedRequests === this.years.length) {
          this.renderTypeChart(this.years, typeCounts, formationType);
        }
      },
      error: (err) => {
        console.error(`Erreur pour l'année ${year} avec formation "${formationType}":`, err);
        typeCounts.push(0);
        completedRequests++;
        if (completedRequests === this.years.length) {
          this.renderTypeChart(this.years, typeCounts, formationType);
        }
      }
    });
  });
}

/**
 * Affiche le deuxième graphique qui présente, pour chaque année, le nombre total 
 * de filières correspondant à la formation sélectionnée.
 *
 * @param years Tableau des années.
 * @param typeCounts Tableau des effectifs pour le type sélectionné.
 * @param formationType Le type de formation sélectionné.
 */
renderTypeChart(years: string[], typeCounts: number[], formationType: string): void {
  const canvas = document.getElementById('typeChart') as HTMLCanvasElement;
  if (!canvas) {
    console.error("Canvas 'typeChart' non trouvé !");
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error("Impossible d'obtenir le contexte 2D du canvas 'typeChart'!");
    return;
  }

  if (this.typeChart) {
    this.typeChart.destroy();
  }

  this.typeChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: years,
      datasets: [{
        label: formationType,
        data: typeCounts,
        backgroundColor: 'rgba(75, 192, 192, 0.7)', // Couleur personnalisée (ex: vert-bleu)
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

/**
 * Méthode appelée lors du changement de la formation sélectionnée.
 * Relance la récupération des données pour mettre à jour le deuxième graphique.
 */
onSelectedFormationChange(): void {
  if (this.region && this.selectedFormation) {
    this.getNbFilieresParTypeChart(this.region, this.selectedFormation);
  }
}



}