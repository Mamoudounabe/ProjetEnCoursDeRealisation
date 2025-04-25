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

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
/* import ChartDataLabels from 'chartjs-plugin-datalabels';  */
Chart.register(ChartDataLabels);

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
    RouterModule ,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatSliderModule,
  
  ], // Ajoutez ici les modules Angular nécessaires
  templateUrl: './comparatif-universites-details.component.html',
  styleUrls: ['./comparatif-universites-details.component.css']
})
export class ComparatifUniversitesDetailsComponent implements OnInit {
  universitesIDs: number[] = []; // Liste des IDs des universités sélectionnées
  universitesNames: string[] = []; // Liste des noms des universités sélectionnées
  /* anneesActuelles: string[] = ['2020', '2021', '2022', '2023']; */ // À modifier selon besoin
  anneesActuelles: string[] = ['2021', '2022', '2023']; // À modifier selon besoin
/*   universitesData: any[] = []; */
  faSignal = faSignal;

  chart: any;
  isLoading = true;

  universitesData: Record<string, any[]> = {};


  quotasData: Array<{
    etablissement: string;
    total_admis: number;
    pct_boursiers: number;
    pct_bac_general: number;
  }> = [];


/* ---------------- Informations  Générales------- bloc 1--------------------------------------------------------------- */

 selectedOption: string = 'nombre_de_candidats'; // Assurez-vous que cette valeur correspond à l'un des cas dans le template
selectedSousOption: string = 'neobachelier'; // Valeur par défaut pour le sous-menu
selectedSousOption1: string = 'ppneo';

 
/* -------------------------------------------------------------------------------------------------------------- */

/* ---------------- Profil des candidats admis-----bloc 2--------------------------------------------------------------- */
selectedOption1 : string= 'mention_technologique';
selectedSousOption11: string= 'mention_technologique';


/* ----------------------------------------------bloc 3---------------------------------------------------------------- */

selectedOption2 : string = 'duree_du_processus';
selectedSousOptionSelect: string = 'Admis_Avant_Bac'; 

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











 constructor(private apiService: ApiService, private cdr: ChangeDetectorRef, private router: Router,private route: ActivatedRoute) {}


ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    const nomsString = params.get('nom');
    if (nomsString) {
      this.universitesNames = nomsString.split(',');
      console.log(' Noms récupérés :', this.universitesNames);
    } else {
      console.error(' Aucun nom d\'université trouvé dans l\'URL.');
    }

