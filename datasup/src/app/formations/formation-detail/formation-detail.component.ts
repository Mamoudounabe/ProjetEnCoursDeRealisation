import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { config } from '../../../environments/config';
import { NgChartsModule } from 'ng2-charts';
import { ChartDataset, ChartData } from 'chart.js';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOption } from '@angular/material/autocomplete';
const defaultCoordinates = [45.0672, 4.8345];
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { FormsModule } from '@angular/forms';

import { RouterLink } from '@angular/router';
/* Chart.register(...registerables, ChartDataLabels); */
import { MatOptionModule } from '@angular/material/core'; 
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {FormControl } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';

import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { ChangeDetectionStrategy } from '@angular/core';




Chart.register(...registerables, ChartDataLabels);



@Component({
  selector: 'app-formation-detail',
  standalone: true,
  imports: [
    RouterLink,
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
    NgChartsModule, 
    FormsModule, 
    ReactiveFormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './formation-detail.component.html',
  styleUrls: ['./formation-detail.component.css']
})
export class FormationDetailComponent implements OnInit {
  private apiUrl = config.apiUrl;
  etablissementID!: number;
  etablissementData: any;
  chart: Chart<'pie', number[], string> | undefined;
  admisInternat!: number;
  capaciteFormation!: number;
  capaciteInternat!: number;
  sessionAnnee: string = '2021'; 
  activeTab: string = 'tauxAcces';
  afficherEvolution = false;
  afficherDuree = false;
  tauxAcces: number = 0;
  totalCandidats: number = 0;
  rangDernierAppelee: number = 0;
  panelColor = new FormControl('red');
  academies: string[] = [];






/* 
  private apiUrl = config.apiUrl; // Utilise l'URL de l'API depuis le fichier de configuration
  etablissementID!: number;
  etablissementData: any;
  chart: any; */
  private map: L.Map | undefined;
 /*  selectedYear = new FormControl('2021'); */ // Initialisation de l'année sélectionnée
 /*  selectedOption: string = 'mention_bien'; */
  formation: any = null; // à remplacer par le vrai type si dispo

  hasData: boolean = false;
  anneeActuelle: string = '';

/*   private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient); */

  //talla
  isLoading = true;
  errorMessage = '';
  selectedStat = new FormControl('tauxAcces');

  // Session et source des données
  session: string = '2021';
  source: string = 'Données récoltées sur la fiche parcoursup de la formation.';
  lastUpdate: string = '15/01/2025';












 constructor(private http: HttpClient, private route: ActivatedRoute ,private cdr: ChangeDetectorRef) {}



 


 /*  private map: L.Map | undefined; */
  selectedYear = new FormControl('2021');

  private _selectedOption: string = 'mention_bien';
  get selectedOption(): string {
    return this._selectedOption;
  }
  set selectedOption(value: string) {
    this._selectedOption = value;
    setTimeout(() => {
      const canvas = document.getElementById(this.getCanvasIdFromOption(value));
      if (canvas) {
        this.createPieChart();
      } else {
        setTimeout(() => this.createPieChart(), 100);
      }
    }, 50);
  }

  getCanvasIdFromOption(option: string): string {
    switch (option) {
      case 'mention_bien': return 'mentionChart';
      case 'sexe': return 'sexeChart';
      case 'bourse': return 'bourseChart';
      case 'academie': return 'academieChart';
      case 'type_bac': return 'bacChart';
      default: return '';
    }
  }

  candidatsBarChartData: ChartData<'bar'> = {
    labels: ['Candidats admis', 'Néo-bacheliers admis'],
    datasets: [
      {
        data: [0, 0],
        label: 'Répartition',
        backgroundColor: ['#42A5F5', '#66BB6A']
      }
    ]
  };

  candidatsBarChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Répartition des admis'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  barChartData: ChartData<'bar'> = {
    labels: ['MySpace', 'Hi5'],
    datasets: [
      {
        data: [40.7, 15.9],
        label: 'Utilisateurs (M)',
        backgroundColor: ['#17A2B8', '#17A2B8', '#FF5252', '#40C4FF', '#00E676', '#29B6F6', '#FF5722'],
      }
    ]
  };



barChartOptionss: ChartOptions<'bar'> = {
  indexAxis: 'y',
  responsive: true,
  animation: {
    duration: 2000,
    easing: 'linear'
  }
};



  tauxChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Rang permettant une proposition', 'Rang ne permettant pas'],
    datasets: [
      {
        data: [],
        backgroundColor: ['#00a6b6', '#e57373'],
        label: 'Répartition des candidats (%)',
      },
    ],
  };

  tauxChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y}%`,
        },
      },
    },
    scales: {
      y: { min: 0, max: 100 },
    },
  };

  tauxMultiChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['2020', '2021', '2022', '2023'],
    datasets: [
      {
        label: 'Taux d’accès (%)',
        data: [],
        backgroundColor: ['#66bb6a', '#81c784', '#a5d6a7', '#c8e6c9'],
      },
    ],
  };

  tauxMultiChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      y: { min: 0, max: 100 },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y}%`,
        },
      },
    },
  };

  dureeChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['À l’ouverture', 'Avant bac', 'Fin principale', 'Terme'],
    datasets: [
      {
        label: 'Répartition (%)',
        data: [],
        backgroundColor: '#007bff',
      },
    ],
  };

  dureeChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.x}%`,
        },
      },
    },
    scales: {
      x: { min: 0, max: 100 },
    },
  };

  dureeMultiChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['2020', '2021', '2022', '2023'],
    datasets: [
      {
        label: 'À l’ouverture',
        data: [],
        backgroundColor: '#1a237e',
        stack: 'a',
      },
      {
        label: 'Avant bac',
        data: [],
        backgroundColor: '#303f9f',
        stack: 'a',
      },
      {
        label: 'Avant fin principale',
        data: [],
        backgroundColor: '#1976d2',
        stack: 'a',
      },
      {
        label: 'Terme procédure',
        data: [],
        backgroundColor: '#4fc3f7',
        stack: 'a',
      },
    ],
  };

  dureeMultiChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    indexAxis: 'x',
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.y}%`,
        },
      },
    },
    scales: {
      y: { stacked: true, min: 0, max: 100 },
      x: { stacked: true },
    },
  };

  barChartTypee: 'bar' = 'bar';

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
  };

  barChartType: 'bar' = 'bar';

  barChartData2: ChartConfiguration<'bar'>['data'] = {
    labels: ['Avr', 'Mai', 'Juin'],
    datasets: [{ data: [15, 25, 35], label: 'Dataset 2', backgroundColor: ['purple', 'orange', 'cyan'] }]
  };



  /* ngOnInit(): void {
    // Récupération de l'ID depuis l'URL
    this.etablissementID = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.etablissementID) {
      console.error("Aucun ID d'établissement trouvé dans l'URL !");
      return;
    }

    // Initialisation des données
    this.getAcademies();
    this.loadMultiYearData();
    
    // Chargement initial des données
    const initialYear = this.selectedYear.value || '2021';
    this.getEtablissementData(initialYear);

    // Abonnement aux changements d'année
    this.selectedYear.valueChanges.subscribe((anneeactuelle) => {
      this.getEtablissementData(anneeactuelle || '2021');
    });
  }
 */


  ngOnInit(): void {
    // ✅ Récupération de l'ID d'établissement depuis l'URL
    this.etablissementID = Number(this.route.snapshot.paramMap.get('id'));
  
    // ✅ Récupération de l’année depuis les query params (?anneeactuelle=2021)
    this.anneeActuelle = this.route.snapshot.queryParamMap.get('anneeactuelle') || '2021';
  
    if (!this.etablissementID) {
      console.error("Aucun ID d'établissement trouvé dans l'URL !");
      return;
    }
  
    //  Récupération des données annexes
    this.getAcademies();
    this.loadMultiYearData();
  
    //  Récupération des détails de la formation si présente
    const formationId = this.route.snapshot.paramMap.get('id');
    if (formationId) {
      this.getFormationDetails(formationId);
    } else {
      this.errorMessage = 'Formation introuvable.';
      this.isLoading = false;
    }
  
    //  Initialisation de la stat sélectionnée
    if (!this.selectedStat.value) {
      this.selectedStat.setValue('tauxAcces');
    }
  
    //  Chargement initial avec la valeur sélectionnée ou l'année depuis l'URL
    const initialYear = this.selectedYear.value || this.anneeActuelle;
    this.getEtablissementData(initialYear);
    console.log('Année actuelle (depuis URL ou champ) :', this.anneeActuelle);
  
    //  Écoute des changements de l’année
    this.selectedYear.valueChanges.subscribe((anneeactuelle) => {
      this.getEtablissementData(anneeactuelle || this.anneeActuelle);
    });
  
    //  Écoute des changements de la statistique sélectionnée
    this.selectedStat.valueChanges.subscribe(() => this.updateChart());
  }
  


  getAcademies(): void {
    this.http.get<any[]>(`${this.apiUrl}/academies`).subscribe({
      next: (data) => {
        this.academies = data.map(item => item.academie);
        console.log('📚 Académies récupérées :', this.academies);
      },
      error: (err) => console.warn('⚠️ Academies non récupérées :', err)
    });
  }

  /* --------------------------------------------getEtablissementData--------------------------------------------------------- */

