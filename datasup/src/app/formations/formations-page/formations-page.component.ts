import { Component, OnInit ,OnDestroy  ,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-formations-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatProgressSpinnerModule
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

  totalPages: number = 50000;


  isLoading: boolean = true;
  private timeoutId: any; // Identifier pour le setTimeout


  constructor(private apiService: ApiService , private cdr: ChangeDetectorRef) {}

 ngOnInit() {
    this.fetchFormations();
  } 



  
  fetchFormations() {
    this.isLoading = true;  // Affiche le spinner en début de chargement
  
    this.apiService.getFiliereEtablissements(this.page, this.pageSize).subscribe({
      next: (response) => {
        console.log("Données reçues :", response);
        this.formations = response.items;
        this.filteredFormations = this.formations;
        console.log("Formations :", this.formations);
        
        this.isLoading = false;  // Arrête le spinner après que les données soient reçues
      },
      error: (error) => {
        console.error("Erreur API :", error);
        this.isLoading = false;  // Arrête aussi le spinner en cas d'erreur
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
