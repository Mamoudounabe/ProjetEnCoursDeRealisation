import { Component } from '@angular/core';

import { Chart } from 'chart.js/auto';
import { SessionService } from '../../core/services/session.service';
import { NgFor, NgIf } from '@angular/common';

interface SessionData {
  filiere: string;
  candidatures: number;
  admissionRate: number;
}

@Component({
  selector: 'app-statistique-annee',
  standalone: true,
  imports: [
    NgFor,
    NgIf
  ],
  templateUrl: './statistique-annee.component.html',
  styleUrls: ['./statistique-annee.component.css'], // Corrigé : 'styleUrl' -> 'styleUrls'
})
export class StatistiqueAnneeComponent {
  sessionData: SessionData[] = []; // Définition d'un tableau typé
  sessionChart: any; // Instance du graphique
  selectedYear: string = ''; // Année sélectionnée
  selectedChartType: string = 'bar'; // Type de graphique sélectionné

  constructor(private sessionService: SessionService) {}

  // Méthode pour charger les données d'une session
  showSessionData(session: string): void {
    this.selectedYear = session;

    this.sessionService.getSessionData(session).subscribe({
      next: (data: SessionData[]) => { // Définition du type pour 'data'
        this.sessionData = data; // Charger les données dans le tableau
        this.createChart(data); // Mettre à jour le graphique
      },
      error: (err: any) => console.error('Erreur lors de la récupération des données :', err), // Typage de 'err'
    });
  }

  // Méthode pour créer ou mettre à jour le graphique
  createChart(data: SessionData[]): void {
    const labels = data.map((item) => item.filiere);
    const candidatures = data.map((item) => item.candidatures);
    const admissionRates = data.map((item) => item.admissionRate);

    if (this.sessionChart) {
      this.sessionChart.destroy(); // Détruire l'ancien graphique
    }

    const ctx = document.getElementById('sessionChart') as HTMLCanvasElement;

    switch (this.selectedChartType) {
      case 'pie':
        this.createPieChart(ctx, labels, candidatures, admissionRates);
        break;
      case 'line':
        this.createLineChart(ctx, labels, candidatures, admissionRates);
        break;
      case 'radar':
        this.createRadarChart(ctx, labels, candidatures, admissionRates);
        break;
      default:
        this.createBarChart(ctx, labels, candidatures, admissionRates);
        break;
    }
  }

  // Méthode pour créer un graphique en barres
  createBarChart(ctx: HTMLCanvasElement, labels: string[], candidatures: number[], admissionRates: number[]): void {
    this.sessionChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Candidatures',
            data: candidatures,
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 0.5,
          },
          {
            label: 'Taux d\'admission (%)',
            data: admissionRates,
            backgroundColor: 'rgba(153, 102, 255, 0.5)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  // Méthode pour créer un graphique circulaire
  createPieChart(ctx: HTMLCanvasElement, labels: string[], candidatures: number[], admissionRates: number[]): void {
    this.sessionChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Candidatures',
            data: candidatures,
            backgroundColor: [
              'rgba(75, 192, 192, 0.5)',
              'rgba(153, 102, 255, 0.5)',
              'rgba(255, 159, 64, 0.5)',
              'rgba(255, 99, 132, 0.5)',
              'rgba(54, 162, 235, 0.5)',
            ],
            borderColor: [
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    });
  }

  // Méthode pour créer un graphique en ligne
  createLineChart(ctx: HTMLCanvasElement, labels: string[], candidatures: number[], admissionRates: number[]): void {
    this.sessionChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Candidatures',
            data: candidatures,
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: false,
          },
          {
            label: 'Taux d\'admission (%)',
            data: admissionRates,
            backgroundColor: 'rgba(153, 102, 255, 0.5)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  // Méthode pour créer un graphique en radar
  createRadarChart(ctx: HTMLCanvasElement, labels: string[], candidatures: number[], admissionRates: number[]): void {
    this.sessionChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Candidatures',
            data: candidatures,
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
          {
            label: 'Taux d\'admission (%)',
            data: admissionRates,
            backgroundColor: 'rgba(153, 102, 255, 0.5)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          r: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  // Méthode pour changer le type de graphique
  changeChartType(chartType: string): void {
    this.selectedChartType = chartType;
    this.createChart(this.sessionData);
  }
}
