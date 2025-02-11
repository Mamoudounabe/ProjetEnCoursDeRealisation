import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-apropos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './apropos.component.html',
  styleUrl: './apropos.component.css'
})
export class AproposComponent {



  events = [
    { title: 'Naissance', date: 'Septembre 2024', description: 'Première exploration des sources de données open data du Ministère de l\'Enseignement Supérieur et de la Recherche (MESR)...', completed: true },
    { title: 'Alpha-test privé', date: 'Avril 2023', description: 'Premiers tests sur une dizaine d\'utilisateurs (étudiants, économistes, data-scientists).', completed: true },
    { title: 'Beta-test public', date: 'Septembre 2023', description: 'Premier déploiement public, pour intégrer les retours d\'utilisateurs plus variés...', completed: true },
    { title: 'Lancement de la première version', date: '', description: '', completed: false }
  ];

}
