import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { config } from '../../../environments/config';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-formation-detail',
  standalone: true,
  templateUrl: './formation-detail.component.html',
  styleUrls: ['./formation-detail.component.css'],
  imports: [CommonModule, NgChartsModule, FormsModule],
})
export class FormationDetailComponent implements OnInit {
  etablissementID!: number;
  etablissementData: any;

  sessionAnnee: string = '2024'; // 🔧 utilisée dans le HTML
  activeTab: string = 'tauxAcces';
  afficherEvolution = false;

  tauxAcces: number = 0;
  totalCandidats: number = 0;
  rangDernierAppelee: number = 0;

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

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.etablissementID = Number(this.route.snapshot.paramMap.get('id'));
    if (this.etablissementID) {
      this.getEtablissementData('2021');
      this.loadMultiYearData();
    }
  }

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
  }

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
}
