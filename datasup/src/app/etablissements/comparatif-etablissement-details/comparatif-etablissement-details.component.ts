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
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { faChartBar } from '@fortawesome/free-solid-svg-icons';



import { toInteger } from 'lodash'; // Si lodash est installé, sinon utilise `parseInt`

@Component({
    selector: 'app-comparatif-etablissement-details',
    standalone: true,
    imports: [RouterLink,
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
        MatCheckboxModule,
        CommonModule,
        FontAwesomeModule,
        MatGridListModule,
        MatToolbarModule,
        MatIconModule
    ],
    templateUrl: './comparatif-etablissement-details.component.html',
    styleUrl: './comparatif-etablissement-details.component.css'
})
export class ComparatifEtablissementDetailsComponent implements OnInit  {

  faSignal = faSignal;
  faChartBar = faChartBar;

  etablissementsIDs: number[] = [];
  selectedYear = new FormControl('2021'); 
  anneeactuelle: string = '2021'; 
  etablissementsData: any[] = [];
  selectedOption: string = 'nombre_de_candidats'; 
  selectedSousOption: string= 'neobachelier'; 
  selectedSousOption1: string= 'ppneo';
 chart!: Chart | null;
  @ViewChild('etablissementsChart', { static: false }) chartRef!: ElementRef;
  @ViewChild('chart_effectif_total_candidats_formation', { static: false }) chartEffectifTotalCandidatsFormationRef!: ElementRef;
  @ViewChild('chart_capacite_etablissement_formation', { static: false }) chartCapaciteEtablissementFormationRef!: ElementRef;
  @ViewChild('chart_taux_acces', { static: false }) chartTauxAccesRef!: ElementRef;
  @ViewChild('chart_rang_dernier_appele_groupe_3', { static: false }) chartRangDernierAppeleGroupe3Ref!: ElementRef;
  @ViewChild('chart_rang_dernier_appele_groupe_2', { static: false }) chartRangDernierAppeleGroupe2Ref!: ElementRef;
  @ViewChild('chart_rang_dernier_appele_groupe_1', { static: false }) chartRangDernierAppeleGroupe1Ref!: ElementRef;
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

      // Créer le graphique pour 'effectif_total_candidats_formation'
      const canvasEffectifTotalCandidatsFormation = this.chartEffectifTotalCandidatsFormationRef.nativeElement;
      if (canvasEffectifTotalCandidatsFormation) {
        this.createChart(canvasEffectifTotalCandidatsFormation, 'effectif_total_candidats_formation', 'Effectif Total Candidats Formation');
      }

      // Créer les graphiques pour les autres variables
      const canvasCapaciteEtablissementFormation = this.chartCapaciteEtablissementFormationRef.nativeElement;
      if (canvasCapaciteEtablissementFormation) {
        this.createChart(canvasCapaciteEtablissementFormation, 'capacite_etablissement_formation', 'Capacité Établissement Formation');
      }
  
      const canvasTauxAcces = this.chartTauxAccesRef.nativeElement;
      if (canvasTauxAcces) {
        this.createChart(canvasTauxAcces, 'taux_acces', 'Taux d\'Accès');
      }
  
      const canvasRangDernierAppeleGroupe3 = this.chartRangDernierAppeleGroupe3Ref.nativeElement;
      if (canvasRangDernierAppeleGroupe3) {
        this.createChart(canvasRangDernierAppeleGroupe3, 'rang_dernier_appele_groupe_3', 'Rang Dernier Appelé Groupe 3');
      }
  
      const canvasRangDernierAppeleGroupe2 = this.chartRangDernierAppeleGroupe2Ref.nativeElement;
      if (canvasRangDernierAppeleGroupe2) {
        this.createChart(canvasRangDernierAppeleGroupe2, 'rang_dernier_appele_groupe_2', 'Rang Dernier Appelé Groupe 2');
      }
  
      const canvasRangDernierAppeleGroupe1 = this.chartRangDernierAppeleGroupe1Ref.nativeElement;
      if (canvasRangDernierAppeleGroupe1) {
        this.createChart(canvasRangDernierAppeleGroupe1, 'rang_dernier_appele_groupe_1', 'Rang Dernier Appelé Groupe 1');
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

    // Si un graphique existe déjà, le détruire avant de le recréer
    if ((canvas as any).chartInstance) {
      (canvas as any).chartInstance.destroy();
    }

    console.log(`📊 Création du graphique : ${label}`);
    console.log('Labels:', this.etablissementsData.map(etab => etab.NomEtablissement));
    console.log(`Données (${dataKey}):`, this.etablissementsData.map(etab => this.safeNumber(etab[dataKey])));

    // Tableau de couleurs alternées
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
        labels: this.etablissementsData.map(etab => etab.NomEtablissement), // Labels des établissements
        datasets: [{
          label: label,
          data: this.etablissementsData.map(etab => this.safeNumber(etab[dataKey])), // Données pour le graphique
          backgroundColor: this.etablissementsData.map((_, index) => colors[index % colors.length]), // Alterner les couleurs
          borderColor: this.etablissementsData.map((_, index) => colors[index % colors.length]), // Alterner les couleurs des bordures
          borderWidth: 1, // Largeur de la bordure des barres
          barThickness: 30, // Épaisseur des barres (ajustez selon vos besoins)
          barPercentage: 0.6, // Réduire la largeur des barres (60% de l'espace disponible)
          categoryPercentage: 0.8, // Augmenter l'espacement entre les catégories (80% de l'espace utilisé)
        }]
      },
      options: {
        indexAxis: 'y', // Les barres seront affichées horizontalement
        responsive: true, // Le graphique s'adapte à la taille de son conteneur
        maintainAspectRatio: false, // Permet de redimensionner le graphique selon le conteneur
        plugins: {
          legend: {
            labels: {
              color: '#333', // Couleur des labels de la légende
              font: {
                size: 14, // Taille de police des labels de la légende
              },
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true, // Commencer à zéro pour l'axe des X (l'axe des catégories)
            ticks: {
              color: '#333', // Couleur des labels de l'axe X
              font: {
                size: 12, // Taille de police des labels de l'axe X
              },
              autoSkip: false, // Éviter que les labels se chevauchent
            },
            grid: {
              drawOnChartArea: false, // Ne pas dessiner de grille verticale
              color: '#e0e0e0', // Couleur de la grille
            },
          },
          y: {
            beginAtZero: true, // Commencer à zéro pour l'axe des Y (l'axe des barres)
            ticks: {
              color: '#333', // Couleur des labels de l'axe Y
              font: {
                size: 12, // Taille de police des labels de l'axe Y
              },
              stepSize: 10, // Ajuster le pas des ticks sur l'axe Y si nécessaire
            },
            grid: {
              drawOnChartArea: true, // Dessiner la grille pour l'axe des Y
              color: '#e0e0e0', // Couleur de la grille
            },
          },
        },
      },
    });

    // Stocker l'instance du graphique dans l'élément canvas
    (canvas as any).chartInstance = chartInstance;
  }, 200);
}
  


  
}