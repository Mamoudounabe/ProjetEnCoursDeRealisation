import { Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FilieresPageComponent } from './filieres/filieres-page/filieres-page.component';
import { RapportsPageComponent } from './rapports/rapports-page/rapports-page.component';
import { StatistiquesPageComponent } from './statistiques/statistiques-page/statistiques-page.component';
import { AccueilPageComponent } from './accueil-page/accueil-page.component';
import { FormationsPageComponent } from './formations/formations-page/formations-page.component';
import { FormationDetailComponent } from './formations/formation-detail/formation-detail.component';


import{AproposComponent} from './apropos/apropos.component';
export const routes: Routes = [
    { path: '', component: AccueilPageComponent },   
    { path: 'filieres', component: FilieresPageComponent },
    { path: 'rapports-analyses', component: RapportsPageComponent },
    { path: 'statistiques', component: StatistiquesPageComponent },
    {path: 'formations', component: FormationsPageComponent },
    { path: 'formations/:id', component: FormationDetailComponent },
    {path: 'apropos', component: AproposComponent}
];