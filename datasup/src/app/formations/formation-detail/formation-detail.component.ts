import { Component, OnInit, ElementRef, ViewChild, Input, ChangeDetectionStrategy, signal } from '@angular/core';
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
  chart: any;
  private map: L.Map | undefined;
  selectedYear = new FormControl('2021');

  private _selectedOption: string = 'mention_bien';
  get selectedOption(): string {
    return this._selectedOption;
  }
  set selectedOption(value: string) {
    this._selectedOption = value;
    setTimeout(() => this.createPieChart(), 0);
  }

  totalCandidats: number = 10000;
  neoBacheliers: number = 5000;
  baisseTotale: number = 10;
  baisseNeoBacheliers: number = 8;

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
// graphe de la partie 2

  createPieChart(): void {
    if (!this.etablissementData || !this.etablissementData[0]) return;

    const data = this.etablissementData[0];
    let ctx: any;
    let labels: string[];
    let dataset: number[];

    switch (this.selectedOption) {
      case 'mention_bien':
        ctx = document.getElementById('mentionChart') as HTMLCanvasElement;
        labels = ['Très bien', 'Bien', 'Assez bien', 'Passable'];
        dataset = [
          data["toInteger(a.effectif_neo_bacheliers_mention_tres_bien_felicitation_bac_admis)"],
          data["toInteger(a.effectif_neo_bacheliers_mention_bien_bac_admis)"],
          data["toInteger(a.effectif_neo_bacheliers_mention_assez_bien_bac_admis)"],
          data["toInteger(a.effectif_neo_bacheliers_sans_mention_bac_admis)"]
        ];
        break;

      case 'bourse':
        ctx = document.getElementById('bourseChart') as HTMLCanvasElement;
        const total = data['toInteger(a.effectif_total_candidats_admis)'];
        const boursiers = data['toInteger(a.effectif_boursiers_admis)'];
        labels = ['Boursiers', 'Non-boursiers'];
        dataset = [boursiers, total - boursiers];
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
        const totalAdmis = data['effectif_total_candidats_admis'];
        const memeEtab = data['effectif_admis_meme_etablissement_bts_cpge'];
        const memeAcademie = data['effectif_admis_meme_academie'];
        const autreAcademie = totalAdmis - memeEtab - memeAcademie;
        labels = ['Même établissement', 'Même académie', 'Autre académie'];
        dataset = [memeEtab, memeAcademie, autreAcademie];
        break;

      case 'sexe':
        ctx = document.getElementById('sexeChart') as HTMLCanvasElement;
        labels = ['Hommes', 'Femmes'];
        dataset = [
          data['a.effectif_candidats_hommes_admis'],
          data['a.effectif_candidats_femmes_admises']
        ];
        break;

      default:
        return;
    }

    if (!ctx) return;

    new Chart(ctx, {
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
          legend: {
            position: 'top'
          },
          title: {
            display: true,
            text: `Répartition - ${this.selectedOption}`
          }
        }
      }
    });
  }
  academies: string[] = [];
  getAcademies(): void {
    this.http.get<any[]>(`${this.apiUrl}/academies`).subscribe({
      next: (data) => {
        this.academies = data.map(item => item.academie);
        console.log('📚 Académies récupérées :', this.academies);
      },
      error: (err) => console.error('Erreur lors de la récupération des académies :', err)
    });
  }


  ngOnInit(): void {
    this.etablissementID = Number(this.route.snapshot.paramMap.get('id'));
    this.getAcademies(); // <-- ajout
    if (!this.etablissementID) {
      console.error("Aucun ID d'établissement trouvé dans l'URL !");
      return;
    }

    this.selectedYear.valueChanges.subscribe((anneeactuelle) => {
      this.getEtablissementData(anneeactuelle || '2021');
    });

    this.getEtablissementData(this.selectedYear.value || '2021');
    console.log(this.selectedYear.value);
  }

  panelColor = new FormControl('red');

  getEtablissementData(anneeactuelle: string): void {
    if (!this.etablissementID) {
      console.error("ID établissement non défini !");
      return;
    }

    const url = `${this.apiUrl}/Etablissement/Candidat/Bachelier/${this.etablissementID}?anneeactuelle=${anneeactuelle}`;
    console.log("📡 Appel API avec ID :", this.etablissementID, "URL :", url);

    this.http.get(url, { observe: 'response' }).subscribe({
      next: (response) => {
        const contentType = response.headers.get('Content-Type');
        console.log("Content-Type :", contentType);

        if (contentType && contentType.includes('application/json')) {
          try {
            this.etablissementData = response.body;
            console.log(" Données récupérées :", this.etablissementData);
            console.log(" Taille du tableau :", Array.isArray(this.etablissementData) ? this.etablissementData.length : 'Non un tableau');

            if (Array.isArray(this.etablissementData) && this.etablissementData.length > 0) {
              this.etablissementData[0].coordonnees_gps = this.etablissementData[0].localisation;
              setTimeout(() => this.createPieChart(), 0);
              setTimeout(() => this.initMap(), 0);
            } else {
              console.error(" Données JSON invalides ou vides :", this.etablissementData);
            }
          } catch (e) {
            console.error("Erreur de parsing JSON :", e);
          }
        } else {
          console.error("Réponse non JSON reçue :", response.body);
        }
      },
      error: (error) => {
        console.error("Erreur lors de la récupération des données :", error);
      }
    });
  }

  initMap(): void {
    if (this.map) {
      this.map.remove();
    }

    const coordinates = this.etablissementData[0].coordonnees_gps ? this.etablissementData[0].coordonnees_gps.split(',').map(Number) : defaultCoordinates;

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
