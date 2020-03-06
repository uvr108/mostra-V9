import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AnalisisComponent } from './analisis/analisis.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { ListService } from './shared/list.service';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    AnalisisComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule
  ],
  providers: [ListService],
  bootstrap: [AppComponent]
})
export class AppModule { }
