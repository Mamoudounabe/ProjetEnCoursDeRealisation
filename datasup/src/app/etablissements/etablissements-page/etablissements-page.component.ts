import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-etablissements-page',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './etablissements-page.component.html',
  styleUrl: './etablissements-page.component.css'
})
export class EtablissementsPageComponent {
}
