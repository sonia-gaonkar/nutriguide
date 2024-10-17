import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
//import { NgxWebstorageModule } from 'ngx-webstorage';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AdvisorComponent } from './advisor/advisor.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ImageStudyComponent } from './image-study/image-study.component';
import { HealthySwapsComponent } from './healthy-swaps/healthy-swaps.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AdvisorComponent,
    DashboardComponent,
    ImageStudyComponent,
    HealthySwapsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbDatepickerModule,
    FormsModule,
    //NgxWebstorageModule.forRoot(),
    ModalModule.forRoot(),
    HttpClientModule    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
