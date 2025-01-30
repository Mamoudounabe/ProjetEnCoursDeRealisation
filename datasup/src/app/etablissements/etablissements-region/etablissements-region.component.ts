import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-etablissements-region',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule // Ajoutez HttpClientModule ici
  ],
  templateUrl: './etablissements-region.component.html',
  styleUrls: ['./etablissements-region.component.css']
})
export class EtablissementsRegionComponent implements OnInit {
  etablissements: any[] = [];
  region: string = ''; // Initialisation avec une valeur par défaut

  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.region = params['region'];
      this.apiService.getEtablissementsByRegion(this.region).subscribe({
        next: (data: any[]) => this.etablissements = data,
        error: (err: any) => console.error('Erreur lors de la récupération des établissements :', err)
      });
    });
  }
}