/* 
  getEtablissementData(anneeactuelle: string): void {
    if (!this.etablissementID) {
      console.error(" ID établissement non défini");
      return;
    }
  
    const url = `${this.apiUrl || config.apiUrl}/Etablissement/Candidat/Bachelier/${this.etablissementID}?anneeactuelle=${anneeactuelle}`;
    console.log("📡 Appel API :", url);
  
    this.http.get<any[]>(url, { observe: 'response' }).subscribe({
      next: (response) => {
        // Vérification du content-type et du corps de réponse
        if (!response.headers.get('Content-Type')?.includes('application/json') || !response.body) {
          console.error(" Réponse non-JSON ou vide");
          return;
        }
  
        try {
          this.etablissementData = response.body;
          console.log(" Données établissement :", this.etablissementData);
  
          if (Array.isArray(this.etablissementData) && this.etablissementData.length > 0) {
            const etab = this.etablissementData[0];
            console.log(" Donnée brute établissement :", etab);
  
            // Gestion des coordonnées GPS
            etab.coordonnees_gps = etab.localisation || etab.coordonnees_gps;
  
            // Données principales
            this.sessionAnnee = anneeactuelle;
            this.tauxAcces = this.safeParseNumber(etab['toInteger(cl.taux_acces)']);
            this.totalCandidats = this.safeParseNumber(etab.TotalCandidat);
            this.rangDernierAppelee = this.safeParseNumber(etab['toInteger(cl.rang_dernier_appele_groupe_3)']);
  
            // Nouvelles données pour le bar chart
            const totalAdmis = this.safeParseNumber(etab["toInteger(a.effectif_total_candidats_admis)"]);
            const neoAdmis = this.safeParseNumber(etab["toInteger(a.effectif_neo_bacheliers_admis)"]);
            console.log(" Données graphiques :", { totalAdmis, neoAdmis });
  
            // Mise à jour des graphiques
            this.updateTauxChart();
            this.updateDureeChart(etab);
            
            // Mise à jour du bar chart si données valides
            if (!isNaN(totalAdmis) && !isNaN(neoAdmis)) {
              this.candidatsBarChartData.datasets[0].data = [totalAdmis, neoAdmis];
              this.candidatsBarChartData = { ...this.candidatsBarChartData };
            }
  
            // Mise à jour asynchrone de l'UI
            requestAnimationFrame(() => {
              this.createPieChart();
              if (etab.coordonnees_gps) this.initMap();
            });
          } else {
            console.error(" Tableau de données vide");
          }
        } catch (e) {
          console.error(" Erreur traitement données :", e);
        }
      },
      error: (error) => {
        console.error(" Erreur API :", error);
        if (error.status) console.error("Code statut :", error.status);
      }
    });
  } */
  




    getEtablissementData(anneeactuelle: string): void {
      if (!this.etablissementID) {
        console.error('ID établissement non défini !');
        return;
      }
    
      const url = `${this.apiUrl || config.apiUrl}/Etablissement/Candidat/Bachelier/${this.etablissementID}?anneeactuelle=${anneeactuelle}`;
      console.log('📡 Appel API avec ID :', this.etablissementID, 'URL :', url);
    
      this.http.get<any[]>(url, { observe: 'response' }).subscribe({
        next: (response) => {
          const contentType = response.headers.get('Content-Type');
          if (!contentType?.includes('application/json') || !response.body) {
            console.error('Réponse non JSON ou vide :', response.body);
            return;
          }
    
          try {
            this.etablissementData = response.body;
            console.log('📦 Données récupérées :', this.etablissementData);
    
            if (Array.isArray(this.etablissementData) && this.etablissementData.length > 0) {
              const etab = this.etablissementData[0];
    
              // ✅ Mise à jour des coordonnées GPS
              etab.coordonnees_gps = etab.localisation || etab.coordonnees_gps;
    
              // ✅ Données principales
              this.sessionAnnee = anneeactuelle;
              this.tauxAcces = this.safeParseNumber(etab['toInteger(cl.taux_acces)']);
              this.totalCandidats = this.safeParseNumber(etab.TotalCandidat);
              this.rangDernierAppelee = this.safeParseNumber(etab['toInteger(cl.rang_dernier_appele_groupe_3)']);
    
              // ✅ Données pour graphiques
              const totalAdmis = this.safeParseNumber(etab["toInteger(a.effectif_total_candidats_admis)"]);
              const neoAdmis = this.safeParseNumber(etab["toInteger(a.effectif_neo_bacheliers_admis)"]);
              console.log('📊 Données graphiques :', { totalAdmis, neoAdmis });
    
              // ✅ Mise à jour des différents graphiques
              this.updateTauxChart();
              this.updateDureeChart(etab);
    
              if (!isNaN(totalAdmis) && !isNaN(neoAdmis)) {
                this.candidatsBarChartData.datasets[0].data = [totalAdmis, neoAdmis];
                this.candidatsBarChartData = { ...this.candidatsBarChartData };
              }
    
              // ✅ Initialisation des visualisations après update
              requestAnimationFrame(() => {
                this.createPieChart();
                if (etab.coordonnees_gps) this.initMap();
              });
    
            } else {
              console.error('⚠️ Tableau vide ou données invalides :', this.etablissementData);
            }
          } catch (e) {
            console.error('❌ Erreur de traitement des données :', e);
          }
        },
        error: (error) => {
          console.error('❌ Erreur lors de l’appel API :', error);
          if (error.status) console.error('Code statut :', error.status);
        },
      });
    }
    
    // ✅ Méthode utilitaire pour conversion sûre en nombre
    private safeParseNumber(value: any): number {
      const num = +value;
      return isNaN(num) ? 0 : num;
    }
    


















  // Méthode utilitaire pour conversion numérique sécurisée
