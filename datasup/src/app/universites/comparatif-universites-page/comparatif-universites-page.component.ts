import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-comparatif-universites-page',
  imports: [CommonModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatSliderModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatCheckboxModule,
    MatButtonToggleModule ],
  templateUrl: './comparatif-universites-page.component.html',
  styleUrls: ['./comparatif-universites-page.component.css']
})
export class ComparatifUniversitesPageComponent  implements OnInit{

 // Liste des universités
 universites: any[] = [
  { id: 1, nom: 'Aix Marseille Université', region: 'Provence-Alpes-Côte d\'Azur' },
  { id: 2, nom: 'Université Angers', region: 'Pays de la Loire' },
  { id: 3, nom: 'Université de Bourgogne', region: 'Bourgogne-Franche-Comté' },
  { id: 4, nom: 'Université de Bretagne Occidentale', region: 'Bretagne' },
  { id: 5, nom: 'Université de Caen Normandie', region: 'Normandie' },
  { id: 11, nom: 'Université de Lille', region: 'Hauts-de-France' },
  { id: 6, nom: 'Université de Cergy-Pontoise', region: 'Île-de-France' },
  { id: 7, nom: 'Université Clermont Auvergne', region: 'Auvergne-Rhône-Alpes' },
  { id: 8, nom: 'Université de Corte', region: 'Corse' },
  { id: 9, nom: 'Université de Franche-Comté', region: 'Bourgogne-Franche-Comté' },
  { id: 10, nom: 'Université Grenoble Alpes', region: 'Auvergne-Rhône-Alpes' },
 

  { id: 12, nom: 'Université de Limoges', region: 'Nouvelle-Aquitaine' },
  { id: 13, nom: 'Université de Lorraine', region: 'Grand Est' },
  { id: 14, nom: 'Université de Montpellier', region: 'Occitanie' },
  { id: 15, nom: 'Université de Nantes', region: 'Pays de la Loire' },
  { id: 16, nom: 'Université de Nice Sophia Antipolis', region: 'Provence-Alpes-Côte d\'Azur' },
  { id: 17, nom: 'Université de Nîmes', region: 'Occitanie' },
  { id: 18, nom: 'Université de Orléans', region: 'Centre-Val de Loire' },
  { id: 19, nom: 'Université de Paris', region: 'Île-de-France' },
  { id: 20, nom: 'Université de Pau et des Pays de l\'Adour', region: 'Nouvelle-Aquitaine' },
  { id: 21, nom: 'Université de Perpignan Via Domitia', region: 'Occitanie' },
  { id: 22, nom: 'Université de Poitiers', region: 'Nouvelle-Aquitaine' },
  { id: 23, nom: 'Université de Reims Champagne-Ardenne', region: 'Grand Est' },
  { id: 24, nom: 'Université de Rennes 1', region: 'Bretagne' },
  { id: 25, nom: 'Université de Rouen Normandie', region: 'Normandie' },
  { id: 26, nom: 'Université de Savoie Mont Blanc', region: 'Auvergne-Rhône-Alpes' },
  { id: 27, nom: 'Université de Strasbourg', region: 'Grand Est' },
  { id: 28, nom: 'Université de Toulon', region: 'Provence-Alpes-Côte d\'Azur' },
  { id: 29, nom: 'Université de Toulouse Jean Jaurès', region: 'Occitanie' },
  { id: 30, nom: 'Université de Tours', region: 'Centre-Val de Loire' },
  { id: 31, nom: 'Université de Versailles Saint-Quentin-en-Yvelines', region: 'Île-de-France' },
  { id: 32, nom: 'Université Gustave Eiffel', region: 'Île-de-France' },
  { id: 33, nom: 'Université Jean Monnet Saint-Étienne', region: 'Auvergne-Rhône-Alpes' },
  { id: 34, nom: 'Université Le Havre Normandie', region: 'Normandie' },
  { id: 35, nom: 'Université Lumière Lyon 2', region: 'Auvergne-Rhône-Alpes' },
  { id: 36, nom: 'Université Panthéon-Assas', region: 'Île-de-France' },
  { id: 37, nom: 'Université Panthéon-Sorbonne', region: 'Île-de-France' },
  { id: 38, nom: 'Université Paris 13', region: 'Île-de-France' },
  { id: 39, nom: 'Université Paris 8 Vincennes-Saint-Denis', region: 'Île-de-France' },
  { id: 40, nom: 'Université Paris-Dauphine', region: 'Île-de-France' },
  { id: 41, nom: 'Université Paris-Est Créteil', region: 'Île-de-France' },
  { id: 42, nom: 'Université Paris-Est Marne-la-Vallée', region: 'Île-de-France' },
  { id: 43, nom: 'Université Paris-Nanterre', region: 'Île-de-France' },
  { id: 44, nom: 'Université Paris-Saclay', region: 'Île-de-France' },
  { id: 45, nom: 'Université Paris Sciences et Lettres', region: 'Île-de-France' },
  { id: 46, nom: 'Université Polytechnique Hauts-de-France', region: 'Hauts-de-France' },
  { id: 47, nom: 'Université Sorbonne Nouvelle', region: 'Île-de-France' },
  { id: 48, nom: 'Université Toulouse 1 Capitole', region: 'Occitanie' },
  { id: 49, nom: 'Université Toulouse 3 Paul Sabatier', region: 'Occitanie' },
  { id: 50, nom: 'Université de Valenciennes', region: 'Hauts-de-France' },
  { id: 51, nom: 'Université de La Réunion', region: 'La Réunion' },
  { id: 52, nom: 'Université des Antilles', region: 'Guadeloupe et Martinique' },
  { id: 53, nom: 'Université de Guyane', region: 'Guyane' },
  { id: 54, nom: 'Université de Polynésie Française', region: 'Polynésie Française' },
  { id: 55, nom: 'Université de Nouvelle-Calédonie', region: 'Nouvelle-Calédonie' },
  { id: 56, nom: 'Université de Lille 2', region: 'Hauts-de-France' },
  { id: 57, nom: 'Université de Lille 3', region: 'Hauts-de-France' },
  { id: 58, nom: 'Université de Lorraine 2', region: 'Grand Est' },
  { id: 59, nom: 'Université de Montpellier 2', region: 'Occitanie' },
  { id: 60, nom: 'Université de Nantes 2', region: 'Pays de la Loire' },
  { id: 61, nom: 'Université de Nice 2', region: 'Provence-Alpes-Côte d\'Azur' },
  { id: 62, nom: 'Université de Paris 2', region: 'Île-de-France' },
  { id: 63, nom: 'Université de Rennes 2', region: 'Bretagne' },
  { id: 64, nom: 'Université de Rouen 2', region: 'Normandie' },
  { id: 65, nom: 'Université de Strasbourg 2', region: 'Grand Est' },
  { id: 66, nom: 'Université de Toulouse 2', region: 'Occitanie' },
  { id: 67, nom: 'Université de Versailles 2', region: 'Île-de-France' },
  { id: 67, nom: 'Université du Mans', region: '' }

  

];

filteredUniversites: any[] = [];
paginatedUniversites: any[] = [];
searchEtablissement: string = '';
page: number = 1;
pageSize: number = 10;
totalPages: number = 0;
totalItems: number = 0;
isLoading: boolean = true;

selectedUniversites: any[] = [];
isAllSelected: boolean = false;

// Contrôle de l'état de la sélection
disableSelect = new FormControl(false);

searchQuery: string = ''; // Ajout de la propriété searchQuery
searchUniversite: string = ''; // Ajout de la propriété searchUniversite
pagesContainingResults: number[] = []; // Ajout de la propriété pagesContainingResults

constructor(private apiService: ApiService, private cdr: ChangeDetectorRef, private router: Router, private route: ActivatedRoute) {}

ngOnInit() {
  this.filteredUniversites = [...this.universites];  // Initialisation avec toutes les universités
  this.updatePagination(); // Mettre à jour la pagination
}

// Fonction de filtrage des universités
filterUniversites() {
  const query = this.searchQuery.toLowerCase().trim();
  const searchRegion = this.searchUniversite.toLowerCase().trim();

  this.filteredUniversites = this.universites.filter(universite => {
    const matchesNom = universite.nom.toLowerCase().includes(query);
    const matchesRegion = universite.region.toLowerCase().includes(searchRegion);
    return matchesNom && matchesRegion;
  });

  this.totalItems = this.filteredUniversites.length;
  this.totalPages = Math.ceil(this.totalItems / this.pageSize);
  this.page = 1; // Réinitialiser à la première page après un filtrage
  this.updatePagination();
}

// Fonction pour mettre à jour la pagination
updatePagination() {
  const startIndex = (this.page - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.paginatedUniversites = this.filteredUniversites.slice(startIndex, endIndex);
}

// Fonction pour la pagination
onPageChange(event: PageEvent) {
  this.page = event.pageIndex + 1;
  this.pageSize = event.pageSize;
  this.updatePagination();
}

// Fonction pour sélectionner toutes les universités visibles
selectAllUniversites() {
  this.filteredUniversites.forEach(universite => {
    this.isAllSelected = !this.isAllSelected;
    this.selectUniversite(universite);
  });
}

// Fonction pour sélectionner/désélectionner une université
selectUniversite(universite: any) {
  const index = this.selectedUniversites.findIndex(u => u.id === universite.id);
  if (index === -1) {
    this.selectedUniversites.push(universite);
  } else {
    this.selectedUniversites.splice(index, 1);
  }
}

// Fonction pour vérifier si une université est sélectionnée
isUniversiteSelected(universite: any): boolean {
  return this.selectedUniversites.some(u => u.id === universite.id);
}



// Fonction pour calculer le nombre total de mots dans les champs textuels (utile pour l'optimisation)
calculateTotalWords(formations: any[]): number {
  let totalWords = 0;
  formations.forEach(item => {
    Object.values(item).forEach(value => {
      if (typeof value === 'string') {
        totalWords += value.split(/\s+/).length; // Compte les mots en séparant par les espaces
      }
    });
  });
  return totalWords;
}

// Fonction pour formater les valeurs de l'intervalle de la plage
formatLabel(value: number): string {
  return value.toString();
}




goToUniversiteComp(): void {
  if (this.selectedUniversites.length >= 2) {
    // Récupère les noms des universités sélectionnées
    const noms = this.selectedUniversites.map(u => u.nom).join(','); 

    // Vérifie si les noms sont corrects avant de naviguer
    console.log('✅ Noms sélectionnés :', noms);

    // Navigation vers la page avec les noms dans l'URL
    this.router.navigate(['/universites/comparaison', noms]);

    // Affiche également les noms dans la console
    console.log('✅ Navigation vers la page de comparaison avec les noms :', noms);
  } else {
    alert('Veuillez sélectionner au moins 2 universités à comparer.');
  }
}



    
    
    
    

}



