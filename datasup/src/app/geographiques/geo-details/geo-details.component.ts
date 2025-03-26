import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
    selector: 'app-geo-details',
    standalone:true,
    imports: [],
    templateUrl: './geo-details.component.html',
    styleUrl: './geo-details.component.css'
})
export class GeoDetailsComponent {

    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
        const regionName = this.route.snapshot.paramMap.get('region');  
        console.log('Région sélectionnée:', regionName);
      }
}
