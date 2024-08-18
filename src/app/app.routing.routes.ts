import { Routes } from '@angular/router';
import { LoginComponent } from '@mean/public';
import { StudentsDashboardComponent, StudentsLayoutComponent, StudentsPatientsComponent } from '@mean/students';
import { StudentsOdontogramComponent } from './components/private/students/components/odontogram/students-odontogram.component';
import { StudentsGeneralHistoryComponent } from './components/private/students/pages/history-general/students-general-history.component';
import { StudentsPeriodonticsHistoryComponent } from './components/private/students/pages/history-periodontics/students-periodontics-history.component';
import { HistoryPersonalDataComponent } from './components/private/students/components/form-personal-data/history-personal-data.component';
import { StudentsOralSurgeryHistoryComponent } from './components/private/students/pages/history-oral-surgery/students-oral-surgery-history.component';
import { StudentsDentalOperationComponent } from './components/private/students/pages/history-dental-operation/students-dental-operation.component';

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
        path: 'OralSurgery',
        component: StudentsOralSurgeryHistoryComponent
      },
      {
        path: 'DentalOperation',
        component: StudentsDentalOperationComponent
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