import { Routes } from '@angular/router';
import { LoginComponent } from '@mean/public';
import { StudentsDashboardComponent, StudentsLayoutComponent, StudentsPatientsComponent } from '@mean/students';
import { StudentsOdontogramComponent } from './components/private/students/components/students-odontogram/students-odontogram.component';
import { StudentsGeneralHistoryComponent } from './components/private/students/components/students-general-history/students-general-history.component';
import { StudentsPeriodonticsHistoryComponent } from './components/private/students/components/students-periodontics-history/students-periodontics-history.component';
import { HistoryPersonalDataComponent } from './components/private/students/components/students-general-history/history-personal-data/history-personal-data.component';

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
      // Ruta historia clinica general
      {
        path: 'historyClinic/:id',
        component: StudentsGeneralHistoryComponent
      },
      {
        path: 'periodontics',
        component: StudentsPeriodonticsHistoryComponent
      },
      {
        path: 'addPatient',
        component: HistoryPersonalDataComponent
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