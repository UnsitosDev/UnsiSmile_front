import { Routes } from '@angular/router';
import { LoginComponent } from '@mean/public';
import { StudentsLayoutComponent, StudentsPatientsComponent } from '@mean/students';
import { StudentsOdontogramComponent } from './components/private/students/components/odontogram/students-odontogram.component';
import { StudentsGeneralHistoryComponent } from './components/private/students/pages/history-clinics/general/students-general-history.component';
import { StudentsPeriodonticsHistoryComponent } from './components/private/students/pages/history-clinics/periodontics/students-periodontics-history.component';
import { HistoryPersonalDataComponent } from './components/private/students/components/form-personal-data/history-personal-data.component';
import { StudentsOralSurgeryHistoryComponent } from './components/private/students/pages/history-clinics/oral-surgery/students-oral-surgery-history.component';
import { StudentsDentalOperationComponent } from './components/private/students/pages/history-clinics/dental-operation/students-dental-operation.component';
import { FormPatientPersonalDataComponent } from './components/private/students/components/form-patient-personal-data/form-patient-personal-data.component';
import { TableStudentsComponent } from './components/private/admins/components/table-students/table-students.component';
import { LayoutAdminComponent } from './components/private/admins/components/layout-admin/layout-admin.component';
import { FormInsertStudentComponent } from './components/private/admins/components/form-insert-student/form-insert-student.component';
import { AdminTablePatientsComponent } from './components/private/admins/components/admin-table-patients/admin-table-patients.component';
import { FormInsertAdminComponent } from './components/private/admins/components/form-insert-admin/form-insert-admin.component';

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
        component: FormPatientPersonalDataComponent
      },   
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      }
    ]
  },
  {
    path: 'admin',
    component: LayoutAdminComponent,
    children: [
      {
        path:'students',
        component: TableStudentsComponent,

      },
      {
        path: 'addStudient',
        component: FormInsertStudentComponent,
      },
      {
        path: 'patients',
        component: AdminTablePatientsComponent,
      },
      {
        path: 'addPatient',
        component: FormPatientPersonalDataComponent,
      },
      {
        path: 'addAdmin',
        component: FormInsertAdminComponent,
      },
    ]

  },
  
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '',
  }
];

export default routes;