import { Component } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { SessionService } from '../../core/services/session.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importez FormsModule
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

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
    NgIf,
    FormsModule // Ajoutez FormsModule ici
  ],
  templateUrl: './statistique-annee.component.html',
  styleUrls: ['./statistique-annee.component.css']
})
export class StatistiqueAnneeComponent {
  sessionData: SessionData[] = [];
  sessionChart: any;
  selectedYear: string = '';
  selectedChartType: string = 'bar';

  constructor(private sessionService: SessionService) {}

  showSessionData(session: string): void {
    this.selectedYear = session;

    this.sessionService.getSessionData(session).subscribe({
      next: (data: SessionData[]) => {
        this.sessionData = data;
        this.createChart(data);
      },
      error: (err: any) => console.error('Erreur lors de la récupération des données :', err),
    });
  }

  createChart(data: SessionData[]): void {
    const labels = data.map((item) => item.filiere);
    const candidatures = data.map((item) => item.candidatures);
    const admissionRates = data.map((item) => item.admissionRate);

    if (this.sessionChart) {
      this.sessionChart.destroy();
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

  changeChartType(chartType: string): void {
    this.selectedChartType = chartType;
    this.createChart(this.sessionData);
  }

  downloadChart(): void {
    const canvas = document.getElementById('sessionChart') as HTMLCanvasElement;
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'chart.png';
    link.click();
  }

  downloadPdf(): void {
    const canvas = document.getElementById('sessionChart') as HTMLCanvasElement;
    html2canvas(canvas).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('chart.pdf');
    });
  }
}
