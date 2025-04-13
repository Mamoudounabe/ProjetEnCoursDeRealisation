import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIf, CommonModule } from '@angular/common';

import { Chart, registerables, ChartOptions, ChartData } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { NgChartsModule } from 'ng2-charts';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';

Chart.register(...registerables, ChartDataLabels);

@Component({
  selector: 'app-filieres-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatSidenavModule
  ],
  templateUrl: './filieres-details.component.html',
  styleUrl: './filieres-details.component.css'
})
export class FilieresDetailsComponent implements OnInit {
  public ChartDataLabels = ChartDataLabels;

  filiereID!: number;
  anneeactuelle!: string;
  filieres: any[] = [];
  selectedOption: string = 'mention_bien';

  totalCandidats: number = 10000;
  neoBacheliers: number = 5000;
  baisseTotale: number = 10;
  baisseNeoBacheliers: number = 8;
  year = 2006;

  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    const filiereIdParam = this.route.snapshot.paramMap.get("id");
    const anneeParam = this.route.snapshot.queryParamMap.get("annee");

    this.filiereID = filiereIdParam && !isNaN(Number(filiereIdParam)) ? Number(filiereIdParam) : 0;
    this.anneeactuelle = anneeParam ? anneeParam : "2021";

    if (!this.filiereID || !this.anneeactuelle) return;

    this.chargementdata();
  }

  chargementdata() {
    if (!this.filiereID || isNaN(this.filiereID) || !this.anneeactuelle) return;

    this.apiService.getFilieresByDetails(this.filiereID, this.anneeactuelle).subscribe({
      next: (response) => {
        this.filieres = response;

        // Mettre à jour ici si tu veux calculer le % admis plus tard
      },
      error: (err) => console.error("Erreur API :", err)
    });
  }

  // === GRAPHE - Mentions au bac ===
  public barChartMentionsData: ChartData<'bar'> = {
    labels: ['Sans mention', 'Passable', 'Assez bien', 'Bien', 'Très bien', 'Félicitations'],
    datasets: [
      {
        data: [10, 15, 25, 30, 15, 5],
        label: 'Répartition des mentions',
        backgroundColor: '#64b5f6',
        hoverBackgroundColor: '#1976d2'
      }
    ]
  };

  public barChartMentionsOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Mentions au bac',
        font: { size: 18 }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => `${value} %`
        }
      }
    }
  };

  // === GRAPHE - Répartition des types de bac (camembert) ===
  public barChartTypeBacData: ChartData<'pie'> = {
    labels: ['Général', 'Technologique', 'Professionnel'],
    datasets: [
      {
        label: 'Répartition des types de bac',
        data: [15.6, 43.5, 40.8],
        backgroundColor: ['#FFCA28', '#FB8C00', '#EC407A'],
        datalabels: {
          color: '#fff',
          font: {
            weight: 'bold',
            size: 14
          },
          formatter: (value: number) => `${value}%`
        }
      }
    ]
  };

  public barChartTypeBacOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right'
      },
      title: {
        display: true,
        text: 'Répartition des types de bac',
        font: { size: 18 }
      },
      datalabels: {}
    }
  };

  // === ✅ NOUVEAU : GRAPHE CAMEMBERT - Taux d’admission ===
  public barChartAdmissionData: ChartData<'bar'> = {
    labels: ['Admis', 'Non admis'],
    datasets: [
      {
        label: 'Taux d\'admission',
        data: [38.4, 61.6], // données simulées locales
        backgroundColor: ['#4CAF50', '#FF7043'],
        datalabels: {
          anchor: 'end',
          align: 'end',
          color: '#fff',
          font: {
            weight: 'bold',
            size: 14
          },
          formatter: (value: number) => `${value}%`
        }
      }
    ]
  };
  
  public barChartAdmissionOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`
        },
        title: {
          display: true,
          text: 'Pourcentage'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Taux d\'admission',
        font: { size: 18 }
      },
      datalabels: {}
    }
  };
  
 
}
