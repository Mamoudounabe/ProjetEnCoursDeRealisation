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
    selector: 'app-comparatif-etablissement-details',
    standalone: true,
    imports: [
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
        MatCheckboxModule,
        CommonModule,
        FontAwesomeModule,
        MatGridListModule,
        MatToolbarModule,
        MatIconModule,
        RouterModule 
    ],
    templateUrl: './comparatif-etablissement-details.component.html',
    styleUrl: './comparatif-etablissement-details.component.css'
})
export class ComparatifEtablissementDetailsComponent implements OnInit, AfterViewInit {

  faSignal = faSignal;
  faChartBar = faChartBar;

  etablissementsIDs: number[] = [];
  selectedYear = new FormControl('2021');
  anneeactuelle: string = '2021';
  etablissementsData: any[] = [];
  chart!: Chart | null;
  etablissementData: any;
  etablissementsDataBacheliers: any[] = [];

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


/* --------------------------------------------bloc 6------------------------------------------------------------------- */





/* -------------------------------------------------------------------------------------------------------------------------- */






  /*   @ViewChild('chartEffectifTotalCandidatsFormationRef', { static: false }) chartEffectifTotalCandidatsFormationRef!: ElementRef;
    @ViewChild('chartCapaciteEtablissementFormationRef', { static: false }) chartCapaciteEtablissementFormationRef!: ElementRef;
    
chartResultatAcademiqueRef

   */

    @ViewChild('chartResultatAcademiqueRef', { static: false }) chartResultatAcademiqueRef!: ElementRef;


    @ViewChild('distributionChart', { static: false }) distributionChartRef!: ElementRef<HTMLCanvasElement>;

   

    

    @ViewChild('chartTauxAccesRef', { static: false }) chartTauxAccesRef!: ElementRef;

  @ViewChild('chartEffectifTechnologiquesMentionBacAdmisRef', { static: false }) chartEffectifTechnologiquesMentionBacAdmisRef!: ElementRef;



  @ViewChild('chartEffectifNeoBacheliermentionTresBienFelicitationBacAdmisRef', { static: false }) chartEffectifNeoBacheliermentionTresBienFelicitationBacAdmisRef!: ElementRef;

  @ViewChild('chartEffectifNeoBachelierTechnologiquePhaseComplementaireRef', { static: false }) chartEffectifNeoBachelierTechnologiquePhaseComplementaireRef!: ElementRef;

  @ViewChild('chartCandidatsRef', { static: false }) chartCandidatsRef!: ElementRef;
  @ViewChild('chartNeoBachelierTechnologiquePhasePrincipaleRef', { static: false }) chartNeoBachelierTechnologiquePhasePrincipaleRef!: ElementRef;

  @ViewChild(' chartEffectifTotalCandidatsPhaseComplementaireRef', { static: false }) chartEffectifTotalCandidatsPhaseComplementaireRef!: ElementRef;

  @ViewChild('chartEffectifTotalCandidatsPhasePrincipaleRef', { static: false }) chartEffectifTotalCandidatsPhasePrincipaleRef!: ElementRef;
  /* --------------------------------------------------------------------------------------------------------------------------------------------------- */

  @ViewChild('chartNeoBacheliersPhasePrincipaleRef', { static: false }) chartNeoBacheliersPhasePrincipaleRef!: ElementRef;
  @ViewChild('chartNeoBacheliersPhaseComplementaireRef', { static: false }) chartNeoBacheliersPhaseComplementaireRef!: ElementRef;
  @ViewChild('charteffectif_technologiques_mention_bacAdmisRef', { static: false }) charteffectif_technologiques_mention_bacAdmisRef!: ElementRef;

  /* --------------------------------------------------------------------------------------------------------------------------------------------------- */




/*   ngAfterViewInit(): void {
    this.updateCharts();
  } */
   
  onSousOptionChange(event: any): void {
    console.log('Sous option changée:', event.value);
    this.updateCharts();
  }

  updateCharts(): void {
    if (this.selectedSousOption1 === 'ppneo' && this.chartNeoBacheliersPhasePrincipaleRef) {
      const canvas = this.chartNeoBacheliersPhasePrincipaleRef.nativeElement;
      this.createChart(canvas, 'effectif_neo_bacheliers_generaux_phase_principale', 'Effectif Néo-Bacheliers Phase Principale');
    } else if (this.selectedSousOption1 === 'pcneo' && this.chartNeoBachelierTechnologiquePhasePrincipaleRef) {
      const canvas = this.chartNeoBachelierTechnologiquePhasePrincipaleRef.nativeElement;
      this.createChart(canvas, 'effectif_neo_bacheliers_technologiques_phase_principale', 'Effectif Néo-Bacheliers Technologiques Phase Principale');
    }
      

    console.log('pp','effectif_neo_bacheliers_generaux_phase_principale');
    console.log('pc','effectif_neo_bacheliers_technologiques_phase_principale');


  }
 





