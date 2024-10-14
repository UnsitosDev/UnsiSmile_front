import { Routes } from '@angular/router';

export default [
    {
        path: '',
        loadComponent: () =>
            import('@mean/students').then(
                (m) => m.StudentsLayoutComponent
            ),
        children: [
            {
                path: 'patients',
                loadComponent: () =>
                    import('@mean/students').then(
                        (m) => m.StudentsPatientsComponent
                    ),
            },
            {
                path: 'odontogram',
                loadComponent: () =>
                    import('@mean/students').then(
                        (m) => m.StudentsOdontogramComponent
                    ),
            },
            {
                path: 'historyClinic/:id',
                loadComponent: () =>
                    import('./pages/history-clinics/general/students-general-history.component').then(
                        (m) => m.StudentsGeneralHistoryComponent
                    ),
            },
            {
                path: 'periodontics',
                loadComponent: () =>
                    import('./pages/history-clinics/periodontics/students-periodontics-history.component').then(
                        (m) => m.StudentsPeriodonticsHistoryComponent
                    ),
            },
            {
                path: 'OralSurgery',
                loadComponent: () =>
                    import('./pages/history-clinics/oral-surgery/students-oral-surgery-history.component').then(
                        (m) => m.StudentsOralSurgeryHistoryComponent
                    ),
            },
            {
                path: 'DentalOperation',
                loadComponent: () =>
                    import('./pages/history-clinics/dental-operation/students-dental-operation.component').then(
                        (m) => m.StudentsDentalOperationComponent
                    ),
            },
            {
                path: 'addPatient',
                loadComponent: () =>
                    import('./components/form-patient-personal-data/form-patient-personal-data.component').then(
                        (m) => m.FormPatientPersonalDataComponent
                    ),
            },
            {
                path: 'user',
                loadComponent: () =>
                    import('./components/form-user/form-user.component').then(
                        (m) => m.FormUserComponent
                    ),
            },
            {
                path: '**',
                pathMatch: 'full',
                redirectTo: 'dashboard',
            },
        ],
    },
] as Routes;
