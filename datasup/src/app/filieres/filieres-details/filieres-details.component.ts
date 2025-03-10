import { Component, OnInit, ElementRef, ViewChild, Input,ChangeDetectionStrategy, signal  } from '@angular/core';
import { Formation } from '../../core/models/formation.model';
import { ApiService} from '../../core/services/api.service';
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


Chart.register(...registerables, ChartDataLabels);

@Component({
  selector: 'app-filieres-details',
  standalone: true,
  imports: [ 
    RouterLink,
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
     CommonModule 
   ],
  templateUrl: './filieres-details.component.html',
  styleUrl: './filieres-details.component.css'
})
export class FilieresDetailsComponent {

    filiereID!: number;
    anneeactuelle!: string;
    filieres: any[] = [];
    selectedOption: string = 'mention_bien';
  
    constructor(private apiService: ApiService, private route: ActivatedRoute) {}
  
    ngOnInit() {
      // Récupération des paramètres de l'URL
      const filiereIdParam = this.route.snapshot.paramMap.get("id");
      const anneeParam = this.route.snapshot.queryParamMap.get("annee"); // Récupération en tant que query param
  
      // Vérification et conversion sécurisée
      this.filiereID = filiereIdParam && !isNaN(Number(filiereIdParam)) ? Number(filiereIdParam) : 0;
      this.anneeactuelle = anneeParam ? anneeParam : "2021";
  
      console.log("Valeurs après récupération :", this.filiereID, this.anneeactuelle);
  
      if (!this.filiereID) {
        console.error("Erreur : filiereID invalide !");
        return;
      }
  
      if (!this.anneeactuelle) {
        console.error("Erreur : anneeactuelle est manquante !");
        return;
      }
  
      // Chargement des données depuis l'API
      this.chargementdata();
    }
  
 



      totalCandidats: number = 10000; // Exemple de valeur, vous pouvez ajuster en fonction de vos données
      neoBacheliers: number = 5000;   // Exemple de valeur
      baisseTotale: number = 10;      // Exemple de pourcentage de baisse
      baisseNeoBacheliers: number = 8; // Exemple de pourcentage de baisse
    
      year = 2006; // Année affichée sur le graphique

      public barChartData: ChartData<'bar'> = {
        labels: [],
        datasets: [
          { 
            data: [], 
            label: 'Utilisateurs (M)',
            backgroundColor: ['#17A2B8', '#FF5252', '#40C4FF', '#00E676', '#29B6F6', '#FF5722'],
          }
        ]
      };



     // Options du graphique à barres
  public barChartOptionss: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    animation: {
      duration: 2000,
      easing: 'linear'
    },
    scales: {
      x: { min: 0, max: 50 }
    }
  };



   // Type du graphique
   public barChartTypee: 'bar' = 'bar'; // Indiquer explicitement 'bar' comme type

   startChartRace() {
     setInterval(() => {
       this.year++; // Incrémente l'année
 
       // Simule des données évolutives
       this.barChartData.datasets[0].data = this.barChartData.datasets[0].data.map((value) => 
         Math.max(0, value + (Math.random() * 5 - 2)) // Variation aléatoire
       );
 
       this.barChartData = { ...this.barChartData }; // Mise à jour du graphique
     }, 2000);
   }
  


   chargementdata() {
    if (!this.filiereID || isNaN(this.filiereID) || !this.anneeactuelle) {
      console.error("Données invalides ! filiereID:", this.filiereID, "anneeactuelle:", this.anneeactuelle);
      return;
    }

      this.apiService.getFilieresByDetails(this.filiereID, this.anneeactuelle).subscribe({
        next: (response) => {
          console.log("Données reçues :", response);
          this.filieres = response;

          // Mise à jour des données du graphique
      this.barChartData.labels = this.filieres.map(filiere => filiere.filiere_formation);
      this.barChartData.datasets[0].data = this.filieres.map(filiere => filiere.effectif_total_candidats_formation);

        },
        error: (error) => {
          if (error.status === 404) {
            console.warn("Aucune donnée trouvée pour cet ID et cette année.");
          } else if (error.status === 500) {
            console.error("Erreur interne du serveur !");
          } else {
            console.error("Erreur inconnue :", error);
          }
        }
      });
    }





  }
  












