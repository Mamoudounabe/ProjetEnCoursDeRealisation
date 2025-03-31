import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComparatifEtablissementDetailsComponent } from './etablissements/comparatif-etablissement-details/comparatif-etablissement-details.component';
import { ComparatifUniversitesDetailsComponent } from './universites/comparatif-universites-details/comparatif-universites-details.component';

const routes: Routes = [
  { path: 'etablissements/comparatif/:ids', component: ComparatifEtablissementDetailsComponent },
  { path: 'universites/comparatif/:nom', component: ComparatifUniversitesDetailsComponent },
  // ...other routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }