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
     FontAwesomeModule

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
  selectedOption: string = 'mention_bien'; 
 /*  chart: any; */
  chart!: Chart;
  @ViewChild('etablissementsChart', { static: false }) chartRef!: ElementRef;
  

constructor(private apiService: ApiService, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}


ngOnInit(): void {
  // Récupérer les IDs des établissements depuis l'URL
  const etablissementsParam = this.route.snapshot.paramMap.get('ids');
  if (!etablissementsParam) {
    console.error("Aucun ID d'établissements trouvé dans l'URL !");
    return;
  }

  this.etablissementsIDs = etablissementsParam.split(',').map(id => Number(id));

  // Vérification qu'il y a au moins deux établissements à comparer
  if (this.etablissementsIDs.length < 2) {
    console.error("Il faut au moins deux établissements à comparer !");
    return;
  }

  // Vérification que tous les IDs sont valides
  if (this.etablissementsIDs.some(id => isNaN(id) || id <= 0)) {
    console.error("Un ou plusieurs IDs d'établissements sont invalides !");
    return;
  }

  // Souscrire aux changements de l'année sélectionnée
  this.selectedYear.valueChanges.subscribe((anneeactuelle) => {
    this.getEtablissementData(anneeactuelle || '2021', this.etablissementsIDs);
  });

  // Charger les données pour la première fois
  this.getEtablissementData(this.selectedYear.value || '2021', this.etablissementsIDs);
  console.log("Année sélectionnée:", this.selectedYear.value);
}




  
  
  ngAfterViewInit(): void {
    console.log("ngAfterViewInit - chartRef:", this.chartRef);
    this.tryCreateChart();
  }


  getEtablissementData(annee: string,etablissementsIDs: number[]): void {
    console.log(`Chargement des données pour les établissements ${etablissementsIDs.join(', ')} pour l'année ${annee}`);

    this.apiService.getEtablissementsByComp(etablissementsIDs, annee).subscribe(
      (response) => {
        // Vérification et tri des données
        if (response && response.length > 0) {
          this.etablissementsData = response.sort((a, b) => 
            toInteger(b.effectif_total_candidats_phase_principale) - toInteger(a.effectif_total_candidats_phase_principale)
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




  createChart(): void {
    setTimeout(() => {  // Délai pour laisser le DOM se mettre à jour
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

      this.chart = new Chart(ctx, { 
        type: 'bar' as ChartType,
        data: {
          labels: this.etablissementsData.map(etab => etab.NomEtablissement),
          datasets: [{
            label: 'Nombre de Candidats',
            data: this.etablissementsData.map(etab => toInteger(etab.effectif_total_candidats_phase_principale)),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
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

    }, 200); // Augmenté à 200ms pour plus de fiabilité
  }

  tryCreateChart(): void {
    setTimeout(() => { 
      if (!this.chartRef?.nativeElement) {
        console.error("Le canvas n'est pas encore disponible !");
        return;
      }

      this.createChart();
    }, 200);
  }



  


  
}