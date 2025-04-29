import { Component, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';



import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';



@Component({
    selector: 'app-header', // Assure-toi d'utiliser Angular 15+
    standalone: true,
    imports: [
        RouterLink,
        CommonModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatSidenavModule,
        MatListModule,
        MatDividerModule

    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent {



  @ViewChild('sidenav') sidenav!: MatSidenav;
 




 /*  isMenuOpen = false; */

  constructor(private router: Router) {}

/*   toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
 */


  isMenuOpen = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      this.sidenav.open();
    } else {
      this.sidenav.close();
    }
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
