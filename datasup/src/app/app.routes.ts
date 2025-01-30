import { Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FilieresPageComponent } from './filieres/filieres-page/filieres-page.component';
import { RapportsPageComponent } from './rapports/rapports-page/rapports-page.component';
import { StatistiquesPageComponent } from './statistiques/statistiques-page/statistiques-page.component';
import { AccueilPageComponent } from './accueil-page/accueil-page.component';


export const routes: Routes = [
    { path: '', component: AccueilPageComponent },   
    { path: 'filieres', component: FilieresPageComponent },
    { path: 'rapports-analyses', component: RapportsPageComponent },
    { path: 'statistiques', component: StatistiquesPageComponent },
];