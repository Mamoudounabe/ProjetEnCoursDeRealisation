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

 /*  universitesData: Record<string, any[]> = {}; */
  moyenneEffectifsAdmis!: number; 

// Déclaration correcte du tableau d'objets
public universitesData: any[] = [];  // Tableau contenant les données des universités



  quotasData: Array<{
    etablissement: string;
    total_admis: number;
    pct_boursiers: number;
    pct_bac_general: number;
  }> = [];


/* ---------------- Informations  Générales------- bloc 1--------------------------------------------------------------- */

selectedOption: string = 'nombre_de_candidats'; 
selectedSousOption: string = 'neobachelier'; 
selectedSousOption1: string = 'ppneo';
 




/* -------------------------------------------------------------------------------------------------------------- */

/* ---------------- Profil des candidats admis-----bloc 2--------------------------------------------------------------- */
selectedOption1 : string= 'mention_au_bac';
selectedSousOption11: string= 'mention_technologique';


/* ----------------------------------------------bloc 3---------------------------------------------------------------- */

selectedOption2 : string = 'taux_dacces';
selectedSousOptionSelect: string = 'taux_acces'; 

/* --------------------------------------------------------------------------------------------------------------------- */

/* --------------------------------------------bloc 4------------------------------------------------------------------- */

selectedOption3 : string = 'frequence';

selectedSousOption3 : string = 'generales';

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

/*   if (this.selectedOption === 'nombre_de_candidats' || this.selectedOption === 'nombre_dadmis') {
      this.selectedSousOption = 'neobachelier';
      this.selectedSousOption1 = 'ppneo';
    } */

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

              effectif_candidates_formation: universite.effectif_candidates_formation || 0 ,
           
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
            
             effectif_admis_phase_complementaire: universite.effectif_admis_phase_complementaire || 0,
             effectif_admis_phase_principale: universite.effectif_admis_phase_principale || 0,
        
             effectif_professionnels_mention_bac_admis: universite.effectif_professionnels_mention_bac_admis || 0,
             effectif_neo_bacheliers_mention_bien_bac_admis: universite.effectif_neo_bacheliers_mention_bien_bac_admis || 0,
             
            
             effectif_neo_bacheliers_sans_mention: universite.effectif_neo_bacheliers_sans_mention || 0,
             effectif_neo_bacheliers_sans_info_mention_bac_admis: universite.effectif_neo_bacheliers_sans_info_mention_bac_admis || 0,
             
              effectif_total_candidats_phase_complementaire: universite.effectif_total_candidats_phase_complementaire || 0,
             effectif_total_candidats_phase_principale: universite.effectif_total_candidats_phase_principale || 0,
       
          effectif_neo_bacheliers_technologiques_phase_complementaire: universite.effectif_neo_bacheliers_technologiques_phase_complementaire || 0,
      
         proportion_neo_bacheliers_admis: universite.proportion_neo_bacheliers_admis || 0,

      effectif_boursiers_admis: universite.effectif_boursiers_admis || 0,
     
      taux_acces: universite.taux_acces || 0,

      boursiers_admis: universite.boursiers_admis || 0,
      boursiers_generaux: universite.boursiers_generaux || 0,
      boursiers_technologiques: universite.boursiers_technologiques || 0,
      boursiers_professionnels: universite.boursiers_professionnels || 0,
      /* effectif_boursiers_professionnels_phase_principale: universite.effectif_boursiers_professionnels_phase_principale || 0, */



