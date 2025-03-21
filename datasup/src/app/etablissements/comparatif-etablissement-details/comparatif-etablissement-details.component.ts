// Méthode pour récupérer les données des établissements
/* getEtablissementData(annee: string, etablissementsIDs: number[]): void {
 
  console.log(`Chargement des données pour les établissements ${etablissementsIDs.join(', ')} pour l'année ${annee}`);
  
  this.apiService.getEtablissementsByComp(etablissementsIDs, annee).subscribe(
    (response) => {
     
      this.etablissementsData = response;
      console.log('Données récupérées:', response);
    },
    (error) => {
     
      console.error('Erreur lors de la récupération des données des établissements:', error);
    }
  );
} */


import { Component, OnInit, ElementRef, ViewChild, Input,ChangeDetectionStrategy, signal  } from '@angular/core';
import {  AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Formation } from '../../core/models/formation.model';
import { FormationService } from '../../core/services/formations.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { Chart, registerables, ChartOptions,ChartType } from 'chart.js';
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
import { ChartDataset,ChartData } from 'chart.js';
import{ CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ApiService} from '../../core/services/api.service';
import { faSignal } from '@fortawesome/free-solid-svg-icons'; 
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MatGridListModule} from '@angular/material/grid-list';


import { toInteger } from 'lodash'; // Si lodash est installé, sinon utilise `parseInt`

@Component({
  selector: 'app-comparatif-etablissement-details',
  standalone: true,
  imports: [ RouterLink,
    NgIf,
    MatInputModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule,
    MatTabsModule,
    MatButtonToggleModule,
     MatCheckboxModule ,
     CommonModule,
     FontAwesomeModule,
     MatGridListModule

    ],
  templateUrl: './comparatif-etablissement-details.component.html',
  styleUrl: './comparatif-etablissement-details.component.css'
})
export class ComparatifEtablissementDetailsComponent implements OnInit  {

  faSignal = faSignal;

  etablissementsIDs: number[] = [];
  selectedYear = new FormControl('2021'); 
  anneeactuelle: string = '2021'; 
  etablissementsData: any[] = [];
  selectedOption: string = 'neo_admis';  
 /*  selectedOption: string = 'nombre_de_candidats';  */
 /*  chart: any; */
 chart!: Chart | null;
  @ViewChild('etablissementsChart', { static: false }) chartRef!: ElementRef;
  etablissementData: any;
  etablissementsDataBacheliers: any[] = [];
  


  


constructor(private apiService: ApiService, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}

ngOnInit(): void {
  const etablissementsParam = this.route.snapshot.paramMap.get('ids');
  if (!etablissementsParam) {
    console.error("Aucun ID d'établissements trouvé dans l'URL !");
    return;
  }

  this.etablissementsIDs = etablissementsParam.split(',').map(id => Number(id));
  if (this.etablissementsIDs.length < 2) {
    console.error("Il faut au moins deux établissements à comparer !");
    return;
  }
  if (this.etablissementsIDs.some(id => isNaN(id) || id <= 0)) {
    console.error("Un ou plusieurs IDs d'établissements sont invalides !");
    return;
  }
  this.selectedYear.valueChanges.subscribe((anneeactuelle) => {
    this.getEtablissementData(anneeactuelle || '2021', this.etablissementsIDs);
  });

  this.getEtablissementData(this.selectedYear.value || '2021', this.etablissementsIDs);
  console.log("Année sélectionnée:", this.selectedYear.value);
}



private safeNumber(val: any): number {
  if (val === null || val === undefined) {
    console.warn(" Valeur null ou undefined détectée, remplacée par 0.");
    return 0;
  }

  const num = Number(val);
  if (isNaN(num)) {
    console.warn(" Valeur NaN détectée, remplacée par 0:", val);
    return 0;
  }

  return num;
}




/* getEtablissementData(annee: string, etablissementsIDs: number[]): void {
  console.log(`Chargement des données pour les établissements ${etablissementsIDs.join(', ')} pour l'année ${annee}`);

  this.apiService.getEtablissementsByComp(etablissementsIDs, annee).subscribe(
    (response) => {
     
      console.log('Réponse de l\'API:', response);
  
      if (response && response.length > 0) {

      
        console.log(" Données récupérées :", this.etablissementData);
        this.etablissementsData = response.sort((a, b) => 
          this.safeNumber(b.effectif_total_candidats_phase_principale) - this.safeNumber(a.effectif_total_candidats_phase_principale)
        );

        console.log('Données triées:', this.etablissementsData);
        this.cdr.detectChanges();
        this.createChart();
      } else {
        console.warn('Aucune donnée reçue.');
      }
    },
    (error) => {
      console.error('Erreur lors de la récupération des données:', error);
    }
  );
}
 */








/**
 * Fonction pour convertir un nombre en toute sécurité
 * @param val Valeur à convertir
 * @returns Nombre converti ou 0 si invalide
 */




/* 

createChart(): void {
  setTimeout(() => {
    if (!this.etablissementsData || this.etablissementsData.length === 0) {
      console.warn("Pas de données disponibles pour créer le graphique.");
      return;
    }

    if (!this.chartRef?.nativeElement) {
      console.error("Le canvas n'est pas encore disponible !");
      return;
    }

    const ctx = this.chartRef.nativeElement.getContext('2d');

    if (this.chart) {
      this.chart.destroy();
    }

    console.log('Labels:', this.etablissementsData.map(etab => etab.NomEtablissement));
    console.log('Données:', this.etablissementsData.map(etab => this.safeNumber(etab.effectif_autres_candidats_phase_principale)));

    this.chart = new Chart(ctx, {
      type: 'bar' as ChartType,
      data: {
        labels: this.etablissementsData.map(etab => etab.NomEtablissement),
        datasets: [{
         label: 'Nombre de Candidats', 
         
          data: this.etablissementsData.map(etab => this.safeNumber(etab.effectif_autres_candidats_phase_principale)),
          backgroundColor: 'rgba(58, 104, 156, 0.6)',
          borderColor: 'rgb(206, 36, 64)',
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        scales: {
          x: { beginAtZero: true }
        }
      }
    });
  }, 200);
} */



/* tryCreateChart(): void {
  setTimeout(() => {
    if (!this.chartRef?.nativeElement) {
      console.error("Le canvas n'est pas encore disponible !");
      return;
    }

    this.createChart();
  }, 200);
}
 */


@ViewChild('chartCandidatsRef', { static: false }) chartCandidatsRef!: ElementRef;
  @ViewChild('chartNeoBacheliersRef', { static: false }) chartNeoBacheliersRef!: ElementRef;



