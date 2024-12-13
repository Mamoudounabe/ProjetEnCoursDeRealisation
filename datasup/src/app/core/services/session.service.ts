import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

interface SessionData {
  filiere: string;
  candidatures: number;
  admissionRate: number;
}

interface SessionYearData {
  [key: string]: SessionData[];
}

@Injectable({
  providedIn: 'root', // Rend le service accessible globalement
})
export class SessionService {
  constructor() {}

  // Données complètes et distinctes pour chaque session
  private sessionData: SessionYearData = {
    '2020': [
      { filiere: 'Informatique', candidatures: 12, admissionRate: 75 },
      { filiere: 'Mathématiques', candidatures: 80, admissionRate: 60 },
      { filiere: 'Physique', candidatures: 5, admissionRate: 50 },
      { filiere: 'Biologie', candidatures: 40, admissionRate: 45 },
      { filiere: 'Chimie', candidatures: 16, admissionRate: 35 },
    ],
    '2021': [
      { filiere: 'Informatique', candidatures: 120, admissionRate: 75 },
      { filiere: 'Mathématiques', candidatures: 80, admissionRate: 60 },
      { filiere: 'Physique', candidatures: 50, admissionRate: 50 },
      { filiere: 'Biologie', candidatures: 40, admissionRate: 45 },
      { filiere: 'Chimie', candidatures: 30, admissionRate: 35 },
    ],
    '2022': [
      { filiere: 'Informatique', candidatures: 150, admissionRate: 80 },
      { filiere: 'Mathématiques', candidatures: 90, admissionRate: 65 },
      { filiere: 'Physique', candidatures: 70, admissionRate: 55 },
      { filiere: 'Biologie', candidatures: 60, admissionRate: 50 },
      { filiere: 'Chimie', candidatures: 40, admissionRate: 40 },
    ],
    '2023': [
      { filiere: 'Informatique', candidatures: 200, admissionRate: 85 },
      { filiere: 'Mathématiques', candidatures: 120, admissionRate: 70 },
      { filiere: 'Physique', candidatures: 100, admissionRate: 60 },
      { filiere: 'Biologie', candidatures: 80, admissionRate: 55 },
      { filiere: 'Chimie', candidatures: 50, admissionRate: 45 },
    ],
    '2024': [
      { filiere: 'Informatique', candidatures: 250, admissionRate: 90 },
      { filiere: 'Mathématiques', candidatures: 140, admissionRate: 75 },
      { filiere: 'Physique', candidatures: 120, admissionRate: 65 },
      { filiere: 'Biologie', candidatures: 100, admissionRate: 60 },
      { filiere: 'Chimie', candidatures: 70, admissionRate: 50 },
    ],
  };

  /**
   * Méthode pour récupérer les données de la session en fonction de l'année
   * @param session Année de la session (ex. "2021", "2022", "2023", "2024")
   * @returns Observable contenant les données de session pour l'année spécifiée
   */
  getSessionData(session: string): Observable<SessionData[]> {
    const data = this.sessionData[session] || []; // Retourne les données ou un tableau vide si l'année n'existe pas
    return of(data); // Retourne les données sous forme d'Observable
  }
}
