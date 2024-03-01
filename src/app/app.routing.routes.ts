import { Routes } from '@angular/router';
import { LoginComponent } from '@mean/public';
import { DashboardComponent, PatientsComponent } from '@mean/students';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },

  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: 'students',
    component: DashboardComponent,
    children: [
      {
        path: 'patients',
        component: PatientsComponent,
      }
    ]
  },

  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '',
  }
];

export default routes;