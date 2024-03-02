import { Routes } from '@angular/router';
import { LoginComponent } from '@mean/public';
import { DashboardComponent, PatientsComponent } from '@mean/students';
import { LayoutComponent } from './components/private/students/components/layout/layout.component';
import { AdminLayoutComponent } from './components/private/admin/components/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './components/private/admin/components/admin-dashboard/admin-dashboard.component';

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

    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: AdminDashboardComponent,
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      }
    ]

  },
  {
    path: 'students',
    component: LayoutComponent,
    children: [
      {
        path: 'patients',
        component: PatientsComponent,
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
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