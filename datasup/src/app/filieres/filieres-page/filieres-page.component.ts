import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService} from '../../core/services/api.service';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { MatPaginatorModule,PageEvent } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {MatProgressBarModule} from '@angular/material/progress-bar';






@Component({
    selector: 'app-filieres-page',
    imports: [FormsModule,
        FormsModule,
        MatPaginatorModule,
        MatSliderModule,
        MatProgressSpinnerModule,
        CommonModule,
        MatProgressBarModule
    ],
    templateUrl: './filieres-page.component.html',
    styleUrl: './filieres-page.component.css'
})
export class FilieresPageComponent {


  isloading: boolean = true;
  rangeValues: number [] = [0,100];
  page: number =1;
  pageSize: number=10;
  formations: any[] = [];
  totalPages : number = 0;
  totalItems: number =0;

  filtrerFilieres: any[] = [];

  searchQuery: string = '';  // Variable pour stocker la recherche
   // Variables pour les champs de recherche
   rechercherFiliere: string = '';
   rechercherFiliereDetaillee: string = '';
   rechercherNombreCandidats: string = '';
   rechercherNombreAdmis: string = '';
 

constructor(private apiService: ApiService, private cdr: ChangeDetectorRef, private router: Router) {}


ngOnInit(){
  this.chargementFilieres();
}

/* 

chargementFilieres(){
  this.isloading = true;
  this.apiService.getFiliereEtablissements(this.page, this.pageSize).subscribe({

   next:(response) => {
       console.log("Données recus :" , response);
       this.formations= response.items;
       this.filtrerFilieres = this.formations;
       this.totalItems = response.total_items;  
       this.totalPages = Math.ceil(this.totalItems/this.pageSize);
       console.log("Formations :",this.formations);
       this.isloading = false;
     } ,

   error:(error) =>{
    console.error("Erreur API : ", error);
    if(error.status === 200 && error.error instanceof SyntaxError)
    {
      console.error("La réponse de l'API n'est pas au format JSON attendu.");
    }
    else {
      console.error("Erreur lors de la récupération des données :", error.message);
    }
     this.isloading = false;
   }
   

  }

  );
}
 */




chargementFilieres(query: string = '') {
  this.isloading = true;  // Affiche le spinner en début de chargement

  // Assurez-vous que `query` est une chaîne
  if (typeof query !== 'string') {
    query = '';
  }

  // Envoyer les paramètres en tant qu'entiers, sans conversion en chaîne
  this.apiService.getFiliereEtablissements(query, this.page, this.pageSize).subscribe({
    next: (response) => {
      console.log("Données reçues :", response);
      this.formations = response.items || [];
      this.filtrerFilieres = [...this.formations]; // Initialisation correcte
      this.totalItems = response.total_items; // Mise à jour du nombre total d'éléments
      this.totalPages = Math.ceil(this.totalItems / this.pageSize); // Mise à jour du nombre total de pages
      console.log("Formations :", this.formations);
      this.isloading = false;  // Arrête le spinner après que les données soient reçues
    },
    error: (error) => {
      console.error("Erreur API :", error);
      if (error.status === 200 && error.error instanceof SyntaxError) {
        console.error("La réponse de l'API n'est pas au format JSON attendu.");
      } else {
        console.error("Erreur lors de la récupération des données :", error.message);
      }
      this.isloading = false;  // Arrête aussi le spinner en cas d'erreur
    }
  });
}


    filtrerFormations() {
      this.filtrerFilieres = this.formations.filter(formation =>
        formation.filiere_formation?.toLowerCase().includes(this.rechercherFiliere.toLowerCase()) &&
        formation.filiere_formation_detaillee?.toLowerCase().includes(this.rechercherFiliereDetaillee.toLowerCase()) &&
        formation.effectif_total_candidats_formation?.toString().includes(this.rechercherNombreCandidats) &&
        formation.effectif_total_candidats_admis?.toString().includes(this.rechercherNombreAdmis)
      );
    }
  

    
  goToFilieres(id : number) {
    if(id){
      console.log('Redirection vers la fonction ${id}');
      this.router.navigate(['filieres/',id])
      .then(success => console.log("Navigation réussie"))
      .catch(err => console.error("Erreur de navigation :", err));
    }
    else {
      console.error('Formation ID is undefined or null');
    }
  }

    onPageChange(event: PageEvent) {
      this.page = event.pageIndex + 1;
      this.pageSize = event.pageSize;
      this.chargementFilieres();
    }
  
}
