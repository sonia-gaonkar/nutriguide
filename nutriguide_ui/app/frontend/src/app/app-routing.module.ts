import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdvisorComponent } from './advisor/advisor.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ImageStudyComponent } from './image-study/image-study.component';
import { HealthySwapsComponent } from './healthy-swaps/healthy-swaps.component';



const routes: Routes = [
  { 
    path: '', 
    component : HomeComponent 
  },
  { 
    path: 'home', 
    component : HomeComponent 
  },
  { 
    path: 'dashboard', 
    component : DashboardComponent 
  },
  { 
    path: 'advisor', 
    component : AdvisorComponent 
  },
  { 
    path: 'image-study', 
    component : ImageStudyComponent 
  },
  { 
    path: 'healthy-swaps', 
    component : HealthySwapsComponent 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
