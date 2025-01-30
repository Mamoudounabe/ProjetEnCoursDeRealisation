import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { config } from '../../../environments/config';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = config.apiUrl; // Utilisation de l'URL de l'API depuis le fichier de configuration
  constructor(private http: HttpClient) { }

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