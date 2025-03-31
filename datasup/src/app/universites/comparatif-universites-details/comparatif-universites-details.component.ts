import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
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
  selector: 'app-comparatif-universites-details',
  standalone: true,
  imports: [], // Ajoutez ici les modules Angular nécessaires
  templateUrl: './comparatif-universites-details.component.html',
  styleUrls: ['./comparatif-universites-details.component.css']
})
export class ComparatifUniversitesDetailsComponent implements OnInit {
  universitesIDs: number[] = []; // Liste des IDs des universités sélectionnées
  universitesNames: string[] = []; // Liste des noms des universités sélectionnées
  anneesActuelles: string[] = ['2021']; // À modifier selon besoin
  universitesData: any[] = [];

 /*  constructor(private route: ActivatedRoute) {} */
 constructor(private apiService: ApiService, private cdr: ChangeDetectorRef, private router: Router,private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const nomsString = params.get('nom');  // Récupère la chaîne des noms d'universités depuis l'URL
      if (nomsString) {
        this.universitesNames = nomsString.split(',');  // Découpe la chaîne en un tableau
        console.log('✅ Noms récupérés :', this.universitesNames);  // Affiche les noms
      } else {
        console.error(' Aucun nom d\'université trouvé dans l\'URL.');
      }
    });

    this.getUniversitesData();  // Appelle la méthode pour récupérer les données des universités
  }

  getUniversitesData(): void {
    if (!this.universitesNames || this.universitesNames.length < 2) {
      console.error(' Vous devez sélectionner au moins deux universités pour la comparaison.');
      return;
    }
  
    if (!this.anneesActuelles || this.anneesActuelles.length === 0) {
      console.error(' Vous devez sélectionner au moins une année.');
      return;
    }
  
    this.apiService.getUniversitesByComp(this.universitesNames, this.anneesActuelles)
      .subscribe(
        (data) => {
          this.universitesData = data;
          console.log(' Données des universités récupérées :', this.universitesData);
        },
        (error) => {
          console.error(' Erreur lors de la récupération des universités :', error);
        }
      );
  }
  
  





}
