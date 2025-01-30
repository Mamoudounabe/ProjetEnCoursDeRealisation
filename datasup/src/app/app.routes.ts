import { Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EtablissementsPageComponent } from './etablissements/etablissements-page/etablissements-page.component';
import { FilieresPageComponent } from './filieres/filieres-page/filieres-page.component';
import { OrientationPageComponent } from './orientation/orientation-page/orientation-page.component';
import { RapportsPageComponent } from './rapports/rapports-page/rapports-page.component';
import { StatistiquesPageComponent } from './statistiques/statistiques-page/statistiques-page.component';
import { AccueilPageComponent } from './accueil-page/accueil-page.component';
import { StatistiquesFormationComponent } from './statistiques/statistiques-formation/statistiques-formation.component';
import { StatistiqueAnneeComponent } from './statistiques/statistique-annee/statistique-annee.component';
import { EtablissementsRegionComponent } from './etablissements/etablissements-region/etablissements-region.component';

export const routes: Routes = [
    { path: '', component: AccueilPageComponent },
    { path: 'etablissements', component: EtablissementsPageComponent },
    { path: 'etablissements/region', component: EtablissementsRegionComponent },
    { path: 'filieres', component: FilieresPageComponent },
    { path: 'orientation', component: OrientationPageComponent },
    { path: 'rapports-analyses', component: RapportsPageComponent },
    { path: 'statistiques', component: StatistiquesPageComponent },
    { path: 'statistiques/formations', component: StatistiquesFormationComponent },
    { path: 'statistiques/annee', component: StatistiqueAnneeComponent }
];