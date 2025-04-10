import { Component, OnInit, ElementRef, ViewChild, Input, ChangeDetectionStrategy } from '@angular/core';
import { Formation } from '../../core/models/formation.model';
import { FormationService } from '../../core/services/formations.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { Chart, registerables, ChartOptions } from 'chart.js';
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
import { ChartDataset, ChartData } from 'chart.js';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';

Chart.register(...registerables, ChartDataLabels);

const defaultCoordinates = [45.0672, 4.8345];

@Component({
  selector: 'app-formation-detail',
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
    MatCheckboxModule,
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


  private map: L.Map | undefined;
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
    },
    scales: {
      x: { min: 0, max: 50 }
    }
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

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.etablissementID = Number(this.route.snapshot.paramMap.get('id'));
    this.getAcademies();

    if (!this.etablissementID) {
      console.error("Aucun ID d'établissement trouvé dans l'URL !");
      return;
    }

    this.selectedYear.valueChanges.subscribe((anneeactuelle) => {
      this.getEtablissementData(anneeactuelle || '2021');
    });

    this.getEtablissementData(this.selectedYear.value || '2021');
  }

  panelColor = new FormControl('red');

  academies: string[] = [];

  getAcademies(): void {
    this.http.get<any[]>(`${this.apiUrl}/academies`).subscribe({
      next: (data) => {
        this.academies = data.map(item => item.academie);
        console.log('📚 Académies récupérées :', this.academies);
      },
      error: (err) => console.warn('⚠️ Academies non récupérées :', err)
    });
  }

  getEtablissementData(anneeactuelle: string): void {
    const url = `${this.apiUrl}/Etablissement/Candidat/Bachelier/${this.etablissementID}?anneeactuelle=${anneeactuelle}`;
    console.log("📡 Appel API :", url);

    this.http.get(url, { observe: 'response' }).subscribe({
      next: (response) => {
        if (response.headers.get('Content-Type')?.includes('application/json')) {
          try {
            this.etablissementData = response.body;
            console.log("✅ Données établissement :", this.etablissementData);

            if (Array.isArray(this.etablissementData) && this.etablissementData.length > 0) {
              const data = this.etablissementData[0];
              console.log("🧾 Donnée brute établissement :", data);

              data.coordonnees_gps = data.localisation;


              const total = +data["toInteger(a.effectif_total_candidats_admis)"] || 0;
              const neos = +data["toInteger(a.effectif_neo_bacheliers_admis)"] || 0;
              
              console.log("📊 Données bar chart :", { total, neos });

              if (!isNaN(total) && !isNaN(neos)) {
                this.candidatsBarChartData.datasets[0].data = [total, neos];
                this.candidatsBarChartData = { ...this.candidatsBarChartData };
              } else {
                console.warn("⚠️ Valeurs non numériques pour le graphique !");
              }

              setTimeout(() => this.createPieChart(), 0);
              setTimeout(() => this.initMap(), 0);
            } else {
              console.error("❌ Données vides ou invalides :", this.etablissementData);
            }
          } catch (e) {
            console.error("❌ Erreur parsing JSON :", e);
          }
        }
      },
      error: (error) => {
        console.error("❌ Erreur API :", error);
      }
    });
  }

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
}
