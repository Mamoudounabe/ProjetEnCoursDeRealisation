import { Component, OnInit, ElementRef, ViewChild, Input,ChangeDetectionStrategy, signal  } from '@angular/core';
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
import { ChartConfiguration } from 'chart.js'; 
import { ChartDataset,ChartData } from 'chart.js';
import{ CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ApiService} from '../../core/services/api.service';
import { faSignal } from '@fortawesome/free-solid-svg-icons'; 
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

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


constructor(private apiService: ApiService, private route: ActivatedRoute) {}


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

// Méthode pour récupérer les données des établissements
getEtablissementData(annee: string, etablissementsIDs: number[]): void {
  // Afficher les IDs des établissements et l'année dans la console
  console.log(`Chargement des données pour les établissements ${etablissementsIDs.join(', ')} pour l'année ${annee}`);
  
  // Appeler le service pour récupérer les données
  this.apiService.getEtablissementsByComp(etablissementsIDs, annee).subscribe(
    (response) => {
      // Traiter la réponse ici
      this.etablissementsData = response;
      console.log('Données récupérées:', response);
    },
    (error) => {
      // Traiter l'erreur ici
      console.error('Erreur lors de la récupération des données des établissements:', error);
    }
  );
}
  



}