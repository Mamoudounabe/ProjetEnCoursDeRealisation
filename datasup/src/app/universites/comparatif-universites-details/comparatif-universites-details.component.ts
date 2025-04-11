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
  imports: [  MatInputModule,
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
    RouterModule ], // Ajoutez ici les modules Angular nécessaires
  templateUrl: './comparatif-universites-details.component.html',
  styleUrls: ['./comparatif-universites-details.component.css']
})
export class ComparatifUniversitesDetailsComponent implements OnInit {
  universitesIDs: number[] = []; // Liste des IDs des universités sélectionnées
  universitesNames: string[] = []; // Liste des noms des universités sélectionnées
  /* anneesActuelles: string[] = ['2020', '2021', '2022', '2023']; */ // À modifier selon besoin
  anneesActuelles: string[] = ['2020','2021', '2022', '2023']; // À modifier selon besoin
/*   universitesData: any[] = []; */
  faSignal = faSignal;

  chart: any;


  universitesData: Record<string, any[]> = {};


/* ---------------- Informations  Générales------- bloc 1--------------------------------------------------------------- */

selectedOption: string = 'nombre_de_candidats'; // Assurez-vous que cette valeur correspond à l'un des cas dans le template
selectedSousOption: string = 'neobachelier'; // Valeur par défaut pour le sous-menu
selectedSousOption1: string = 'ppneo';/* 'ppneo'; */

/* -------------------------------------------------------------------------------------------------------------- */

/* ---------------- Profil des candidats admis-----bloc 2--------------------------------------------------------------- */
selectedOption1 : string= 'mention_au_bac';
selectedSousOption11: string= 'mention_technologique';


/* ----------------------------------------------bloc 3---------------------------------------------------------------- */

selectedOption2 : string = 'taux_dacces';
selectedSousOption2 : string = '';


/* --------------------------------------------------------------------------------------------------------------------- */

/* --------------------------------------------bloc 4------------------------------------------------------------------- */

selectedOption3 : string = 'moyenne';

selectedSousOption3 : string = '';

/* ---------------------------------------------------------------------------------------------------------------------- */

/* -----------------------------------------------bloc 5---------------------------------------------------------------- */

selectedOption4 : string = 'resultats_academiques';


/* --------------------------------------------bloc Quotas------------------------------------------------------------------- */

selectedOptionQ : string = 'boursiersSecondaire';

selectedSousOptionQ : string = 'boursiersSecondaire';










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
    if (!this.universitesNames?.length || this.universitesNames.length < 2) {
      console.error('Vous devez sélectionner au moins deux universités pour la comparaison.');
      return;
    }

    if (!this.anneesActuelles?.length) {
      console.error('Vous devez sélectionner au moins une année.');
      return;
    }

    this.apiService.getUniversitesByComp(this.universitesNames, this.anneesActuelles)
      .subscribe(
        (data: any[]) => {
          console.log("Données brutes reçues :", data);

          // Transformer les données en un objet structuré par université et année
          this.universitesData = data.reduce((acc, universite) => {
            const etablissement = universite.etablissement;
            if (!acc[etablissement]) {
              acc[etablissement] = [];
            }
            acc[etablissement].push({
              annee: universite.annee,
              effectif_total_candidats_formation: universite.effectif_total_candidats_formation || 0,
              taux_acces: universite.taux_acces || 0,
              effectif_candidates_formation: universite.effectif_candidates_formation || 0 ,
              /* quotas applicable */
              effectif_boursiers_generaux_phase_principale: universite.effectif_boursiers_generaux_phase_principale || 0,
              effectif_admis_meme_academie: universite.effectif_admis_meme_academie || 0,
              moyenne_effectif_admis_meme_academie: universite.moyenne_effectif_admis_meme_academie || 0
            });
            return acc;
          }, {} as Record<string, any[]>);

          console.log("Données transformées :", this.universitesData);
          console.log("Années disponibles :", Object.values(this.universitesData).flat().map(d => d.annee));


         /* ['#009FE3', '#A3D39C'] */

          // Créer les graphiques après récupération des données
          this.createChart('effectif_total_candidats_formation', 'chartCandidats', 'Total Candidats', ['#009FE3', '#A3D39C']);
          this.createChart('taux_acces', 'chartPhasePrincipale', 'Candidats Phase Principale', ['#87A2C2', '#D77683']);
          this.createChart('effectif_candidates_formation', 'chartCandidates', 'Candidates Formation', ['#009FE3', '#A3D39C']);
          this.createChart('effectif_boursiers_generaux_phase_principale', 'chartBoursiers', 'Boursiers Phase Principale', ['#87A2C2', '#D77683']);
          this.createChart('effectif_admis_meme_academie', 'chartAdmisAcademie', 'Admis Même Académie', ['#009FE3', '#A3D39C']);
         /*  this.createChart('moyenne_effectif_admis_meme_academie', 'chartMoyenneAdmisAcademie', 'Moyenne Admis Même Académie', ['#009FE3', '#A3D39C']); */
          
        },
        (error) => {
          console.error('Erreur lors de la récupération des universités :', error);
        }
      );
  }




  createChart(variable: string, chartId: string, label: string, colors: string[]): void {
    setTimeout(() => {
      const canvas = document.getElementById(chartId) as HTMLCanvasElement;
      if (!canvas) {
        console.error(`Canvas avec id "${chartId}" introuvable.`);
        return;
      }

      if (this.chartInstances[chartId]) {
        this.chartInstances[chartId].destroy(); // Détruire l'ancien graphique avant d'en créer un nouveau
      }

      const labels = this.anneesActuelles;
      const datasets = this.universitesNames.map((name, index) => {
        const dataValues = this.anneesActuelles.map(annee => {
          const found = (this.universitesData as any)[name]?.find((entry: any) => entry.annee === annee);
          return found ? found[variable] : 0;
        });

        return {
          label: name,
          data: dataValues,
          backgroundColor: colors[index % colors.length],
        };
      });

      this.chartInstances[chartId] = new Chart(canvas, {
        type: 'bar',
        data: { labels, datasets },
        options: { responsive: true, scales: { y: { beginAtZero: true } } }
      });
    }, 100);
  }


 
  chartInstances: Record<string, Chart> = {}; // Stockage des graphiques






  retourListe() {
    this.router.navigate(['/etablissements']);
  }


}
