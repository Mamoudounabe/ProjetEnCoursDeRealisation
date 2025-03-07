import { Component, OnInit, ElementRef, ViewChild, Input  } from '@angular/core';
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
import { ChartConfiguration } from 'chart.js'; 
import { ChartDataset,ChartData } from 'chart.js';
import{ CommonModule } from '@angular/common';



Chart.register(...registerables, ChartDataLabels);

const defaultCoordinates = [45.0672, 4.8345]; // Ajoutez cette ligne pour définir les coordonnées par défaut

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
   
    
  ],
  templateUrl: './formation-detail.component.html',
  styleUrls: ['./formation-detail.component.css']
})
export class FormationDetailComponent implements OnInit {
  private apiUrl = config.apiUrl; // Utilise l'URL de l'API depuis le fichier de configuration
  etablissementID!: number;
  etablissementData: any;
  chart: any;
  private map: L.Map | undefined;
  selectedYear = new FormControl('2021'); // Initialisation de l'année sélectionnée

  constructor(private http: HttpClient, private route: ActivatedRoute) {}
























/* 
  totalCandidats = 175;
  neoBacheliers = 147;
  baisseTotale = -60;
  baisseNeoBacheliers = -36;

  // Données du graphique
  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
    datasets: [
      {
        data: [200, 220, 180, 210, 230, 260, 175], // Candidats totaux
        label: 'Candidats',
        borderColor: '#00A9C9',
        backgroundColor: 'rgba(0, 169, 201, 0.2)',
        fill: false,
        tension: 0.4
      },
      {
        data: [120, 130, 110, 140, 150, 160, 147], // Néo-bacheliers
        label: 'Néo-bacheliers',
        borderColor: '#C95479',
        borderDash: [5, 5], // Ligne pointillée
        backgroundColor: 'rgba(201, 84, 121, 0.2)',
        fill: false,
        tension: 0.4
      }
    ]
  };

  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { display: true },
      y: { display: false }
    },
    elements: { point: { radius: 4 } }
  };
 */





  
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
  };
  barChartType: "bar" = "bar"; // Assign it to be "bar" explicitly


  // Données pour les 3 graphiques
  public barChartData1: ChartConfiguration<'bar'>['data'] = {
    labels: ['Jan', 'Fév', 'Mar'],
    datasets: [{ data: [10, 20, 30], label: 'Dataset 1', backgroundColor: ['red', 'blue', 'green'] }]
  };

  public barChartData2: ChartConfiguration<'bar'>['data'] = {
    labels: ['Avr', 'Mai', 'Juin'],
    datasets: [{ data: [15, 25, 35], label: 'Dataset 2', backgroundColor: ['purple', 'orange', 'cyan'] }]
  };

  public barChartData3: ChartConfiguration<'bar'>['data'] = {
    labels: ['Juil', 'Août', 'Sep'],
    datasets: [{ data: [5, 15, 25], label: 'Dataset 3', backgroundColor: ['yellow', 'pink', 'brown'] }]
  };

  


  







  totalCandidats: number = 10000; // Exemple de valeur, vous pouvez ajuster en fonction de vos données
  neoBacheliers: number = 5000;   // Exemple de valeur
  baisseTotale: number = 10;      // Exemple de pourcentage de baisse
  baisseNeoBacheliers: number = 8; // Exemple de pourcentage de baisse

  year = 2006; // Année affichée sur le graphique

  public barChartData: ChartData<'bar'> = {
    labels: ['MySpace', 'Hi5'],
    datasets: [
      { 
        data: [40.7, 15.9], 
        label: 'Utilisateurs (M)',
        backgroundColor: ['#E1306C', '#FF4081', '#FF5252', '#40C4FF', '#00E676', '#29B6F6', '#FF5722'],
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










  ngOnInit(): void {
    this.etablissementID = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.etablissementID) {
      console.error("Aucun ID d'établissement trouvé dans l'URL !");
      return;
    }

    this.selectedYear.valueChanges.subscribe((anneeactuelle) => {
      this.getEtablissementData(anneeactuelle || '2021'); // Utilise une valeur par défaut si null
    });

    this.getEtablissementData(this.selectedYear.value || '2021');
    console.log(this.selectedYear.value);
  }

  panelColor = new FormControl('red');

  // Fonction pour récupérer les données de l'établissement en fonction de l'année sélectionnée
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
              setTimeout(() => this.createChart(), 0);
              setTimeout(() => this.initMap(), 0); // Ajoutez cet appel pour initialiser la carte après avoir récupéré les données
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

  // Fonction pour créer le graphique
  createChart(): void {
    if (!Array.isArray(this.etablissementData) || this.etablissementData.length === 0) {
      console.error(" Données insuffisantes pour créer le graphique !");
      return;
    }

    const etab = this.etablissementData[0]; // Prend le premier élément du tableau

    const data = [
      parseInt(etab.TotalCandidats) || 0,
      parseInt(etab.NeoBacheliersGeneraux) || 0,
      parseInt(etab.NeoBacheliersTechnologiques) || 0,
      parseInt(etab.NeoBacheliersProfessionnels) || 0
    ];

    console.log(" Données utilisées pour le graphique :", data);

    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!canvas) {
      console.error("Impossible de créer le graphique : élément <canvas> introuvable !");
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

    const labels = ['Tous les candidats', 'Bacheliers généraux', 'Bacheliers technologiques', 'Bacheliers professionnels'];

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Taux d\'accès (%)',
            data: data,
            backgroundColor: ['#27ae60', '#16a085', '#f1c40f', '#e74c3c'],
            borderColor: ['#219150', '#128277', '#d4ac0d', '#c0392b'],
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: {
              font: { size: 12 },
              maxRotation: 0, // Texte horizontal
              minRotation: 0
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) { 
                return value + ' %'; 
              }
            }
          }
        }
      }
    });
  }
}