    this.getUniversitesData();  // On attend d’avoir les noms avant de lancer
  });
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

    this.isLoading = true; // Affiche le spinner en début de chargement

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
              moyenne_effectif_admis_meme_academie: universite.moyenne_effectif_admis_meme_academie || 0,
              effectif_terminal_technologique: universite.effectif_terminal_technologique || 0,
              effectif_terminal_professionnelle: universite.effectif_terminal_professionnelle || 0,
              effectif_autres_candidats_phase_principale: universite.effectif_autres_candidats_phase_principale || 0,
        
              effectif_neo_bacheliers_generaux_phase_principale: universite.effectif_neo_bacheliers_generaux_phase_principale || 0,
              effectif_neo_bacheliers_technologiques_phase_principale: universite.effectif_neo_bacheliers_technologiques_phase_principale || 0,
              effectif_neo_bacheliers_professionnels_phase_principale: universite.effectif_neo_bacheliers_professionnels_phase_principale || 0,
              effectif_neo_bacheliers_mention_assez_bien_bac_admis: universite.effectif_neo_bacheliers_mention_assez_bien_bac_admis || 0,
              effectif_neo_bacheliers_mention_tres_bien_felicitation_bac_admis: universite.effectif_neo_bacheliers_mention_tres_bien_felicitation_bac_admis || 0,
              effectif_neo_bacheliers_sans_mention_bac_admis: universite.effectif_neo_bacheliers_sans_mention_bac_admis || 0,
              effectif_neo_bacheliers_admis: universite.effectif_neo_bacheliers_admis || 0,

              effectif_neo_bacheliers_mention_tres_bien_bac_admis: universite.effectif_neo_bacheliers_mention_tres_bien_bac_admis || 0,
              effectif_boursiers_professionnels_phase_principale: universite.effectif_boursiers_professionnels_phase_principale || 0,
            


              effectif_boursiers_technologiques_phase_principale: universite.effectif_boursiers_technologiques_phase_principale || 0,
              effectif_admis_meme_academie_paris_creteil_versailles: universite.effectif_admis_meme_academie_paris_creteil_versailles || 0,
              effectif_admis_proposition_avant_baccalaureat: universite.effectif_admis_proposition_avant_baccalaureat || 0,
              
              effectif_generaux_mention_bac_admis: universite.effectif_generaux_mention_bac_admis || 0,
              effectif_technologiques_admis: universite.effectif_technologiques_admis || 0,
              effectif_professionnels_admis: universite.effectif_professionnels_admis || 0,
              effectif_admis_proposition_ouverture_phase_principale: universite.effectif_admis_proposition_ouverture_phase_principale || 0,
            
              effectif_total_candidats_proposition: universite.effectif_total_candidats_proposition || 0,

              effectif_generaux_admis: universite.effectif_generaux_admis || 0,

              effectif_technologiques_mention_bac_admis: universite.effectif_technologiques_mention_bac_admis || 0,
           
              effectif_admis_proposition_avant_fin_procedure_principale: universite.effectif_admis_proposition_avant_fin_procedure_principale || 0,
              effectif_candidates_admises: universite.effectif_candidates_admises || 0, 

              effectif_admises_meme_etablissement_bts_cpge: universite.effectif_admises_meme_etablissement_bts_cpge || 0,
              effectif_total_candidats_admis: universite.effectif_total_candidats_admis || 0,

              effectif_autres_admis: universite.effectif_autres_admis || 0,
              effectif_neo_bacheliers_generaux_phase_complementaire: universite.effectif_neo_bacheliers_generaux_phase_complementaire || 0,

              /* effectif_boursiers_generaux_phase_principale: universite.effectif_boursiers_generaux_phase_principale || 0, */         
            
             effectif_admis_phase_complementaire: universite.effectif_admis_phase_complementaire || 0,
             effectif_admis_phase_principale: universite.effectif_admis_phase_principale || 0,
        
             effectif_professionnels_mention_bac_admis: universite.effectif_professionnels_mention_bac_admis || 0,
             effectif_neo_bacheliers_mention_bien_bac_admis: universite.effectif_neo_bacheliers_mention_bien_bac_admis || 0,
             
            
             effectif_neo_bacheliers_sans_mention: universite.effectif_neo_bacheliers_sans_mention || 0,
             effectif_neo_bacheliers_sans_info_mention_bac_admis: universite.effectif_neo_bacheliers_sans_info_mention_bac_admis || 0,
             
            



             effectif_boursiers_admis: universite.effectif_boursiers_admis || 0, 
          


              
            });
            return acc;
          }, {} as Record<string, any[]>);



          console.log("Données transformées :", this.universitesData);
          console.log("Années disponibles :", Object.values(this.universitesData).flat().map(d => d.annee));
          console.log("je teste");




    /*      // 1. Calculer les indicateurs pour le tableau
         this.quotasData = Object.keys(this.universitesData).map(uni => {
          const uniData = this.universitesData[uni][0];
          return {
            etablissement: uni,
            total_admis: uniData.effectif_total_candidats_admis,
            pct_boursiers: uniData.effectif_total_candidats_admis > 0 ? 
              Math.round(uniData.effectif_boursiers_admis * 1000 / uniData.effectif_total_candidats_admis) / 10 : 0,
            pct_bac_general: uniData.effectif_total_candidats_admis > 0 ? 
              Math.round(uniData.effectif_generaux_admis * 1000 / uniData.effectif_total_candidats_admis) / 10 : 0
          } as { etablissement: string; total_admis: number; pct_boursiers: number; pct_bac_general: number };
        });

      // 2. Créer le graphique
      this.createQuotasChart(); */


                // 1. Calculer les indicateurs pour le tableau (limitée à 2 universités)
          this.quotasData = Object.keys(this.universitesData)
          .slice(0, 2) // Prendre seulement les 2 premières universités
          .map(uni => {
            const uniData = this.universitesData[uni][0];
            return {
              etablissement: uni,
              total_admis: uniData.effectif_total_candidats_admis || 0,
              pct_boursiers: uniData.effectif_total_candidats_admis > 0 ? 
                Math.round(uniData.effectif_boursiers_admis * 1000 / uniData.effectif_total_candidats_admis) / 10 : 0,
              pct_bac_general: uniData.effectif_total_candidats_admis > 0 ? 
                Math.round(uniData.effectif_generaux_admis * 1000 / uniData.effectif_total_candidats_admis) / 10 : 0
            } as { 
              etablissement: string; 
              total_admis: number; 
              pct_boursiers: number; 
              pct_bac_general: number 
            };
          });

          // 2. Créer le graphique (affichera automatiquement les 2 universités)
          this.createQuotasChart();













                                          /*  Moyennes*/
                                // 1. Calcul des données pour chaque université + moyennes
             
















        
          // Créer les graphiques après récupération des données
          this.createChart('effectif_total_candidats_formation', 'chartCandidats', 'Total Candidats', ['#009FE3', '#A3D39C']);
          this.createChart('taux_acces', 'chartTauxAcces', 'Taux  Acees', ['#87A2C2', '#D77683']);
          this.createChart('effectif_candidates_formation', 'chartCandidates', 'Candidates Formation', ['#009FE3', '#A3D39C']);
          this.createChart('effectif_boursiers_generaux_phase_principale', 'chartBoursiers', 'Boursiers Phase Principale', ['#87A2C2', '#D77683']);
          this.createChart('effectif_admis_meme_academie', 'chartAdmisAcademie', 'Admis Même Académie', ['#009FE3', '#A3D39C']);
         /*  this.createChart('moyenne_effectif_admis_meme_academie', 'chartMoyenneAdmisAcademie', 'Moyenne Admis Même Académie', ['#009FE3', '#A3D39C']); */
         this.createChart('effectif_terminal_technologique', 'chartTerminalTechnologique', 'Terminal Technologique', ['#009FE3', '#A3D39C']);
         this.createChart('effectif_terminal_professionnelle', 'chartTerminalProfessionnelle', 'Terminal Professionnelle', ['#009FE3', '#A3D39C']);
         this.createChart('effectif_autres_candidats_phase_principale', 'chartAutresCandidats', 'Autres Candidats Phase Principale', ['#009FE3', '#A3D39C']);

          this.createChart('effectif_neo_bacheliers_generaux_phase_principale', 'chartNeoBacheliersGeneraux', 'Néo-bacheliers Généraux Phase Principale', ['#009FE3', '#A3D39C']);
         this.createChart('effectif_neo_bacheliers_generaux_phase_complementaire', 'chartNeoBacheliersGenerauxPhaseComplementaire', 'Néo-bacheliers Généraux Phase Complémentaire', ['#009FE3', '#A3D39C']);

          this.createChart('effectif_neo_bacheliers_technologiques_phase_principale', 'chartNeoBacheliersTechnologiques', 'Néo-bacheliers Technologiques Phase Principale', ['#009FE3', '#A3D39C']);
          this.createChart('effectif_neo_bacheliers_professionnels_phase_principale', 'chartNeoBacheliersProfessionnels', 'Néo-bacheliers Professionnels Phase Principale', ['#009FE3', '#A3D39C']);
          this.createChart('effectif_neo_bacheliers_mention_assez_bien_bac_admis', 'chartMentionAssezBien', 'Mention Assez Bien Bac Admis', ['#009FE3', '#A3D39C']);
          this.createChart('effectif_neo_bacheliers_mention_tres_bien_felicitation_bac_admis', 'chartMentionTresBien', 'Mention Très Bien Bac Admis', ['#009FE3', '#A3D39C']);
          this.createChart('effectif_neo_bacheliers_sans_mention_bac_admis', 'chartSansMention', 'Sans Mention Bac Admis', ['#009FE3', '#A3D39C']);
          this.createChart('effectif_neo_bacheliers_admis', 'chartNeoBacheliersAdmis', 'Néo-bacheliers Admis', ['#009FE3', '#A3D39C']); 
          
        
        
       this.createChart('effectif_boursiers_professionnels_phase_principale', 'chartMentionBienAdmis', 'Mention Bien Bac Admis', ['#009FE3', '#A3D39C']);
         

          this.createChart('effectif_boursiers_generaux_phase_principale', 'chartBoursiersGeneraux', 'Boursiers Généraux Phase Principale', ['#009FE3', '#A3D39C']);
          this.createChart('effectif_boursiers_technologiques_phase_principale', 'chartBoursiersTechnologiques', 'Boursiers Technologiques Phase Principale', ['#009FE3', '#A3D39C']);
         
          this.createChart('effectif_admis_meme_academie_paris_creteil_versailles', 'chartAdmisAcademieParis', 'Admis Même Académie Paris Créteil Versailles', ['#009FE3', '#A3D39C']);
          this.createChart('effectif_admis_proposition_avant_baccalaureat', 'chartAdmisAvantBac', 'Admis Avant Baccalauréat', ['#009FE3', '#A3D39C']);
          this.createChart('effectif_generaux_mention_bac_admis', 'chartGenerauxMentionBac', 'Généraux Mention Bac Admis', ['#009FE3', '#A3D39C']);
          this.createChart('effectif_technologiques_admis', 'chartTechnologiquesAdmis', 'Technologiques Admis', ['#009FE3', '#A3D39C']);
        
          this.createChart('effectif_professionnels_admis', 'chartProfessionnelsAdmis', 'Professionnels Admis', ['#009FE3', '#A3D39C']);
          this.createChart('', 'chartBoursiersAdmis', 'Boursiers Admis', ['#009FE3', '#A3D39C']);
          this.createChart('effectif_admis_proposition_ouverture_phase_principale', 'chartAdmisPropositionOuverture', 'Admis Proposition Ouverture Phase Principale', ['#009FE3', '#A3D39C']);
          this.createChart('', 'chartAdmisPhaseComplementaire', 'Admis Phase Complémentaire', ['#009FE3', '#A3D39C']);
          this.createChart('', 'chartAdmisPhasePrincipale', 'Admis Phase Principale', ['#009FE3', '#A3D39C']);
          this.createChart('', 'chartTotalCandidatsProposition', 'Total Candidats Proposition Admission', ['#009FE3', '#A3D39C']);
          this.createChart('effectif_generaux_admis', 'chartGenerauxAdmis', 'Généraux Admis', ['#009FE3', '#A3D39C']);  
          this.createChart('', 'chartTechnologiquesMentionBac', 'Technologiques Mention Bac Admis', ['#009FE3', '#A3D39C']);
          this.createChart('effectif_autres_candidats_phase_principale ', 'chartAutresCandidatsPhasePrincipale', 'Autres Candidats Phase Principale', ['#009FE3', '#A3D39C']);


       
          this.createChart('effectif_admis_proposition_avant_fin_procedure_principale', 'chartAdmisPropositionAvantFin', 'Admis Proposition Avant Fin Procédure Principale', ['#009FE3', '#A3D39C']);
          this.createChart('effectif_candidates_admises', 'chartCandidatesAdmises', 'Candidates Admissibles', ['#009FE3', '#A3D39C']);
          this.createChart('effectif_admises_meme_etablissement_bts_cpge', 'chartAdmisesMemeEtablissement', 'Admises Même Etablissement BTS CPGE', ['#009FE3', '#A3D39C']); 
          this.createChart('effectif_total_candidats_admis', 'chartTotalCandidatsAdmis', 'Total Candidats Admis', ['#009FE3', '#A3D39C']);
          this.createChart('effectif_autres_admis', 'chartAutresAdmis', 'Autres Admis', ['#009FE3', '#A3D39C']);    
          this.createChart('effectif_admis_meme_academie', 'chartAdmisMemeAcademie', 'Admis Même Académie', ['#009FE3', '#A3D39C']);
          this.createChart('effectif_admis_meme_academie_paris_creteil_versailles', 'chartAdmisAcademieParisCreteilVersailles', 'Admis Même Académie Paris Créteil Versailles', ['#009FE3', '#A3D39C']);  
        
      
          this.createChart('effectif_total_candidats_proposition', 'chartTotalCandidatsProposition', 'Total Candidats Proposition', ['#009FE3', '#A3D39C']);
          this.createChart('effectif_admis_proposition_avant_baccalaureat', 'charteffectif_admis_proposition_avant_baccalaureat', 'Généraux Admis', ['#009FE3', '#A3D39C']);
          
          this.createChart('effectif_admis_phase_complementaire', 'chartAdmisPhaseComplementaire', 'Admis Phase Complémentaire', ['#009FE3', '#A3D39C']);

          this.createChart('effectif_admis_phase_principale', 'chartAdmisPhasePrincipale', 'Admis Phase Principale', ['#009FE3', '#A3D39C']);
          this.createChart('effectif_neo_bacheliers_mention_tres_bien_bac_admis', 'chartNeoBacheliersMentionTresBien', 'Néo-bacheliers Mention Très Bien Bac Admis', ['#009FE3', '#A3D39C']);
          this.createChart('effectif_generaux_mention_bac_admis', 'chartGenerauxMentionBacAdmis', 'Généraux Mention Bac Admis', ['#009FE3', '#A3D39C']);
         
          this.createChart('effectif_professionnels_mention_bac_admis', 'chartProfessionnelsMentionBac', 'Professionnels Mention Bac Admis', ['#009FE3', '#A3D39C']);
          this.createChart('effectif_neo_bacheliers_mention_bien_bac_admis', 'chartNeoBacheliersMentionBien', 'Néo-bacheliers Mention Bien Bac Admis', ['#009FE3', '#A3D39C']);



          this.createChart('effectif_neo_bacheliers_sans_info_mention_bac_admis', 'chartNeoBacheliersSansInfo', 'Néo-bacheliers Sans Info Mention Bac Admis', ['#009FE3', '#A3D39C']);
         /*  this.createChart('effectif_neo_bacheliers_sans_mention', 'chartNeoBacheliersSansMention', 'Néo-bacheliers Sans Mention', ['#009FE3', '#A3D39C']); */
          


         


          this.isLoading = false; //  Fin du chargement une fois tout prêt
          
        },
        (error) => {
          console.error('Erreur lors de la récupération des universités :', error);
          this.isLoading = false; //  Fin du chargement même en cas d'erreur
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



  // updateChart(): void {
  //   this.createChart('effectif_total_candidats_formation', 'chartCandidats', 'Total Candidats', ['#009FE3', '#A3D39C']);
  //   console.log("Mise à jour du graphique pour le nombre de candidats.");
  // }

  retourListe() {
    this.router.navigate(['/etablissements']);
  }


















/* 






  createQuotasChart() {
    const ctx = document.getElementById('quotasChart') as HTMLCanvasElement;
    
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.quotasData.map(d => d.etablissement),
        datasets: [
          {
            label: '% Boursiers',
            data: this.quotasData.map(d => d.pct_boursiers),
            backgroundColor: '#4e79a7'
          },
          {
            label: '% Bac général',
            data: this.quotasData.map(d => d.pct_bac_general),
            backgroundColor: '#f28e2b'
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: function(value) {
                return value + '%';
              }
            }
          }
        }
      }
    });
  } */




    
    createQuotasChart() {
      const ctx = document.getElementById('quotasChart') as HTMLCanvasElement;
      const existingChart = Chart.getChart(ctx);
      if (existingChart) existingChart.destroy();
    
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.quotasData.map(d => d.etablissement),
          datasets: [
            {
              label: '% Boursiers',
              data: this.quotasData.map(d => d.pct_boursiers),
              backgroundColor: '#4e79a7'
            },
            {
              label: '% Bac général',
              data: this.quotasData.map(d => d.pct_bac_general),
              backgroundColor: '#f28e2b'
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: function(value) {
                  return value + '%';
                }
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Comparaison entre 2 universités'
            }
          }
        }
      });
    }





  // Méthode helper pour le template HTML
/*   getPercentage(uniName: string, type: 'boursiers'|'bac_general'): string {
    const data = this.quotasData.find(d => d.etablissement === uniName);
    if (!data) return '0.0';
    return (type === 'boursiers' ? data.pct_boursiers : data.pct_bac_general).toFixed(1);
  }
 */

// Méthode helper pour le template HTML
getPercentage(uniName: string, type: 'boursiers'|'bac_general'): string {
  const data = this.quotasData.find(d => d.etablissement === uniName);
  if (!data) return '0.0%'; // Retourne avec '%' par défaut
  
  // Récupère la valeur numérique (que vous avez déjà calculée)
  const numericValue = type === 'boursiers' ? data.pct_boursiers : data.pct_bac_general;
  
  // Formate avec 1 décimale + ajoute le symbole %
  return numericValue.toFixed(1) + '%';
}


// Ajoutez cette propriété
get universitesCount(): number {
  return this.universitesData ? Object.keys(this.universitesData).length : 0;
}







}