/*   private safeParseNumber(value: any): number {
    const num = +value;
    return isNaN(num) ? 0 : num;
  } */





  createPieChart(): void {
    if (!this.etablissementData || !this.etablissementData[0]) return;

    const data = this.etablissementData[0];
    let ctx: any;
    let labels: string[] = [];
    let dataset: number[] = [];

    switch (this.selectedOption) {
      case 'mention_bien':
        
        ctx = document.getElementById('mentionChart') as HTMLCanvasElement;
        labels = ['Très bien', 'Bien', 'Assez bien', 'Passable'];
        dataset = [
          data["toInteger(a.effectif_neo_bacheliers_mention_tres_bien_felicitation_bac_admis)"],
          data["toInteger(a.effectif_neo_bacheliers_mention_bien_bac_admis)"],
         
          

          
          data["toInteger(a.effectif_neo_bacheliers_mention_assez_bien_bac_admis)"],
          data["toInteger(a.effectif_neo_bacheliers_sans_mention_bac_admis)"],

          
        ];
        break;

      case 'bourse':
        ctx = document.getElementById('bourseChart') as HTMLCanvasElement;
        const totalBourse = data['toInteger(a.effectif_total_candidats_admis)'];
        const boursiers = data['toInteger(a.effectif_boursiers_admis)'];
        labels = ['Boursiers', 'Non-boursiers'];
        dataset = [boursiers, totalBourse - boursiers];
        break;

      case 'type_bac':
        ctx = document.getElementById('bacChart') as HTMLCanvasElement;
        labels = ['Général', 'Technologique', 'Professionnel'];
        dataset = [
          data['toInteger(a.effectif_generaux_admis)'],
        
          data['toInteger(a.effectif_technologiques_admis)'],
          data['toInteger(a.effectif_professionnels_admis)']
        ];
        break;

      case 'academie':
        ctx = document.getElementById('academieChart') as HTMLCanvasElement;
        const totalAdmis = data['toInteger(a.effectif_total_candidats_admis)'];
        const memeEtab = data['toInteger(a.effectif_admis_meme_etablissement_bts_cpge)'];
        const memeAcademie = data['toInteger(a.effectif_admis_meme_academie)'];
        const autreAcademie = totalAdmis - memeEtab - memeAcademie;
        labels = ['Même établissement', 'Même académie', 'Autre académie'];
        dataset = [memeEtab, memeAcademie, autreAcademie];
        break;

      case 'sexe':
        ctx = document.getElementById('sexeChart') as HTMLCanvasElement;
        const femmes = data['toInteger(a.effectif_candidates_admises)'];
        const total = data['toInteger(a.effectif_generaux_admis)'];
        const hommes = total - femmes;
        labels = ['Hommes', 'Femmes'];
        dataset = [hommes, femmes];
        break;

      default:
        return;
    }

    if (!ctx) return;

    this.chart?.destroy();

    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data: dataset,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
        }]
      },
      options: {
        plugins: {
          legend: { position: 'top' },
          title: {
            display: true,
            text: `Répartition - ${this.selectedOption}`
          }
        }
      }
    });
  }

  initMap(): void {
    if (this.map) this.map.remove();

    const coordinates = this.etablissementData[0].coordonnees_gps
      ? this.etablissementData[0].coordonnees_gps.split(',').map(Number)
      : defaultCoordinates;

    this.map = L.map('map').setView(coordinates, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    if (this.etablissementData[0].coordonnees_gps) {
      L.marker(coordinates)
        .addTo(this.map)
        .bindPopup(`<b>${this.etablissementData[0].etablissement}</b><br>${this.etablissementData[0].region}`)
        .openPopup();
    }
  }


  /* constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.etablissementID = Number(this.route.snapshot.paramMap.get('id'));
    if (this.etablissementID) {
      this.getEtablissementData('2021');
      this.loadMultiYearData();
    }
  }

   */
/* 
  getEtablissementData(anneeactuelle: string): void {
    const url = `${config.apiUrl}/Etablissement/Candidat/Bachelier/${this.etablissementID}?anneeactuelle=${anneeactuelle}`;

    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          const etab = data[0];
          this.etablissementData = etab;

          this.sessionAnnee = anneeactuelle;

          this.tauxAcces = parseFloat(etab['toInteger(cl.taux_acces)']) || 0;
          this.totalCandidats = parseInt(etab.TotalCandidat) || 0;
          this.rangDernierAppelee =
            parseInt(etab['toInteger(cl.rang_dernier_appele_groupe_3)']) || 0;

          this.updateTauxChart();
          this.updateDureeChart(etab);
        }
      },
      error: (err) => console.error('Erreur API :', err),
    });
  }*/

  updateTauxChart(): void {
    const refus = 100 - this.tauxAcces;
    this.tauxChartData.datasets[0].data = [this.tauxAcces, refus];
    this.tauxChartData = { ...this.tauxChartData };
  }

  updateDureeChart(etab: any): void {
    const total =
      parseInt(etab['toInteger(a.effectif_total_candidats_admis)']) || 1;

    const ouverture =
      parseInt(
        etab[
          'toInteger(a.effectif_admis_proposition_ouverture_phase_principale)'
        ]
      ) || 0;
    const avantBac =
      parseInt(
        etab['toInteger(a.effectif_admis_proposition_avant_baccalaureat)']
      ) || 0;
    const finPrincipale =
      parseInt(etab['toInteger(a.effectif_admis_phase_principale)']) || 0;
    const terme =
      parseInt(etab['toInteger(a.effectif_admis_phase_complementaire)']) || 0;

    const ouverturePct = Math.round((ouverture / total) * 100);
    const avantBacPct = Math.round((avantBac / total) * 100);
    const finPrincipalePct = Math.round((finPrincipale / total) * 100);
    const termePct = Math.round((terme / total) * 100);

    this.dureeChartData.datasets[0].data = [
      ouverturePct,
      avantBacPct,
      finPrincipalePct,
      termePct,
    ];
    this.dureeChartData = { ...this.dureeChartData };
  } 

  loadMultiYearData(): void {
    const annees = ['2020', '2021', '2022', '2023'];
    const tauxAccesParAnnee: number[] = [];

    const dureeParAnnee: {
      ouverture: number[];
      avantBac: number[];
      finPrincipale: number[];
      terme: number[];
    } = {
      ouverture: [],
      avantBac: [],
      finPrincipale: [],
      terme: [],
    };

    let loaded = 0;

    annees.forEach((annee) => {
      const url = `${config.apiUrl}/Etablissement/Candidat/Bachelier/${this.etablissementID}?anneeactuelle=${annee}`;

      this.http.get<any[]>(url).subscribe({
        next: (data) => {
          if (data && data.length > 0) {
            const etab = data[0];
            const taux = parseFloat(etab['toInteger(cl.taux_acces)']) || 0;
            tauxAccesParAnnee.push(Math.round(taux));

            const total =
              parseInt(etab['toInteger(a.effectif_total_candidats_admis)']) || 1;
            const ouverture =
              parseInt(
                etab[
                  'toInteger(a.effectif_admis_proposition_ouverture_phase_principale)'
                ]
              ) || 0;
            const avantBac =
              parseInt(
                etab[
                  'toInteger(a.effectif_admis_proposition_avant_baccalaureat)'
                ]
              ) || 0;
            const finPrincipale =
              parseInt(
                etab['toInteger(a.effectif_admis_phase_principale)']
              ) || 0;
            const terme =
              parseInt(etab['toInteger(a.effectif_admis_phase_complementaire)']) ||
              0;

            dureeParAnnee.ouverture.push(Math.round((ouverture / total) * 100));
            dureeParAnnee.avantBac.push(Math.round((avantBac / total) * 100));
            dureeParAnnee.finPrincipale.push(
              Math.round((finPrincipale / total) * 100)
            );
            dureeParAnnee.terme.push(Math.round((terme / total) * 100));
          } else {
            tauxAccesParAnnee.push(0);
            dureeParAnnee.ouverture.push(0);
            dureeParAnnee.avantBac.push(0);
            dureeParAnnee.finPrincipale.push(0);
            dureeParAnnee.terme.push(0);
          }

          loaded++;

          if (loaded === annees.length) {
            this.tauxMultiChartData.datasets[0].data = tauxAccesParAnnee;
            this.dureeMultiChartData.datasets[0].data = dureeParAnnee.ouverture;
            this.dureeMultiChartData.datasets[1].data = dureeParAnnee.avantBac;
            this.dureeMultiChartData.datasets[2].data = dureeParAnnee.finPrincipale;
            this.dureeMultiChartData.datasets[3].data = dureeParAnnee.terme;

            this.tauxMultiChartData = { ...this.tauxMultiChartData };
            this.dureeMultiChartData = { ...this.dureeMultiChartData };
          }
        },
        error: (err) => {
          console.error('Erreur chargement année', annee, err);
          tauxAccesParAnnee.push(0);
          dureeParAnnee.ouverture.push(0);
          dureeParAnnee.avantBac.push(0);
          dureeParAnnee.finPrincipale.push(0);
          dureeParAnnee.terme.push(0);
          loaded++;
        },
      });
    });
  }

  showTauxAcces() {
    this.activeTab = 'tauxAcces';
  }

  showDureeSelection() {
    this.activeTab = 'dureeSelection';
  }
















  // Données du graphique
  chartData: ChartData<'bar'> = {
    labels: [
      'Tous candidats',
      'Bac général',
      'Bac technologique',
      'Bac professionnel',
    ],
    datasets: [],
  };

  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: false, position: 'top' },
    },
    scales: {
      x: {
        title: {
          display: false,
          text: 'Types de candidats',
          font: { size: 14, weight: 'bold' },
          color: '#333',
        },
        ticks: {
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
          padding: 5,
          font: { size: 12 },
          color: 'black',
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function (value) {
            return value + '%';
          },
        },
      },
    },
  };



