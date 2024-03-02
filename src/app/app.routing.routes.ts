import { Routes } from '@angular/router';
import { LoginComponent } from '@mean/public';
import { StudentsDashboardComponent, StudentsLayoutComponent, StudentsPatientsComponent } from '@mean/students';

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
    component: StudentsLayoutComponent,
    children: [
      {
        path: 'patients',
        component: StudentsPatientsComponent,
      },
      {
        path: 'dashboard',
        component: StudentsDashboardComponent,
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'dashboard',
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