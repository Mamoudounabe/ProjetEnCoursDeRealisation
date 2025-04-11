import { Component, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
    selector: 'app-header', 
    standalone:true,
    imports: [
        RouterLink,
        CommonModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isMenuOpen = false;

  constructor(private router: Router) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  navigateToFormationspage(): void {
    this.router.navigate(['/formations']);
  }

  @HostListener('document:click', ['$event'])
  closeMenuOutsideClick(event: Event) {
    const menu = document.querySelector('.menu-container');
    const button = document.querySelector('button[mat-icon-button]');
    if (this.isMenuOpen && menu && !menu.contains(event.target as Node) && !button?.contains(event.target as Node)) {
      this.isMenuOpen = false;
    }
  }
}
