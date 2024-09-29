import { Routes } from '@angular/router';

const routes: Routes = [

  {
    path: '',
    loadChildren: () => import('./components/public/login/login.route')
  },

  {
    path: 'students',
    loadChildren: () => import('./components/private/students/student.route')
  },

  {
    path: 'admin',
    loadChildren: () => import('./components/private/admins/admin.route')
  },
  
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '',
  }
];

export default routes;