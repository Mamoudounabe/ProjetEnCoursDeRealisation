import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Formation } from '../../core/models/formation.model';
import { FormationService } from '../../core/services/formations.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { Chart, registerables, ChartOptions } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { config } from '../../../environments/config';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

Chart.register(...registerables, ChartDataLabels);

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
    ReactiveFormsModule
  ],
  templateUrl: './formation-detail.component.html',
  styleUrls: ['./formation-detail.component.css']
})
export class FormationDetailComponent implements OnInit {
  private apiUrl = config.apiUrl; // Utilise l'URL de l'API depuis le fichier de configuration
  etablissementID!: number;
  etablissementData: any;
  chart: any;
  selectedYear = new FormControl('2021'); // Initialisation de l'année sélectionnée

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

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
              setTimeout(() => this.createChart(), 0);
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

    console.log("📊 Données utilisées pour le graphique :", data);

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