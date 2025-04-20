import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgChartsModule, NgChartsConfiguration } from 'ng2-charts';
import { ChartData, ChartOptions, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ApiService } from '../../core/services/api.service';
import { RouterModule } from '@angular/router';
import { Chart } from 'chart.js';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table'; 

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';


Chart.register(...registerables, ChartDataLabels);

@Component({
    selector: 'app-filieres-details',
    standalone: true,
    imports: [
        RouterModule,
        MatButtonModule,
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
        CommonModule,
        MatSidenavModule
    ],
    templateUrl: './filieres-details.component.html',
    styleUrl: './filieres-details.component.css'
})
export class FilieresDetailsComponent implements OnInit {
  filiereID!: number;
  anneeactuelle!: string;
  filieres: any[] = [];
  selectedOption: string = 'mention_bien';
  selectedFiliere: any = null;

  nombreCandidats: number | null = null;
  nombreAdmis: number | null = null;
  tauxAdmission: number | null = null;
  nombreBoursiers: number | null = null;
  sexeFemmes: number | null = null;
  sexeHommes: number | null = null;

  effectifBacGeneral: number | null = null;
  effectifBacTechno: number | null = null;
  effectifBacPro: number | null = null;

  totalCandidats: number = 10000;
  neoBacheliers: number = 5000;
  baisseTotale: number = 10;
  baisseNeoBacheliers: number = 8;

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Répartition des spécialités',
      backgroundColor: ['#17A2B8', '#FF5252', '#40C4FF', '#00E676', '#29B6F6', '#FF5722'],
    }]
  };

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

  public barChartTypee: 'bar' = 'bar';

  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    const filiereIdParam = this.route.snapshot.paramMap.get("id");
    const anneeParam = this.route.snapshot.queryParamMap.get("annee");

    this.filiereID = filiereIdParam && !isNaN(Number(filiereIdParam)) ? Number(filiereIdParam) : 0;
    this.anneeactuelle = anneeParam ? anneeParam : "2021";

    if (!this.filiereID || !this.anneeactuelle) {
      console.error("Paramètres manquants !");
      return;
    }

    this.chargementdata();
  }

  chargementdata() {
    this.apiService.getFilieresByDetails(this.filiereID, this.anneeactuelle).subscribe({
      next: (response) => {
        this.filieres = response;
      },
      error: (error) => {
        console.error("Erreur lors du chargement :", error);
      }
    });
  }

  onSelectFiliere(filiere: any): void {
    this.selectedFiliere = filiere;

    // Admissions
    this.nombreCandidats = Number(filiere["toInteger(a.effectif_total_candidats_admis)"]) || null;
    this.nombreAdmis = Number(filiere["toInteger(a.nombre_admis)"]) || null;
    this.tauxAdmission = (this.nombreAdmis && this.nombreCandidats)
      ? (this.nombreAdmis / this.nombreCandidats) * 100
      : null;

    // Bourse
    this.nombreBoursiers = Number(filiere["toInteger(a.effectif_boursiers_admis)"]) || null;

    // Sexe
    const total = Number(filiere["toInteger(a.effectif_generaux_admis)"]) || null;
    this.sexeFemmes = Number(filiere["toInteger(a.effectif_candidates_admises)"]) || null;
    this.sexeHommes = (total && this.sexeFemmes !== null) ? total - this.sexeFemmes : null;

    // Type de bac
    this.effectifBacGeneral = Number(filiere["toInteger(a.effectif_generaux_admis)"]) || null;
    this.effectifBacTechno = Number(filiere["toInteger(a.effectif_technologiques_admis)"]) || null;
    this.effectifBacPro = Number(filiere["toInteger(a.effectif_professionnels_admis)"]) || null;

    // Graph spécialités
    this.barChartData.labels = ['Art', 'Bio', 'EPPCS', 'HGGSP', 'HLP', 'LLCER', 'LLCA', 'Maths', 'NSI', 'PC', 'SI', 'SVT', 'SES'];
    this.barChartData.datasets[0].data = [
      filiere.art || 0,
      filiere.bio || 0,
      filiere.eppcs || 0,
      filiere.hggsp || 0,
      filiere.hlp || 0,
      filiere.llcer || 0,
      filiere.llca || 0,
      filiere.maths || 0,
      filiere.nsi || 0,
      filiere.pc || 0,
      filiere.si || 0,
      filiere.svt || 0,
      filiere.ses || 0,
    ];

    this.barChartData = { ...this.barChartData }; // force update
  }
}
