import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-etablissements-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    HttpClientModule // Ajoutez HttpClientModule ici
  ],
  templateUrl: './etablissements-page.component.html',
  styleUrls: ['./etablissements-page.component.css']
})
export class EtablissementsPageComponent {

  constructor(private router: Router) {}

  navigateToRegion(region: string): void {
    this.router.navigate(['/etablissements/region', { region }]);
  }
}