part_terminales_generales_position_recevoir_proposition_phase_principale: universite.part_terminales_generales_position_recevoir_proposition_phase_principale ? parseFloat(universite.part_terminales_generales_position_recevoir_proposition_phase_principale.toFixed(2)) : 0,
part_terminales_technologiques_position_recevoir_proposition_phase_principale: universite.part_terminales_technologiques_position_recevoir_proposition_phase_principale ? parseFloat(universite.part_terminales_technologiques_position_recevoir_proposition_phase_principale.toFixed(2)) : 0,
part_terminales_professionnelles_position_recevoir_proposition_phase_principale: universite.part_terminales_professionnelles_position_recevoir_proposition_phase_principale ? parseFloat(universite.part_terminales_professionnelles_position_recevoir_proposition_phase_principale.toFixed(2)) : 0,
/* effectif_neo_bacheliers_generaux_phase_complementaire: universite.effectif_neo_bacheliers_generaux_phase_complementaire || 0, */


            });
            return acc;
          }, {} as Record<string, any[]>);



          console.log("Données transformées :", this.universitesData);
          console.log("Années disponibles :", Object.values(this.universitesData).flat().map(d => d.annee));
          console.log("je teste");


        
          // Créer les graphiques après récupération des données chartBoursiersGeneraux
          this.createChart('effectif_total_candidats_formation', 'chartCandidats', 'Total Candidats', ['#009FE3', '#A3D39C']);

          this.createChart('effectif_candidates_formation', 'chartCandidates', 'Candidates Formation', ['#009FE3', '#A3D39C']);
          this.createChart('effectif_boursiers_generaux_phase_principale', 'chartBoursiers', 'Boursiers Phase Principale', ['#87A2C2', '#D77683']);
          this.createChart('effectif_admis_meme_academie', 'chartAdmisAcademie', 'Admis Même Académie', ['#009FE3', '#A3D39C']);
         /*  this.createChart('moyenne_effectif_admis_meme_academie', 'chartMoyenneAdmisAcademie', 'Moyenne Admis Même Académie', ['#009FE3', '#A3D39C']); */
         this.createChart('effectif_terminal_technologique', 'chartTerminalTechnologique', 'Terminal Technologique', ['#009FE3', '#A3D39C']);
         this.createChart('effectif_terminal_professionnelle', 'chartTerminalProfessionnelle', 'Terminal Professionnelle', ['#009FE3', '#A3D39C']);
         this.createChart('effectif_autres_candidats_phase_principale', 'chartAutresCandidats', 'Autres Candidats Phase Principale', ['#009FE3', '#A3D39C']);

          this.createChart('effectif_neo_bacheliers_generaux_phase_principale', 'chartNeoBacheliersGeneraux', 'Néo-bacheliers Généraux Phase Principale', ['#009FE3', '#A3D39C']);
         this.createChart('effectif_neo_bacheliers_generaux_phase_complementaire', 'chartNeoBacheliersGpc', 'Néo-bacheliers Généraux Phase Complémentaire', ['#009FE3', '#A3D39C']);

          this.createChart('effectif_neo_bacheliers_technologiques_phase_principale', 'chartNeoBacheliersTechnologiques', 'Néo-bacheliers Technologiques Phase Principale', ['#009FE3', '#A3D39C']);
          this.createChart('effectif_neo_bacheliers_professionnels_phase_principale', 'chartNeoBacheliersProfessionnels', 'Néo-bacheliers Professionnels Phase Principale', ['#009FE3', '#A3D39C']);
          this.createChart('effectif_neo_bacheliers_mention_assez_bien_bac_admis', 'chartMentionAssezBien', 'Mention Assez Bien Bac Admis', ['#009FE3', '#A3D39C']);
          this.createChart('effectif_neo_bacheliers_mention_tres_bien_felicitation_bac_admis', 'chartMentionTresBien', 'Mention Très Bien Bac Admis', ['#009FE3', '#A3D39C']);
          this.createChart('effectif_neo_bacheliers_sans_mention_bac_admis', 'chartSansMention', 'Sans Mention Bac Admis', ['#009FE3', '#A3D39C']);
          this.createChart('effectif_neo_bacheliers_admis', 'chartNeoBacheliersAdmis', 'Néo-bacheliers Admis', ['#009FE3', '#A3D39C']); 
          
        
        
       this.createChart('effectif_boursiers_professionnels_phase_principale', 'chartBoursierPro', 'Mention Bien Bac Admis', ['#009FE3', '#A3D39C']);
         

          this.createChart('effectif_boursiers_generaux_phase_principale', 'chartBoursiersGeneraux', 'Boursiers Généraux Phase Principale', ['#009FE3', '#A3D39C']);
          this.createChart('effectif_boursiers_technologiques_phase_principale', 'chartBoursiersTechnologiques', 'Boursiers Technologiques Phase Principale', ['#009FE3', '#A3D39C']);
         
          this.createChart('effectif_admis_meme_academie_paris_creteil_versailles', 'chartAdmisAcademieParis', 'Admis Même Académie Paris Créteil Versailles', ['#009FE3', '#A3D39C']);
          this.createChart('effectif_admis_proposition_avant_baccalaureat', 'chartAdmisAvantBac', 'Admis Avant Baccalauréat', ['#009FE3', '#A3D39C']);
          this.createChart('effectif_generaux_mention_bac_admis', 'chartGenerauxMentionBac', 'Généraux Mention Passable Bac Admis', ['#009FE3', '#A3D39C']);
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
          this.createChart('effectif_total_candidats_phase_complementaire', 'chartTotalCandidatsPhaseComplementaire', 'Total Candidats Phase Complémentaire', ['#009FE3', '#A3D39C']);

          this.createChart('effectif_total_candidats_phase_principale', 'chartTotalCandidatsPhasePrincipale', 'Total Candidats Phase Principale', ['#009FE3', '#A3D39C']);
         this.createChart('effectif_neo_bacheliers_technologiques_phase_complementaire', 'chartNeoBacheliersTechnologiquesPhaseComplementaire', 'Néo-bacheliers Technologiques Phase Complémentaire', ['#009FE3', '#A3D39C']);
        this.createChart('proportion_neo_bacheliers_admis', 'chartProportionNeoBacheliersAdmis', 'Proportion Néo-bacheliers Admis', ['#009FE3', '#A3D39C']);
        this.createChart('differenceCandidatesAdmis', 'chartDifferenceCandidatesAdmis', 'Différence Candidates Admis', ['#009FE3', '#A3D39C']);
        this.createChart('effectif_boursiers_admis', 'chartBoursiersEfAdmis', 'Boursiers Admis', ['#009FE3', '#A3D39C']);
        this.createChart('taux_acces', 'chartTauxAcces', 'Taux d\'Accès', ['#009FE3', '#A3D39C']);
        this.createChart('part_terminales_generales_position_recevoir_proposition_phase_principale', 'chartPartTerminalesGenerales', 'Part Terminales Générales Position Recevoir Proposition Phase Principale', ['#009FE3', '#A3D39C']);
        this.createChart('part_terminales_technologiques_position_recevoir_proposition_phase_principale', 'chartPartTerminalesTechnologiques', 'Part Terminales Technologiques Position Recevoir Proposition Phase Principale', ['#009FE3', '#A3D39C']);
        this.createChart('part_terminales_professionnelles_position_recevoir_proposition_phase_principale', 'chartPartTerminalesProfessionnelles', 'Part Terminales Professionnelles Position Recevoir Proposition Phase Principale', ['#009FE3', '#A3D39C']);
       /*/*boursiers_admis*/
       this.createChart('boursiers_admis', 'chartBoursiersAdmis', 'Boursiers Admis', ['#009FE3', '#A3D39C']);


        
   /*     this.calculerMoyenneEffectifsAdmis(); chartNeoBacheliersGenerauxPhaseComplementaire

          
         // Attendre que le template soit mis à jour avant de créer le graphique
         setTimeout(() => {
          if (this.selectedSousOption3 === 'generalesM') {
            this.buildGraph();
          }
        }, 0) */


        this.chartData = this.formatMoyennesParAnnee(this.universitesData);
        this.labels = this.anneesActuelles;
        // ligne 399
        this.updateChartDatasetsParAnnee();

        




          this.isLoading = false; //  Fin du chargement une fois tout prêt
          
        },
        (error) => {
          console.error('Erreur lors de la récupération des universités :', error);
          this.isLoading = false; //  Fin du chargement même en cas d'erreur
        }
      );
  }












 /*  calculerMoyenneEffectifsAdmis(): void {
    if (!Array.isArray(this.universitesData)) {
      console.error('universitesData doit être un tableau');
      return;
    }

    this.universitesData.forEach((universite: any) => {
      const categories = [
        universite.effectif_neo_bacheliers_admis,
        universite.effectif_professionnels_admis,
        universite.effectif_technologiques_admis,
        universite.effectif_boursiers_admis,
        universite.effectif_generaux_admis
      ].filter(val => val !== undefined && val !== null);

      const totalEffectifAdmis = categories.reduce((total, effectif) => total + effectif, 0);
      universite.moyenne_effectif_admis = categories.length > 0 ? totalEffectifAdmis / categories.length : 0;

      console.log(`Moyenne des effectifs admis pour ${universite.etablissement} (${universite.annee}): ${universite.moyenne_effectif_admis}`);
    });
  }

  buildGraph(): void {
    const canvas = document.getElementById('chartContainer') as HTMLCanvasElement;
    
    if (!canvas) {
      console.warn('Canvas element with id "chartContainer" not found');
      return;
    }

    // Détruire l'ancien graphique s'il existe
    if (this.chart) {
      this.chart.destroy();
    }

    const labels = this.universitesData.map((universite: any) => 
      `${universite.etablissement} (${universite.annee})`);
    const data = this.universitesData.map((universite: any) => universite.moyenne_effectif_admis);

    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Moyenne des effectifs admis',
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Moyenne des Effectifs Admis par Université'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.raw.toFixed(2)}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Nombre moyen d\'admis'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Universités'
            }
          }
        }
      }
    });
  } */


















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




    /* 
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

 */

    
    createQuotasChart() {
      console.log('Données pour le graphique:', this.quotasData);  // Vérifie les données
      
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











public anneeSelectionnee: number = 2020;
public anneesDisponibles: number[] = [2020, 2021, 2022, 2023];


public chartData: any = {}; // contient les moyennes formatées
public chartDatasets: any[] = [];
public labels: string[] = [];
public chartOptions: any = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: 'Répartition des moyennes estimées par université',
      font: { size: 18 }
    },
    legend: {
      position: 'bottom'
    },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          const label = context.label || '';
          const value = context.raw || 0;
          return `${label}: ${value}`;
        }
      }
    }
  }
};
formatMoyennesParAnnee(universitesData: any): { generale: any, technologique: any } {
  const dataGenerale: { [key: string]: number[] } = {};
  const dataTechnologique: { [key: string]: number[] } = {};

  Object.entries(universitesData).forEach(([nom, stats]) => {
    (stats as any[]).forEach((stat: any) => {
      const annee = stat.annee;

      const tresBien = stat.effectif_neo_bacheliers_mention_tres_bien_bac_admis || 0;
      const bien = stat.effectif_neo_bacheliers_mention_bien_bac_admis || 0;
      const assezBien = stat.effectif_neo_bacheliers_mention_assez_bien_bac_admis || 0;
      const sansMention = stat.effectif_neo_bacheliers_sans_mention_bac_admis || 0;

      const totalGen = tresBien + bien + assezBien + sansMention;
      const moyenneGen = totalGen > 0
        ? (tresBien * 17 + bien * 15 + assezBien * 13 + sansMention * 10) / totalGen
        : 0;

      const technoMention = stat.effectif_technologiques_mention_bac_admis || 0;
      const technoTotal = stat.effectif_technologiques_admis || 0;

      const moyenneTechno = technoTotal > 0
        ? (technoMention * 13 + (technoTotal - technoMention) * 10) / technoTotal
        : 0;

      if (!dataGenerale[nom]) dataGenerale[nom] = [];
      if (!dataTechnologique[nom]) dataTechnologique[nom] = [];

      dataGenerale[nom].push(Number(moyenneGen.toFixed(2)));
      dataTechnologique[nom].push(Number(moyenneTechno.toFixed(2)));
    });
  });

  return {
    generale: dataGenerale,
    technologique: dataTechnologique
  };
}




