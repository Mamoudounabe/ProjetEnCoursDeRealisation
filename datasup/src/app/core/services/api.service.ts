import { Injectable } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { config } from '../../../environments/config';

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

  // Méthode pour obtenir des données depuis l'API
  getData(endpoint: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${endpoint}`);
  }

  // Méthode pour envoyer des données à l'API
  postData(endpoint: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${endpoint}`, data);
  }





  // Méthode pour obtenir les établissements par région
  getEtablissementsByRegion(region: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/etablissements/region`,
      {
      params: { region_name: region }
    });
  }




}









