import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { config } from '../../../environments/config';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-formation-detail',
  standalone: true,
  templateUrl: './formation-detail.component.html',
  styleUrls: ['./formation-detail.component.css'],
  imports: [CommonModule, NgChartsModule],
})
export class FormationDetailComponent implements OnInit {
  etablissementID!: number;
  etablissementData: any;

  activeTab: string = 'tauxAcces';

  tauxAcces: number = 0;
  totalCandidats: number = 0;
  rangDernierAppelee: number = 0;

  // Graphique : Taux d'accès
  public tauxChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Rang permettant une proposition', 'Rang ne permettant pas'],
    datasets: [
      {
        data: [],
        backgroundColor: ['#00a6b6', '#e57373'],
        label: 'Répartition des candidats (%)',
      },
    ],
  };
  public tauxChartOptions: ChartOptions<'bar'> = {
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

  // Graphique : Durée du processus de sélection
  public dureeChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['À l’ouverture', 'Avant bac', 'Fin principale', 'Terme'],
    datasets: [
      {
        label: 'Répartition (%)',
        data: [],
        backgroundColor: '#007bff',
      },
    ],
  };
  public dureeChartOptions: ChartOptions<'bar'> = {
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

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.etablissementID = Number(this.route.snapshot.paramMap.get('id'));
    this.getEtablissementData('2021');
  }

  getEtablissementData(anneeactuelle: string): void {
    const url = `${config.apiUrl}/Etablissement/Candidat/Bachelier/${this.etablissementID}?anneeactuelle=${anneeactuelle}`;

    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          const etab = data[0];
          this.etablissementData = etab;

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

  showTauxAcces() {
    this.activeTab = 'tauxAcces';
  }

  showDureeSelection() {
    this.activeTab = 'dureeSelection';
  }
}
