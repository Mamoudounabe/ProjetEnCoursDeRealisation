import { Component, OnInit } from '@angular/core';
import { Formation } from '../../core/models/formation.model';
import { FormationService } from '../../core/services/formations.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-formation-detail',
  standalone: true,
  imports: [
    RouterLink,
    NgIf
  ]
,
  templateUrl: './formation-detail.component.html',
  styleUrls: ['./formation-detail.component.css']
})
export class FormationDetailComponent implements OnInit {
 

    formation!: Formation;
  
    constructor(private formationService: FormationService, private route: ActivatedRoute) {
    }
  
    ngOnInit(): void {
      const formationID = this.route.snapshot.params['id'];
      this.formation = this.formationService.getFormationByID(formationID);
    }
  
}