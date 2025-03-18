import { Injectable } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { config } from '../../../environments/config';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = config.apiUrl; // Utilisation de l'URL de l'API depuis le fichier de configuration
  constructor(private http: HttpClient) { }


// Récupérer les établissements avec pagination
 // Récupérer les établissements avec pagination
 getFiliereEtablissements(page: number = 1, pageSize: number = 8): Observable<any> {
  let params = new HttpParams()
    .set('page', page.toString())
    .set('page_size', pageSize.toString());

  // Log de l'URL pour vérifier si c'est correct
  console.log(`Request URL: ${this.apiUrl}/filiere/etablissement/admission?page=${page}&page_size=${pageSize}`);

  return this.http.get<any>(`${this.apiUrl}/filiere/etablissement/admission`, { params });
}





  // Méthode pour obtenir les établissements par région
  getEtablissementsByRegion(region: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/etablissements/region`,
      {
      params: { region_name: region }
    });
  }




  // statistique par filiere

 
  getFilieresByDetails(filiereID: number, anneeactuelle: string): Observable<any[]> {
    if (!filiereID || isNaN(filiereID)) {
      throw new Error('filiereID doit être un entier valide');
    }
    
    return this.http.get<any[]>(`${this.apiUrl}/filiere/Candidat/Bachelier/${filiereID}`, {
      params: { anneeactuelle: anneeactuelle }
    });
  }
  




// Fonction pour récupérer les établissements pour la comparaison




getEtablissementsByComp(etablissementIDs: number[], anneeactuelle: string): Observable<any[]> {
  if (!etablissementIDs || etablissementIDs.length < 2) {
    throw new Error('Vous devez sélectionner au moins deux établissements pour la comparaison.');
  }

  // Créer les paramètres de requête avec plusieurs occurrences de 'etablissementIDs'
  let params = new HttpParams()
    .set('anneeactuelle', anneeactuelle);

  etablissementIDs.forEach(id => {
    params = params.append('etablissementIDs', id.toString());
  });

  console.log('Requête envoyée avec les paramètres:', params.toString());

  // Exécuter la requête HTTP GET
  return this.http.get<any[]>(`${this.apiUrl}/etablissements/comparaison`, { params });
}






}