   ngAfterViewInit(): void {

    console.log('Effectif Néo-Bacheliers Phase Principale:', this.chartNeoBacheliersPhasePrincipaleRef);
    console.log('Effectif Néo-Bacheliers Phase Complémentaire:', this.chartNeoBacheliersPhaseComplementaireRef);

   
   

    this.createChart(this.chartResultatAcademiqueRef.nativeElement, 'effectif_admis_meme_academie', 'Résultats académiques');

    this.createChart(this.chartTauxAccesRef.nativeElement, 'taux_acces', 'Taux d\'Accès');


    this.createChart(this.chartEffectifTechnologiquesMentionBacAdmisRef.nativeElement, 'effectif_technologiques_mention_bac_admis', 'effectif technologiques mention bac dmis');


    this.createChart(this.chartEffectifNeoBacheliermentionTresBienFelicitationBacAdmisRef.nativeElement, 'effectif_neo_bacheliers_mention_tres_bien_felicitation_bac_admis', 'effectif néo bacheliers mention tres bien felicitation bac admis');


    this.createChart(this.chartEffectifNeoBachelierTechnologiquePhaseComplementaireRef.nativeElement, 'effectif_neo_bacheliers_technologiques_phase_complementaire', 'Effectif Néo-Bacheliers technologique Phase complementaire');

    this.createChart(this.chartNeoBachelierTechnologiquePhasePrincipaleRef.nativeElement, 'effectif_neo_bacheliers_technologiques_phase_principale', 'Effectif Néo-Bacheliers technologique Phase principale');
    this.createChart(this.chartNeoBacheliersPhaseComplementaireRef.nativeElement, 'effectif_neo_bacheliers_generaux_phase_complementaire', 'Effectif Néo-Bacheliers Phase Complémentaire');

    this.createChart(this.chartEffectifTotalCandidatsPhaseComplementaireRef.nativeElement, 'effectif_total_candidats_phase_complementaire', 'Effectif total candidats Phase complémentaire');
    this.createChart(this.chartEffectifTotalCandidatsPhasePrincipaleRef.nativeElement, 'effectif_total_candidats_phase_principale', 'Effectif total candidats Phase Principale');
    this.createChart(this.chartNeoBacheliersPhasePrincipaleRef.nativeElement, 'effectif_neo_bacheliers_generaux_phase_principale', 'Effectif Néo-Bacheliers Phase Principale');

  } 

  constructor(private apiService: ApiService, private route: ActivatedRoute, private cdr: ChangeDetectorRef,private router: Router) { }

