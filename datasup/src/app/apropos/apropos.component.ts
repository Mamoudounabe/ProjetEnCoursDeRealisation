import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-apropos',
  standalone: true,          // Using standalone components if you're on Angular 14+
  imports: [CommonModule],
  templateUrl: './apropos.component.html',
  styleUrls: ['./apropos.component.css'] // <-- Note the plural: styleUrls
})
export class AproposComponent {
  events = [
    {
      title: 'Naissance',
      date: 'Septembre 2024',
      description: 'Première exploration des sources de données open data du Ministère ...',
      completed: true
    },
    {
      title: 'Alpha-test privé',
      date: 'Avril 2023',
      description: 'Premiers tests sur une dizaine d\'utilisateurs (étudiants, économistes, ...)',
      completed: true
    },
    {
      title: 'Beta-test public',
      date: 'Septembre 2023',
      description: 'Premier déploiement public, pour intégrer les retours d\'utilisateurs ...',
      completed: true
    },
    {
      title: 'Lancement de la première version',
      date: '',
      description: '',
      completed: false
    }
  ];
}
