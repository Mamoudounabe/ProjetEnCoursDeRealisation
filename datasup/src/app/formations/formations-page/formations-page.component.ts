import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator'; // Importer PageEvent
import {FormControl} from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivatedRoute } from '@angular/router';


@Component({
    selector: 'app-formations-page',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatPaginatorModule,
        MatSliderModule
    ],
    templateUrl: './formations-page.component.html',
    styleUrls: ['./formations-page.component.css']
})
export class FormationsPageComponent implements OnInit {

    formations: any[] = [];
      filteredFormations: any[] = [];
      searchQuery: string = '';
      searchEtablissement: string = '';
      searchCommune: string = '';
      searchAcademie: string = '';
      searchFiliere: string = '';
      searchFiliereDetaillee: string = '';
      searchFiliereTresDetaillee: string = '';
      searchStatut: string = '';
      searchSelectivite: string = '';
      searchEffectif: string = '';
      page: number = 1;
      pageSize: number = 10;
      totalPages: number = 0; // Initialisation à 0
      totalItems: number = 0;
      isLoading: boolean = true;
      private timeoutId: any; // Identifier pour le setTimeout
      disableSelect = new FormControl(false);
      selectedEtablissements: any[] = [];
      /* filteredFormations: any[] = []; */
      pagesContainingResults: number[] = []; // Liste des pages contenant les résultats
     /*  query: string = ''; */
  
    
    constructor(private apiService: ApiService, private cdr: ChangeDetectorRef, private router: Router,private route: ActivatedRoute) {}
    
      ngOnInit() {
        this.fetchFormations(''); // Charge les formations
        this.page = 1;  // Initialisation si nécessaire
        this.pageSize = 8;
        
      }
      
      rangeValues: number[] = [0, 100];
    
     formatLabel(value: number): string {
        return value.toString();
      }
      
  
  
  
    fetchFormations(query: string = '') {
       this.isLoading = true;  // Affiche le spinner en début de chargement
        
       if (typeof query !== 'string') {
          query = '';
        }
  
  
        this.apiService.getFiliereEtablissements(query,this.page, this.pageSize).subscribe({
  
          next: (response) => {
            console.log("Données reçues :", response);
            this.formations = response.items || [];
            this.filteredFormations = this.formations|| 0;
            this.totalItems = response.total_items; // Mise à jour du nombre total d'éléments
            this.totalPages = Math.ceil(this.totalItems / this.pageSize); // Mise à jour du nombre total de pages
            console.log("Formations :", this.formations);
              
             this.isLoading = false;  // Arrête le spinner après que les données soient reçues
            },
            error: (error) => {
              console.error("Erreur API :", error);
              if (error.status === 200 && error.error instanceof SyntaxError) {
                console.error("La réponse de l'API n'est pas au format JSON attendu.");
              } else {
                console.error("Erreur lors de la récupération des données :", error.message);
              }
              this.isLoading = false;  // Arrête aussi le spinner en cas d'erreur
            }
          });
      }
       
       
    
  
  
  
  
      filterFormations() {
        const query = this.searchQuery.toLowerCase();
      
        // Filtrer toutes les formations
        console.log(query);
        console.table(this.formations);
        this.filteredFormations = this.formations.filter(formation => 
          (formation.filiere_formation?.toLowerCase().includes(query) ||
          formation.etablissement?.toLowerCase().includes(query) ||
          formation.commune_etablissement?.toLowerCase().includes(query)) &&
          formation.etablissement?.toLowerCase().includes(this.searchEtablissement.toLowerCase()) &&
          formation.commune_etablissement?.toLowerCase().includes(this.searchCommune.toLowerCase()) &&
          formation.academie_etablissement?.toLowerCase().includes(this.searchAcademie.toLowerCase()) &&
          formation.filiere_formation?.toLowerCase().includes(this.searchFiliere.toLowerCase()) &&
          formation.filiere_formation_detaillee?.toLowerCase().includes(this.searchFiliereDetaillee.toLowerCase()) &&
          formation.filiere_formation_tres_detaillee?.toLowerCase().includes(this.searchFiliereTresDetaillee.toLowerCase()) &&
          formation.statut_etablissement_filiere?.toLowerCase().includes(this.searchStatut.toLowerCase()) &&
          formation.selectivite?.toLowerCase().includes(this.searchSelectivite.toLowerCase()) &&
          formation.effectif_total_candidats_admis?.toString().includes(this.searchEffectif)
        );
      
        console.table(this.filteredFormations);
        // Mise à jour du nombre total d'éléments et de pages
        this.totalItems = this.filteredFormations.length;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      
        // Calculer les pages où il y a des résultats
        this.calculatePagesContainingResults();
      
        // Mise à jour de l'affichage de la page actuelle
  /*       this.updatePaginatedFormations(); */
      }
  
  
  
  
      calculatePagesContainingResults() {
        this.pagesContainingResults = [];
      
        for (let i = 0; i < this.totalPages; i++) {
          const startIndex = i * this.pageSize;
          const endIndex = startIndex + this.pageSize;
          const hasResults = this.filteredFormations.slice(startIndex, endIndex).length > 0;
      
          if (hasResults) {
            this.pagesContainingResults.push(i + 1); // Page 1, 2, 3, etc.
          }
        }
      }
      
      
  
  
  
          selectEtablissement(formation: any) {
            const index = this.selectedEtablissements.findIndex(e => e.id_etablissement === formation.id_etablissement);
            if (index === -1) {
              this.selectedEtablissements.push(formation);
            } else {
              this.selectedEtablissements.splice(index, 1);
            }
          }
          
          isEtablissementSelected(formation: any): boolean {
            return this.selectedEtablissements.some(e => e.id_etablissement === formation.id_etablissement);
          }
          
       
  
    
     onPageChange(event: PageEvent) {
        this.page = event.pageIndex + 1;
        this.pageSize = event.pageSize;
        this.fetchFormations();
      } 
  
  
   goToFormation(id: number) {
        if (id) {
          console.log(`Redirection vers la formation ${id}`);
          this.router.navigate(['/formations', id])
            .then(success => console.log("Navigation réussie"))
            .catch(err => console.error("Erreur de navigation :", err));
        } else {
          console.error('Formation ID is undefined or null');
        }
      }
      
  
  
  }
  
  
  
       /* fetchFormations() {
        this.isLoading = true;  
    
        this.apiService.getFiliereEtablissements(this.page, this.pageSize).subscribe({
          next: (response) => {
            console.log("Données reçues :", response);
            this.formations = response.items;
            this.filteredFormations = this.formations;
            this.totalItems = response.total_items; 
            this.totalPages = Math.ceil(this.totalItems / this.pageSize); 
            console.log("Formations :", this.formations);
            
            this.isLoading = false;  
          },
          error: (error) => {
            console.error("Erreur API :", error);
            if (error.status === 200 && error.error instanceof SyntaxError) {
              console.error("La réponse de l'API n'est pas au format JSON attendu.");
            } else {
              console.error("Erreur lors de la récupération des données :", error.message);
            }
            this.isLoading = false;  
          }
        });
      } */
    
  
  /* 
        onPageChange(event: PageEvent) {
          this.page = event.pageIndex + 1;
          this.pageSize = event.pageSize;
          this.updatePaginatedFormations(); // Met à jour l'affichage après changement de page
        }
        
        updatePaginatedFormations() {
          const startIndex = (this.page - 1) * this.pageSize;
          const endIndex = startIndex + this.pageSize;
        
          this.filteredFormations = this.filteredFormations.slice(startIndex, endIndex);
        }
        
   */
  
  
  
  
