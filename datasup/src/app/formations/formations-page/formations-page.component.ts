import { Component, OnInit } from '@angular/core';
import { Formation } from '../../core/models/formation.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormationService } from '../../core/services/formations.service';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-formations-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],

  templateUrl: './formations-page.component.html',
  styleUrls: ['./formations-page.component.css']
})
export class FormationsPageComponent implements OnInit {
  formations: Formation[] = [];
  filteredFormations: Formation[] = [];
  searchQuery: string = '';

  constructor(private formationService: FormationService, private router: Router) { }

  ngOnInit(): void {
    this.loadFormations();
  }

  private loadFormations(): void {
    this.formationService.getAllFormations().subscribe((data: Formation[]) => {
      this.formations = data;
      this.filteredFormations = data;
    });
  }

  filterFormations(): void {
    if (!this.formations || this.formations.length === 0) {
      return;
    }

    const query = this.searchQuery.trim().toLowerCase();

    if (!query) {
      this.filteredFormations = [...this.formations];
      return;
    }

    this.filteredFormations = this.formations.filter(formation =>
      Object.values(formation).some(value =>
        value !== undefined && value !== null && value.toString().toLowerCase().includes(query)
      )
    );
  }

  navigateToFormation(id: string): void {
    this.router.navigate(['/formations', id]);
  }
}