/*   public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
  };
  barChartType: 'bar' = 'bar'; // Assign it to be "bar" explicitly
 */
  // Données pour les 3 graphiques
  public barChartData1: ChartConfiguration<'bar'>['data'] = {
    labels: ['Jan', 'Fév', 'Mar'],
    datasets: [
      {
        data: [10, 20, 30],
        label: 'Dataset 1',
        backgroundColor: ['red', 'blue', 'green'],
      },
    ],
  };

/*   public barChartData2: ChartConfiguration<'bar'>['data'] = {
    labels: ['Avr', 'Mai', 'Juin'],
    datasets: [
      {
        data: [15, 25, 35],
        label: 'Dataset 2',
        backgroundColor: ['purple', 'orange', 'cyan'],
      },
    ],
  }; */

  public barChartData3: ChartConfiguration<'bar'>['data'] = {
    labels: ['Juil', 'Août', 'Sep'],
    datasets: [
      {
        data: [5, 15, 25],
        label: 'Dataset 3',
        backgroundColor: ['yellow', 'pink', 'brown'],
      },
    ],
  };

 /*  totalCandidats: number = 10000; // Exemple de valeur, vous pouvez ajuster en fonction de vos données */
  neoBacheliers: number = 5000; // Exemple de valeur
  baisseTotale: number = 10; // Exemple de pourcentage de baisse
  baisseNeoBacheliers: number = 8; // Exemple de pourcentage de baisse

  year = 2006; // Année affichée sur le graphique