updateChartDatasetsParAnnee(): void {
  const dataValues: number[] = [];
  const dataLabels: string[] = [];
  const backgroundColors: string[] = [];

  let index = 0;

  Object.entries(this.chartData.generale).forEach(([universite, valeurs]) => {
    const moyenne = (valeurs as number[])[this.anneeSelectionnee - 2020];
    if (moyenne !== undefined) {
      dataValues.push(moyenne);
      dataLabels.push(`${universite} - Générale`);
      backgroundColors.push(this.getColor(index++));
    }
  });

  Object.entries(this.chartData.technologique).forEach(([universite, valeurs]) => {
    const moyenne = (valeurs as number[])[this.anneeSelectionnee - 2020];
    if (moyenne !== undefined) {
      dataValues.push(moyenne);
      dataLabels.push(`${universite} - Technologique`);
      backgroundColors.push(this.getColor(index++));
    }
  });

  this.labels = dataLabels;

  this.chartDatasets = [{
    data: dataValues,
    backgroundColor: backgroundColors
  }];
}




getColor(index: number): string {
  const colors = [
    '#42A5F5', '#66BB6A', '#FFA726', '#AB47BC',
    '#EC407A', '#26C6DA', '#FF7043', '#8D6E63',
    '#D4E157', '#5C6BC0', '#29B6F6', '#9CCC65'
  ];
  return colors[index % colors.length];
}




}
