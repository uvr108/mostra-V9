import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnalisisComponent } from './analisis/analisis.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

const routes: Routes = [
 { path:'analisis', component: AnalisisComponent },
 { path: '', redirectTo: '/analisis',  pathMatch: 'full' },
 { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}]
})
export class AppRoutingModule { }
