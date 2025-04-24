import { Routes } from '@angular/router';
import { studentGuard } from './guards/student.guard';
import { loginGuard } from './guards/login.guard';
import { adminGuard } from './guards/admin.guard';
import { PasswordChangeGuard } from './guards/password-change.guard';
import { NewPasswordGuard } from './guards/new-password.guard';
import { NewPasswordComponent } from './shared/components/new-password/new-password.component';
import { proffesorGuard } from './guards/proffessor.guard';
import { professorClinicalGuard } from './guards/professor.clinical.guard';

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
    path: 'professor',
    loadChildren: () => import('./components/private/proffessor/teacher.route'),
    canActivate: [proffesorGuard, PasswordChangeGuard],
  },
  {
    path: 'professor-clinical-area',
    loadChildren: () =>
      import('./components/private/professor-clinical-area/professor.clinical.route'),
    canActivate: [professorClinicalGuard, PasswordChangeGuard],
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