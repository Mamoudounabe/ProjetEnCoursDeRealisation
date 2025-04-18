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

Chart.register(...registerables);

@Component({
    selector: 'app-geo-details',
    standalone: true,
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
 // Graphique pour filières Public/Privé (barres empilées)
 publicPrivateChart: any;
 // Graphique pour la répartition par type (affiché sous forme de graphique à barres horizontal)
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
 
 // Année actuellement sélectionnée pour le graphique rectangulaire
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
  *//*
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
  *//*
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
       plugins: { legend: { position: 'top' } },
       scales: { 
         x: { stacked: true },
         y: { stacked: true, beginAtZero: true }
       }
     }
   });
 }

 /**
  * Charge les données pour le graphique rectangulaire pour l'année passée en paramètre.
  * Pour chaque type de formation, on appelle l'endpoint getNbFilieresParType pour obtenir le nombre.
  *//*
 loadLargeChartData(year: string): void {
   const observables = this.formationTypes.map(type => 
     this.apiService.getNbFilieresParType(this.region, year, type)
   );
   
   forkJoin(observables).subscribe({
     next: (results) => {
       const data: number[] = results.map(res => res && res.length > 0 ? res[0].TotalType : 0);
       this.renderLargeRectangularChart(year, this.formationTypes, data);
     },
     error: (err) => {
       console.error(`Erreur lors du chargement des données pour l'année ${year}:`, err);
       const data = this.formationTypes.map(() => 0);
       this.renderLargeRectangularChart(year, this.formationTypes, data);
     }
   });
 }

 /**
  * Affiche un graphique à barres horizontal qui occupe une grande partie de l'écran,
  * affichant la répartition des filières par type pour l'année donnée.
  * @param year Année sélectionnée.
  * @param labels Liste des types de formation.
  * @param data Nombre d'occurrences pour chaque type.
  *//*
 renderLargeRectangularChart(year: string, labels: string[], data: number[]): void {
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
     type: 'bar',
     data: {
       labels: labels,
       datasets: [{
         label: `Répartition des filières pour ${year}`,
         data: data,
         backgroundColor: labels.map(() => this.randomColor()),
         borderWidth: 1
       }]
     },
     options: {
       responsive: true,
       indexAxis: 'y', // Affichage horizontal
       plugins: {
         legend: { display: false },
         title: {
           display: true,
           text: `Répartition des filières pour ${year}`
         }
       },
       scales: {
         x: { beginAtZero: true }
       }
     }
   });
 }

 /**
  * Renvoie une couleur aléatoire en format RGBA.
  *//*
 randomColor(): string {
   const r = Math.floor(Math.random() * 156) + 100;
   const g = Math.floor(Math.random() * 156) + 100;
   const b = Math.floor(Math.random() * 156) + 100;
   return `rgba(${r}, ${g}, ${b}, 0.7)`;
 }

 /**
  * Méthode appelée lorsqu'un bouton d'année est cliqué pour le graphique rectangulaire.
  *//*
 onSelectLargeYear(selectedYear: string): void {
   this.selectedLargeYear = selectedYear;
   this.loadLargeChartData(selectedYear);
 }
*/
 
  // Graphique pour filières Public/Privé (barres empilées)
  publicPrivateChart: any;
  // Graphique pour la répartition par type (barres horizontales)
  largeChart: any;
  // Graphique pour la répartition par matière (camembert)
  matterChart: any;

  // Années à considérer
  years: string[] = ['2020', '2021', '2022', '2023'];
  // Région récupérée depuis l'URL
  region: string = '';

  // Tableau de types de formation pour le graphique horizontal
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

  // Tableau fixe de couleurs pour le graphique horizontal (type)
  fixedTypeColors: string[] = [
    '#3366CC', '#DC3912', '#FF9900', '#109618', '#990099',
    '#0099C6', '#DD4477', '#66AA00', '#B82E2E', '#316395',
    '#994499', '#22AA99', '#AAAA11', '#6633CC', '#E67300',
    '#8B0707', '#329262', '#5574A6', '#3B3EAC'
  ];

  // Tableau de types pour le graphique matière (camembert)
  matterTypes: string[] = [
    'informatique', 
    'Electronique', 
    'Mathématiques', 
    'Mécanique', 
    'Chimie', 
    'Droit', 
    'Philosophie', 
    'Sciences de la vie', 
    'Lettres', 
    'Langue', 
    'Histoire', 
    'commerce', 
    'Sport', 
    'infirmier', 
    'Economie et gestion', 
    'Santé', 
    'Architecture', 
    'Sciences politiques', 
    'Art'
  ];

  // Tableau fixe de couleurs pour le graphique matière (camembert)
  fixedMatterColors: string[] = [
    '#8E44AD', '#3498DB', '#27AE60', '#F1C40F', '#E67E22',
    '#E74C3C', '#2ECC71', '#1ABC9C', '#34495E', '#16A085',
    '#F39C12', '#D35400', '#C0392B', '#7F8C8D', '#2980B9',
    '#8E44AD', '#27AE60', '#E74C3C', '#3498DB'
  ];

  // Année actuellement sélectionnée pour le graphique horizontal (type)
  selectedLargeYear: string = '2020';
  // Année actuellement sélectionnée pour le graphique matière (camembert)
  selectedMatterYear: string = '2020';

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
      this.loadMatterChartData(this.selectedMatterYear);
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
   * Affiche le graphique en barres empilées pour les filières Public et Privé.
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
        plugins: { legend: { position: 'top' } },
        scales: { 
          x: { stacked: true },
          y: { stacked: true, beginAtZero: true }
        }
      }
    });
  }

  /**
   * Charge les données pour le graphique horizontal (2ème graphique) pour l'année donnée.
   * Pour chaque type de formation, on appelle l'endpoint getNbFilieresParType pour obtenir le nombre.
   */
  loadLargeChartData(year: string): void {
    const observables = this.formationTypes.map(type => 
      this.apiService.getNbFilieresParType(this.region, year, type)
    );
    
    forkJoin(observables).subscribe({
      next: (results) => {
        const data: number[] = results.map(res => res && res.length > 0 ? res[0].TotalType : 0);
        this.renderLargeRectangularChart(year, this.formationTypes, data);
      },
      error: (err) => {
        console.error(`Erreur lors du chargement des données pour l'année ${year}:`, err);
        const data = this.formationTypes.map(() => 0);
        this.renderLargeRectangularChart(year, this.formationTypes, data);
      }
    });
  }

  /**
   * Affiche un graphique à barres horizontal qui occupe une grande partie de l'écran,
   * affichant la répartition des filières par type pour l'année donnée.
   * Utilise des couleurs fixes définies dans fixedTypeColors.
   */
  renderLargeRectangularChart(year: string, labels: string[], data: number[]): void {
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
    const colors = this.fixedTypeColors.slice(0, labels.length);
    this.largeChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: `Répartition des filières pour ${year}`,
          data: data,
          backgroundColor: colors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        indexAxis: 'y', // Affichage horizontal
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: `Répartition des filières par type pour ${year}`
          }
        },
        scales: {
          x: { beginAtZero: true }
        }
      }
    });
  }

  /**
   * Charge les données pour le graphique en camembert (3ème graphique) pour l'année donnée.
   * Pour chaque type de matière, on appelle l'endpoint getNbFilieresParMatiere pour obtenir le nombre.
   * Les résultats sont triés par ordre croissant avant affichage.
   */
  loadMatterChartData(year: string): void {
    const observables = this.matterTypes.map(matter =>
      // On passe le paramètre en minuscule pour garantir la correspondance
      this.apiService.getNbFilieresParMatiere(this.region, year, matter.toLowerCase())
    );
    
    forkJoin(observables).subscribe({
      next: (results) => {
        // Récupération des valeurs dans l'ordre de matterTypes en utilisant l'alias "TotalInformatique"
        const data: number[] = results.map(res => res && res.length > 0 ? res[0].TotalInformatique : 0);
        
        // Création d'un tableau de paires { label, value } pour trier par ordre croissant
        const pairs = this.matterTypes.map((label, idx) => ({ label: label, value: data[idx] }));
        pairs.sort((a, b) => a.value - b.value);
        const sortedLabels = pairs.map(p => p.label);
        const sortedData = pairs.map(p => p.value);
        
        this.renderMatterPieChart(year, sortedLabels, sortedData);
      },
      error: (err) => {
        console.error(`Erreur lors du chargement des données matière pour l'année ${year}:`, err);
        const data = this.matterTypes.map(() => 0);
        this.renderMatterPieChart(year, this.matterTypes, data);
      }
    });
  }

  /**
   * Affiche un graphique en camembert pour la répartition des filières par matière pour l'année donnée.
   * Utilise des couleurs fixes définies dans fixedMatterColors.
   */
  renderMatterPieChart(year: string, labels: string[], data: number[]): void {
    const canvas = document.getElementById('matterChart') as HTMLCanvasElement;
    if (!canvas) {
      console.error("Canvas 'matterChart' non trouvé !");
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error("Impossible d'obtenir le contexte 2D pour 'matterChart'!");
      return;
    }
    if (this.matterChart) {
      this.matterChart.destroy();
    }
    const colors = this.fixedMatterColors.slice(0, labels.length);
    this.matterChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'right' },
          title: {
            display: true,
            text: `Répartition des filières par matière pour ${year}`
          }
        }
      }
    });
  }

  /**
   * Méthode appelée lorsqu'un bouton d'année est cliqué pour le graphique horizontal (type).
   */
  onSelectLargeYear(selectedYear: string): void {
    this.selectedLargeYear = selectedYear;
    this.loadLargeChartData(selectedYear);
  }

  /**
   * Méthode appelée lorsqu'un bouton d'année est cliqué pour le graphique en camembert matière.
   */
  onSelectMatterYear(selectedYear: string): void {
    this.selectedMatterYear = selectedYear;
    this.loadMatterChartData(selectedYear);
  }
}