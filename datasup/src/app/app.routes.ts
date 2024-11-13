import { Routes } from '@angular/router';
import { EtablissementsPageComponent } from './etablissements/etablissements-page/etablissements-page.component';
import { FilieresPageComponent } from './filieres/filieres-page/filieres-page.component';
import { OrientationPageComponent } from './orientation/orientation-page/orientation-page.component';
import { RapportsPageComponent } from './rapports/rapports-page/rapports-page.component';
import { StatistiquesPageComponent } from './statistiques/statistiques-page/statistiques-page.component';

export const routes: Routes = [
    { path: 'etablissements', component: EtablissementsPageComponent},
    { path: 'filieres', component: FilieresPageComponent},
    { path: 'orientation', component: OrientationPageComponent},
    { path: 'rapports-analyses', component: RapportsPageComponent},
    { path: 'statistiques', component: StatistiquesPageComponent},
];
