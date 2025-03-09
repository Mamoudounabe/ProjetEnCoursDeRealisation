import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService} from '../../core/services/api.service';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { MatPaginatorModule,PageEvent } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';





@Component({
  selector: 'app-filieres-page',
  standalone: true,
  imports: [ FormsModule,
    FormsModule,
    MatPaginatorModule,
    MatSliderModule,
    MatProgressSpinnerModule,
    CommonModule
  ],
  templateUrl: './filieres-page.component.html',
  styleUrl: './filieres-page.component.css'
})
export class FilieresPageComponent {


  isloading: boolean = true;
  rangeValues: number [] = [0,100];
  page: number =1;
  pageSize: number=100;
  formations: any[] = [];
  totalPages : number = 0;
  totalItems: number =0;

  searchQuery: string = '';  // Variable pour stocker la recherche

constructor(private apiService: ApiService, private cdr: ChangeDetectorRef, private router: Router) {}


ngOnInit(){
  this.chargementFilieres();
}



chargementFilieres(){
  this.isloading = true;
  this.apiService.getFiliereEtablissements(this.page, this.pageSize).subscribe({

   next:(response) => {
       console.log("Données recus :" , response);
       this.formations= response.items;
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


  filterFormations() {
    console.log("Recherche en cours :", this.searchQuery);






    }





    
  
  
}
