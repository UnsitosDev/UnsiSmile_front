import { Routes } from '@angular/router';
import { LoginComponent } from '@mean/public';
import { StudentsDashboardComponent, StudentsLayoutComponent, StudentsPatientsComponent } from '@mean/students';
import { StudentsOdontogramComponent } from './components/private/students/components/students-odontogram/students-odontogram.component';
import { StudentsGeneralHistoryComponent } from './components/private/students/components/students-general-history/students-general-history.component';

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
        path: 'odontogram',
        component: StudentsOdontogramComponent
      },
      {
        path: 'historyClinic',
        component: StudentsGeneralHistoryComponent
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