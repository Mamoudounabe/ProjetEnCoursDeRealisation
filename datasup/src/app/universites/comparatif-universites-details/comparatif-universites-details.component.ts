import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-comparatif-universites-details',
  standalone: true,
  imports: [], // Ajoutez ici les modules Angular nécessaires
  templateUrl: './comparatif-universites-details.component.html',
  styleUrls: ['./comparatif-universites-details.component.css']
})
export class ComparatifUniversitesDetailsComponent implements OnInit {
  universitesIDs: number[] = []; // Liste des IDs des universités sélectionnées

  constructor(private route: ActivatedRoute) {}





  ngOnInit(): void {
    console.log('🚀 Composant ComparatifUniversitesDetailsComponent initialisé');

    // Vérification de la route snapshot
    console.log('Route snapshot:', this.route.snapshot);

    // Vérification des paramètres d'URL (paramMap)
    const idsParam = this.route.snapshot.paramMap.get('ids');
    console.log('Paramètre ids récupéré :', idsParam);

    if (idsParam) {
      this.universitesIDs = idsParam.split(',').map(id => Number(id));
      console.log('✅ IDs des universités sélectionnées :', this.universitesIDs);
    } else {
      console.error('❌ Aucun ID d\'universités trouvé dans l\'URL.');
    }

    // Écoute des changements de paramètres si l'URL change dynamiquement
    this.route.paramMap.subscribe(params => {
      const newIdsParam = params.get('ids');
      console.log('♻️ Paramètre ids mis à jour :', newIdsParam);

      if (newIdsParam) {
        this.universitesIDs = newIdsParam.split(',').map(id => Number(id));
        console.log('🔄 IDs des universités mis à jour :', this.universitesIDs);
      } else {
        console.error('⚠️ Aucun ID trouvé après mise à jour.');
      }
    });

    // Vérification des queryParams (si utilisés)
    this.route.queryParams.subscribe(params => {
      console.log('🔍 Query Params:', params);
    });
  }
    


}
