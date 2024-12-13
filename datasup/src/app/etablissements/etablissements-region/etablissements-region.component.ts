import { Component } from '@angular/core';

@Component({
  selector: 'app-etablissements-region',
  standalone: true,
  imports: [],
  templateUrl: './etablissements-region.component.html',
  styleUrl: './etablissements-region.component.css'
})
export class EtablissementsRegionComponent {
  etablissementsRegionUrl = '/api/etablissements/region'; 

}
