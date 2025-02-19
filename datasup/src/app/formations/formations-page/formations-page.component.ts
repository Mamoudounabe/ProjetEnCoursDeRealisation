import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-formations-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './formations-page.component.html',
  styleUrls: ['./formations-page.component.css']
})
export class FormationComponent implements OnInit {
  formations: any[] = [];
  filteredFormations: any[] = [];
  searchQuery: string = '';
  page: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.fetchFormations();
  }

  fetchFormations() {
    this.apiService.getFiliereEtablissements(this.page, this.pageSize).subscribe({
      next: (response) => {
        console.log("Données reçues :", response);
      },
      error: (error) => {
        console.error("Erreur API :", error);
      }
    });
  }
  
  

  filterFormations() {
    const query = this.searchQuery.toLowerCase();
    this.filteredFormations = this.formations.filter(formation => 
      formation.filiere_formation?.toLowerCase().includes(query) ||
      formation.etablissement?.toLowerCase().includes(query) ||
      formation.commune_etablissement?.toLowerCase().includes(query)
    );
  }

  goToFormation(id: number) {
    console.log(`Redirection vers la formation ${id}`);
    // Implémente une redirection si nécessaire
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.fetchFormations();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.fetchFormations();
    }
  }
}
