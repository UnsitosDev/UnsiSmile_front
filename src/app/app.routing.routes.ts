import { Routes } from '@angular/router';
import { studentGuard } from './guards/student.guard';
import { loginGuard } from './guards/login.guard';
import { adminGuard } from './guards/admin.guard';

const routes: Routes = [

  {
    path: '',
    loadChildren: () => import('./components/public/login/login.route'),
    canActivate:[loginGuard]
  },

  {
    path: 'students',
    loadChildren: () => import('./components/private/students/student.route'),
    canActivate:[studentGuard]
  },

  {
    path: 'admin',
    loadChildren: () => import('./components/private/admins/admin.route'),
    canActivate:[adminGuard]
  },
  
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '',
  }
];

export default routes;