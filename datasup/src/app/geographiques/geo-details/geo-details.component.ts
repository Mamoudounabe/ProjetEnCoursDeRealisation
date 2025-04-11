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

    constructor(private route: ActivatedRoute,private apiService: ApiService) {}


    chart: any;



ngOnInit() {
    const regionName = this.route.snapshot.paramMap.get('region');  
    if (regionName) { 
        this.getRegion(regionName);
    }
}


getRegion(region: string) { 
    const annees = ['2020', '2021', '2022', '2023'];
    const dataSeries: { annee: string, nombre_formations: number }[] = [];

    let completedRequests = 0;

    annees.forEach(annee => {
        this.apiService.getEtablissementsByRegion(region, annee).subscribe({
            next: (response: any[]) => {  // Déclare que response est un tableau
                console.log(`Données pour ${annee}:`, response);

                // Vérifie si response est un tableau et additionne les formations
                const nombreFormations = response?.reduce((sum, etablissement) => sum + (etablissement.nombre_formations || 0), 0) || 0;

                dataSeries.push({ annee, nombre_formations: nombreFormations });

                completedRequests++;

                // Quand toutes les requêtes sont terminées, on affiche le graphique
                if (completedRequests === annees.length) {
                    this.renderChart(dataSeries);
                }
            },
            error: (err) => console.error(`Erreur pour ${annee}:`, err)
        });
    });
}







renderChart(dataSeries: { annee: string, nombre_formations: number }[]) {
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

    // Vérifier s'il y a un ancien graphique et le détruire
    if (this.chart) {
        this.chart.destroy();
    }

    const labels = dataSeries.map(d => d.annee);
    const values = dataSeries.map(d => d.nombre_formations);

    this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Nombre de formations',
                data: values,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
*/




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
   */
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
   */
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



}