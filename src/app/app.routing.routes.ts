import { Routes } from '@angular/router';
import { studentGuard } from './guards/student.guard';
import { loginGuard } from './guards/login.guard';
import { adminGuard } from './guards/admin.guard';
import { PasswordChangeGuard } from './guards/password-change.guard';
import { NewPasswordGuard } from './guards/new-password.guard';
import { NewPasswordComponent } from './shared/components/new-password/new-password.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./components/public/login/login.route'),
    canActivate: [loginGuard, PasswordChangeGuard],
  },
  {
    path: 'students',
    loadChildren: () => import('./components/private/students/student.route'),
    canActivate: [studentGuard, PasswordChangeGuard],
  },
  {
    path: 'admin',
    loadChildren: () => import('./components/private/admins/admin.route'),
    canActivate: [adminGuard, PasswordChangeGuard],
  },
  {
    path: 'new-password',
    component: NewPasswordComponent,
    canActivate: [NewPasswordGuard]
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '',
  },
];

export default routes;