/*   public barChartData: ChartData<'bar'> = {
    labels: ['MySpace', 'Hi5'],
    datasets: [
      {
        data: [40.7, 15.9],
        label: 'Utilisateurs (M)',
        backgroundColor: [
          '#17A2B8',
          '#17A2B8',
          '#FF5252',
          '#40C4FF',
          '#00E676',
          '#29B6F6',
          '#FF5722',
        ],
      },
    ],
  };
 */
  // Options du graphique à barres
  /* public barChartOptionss: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    animation: {
      duration: 2000,
      easing: 'linear',
    },
    scales: {
      x: { min: 0, max: 50 },
    },
  }; */

  // Type du graphique
/*   public barChartTypee: 'bar' = 'bar'; // Indiquer explicitement 'bar' comme type

  startChartRace() {
    setInterval(() => {
      this.year++; // Incrémente l'année

      // Simule des données évolutives
      this.barChartData.datasets[0].data =
        this.barChartData.datasets[0].data.map(
          (value) => Math.max(0, value + (Math.random() * 5 - 2)) // Variation aléatoire
        );

      this.barChartData = { ...this.barChartData }; // Mise à jour du graphique
    }, 2000);
  } */

  /* ngOnInit(): void {
    this.etablissementID = Number(this.route.snapshot.paramMap.get('id'));

    // ✅ Récupération de l’année depuis l’URL (ex : ?anneeactuelle=2021)
    this.anneeActuelle =
      this.route.snapshot.queryParamMap.get('anneeactuelle') || '2021';

    if (!this.etablissementID) {
      console.error("Aucun ID d'établissement trouvé dans l'URL !");
      return;
    }

    // ✅ Écoute des changements de l’année (si tu fais un select ou autre)
    this.selectedYear.valueChanges.subscribe((anneeactuelle) => {
      this.getEtablissementData(anneeactuelle || this.anneeActuelle);
    });

    // ✅ Chargement initial avec l’année de l’URL
    this.getEtablissementData(this.selectedYear.value || this.anneeActuelle);
    console.log('Année actuelle (depuis URL ou champ) :', this.anneeActuelle);

    const formationId = this.route.snapshot.paramMap.get('id');
    if (formationId) {
      this.getFormationDetails(formationId);
    } else {
      this.errorMessage = 'Formation introuvable.';
      this.isLoading = false;
    }

    if (!this.selectedStat.value) {
      this.selectedStat.setValue('tauxAcces');
    }

    this.selectedStat.valueChanges.subscribe(() => this.updateChart());
  } */

