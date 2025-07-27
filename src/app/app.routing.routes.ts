import { Routes } from '@angular/router';
import { studentGuard } from './guards/student.guard';
import { loginGuard } from './guards/login.guard';
import { adminGuard } from './guards/admin.guard';
import { PasswordChangeGuard } from './guards/password-change.guard';
import { NewPasswordGuard } from './guards/new-password.guard';
import { NewPasswordComponent } from './shared/components/new-password/new-password.component';
import { proffesorGuard } from './guards/proffessor.guard';
import { clinicalAreaSupervisorGuard } from './guards/clinical-area-supervisor.guard';
import { MedicalRecordDigitizer } from './guards/medical-record-digitizer.guard';

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
    path: 'clinical-area-supervisor',
    loadChildren: () =>
      import('./components/private/clinical-area-supervisor/clinical-area-supervisor.route'),
    canActivate: [clinicalAreaSupervisorGuard, PasswordChangeGuard],
  },
  {
    path: 'medical-record-digitizer',
    loadChildren: () =>
      import('./components/private/medical-record-digitizer/medical-record-digitizer.route'),
    canActivate: [MedicalRecordDigitizer, PasswordChangeGuard],
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