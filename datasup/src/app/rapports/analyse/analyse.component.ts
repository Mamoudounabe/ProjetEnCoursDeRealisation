import { Component } from '@angular/core';

@Component({
    selector: 'app-analyse',
    standalone: true,
    imports: [],
    templateUrl: './analyse.component.html',
    styleUrls: ['./analyse.component.css'],
    
})
export class AnalyseComponent {
  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