/*   panelColor = new FormControl('red'); */

  // Fonction pour récupérer les données de l'établissement en fonction de l'année sélectionnée
 /*  getEtablissementData(anneeactuelle: string): void {
    if (!this.etablissementID) {
      console.error('ID établissement non défini !');
      return;
    }

    const url = `${this.apiUrl}/Etablissement/Candidat/Bachelier/${this.etablissementID}?anneeactuelle=${anneeactuelle}`;
    console.log('📡 Appel API avec ID :', this.etablissementID, 'URL :', url);

    this.http.get(url, { observe: 'response' }).subscribe({
      next: (response) => {
        const contentType = response.headers.get('Content-Type');
        console.log('Content-Type :', contentType);

        if (contentType && contentType.includes('application/json')) {
          try {
            this.etablissementData = response.body;
            console.log(' Données récupérées :', this.etablissementData);
            console.log(
              ' Taille du tableau :',
              Array.isArray(this.etablissementData)
                ? this.etablissementData.length
                : 'Non un tableau'
            );

            if (
              Array.isArray(this.etablissementData) &&
              this.etablissementData.length > 0
            ) {
              this.etablissementData[0].coordonnees_gps =
                this.etablissementData[0].localisation;
              setTimeout(() => this.createChart(), 0);
              setTimeout(() => this.initMap(), 0); // Ajoutez cet appel pour initialiser la carte après avoir récupéré les données
            } else {
              console.error(
                ' Données JSON invalides ou vides :',
                this.etablissementData
              );
            }
          } catch (e) {
            console.error('Erreur de parsing JSON :', e);
          }
        } else {
          console.error('Réponse non JSON reçue :', response.body);
        }
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des données :', error);
      },
    });
  } */

  //LOUM

  getFormationDetails(id: string) {
    // ✅ Utilise l'année dynamique récupérée dans ngOnInit()
    const url = `${this.apiUrl}/Etablissement/Candidat/Bachelier/${id}?anneeactuelle=${this.anneeActuelle}`;

    console.log(`📡 Requête envoyée à : ${url}`);

    this.http.get(url).subscribe({
      next: (data: any) => {
        if (!data || data.length === 0) {
          this.errorMessage = 'Aucune donnée disponible pour cette formation.';
          this.isLoading = false;
          this.hasData = false;
          return;
        }

        const formationData = data[0];

        this.formation = {
          // ✅ Tu peux encore afficher l’année dynamique dans le HTML
          annee: this.anneeActuelle,

          nom: formationData.NomEtablissement,
          taux_admission: formationData['toInteger(cl.taux_acces)'] || 0,
          taux_bac_general:
            formationData[
              'toInteger(cl.part_terminales_generales_position_recevoir_proposition_phase_principale)'
            ] || 0,
          taux_bac_technologique:
            formationData[
              'toInteger(cl.part_terminales_technologiques_position_recevoir_proposition_phase_principale)'
            ] || 0,
          taux_bac_professionnel:
            formationData[
              'toInteger(cl.part_terminales_professionnelles_position_recevoir_proposition_phase_principale)'
            ] || 0,

          // ✅ taux de passage et réussite
          taux_passage_tous:
            formationData['toInteger(a.effectif_admis_phase_principale)'] || 0,
          taux_passage_general:
            formationData['toInteger(a.effectif_generaux_admis)'] || 0,
          taux_passage_technologique:
            formationData['toInteger(a.effectif_technologiques_admis)'] || 0,
          taux_passage_professionnel:
            formationData['toInteger(a.effectif_professionnels_admis)'] || 0,

          taux_reussite_tous:
            formationData['toInteger(a.effectif_total_candidats_admis)'] || 0,
          taux_reussite_general:
            formationData['toInteger(a.effectif_generaux_mention_bac_admis)'] ||
            0,
          taux_reussite_technologique:
            formationData[
              'toInteger(a.effectif_technologiques_mention_bac_admis)'
            ] || 0,
          taux_reussite_professionnel:
            formationData[
              'toInteger(a.effectif_professionnels_mention_bac_admis)'
            ] || 0,
        };

        console.log('📊 Données extraites :', this.formation);
        this.isLoading = false;

        // ✅ Affiche directement le graphique pour le taux d'accès
        this.selectedStat.setValue('tauxAcces', { emitEvent: false });
        this.updateChart();
      },
      error: (error) => {
        console.error(
          '❌ Erreur lors de la récupération de la formation :',
          error
        );
        this.errorMessage =
          'Impossible de charger les détails de la formation.';
        this.isLoading = false;
      },
    });
  }

  updateChart() {
    if (!this.formation) return;

    let dataValues: number[] = [];

    switch (this.selectedStat.value) {
      case 'tauxAcces':
        dataValues = [
          this.formation.taux_admission,
          this.formation.taux_bac_general,
          this.formation.taux_bac_technologique,
          this.formation.taux_bac_professionnel,
        ];
        break;
      case 'tauxPassage':
        dataValues = [
          this.formation.taux_passage_tous,
          this.formation.taux_passage_general,
          this.formation.taux_passage_technologique,
          this.formation.taux_passage_professionnel,
        ];
        break;
      case 'tauxReussite':
        dataValues = [
          this.formation.taux_reussite_tous,
          this.formation.taux_reussite_general,
          this.formation.taux_reussite_technologique,
          this.formation.taux_reussite_professionnel,
        ];
        break;
    }

    this.hasData = dataValues.some((d) => d > 0);

    this.chartData = {
      labels: [
        'Tous candidats',
        'Bac général',
        'Bac technologique',
        'Bac professionnel',
      ],
      datasets: [
        {
          data: dataValues,
          backgroundColor: ['#4CAF50', '#2196F3', '#FFC107', '#F44336'],
        },
      ],
    };
    this.cdr.detectChanges();
  }

 /*  goBack() {
    this.router.navigate(['/formations']);
  }
*/
 /*  initMap(): void {
    if (this.map) {
      this.map.remove();
    }
 
    const coordinates = this.etablissementData[0].coordonnees_gps
      ? this.etablissementData[0].coordonnees_gps.split(',').map(Number)
      : defaultCoordinates;

    this.map = L.map('map').setView(coordinates, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    if (this.etablissementData[0].coordonnees_gps) {
      L.marker(coordinates)
        .addTo(this.map)
        .bindPopup(
          `<b>${this.etablissementData[0].etablissement}</b><br>${this.etablissementData[0].region}`
        )
        .openPopup();
    }
  } */

  // Fonction pour créer le graphique
  createChart(): void {
    if (
      !Array.isArray(this.etablissementData) ||
      this.etablissementData.length === 0
    ) {
      console.error(' Données insuffisantes pour créer le graphique !');
      return;
    }

    const etab = this.etablissementData[0]; // Prend le premier élément du tableau

    const data = [
      parseInt(etab.TotalCandidats) || 0,
      parseInt(etab.NeoBacheliersGeneraux) || 0,
      parseInt(etab.NeoBacheliersTechnologiques) || 0,
      parseInt(etab.NeoBacheliersProfessionnels) || 0,
    ];

    console.log(' Données utilisées pour le graphique :', data);

    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!canvas) {
      console.error(
        'Impossible de créer le graphique : élément <canvas> introuvable !'
      );
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error("Impossible d'obtenir le contexte 2D du canvas !");
      return;
    }

    if (this.chart) {
      this.chart.destroy();
    }

    const labels = [
      'Tous les candidats',
      'Bacheliers généraux',
      'Bacheliers technologiques',
      'Bacheliers professionnels',
    ];

    /* this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: "Taux d'accès (%)",
            data: data,
            backgroundColor: ['#27ae60', '#16a085', '#f1c40f', '#e74c3c'],
            borderColor: ['#219150', '#128277', '#d4ac0d', '#c0392b'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: {
              font: { size: 12 },
              maxRotation: 0, // Texte horizontal
              minRotation: 0,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return value + ' %';
              },
            },
          },
        },
      },
    });
  } */













}
