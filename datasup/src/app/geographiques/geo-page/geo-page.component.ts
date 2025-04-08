 import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-geo-page',
    imports: [],
    templateUrl: './geo-page.component.html',
    styleUrl: './geo-page.component.css'
})
export class GeoPageComponent implements AfterViewInit{
  constructor(private router: Router) {}

  ngAfterViewInit() {
    const areas = document.querySelectorAll('area');
    areas.forEach(area => {
      area.addEventListener('click', (event) => {
        event.preventDefault(); // Empêche ouverture URL
        const regionName = area.getAttribute('href'); 
        if (regionName) {
          this.router.navigate(['/geo-details', regionName]);
        }
      });
    });
  }


  
}

 

