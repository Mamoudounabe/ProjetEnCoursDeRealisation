import { Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AnalyseComponent } from './rapports/analyse/analyse.component';
import { FilieresPageComponent } from './filieres/filieres-page/filieres-page.component';
import { RapportsPageComponent } from './rapports/rapports-page/rapports-page.component';
import { StatistiquesPageComponent } from './statistiques/statistiques-page/statistiques-page.component';
import { AccueilPageComponent } from './accueil-page/accueil-page.component';
import { FormationsPageComponent } from './formations/formations-page/formations-page.component';
import { FormationDetailComponent } from './formations/formation-detail/formation-detail.component';
import { FilieresDetailsComponent } from './filieres/filieres-details/filieres-details.component';
import{AproposComponent} from './apropos/apropos.component';
import { GeoPageComponent } from './geographiques/geo-page/geo-page.component';
import { GeoDetailsComponent } from './geographiques/geo-details/geo-details.component';
import { ComparatifEtablissementDetailsComponent } from './etablissements/comparatif-etablissement-details/comparatif-etablissement-details.component';
import { ComparatifEtablissementPageComponent } from './etablissements/comparatif-etablissement-page/comparatif-etablissement-page.component';
import { ComparatifUniversitesPageComponent } from './universites/comparatif-universites-page/comparatif-universites-page.component';
import { ComparatifUniversitesDetailsComponent } from './universites/comparatif-universites-details/comparatif-universites-details.component';

export const routes: Routes = [
    { path: '', component: AccueilPageComponent },   
    { path: 'filieres', component: FilieresPageComponent },
    { path: 'rapports-analyses', component: RapportsPageComponent },
    { path: 'statistiques', component: StatistiquesPageComponent },
    {path: 'formations', component: FormationsPageComponent },
    { path: 'formations/:id', component: FormationDetailComponent },
    {path: 'apropos', component: AproposComponent},
    {path:'filieres/:id',component:FilieresDetailsComponent},
    {path:'etablissements',component:ComparatifEtablissementPageComponent},
    {path:'analyse',component:AnalyseComponent},
    {path:'geo-page',component:GeoPageComponent},
    {path:'geo-details/:region',component:GeoDetailsComponent},
   { path: 'etablissements/comparaison/:ids', component: ComparatifEtablissementDetailsComponent },
   {path: 'universites', component: ComparatifUniversitesPageComponent },
   {path: 'universites/comparaison/:nom', component: ComparatifUniversitesDetailsComponent }
   



]
