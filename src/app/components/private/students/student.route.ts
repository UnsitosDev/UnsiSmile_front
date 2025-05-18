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
                children: [
                    {
                        path: '',
                        loadComponent: () =>
                            import('@mean/students').then(
                                (m) => m.StudentsPatientsComponent
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
                        path: 'updatePatient/:idPatient',
                        loadComponent: () =>
                            import('./components/form-update-patient/form-update-patient.component').then(
                                (m) => m.FormUpdatePatientComponent
                            ),
                    }
                ]
            },
            {
                path: 'treatments',
                loadComponent: () => 
                    import('./components/patient-treatment/patient-treatment.component').then(
                    (m) => m.PatientTreatmentComponent
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
                path: 'dashboard',
                loadComponent: () =>
                    import('./components/dashboard/dashboard.component').then(
                        (m) => m.DashboardComponent
                    ),
            },
            {
                path: 'user',
                loadComponent: () =>
                    import('../../../shared/components/form-user/form-user.component').then(
                        (m) => m.FormUserComponent
                    ),
            },
            {
                path: 'upload-patients', 
                loadComponent: () => 
                    import('./components/upload-patients/upload-patients.component').then(
                    (m) => m.UploadPatientsComponent
                ),
            },
            {
                path: 'dowload-formats', 
                loadComponent: () => 
                    import('./components/formats/formats.component').then(
                    (m) => m.FormatsComponent
                ),
            },
            {
                path: 'treatments/patient/:patientID',
                loadComponent: () => 
                    import('./pages/treatments/presentation/treatment/treatment.component').then(
                    (m) => m.TreatmentComponent
                ),
            },
            {
                path: 'treatment-details/:idTreatmet/patient/:patientID',
                loadComponent: () => 
                    import('./pages/treatment-details/presentation/treatment-details.component').then(
                    (m) => m.TreatmentDetailsComponent
                ),
            },
            {
                path: 'all-treatments',
                loadComponent: () => 
                    import('./pages/patients-treatments/presentation/patients-treatments.component').then(
                    (m) => m.PatientsTreatmentsComponent
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
