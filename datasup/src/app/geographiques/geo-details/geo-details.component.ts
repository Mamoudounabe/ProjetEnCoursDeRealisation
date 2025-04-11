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
import { forkJoin } from 'rxjs'

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
// Graphique pour filières Public/Privé (barres empilées)
publicPrivateChart: any;
// Graphique pour le nouveau graphique en grand (polar area)
largeChart: any;

// Années à considérer
years: string[] = ['2020', '2021', '2022', '2023'];
// Région récupérée depuis l'URL
region: string = '';

// Nouveau tableau de types de formation
formationTypes: string[] = [ 
  'BPJEPS', 
  'BTS', 
  'BUT', 
  'C.M.I', 
  'CPGE', 
  'CUPGE', 
  'Classe préparatoire',  
  'D.E', 
  'DEUST', 
  'DN MADE',  
  'DUT', 
  'Diplôme National d\'Art', 
  'Diplôme d\'Université', 
  'Double licence', 
  'FCIL', 
  'Formation des écoles de commerce et de management', 
  'Licence', 
  'Mention complémentaire', 
  'Sciences Po / Instituts d\'études politiques'
];
// Année actuellement sélectionnée pour le graphique en grand
selectedLargeYear: string = '2020';

constructor(
  private route: ActivatedRoute,
  private apiService: ApiService
) { }

ngOnInit(): void {
  const regionName = this.route.snapshot.paramMap.get('region');
  if (regionName) { 
    this.region = regionName;
    this.getNbFilieresParRegion(this.region);
    this.loadLargeChartData(this.selectedLargeYear);
  }
}

/**
 * Récupère pour chaque année le nombre de filières Public et Privé via l'endpoint getNbFilieresParRegion.
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
 * Affiche le graphique en barres empilées pour les filières Public (bleu) et Privé (orange).
 */
renderPublicPrivateChart(years: string[], publicCounts: number[], privateCounts: number[]): void {
  const canvas = document.getElementById('formationChart') as HTMLCanvasElement;
  if (!canvas) {
    console.error("Canvas 'formationChart' non trouvé !");
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error("Impossible d'obtenir le contexte 2D pour 'formationChart'!");
    return;
  }

  if (this.publicPrivateChart) {
    this.publicPrivateChart.destroy();
  }

  this.publicPrivateChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: years,
      datasets: [
        {
          label: 'Public',
          data: publicCounts,
          backgroundColor: 'rgba(54, 162, 235, 0.7)', // bleu
          stack: 'stack1'
        },
        {
          label: 'Privé',
          data: privateCounts,
          backgroundColor: 'rgba(255, 159, 64, 0.7)', // orange
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
 * Charge les données pour le graphique en grand pour l'année passée en paramètre.
 * Pour chaque type de formation, on appelle l'endpoint getNbFilieresParType pour obtenir le nombre.
 */
loadLargeChartData(year: string): void {
  const observables = this.formationTypes.map(type => 
    this.apiService.getNbFilieresParType(this.region, year, type)
  );
  
  forkJoin(observables).subscribe({
    next: (results) => {
      const data: number[] = results.map(res => res && res.length > 0 ? res[0].TotalType : 0);
      this.renderLargePolarChart(year, this.formationTypes, data);
    },
    error: (err) => {
      console.error(`Erreur lors du chargement des données pour l'année ${year}:`, err);
      const data = this.formationTypes.map(() => 0);
      this.renderLargePolarChart(year, this.formationTypes, data);
    }
  });
}

/**
 * Affiche un graphique de type "polarArea" qui prend la place de l'écran,
 * affichant la répartition des filières par type pour l'année donnée.
 * @param year Année sélectionnée.
 * @param labels Liste des types de formation.
 * @param data Nombre d'occurrences pour chaque type.
 */
renderLargePolarChart(year: string, labels: string[], data: number[]): void {
  const canvas = document.getElementById('largeChart') as HTMLCanvasElement;
  if (!canvas) {
    console.error("Canvas 'largeChart' non trouvé !");
    return;
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error("Impossible d'obtenir le contexte 2D pour 'largeChart'!");
    return;
  }
  if (this.largeChart) {
    this.largeChart.destroy();
  }
  this.largeChart = new Chart(ctx, {
    type: 'polarArea',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: labels.map(() => this.randomColor()),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'right' },
        title: {
          display: true,
          text: `Répartition des filières pour ${year}`
        }
      }
    }
  });
}

/**
 * Renvoie une couleur aléatoire en format RGBA.
 */
randomColor(): string {
  const r = Math.floor(Math.random() * 156) + 100;
  const g = Math.floor(Math.random() * 156) + 100;
  const b = Math.floor(Math.random() * 156) + 100;
  return `rgba(${r}, ${g}, ${b}, 0.7)`;
}

/**
 * Méthode appelée lorsqu'un bouton d'année est cliqué pour le graphique en grand.
 */
onSelectLargeYear(selectedYear: string): void {
  this.selectedLargeYear = selectedYear;
  this.loadLargeChartData(selectedYear);
}


}