  ngAfterViewInit(): void {
    // Une fois la vue initialisée, tu peux accéder aux éléments canvas
    console.log('Canvas Candidats:', this.chartCandidatsRef);
    console.log('Canvas Neo-bacheliers:', this.chartNeoBacheliersRef);
    
    // Appeler la méthode createChart avec les bonnes références
    this.createChart(this.chartCandidatsRef, 'effectif_autres_candidats_phase_principale', 'Nombre de Candidats');
    this.createChart(this.chartNeoBacheliersRef, 'effectif_neo_bacheliers_admis', 'Néo-bacheliers Admis');
  }

  createChart(chartRef: ElementRef, dataKey: string, label: string): void {
    setTimeout(() => {
      if (!this.etablissementsData || this.etablissementsData.length === 0) {
        console.warn("Pas de données disponibles pour créer le graphique.");
        return;
      }
  
      if (!chartRef?.nativeElement) {
        console.error("Le canvas n'est pas encore disponible !");
        return;
      }
  
      const ctx = chartRef.nativeElement.getContext('2d');
  
      // Vérifier si un graphique existe déjà pour cet élément et le détruire
      if (chartRef.nativeElement.chartInstance) {
        chartRef.nativeElement.chartInstance.destroy();
      }
  
      console.log(`📊 Création du graphique : ${label}`);
      console.log('Labels:', this.etablissementsData.map(etab => etab.NomEtablissement));
      console.log(`Données (${dataKey}):`, this.etablissementsData.map(etab => this.safeNumber(etab[dataKey])));
  
      chartRef.nativeElement.chartInstance = new Chart(ctx, {
        type: 'bar' as ChartType,
        data: {
          labels: this.etablissementsData.map(etab => etab.NomEtablissement),
          datasets: [{
            label: label,  // Dynamique
            data: this.etablissementsData.map(etab => this.safeNumber(etab[dataKey])),
            backgroundColor: 'rgba(58, 104, 156, 0.6)',
            borderColor: 'rgb(206, 36, 64)',
            borderWidth: 1
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          scales: {
            x: { beginAtZero: true }
          }
        }
      });
    }, 200);
  }
  

  // Récupérer les données via l'API
  getEtablissementData(annee: string, etablissementsIDs: number[]): void {
    console.log(`📡 Chargement des données pour les établissements ${etablissementsIDs.join(', ')} pour l'année ${annee}`);
  
    this.apiService.getEtablissementsByComp(etablissementsIDs, annee).subscribe(
      (response) => {
        console.log('🛠 Réponse brute de l\'API:', response);
  
        // Vérifie si 'body' existe ou non et accède à la donnée
        const data = (response as any).body || response;
  
        // Vérifier si la réponse contient des données valides
        if (!Array.isArray(data) || data.length === 0) {
          console.warn('Aucune donnée valide reçue !', data);
          return;
        }
  
        console.log("Données brutes reçues :", data);
  
        // Trier les données en fonction de 'effectif_autres_candidats_phase_principale'
        this.etablissementsData = data.sort((a, b) =>
          this.safeNumber(b.effectif_autres_candidats_phase_principale) - 
          this.safeNumber(a.effectif_autres_candidats_phase_principale)
        );
        console.log('Données triées (Candidats) :', this.etablissementsData);
  
        // Trier les données en fonction de 'effectif_neo_bacheliers_admis'
        this.etablissementsData = this.etablissementsData.sort((a, b) =>
          this.safeNumber(b.effectif_neo_bacheliers_admis) - 
          this.safeNumber(a.effectif_neo_bacheliers_admis)
        );
        console.log('Données triées (Neo-Bacheliers) :', this.etablissementsData);
  
        // Une fois les données récupérées et triées, on met à jour les graphiques
        // Graphique pour les candidats
        this.createChart(this.chartCandidatsRef, 'effectif_autres_candidats_phase_principale', 'Nombre de Candidats');
  
        // Graphique pour les néo-bacheliers
        this.createChart(this.chartNeoBacheliersRef, 'effectif_neo_bacheliers_admis', 'Néo-bacheliers Admis');
      },
      (error) => {
        console.error('Erreur lors de la récupération des données:', error);
      }
    );
  }
  

tryCreateCharts(): void {
  if (!this.chartCandidatsRef?.nativeElement || !this.chartNeoBacheliersRef?.nativeElement) {
    console.error(" Les canvas ne sont pas encore disponibles !");
    return;
  }

  this.createChart(this.chartCandidatsRef, 'effectif_autres_candidats_phase_principale', 'Nombre de Candidats');
  this.createChart(this.chartNeoBacheliersRef, 'effectif_neo_bacheliers_admis', 'Néo-bacheliers admis');
}

  


  
}