  ngOnInit(): void {

    console.log("Valeur initiale:", this.selectedSousOption1)

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








  calculateSpecificAverages(data: any[]): { [key: string]: number } {
    const keysToCalculate = [
      'effectif_technologiques_admis',
      'effectif_boursiers_admis',
      'effectif_professionnels_admis',
      'effectif_neo_bacheliers_admis',
      'effectif_generaux_admis',
      'effectif_autres_admis',
      'effectif_total_candidats_admis'
    ];
  
    const sums: { [key: string]: number } = {};
    const counts: { [key: string]: number } = {};
  
    data.forEach(item => {
      keysToCalculate.forEach(key => {
        const value = parseFloat(item[key]);
        if (!isNaN(value)) {
          if (!sums[key]) {
            sums[key] = 0;
            counts[key] = 0;
          }
          sums[key] += value;
          counts[key] += 1;
        }
      });
    });
  
    const averages: { [key: string]: number } = {};
    keysToCalculate.forEach(key => {
      if (counts[key] > 0) {
        averages[key] = sums[key] / counts[key];
      }
    });
  
    return averages;
  }






  createDistributionChart(averages: { [key: string]: number }): void {
    const canvas = this.distributionChartRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error("Le contexte du canvas n'est pas disponible !");
      return;
    }

    const labels = Object.keys(averages);
    const data = Object.values(averages);

    new Chart(ctx, {
      type: 'line' as ChartType,
      data: {
        labels: labels,
        datasets: [{
          label: 'Moyennes des effectifs',
          data: data,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              color: '#333',
              font: {
                size: 12,
              },
            },
            grid: {
              color: '#e0e0e0',
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: '#333',
              font: {
                size: 12,
              },
              stepSize: 10,
            },
            grid: {
              color: '#e0e0e0',
            },
          },
        },
        plugins: {
          legend: {
            labels: {
              color: '#333',
              font: {
                size: 14,
              },
            },
          },
        },
      },
    });
  }








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



         // Calculer les moyennes des valeurs des propriétés spécifiques
      const averages = this.calculateSpecificAverages(data);
      console.log("Moyennes calculées :", averages);
      this.createDistributionChart(averages);
    



        // Liste des clés à trier
        const keysToSort = [
          'capacite_etablissement_formation',
          'taux_acces',
          'rang_dernier_appele_groupe_3',
          'rang_dernier_appele_groupe_2',
          'rang_dernier_appele_groupe_1',
          'part_terminales_generales_position_recevoir_proposition_phase_principale',
          'part_terminales_technologiques_position_recevoir_proposition_phase_principale',
          'part_terminales_professionnelles_position_recevoir_proposition_phase_principale',
          'effectif_total_candidats_formation',
          'effectif_total_candidats_phase_principale',
          'effectif_candidates_formation',
          'proportion_neo_bacheliers_meme_etablissement_bts_cpge',
          'proportion_technologiques_admis_mention',
          'proportion_neo_bacheliers_meme_academie',
          'proportion_neo_bacheliers_admis',
          'proportion_neo_bacheliers_sans_mention_bac_admis',
          'proportion_professionnels_admis_mention',
          'proportion_neo_bacheliers_boursiers',
          'effectif_candidats_terminal_technologique_proposition_admission',
          'effectif_boursiers_terminal_generale_professionnelle_proposition_admission',
          'effectif_boursiers_terminal_generale_proposition_admission',
          'effectif_candidats_terminal_professionnelle_proposition_admission',
          'effectif_boursiers_terminal_technologique_proposition_admission',
          'effectif_neo_bacheliers_generaux_phase_principale',
          'effectif_neo_bacheliers_technologiques_phase_principale',
          'effectif_neo_bacheliers_professionnels_phase_principale',
          'effectif_boursiers_professionnels_phase_principale',
          'effectif_autres_candidats_phase_principale',
          'effectif_boursiers_generaux_phase_principale',
          'effectif_boursiers_technologiques_phase_principale',
          'effectif_neo_bacheliers_technologiques_phase_complementaire',
          'effectif_neo_bacheliers_generaux_phase_complementaire',
          'effectif_total_candidats_phase_complementaire',
          'effectif_admis_proposition_avant_fin_procedure_principale',
          'effectif_neo_bacheliers_mention_bien_bac_admis',
          'effectif_candidates_admises',
          'effectif_neo_bacheliers_mention_assez_bien_bac_admis',
          'effectif_admis_phase_principale',
          'effectif_total_candidats_proposition_admission',
          'effectif_neo_bacheliers_mention_tres_bien_felicitation_bac_admis',
          'effectif_neo_bacheliers_sans_mention_bac_admis',
          'effectif_generaux_admis',
          'effectif_admises_meme_etablissement_bts_cpge',
          'effectif_total_candidats_admis',
          'effectif_technologiques_mention_bac_admis',
          'effectif_neo_bacheliers_admis',
          'effectif_professionnels_mention_bac_admis',
          'effectif_professionnels_admis',
          'effectif_autres_admis',
          'effectif_boursiers_admis',
          'effectif_admis_meme_academie',
          'effectif_admis_meme_etablissement_bts_cpge',
          'effectif_admis_proposition_ouverture_phase_principale',
          'effectif_admis_phase_complementaire',
          'effectif_neo_bacheliers_mention_tres_bien_bac_admis',
          'effectif_admis_meme_academie_paris_creteil_versailles',
          'effectif_admis_proposition_avant_baccalaureat',
          'effectif_generaux_mention_bac_admis',
          'effectif_technologiques_admis'
        ];

        // Trier les données pour chaque clé et créer un graphique
        keysToSort.forEach(key => {
          this.etablissementsData = data.sort((a, b) =>
            this.safeNumber(b[key]) - this.safeNumber(a[key])
          );
          console.log(`Données triées (${key}) :`, this.etablissementsData);

          const canvas = (this as any)[`chart_${key}`]?.nativeElement;
          if (canvas) {
            this.createChart(canvas, key, key.replace(/_/g, ' '));
          }
        });

        console.log('Données triées (Neo-Bacheliers) :', this.etablissementsData);

        /* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
        // Créer le graphique pour 'effectif néo-bacheliers phase principale'
        const canvasEffectifNeoBachelierpp = this.chartNeoBacheliersPhasePrincipaleRef?.nativeElement;
        if (canvasEffectifNeoBachelierpp) {
          this.createChart(canvasEffectifNeoBachelierpp, 'effectif_neo_bacheliers_generaux_phase_principale', 'Effectif Néo-Bacheliers Phase Principale');
        }
        else{
          console.log("Canvas non disponible");
        }

        // Créer le graphique pour 'effectif  neo-bacheliers phase complémentaire'
      /*   const canvasEffectifNeoBachelierpc = this.chartNeoBacheliersPhaseComplementaireRef?.nativeElement;
        if (canvasEffectifNeoBachelierpc) {
          this.createChart(canvasEffectifNeoBachelierpc, 'effectif_neo_bacheliers_generaux_phase_complementaire', 'Effectif Néo-Bacheliers Phase Complémentaire');
        } */

        // Créer le graphique pour 'effectif total candidats phase principale'
        const canvasEffectifTotalCandidatsPhasePrincipale = this.chartEffectifTotalCandidatsPhasePrincipaleRef?.nativeElement;
        if (canvasEffectifTotalCandidatsPhasePrincipale) {
          this.createChart(canvasEffectifTotalCandidatsPhasePrincipale, 'effectif_total_candidats_phase_principale', 'Effectif Total Candidats Phase Principale');
        }

        // Créer le graphique pour 'effectif total candidats phase complémentaire'
 /*        const canvasEffectifTotalCandidatsPhaseComplementaire = this.chartEffectifTotalCandidatsPhaseComplementaireRef?.nativeElement;
        if (canvasEffectifTotalCandidatsPhaseComplementaire) {
          this.createChart(canvasEffectifTotalCandidatsPhaseComplementaire, 'effectif_total_candidats_phase_complementaire', 'Effectif Total Candidats Phase Complémentaire');
        }
 */
        // creer le graphique pour effectif neo-bachelier technologique phase principale
        const canvasEffectifNeoBachelierTechnologiquePhasePrincipale = this.chartNeoBachelierTechnologiquePhasePrincipaleRef?.nativeElement;
        if (canvasEffectifNeoBachelierTechnologiquePhasePrincipale) {
          this.createChart(canvasEffectifNeoBachelierTechnologiquePhasePrincipale, 'effectif_neo_bacheliers_technologiques_phase_principale', 'Effectif Néo-Bacheliers Technologiques Phase Principale');
        }


        

        

        const canvasEffectifNeoBacheliermentionTresBienFelicitationBacAdmis = this.chartEffectifNeoBacheliermentionTresBienFelicitationBacAdmisRef?.nativeElement;
        if (canvasEffectifNeoBacheliermentionTresBienFelicitationBacAdmis) {
          this.createChart(canvasEffectifNeoBacheliermentionTresBienFelicitationBacAdmis, 'effectif_neo_bacheliers_mention_tres_bien_felicitation_bac_admis', 'effectif néo bacheliers mention tres bien felicitation bac admis');
        }



        // creer le graphique pour effectif neo-bachelier technologique phase complementaire
   /*      const canvasEffectifNeoBachelierTechnologiquePhaseComplementaire = this.chartEffectifNeoBachelierTechnologiquePhaseComplementaireRef.nativeElement;
        if (canvasEffectifNeoBachelierTechnologiquePhaseComplementaire) {
          this.createChart(canvasEffectifNeoBachelierTechnologiquePhaseComplementaire, 'effectif_neo_bacheliers_technologiques_phase_complementaire', 'Effectif Néo-Bacheliers Technologiques Phase Complémentaire');
        }
 */
        /* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */

        // Créer le graphique pour 'effectif_total_candidats_formation'
        const canvasEffectifTotalCandidatsFormation = this.chartCandidatsRef?.nativeElement;
        if (canvasEffectifTotalCandidatsFormation) {
          this.createChart(canvasEffectifTotalCandidatsFormation, 'effectif_total_candidats_formation', 'Effectif Total Candidats Formation');
        }

        // Créer les graphiques pour les autres variables
        const canvasEctifTechnologiquesMentionBacAdmis = this.chartEffectifTechnologiquesMentionBacAdmisRef?.nativeElement;
        if (canvasEctifTechnologiquesMentionBacAdmis) {
          this.createChart(canvasEctifTechnologiquesMentionBacAdmis, 'effectif_technologiques_mention_bac_admis', 'effectif technologiques mention bac admis');
        }
    
        const canvasTauxAcces = this.chartTauxAccesRef?.nativeElement;
        if (canvasTauxAcces) {
          this.createChart(canvasTauxAcces, 'taux_acces', 'Taux d\'Accès');
        } 



        const canvasResultatAcademique = this.chartResultatAcademiqueRef?.nativeElement;
        if (canvasResultatAcademique) {
          this.createChart(canvasResultatAcademique, 'effectif_admis_meme_academie', 'Resultat academique');
        } 



      },
      (error) => {
        console.error('Erreur lors de la récupération des données:', error);
      }
    );
  }









  
  createChart(canvas: HTMLCanvasElement, dataKey: string, label: string): void {
    setTimeout(() => {
      if (!this.etablissementsData || this.etablissementsData.length === 0) {
        console.warn("Pas de données disponibles pour créer le graphique.");
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error("Le contexte du canvas n'est pas disponible !");
        return;
      }

      // Détruire l'ancien graphique s'il existe
      if ((canvas as any).chartInstance) {
        (canvas as any).chartInstance.destroy();
      }

      console.log(`📊 Création du graphique : ${label}`);

      // Labels et données
      const labelsFiliere = this.etablissementsData.map(etab => etab.NomEtablissement); // Afficher sur le graphique
      const labelsEtablissement = this.etablissementsData.map(etab => etab.filiere_formation_detaillee); // Pour le tooltip
      const dataValues = this.etablissementsData.map(etab => this.safeNumber(etab[dataKey]));

      // Palette de couleurs alternées
      const colors = [
        'rgba(58, 104, 156, 0.6)', // Bleu
        'rgba(206, 36, 64, 0.6)', // Rouge
        'rgba(52, 168, 83, 0.6)', // Vert
        'rgba(251, 188, 5, 0.6)', // Jaune
        'rgba(155, 81, 224, 0.6)', // Violet
      ];

      // Création du graphique
      const chartInstance = new Chart(ctx, {
        type: 'bar' as ChartType,
        data: {
          labels: labelsFiliere, // Afficher la filière sur l'axe Y
          datasets: [{
            label: label, // Titre du dataset
            data: dataValues,
            backgroundColor: labelsFiliere.map((_, index) => colors[index % colors.length]),
            borderColor: labelsFiliere.map((_, index) => colors[index % colors.length]),
            borderWidth: 1,
            barThickness: 30,
            barPercentage: 0.6,
            categoryPercentage: 0.8,
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  const index = tooltipItem.dataIndex;
                  return `${labelsEtablissement[index]}: ${tooltipItem.raw}`;
                }
              }
            },
            legend: {
              labels: {
                color: '#333',
                font: { size: 14 },
              },
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              ticks: { color: '#333', font: { size: 12 }, autoSkip: false },
              grid: { drawOnChartArea: false, color: '#e0e0e0' },
            },
            y: {
              beginAtZero: true,
              ticks: { color: '#333', font: { size: 12 }, stepSize: 10 },
              grid: { drawOnChartArea: true, color: '#e0e0e0' },
            },
          },
        },
      });

      // Stocker l'instance du graphique pour éviter les doublons
      (canvas as any).chartInstance = chartInstance;
    }, 200);
  }

  /* tryCreateCharts(): void {
    if (!this.chartCandidatsRef?.nativeElement || !this.chartNeoBacheliersRef?.nativeElement) {
      console.error("Les canvas ne sont pas encore disponibles !");
      return;
    }
  
    this.createChart(this.chartNeoBacheliersPhasePrincipaleRef.nativeElement, 'effectif_neo_bacheliers_generaux_phase_principale', 'Effectif Néo-Bacheliers Phase Principale');
    this.createChart(this.chartNeoBacheliersPhaseComplementaireRef.nativeElement, 'effectif_neo_bacheliers_generaux_phase_complementaire', 'Effectif Néo-Bacheliers Phase Complémentaire');
  
    this.createChart(this.chartCandidatsRef.nativeElement, 'effectif_total_candidats_phase_principale', 'Effectif Total Candidats Phase Principale');
    this.createChart(this.chartCandidatsRef.nativeElement, 'effectif_total_candidats_phase_complementaire', 'Effectif Total Candidats Phase Complémentaire');
  
  } */


    retourListe() {
      this.router.navigate(['/etablissements']);
    }
    

}