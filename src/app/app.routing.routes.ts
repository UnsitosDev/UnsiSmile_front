import { Routes } from '@angular/router';
import { permissionGuard } from './guards/permission.guard';
import { loginGuard } from './guards/login.guard';

const routes: Routes = [

  {
    path: '',
    loadChildren: () => import('./components/public/login/login.route'),
    canActivate:[loginGuard]
  },

  {
    path: 'students',
    loadChildren: () => import('./components/private/students/student.route'),
    canActivate:[permissionGuard]
  },

  {
    path: 'admin',
    loadChildren: () => import('./components/private/admins/admin.route'),
    canActivate:[permissionGuard]
  },
  
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '',
  }
];

export default routes;