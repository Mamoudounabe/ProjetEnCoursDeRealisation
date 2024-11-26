import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orientation-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orientation-page.component.html',
  styleUrls: ['./orientation-page.component.css']
})
export class OrientationPageComponent {
  showSpecialities: boolean = false;

  toggleSpecialities() {
    this.showSpecialities = !this.showSpecialities;
  }
}
