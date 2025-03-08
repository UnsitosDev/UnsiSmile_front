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
                    }
                ]
            },
            {
                path: 'odontogram',
                loadComponent: () =>
                    import('@mean/students').then(
                        (m) => m.StudentsOdontogramComponent
                    ),
            },
            {
                path: 'general/:id/patient/:patient/patientHistoryId/:patientID', // Ruta para historia clinica general
                loadComponent: () =>
                    import('./pages/history-clinics/general/students-general-history.component').then(
                        (m) => m.StudentsGeneralHistoryComponent
                    ),
            },
            {
                path: 'periodontics/:id/patient/:patient/patientHistoryId/:patientID', // Ruta para historia clinica periodoncia
                loadComponent: () =>
                    import('./pages/history-clinics/periodontics/students-periodontics-history.component').then(
                        (m) => m.StudentsPeriodonticsHistoryComponent
                    ),
            },
            {
                path: 'oralSurgery/:id/patient/:patient/patientHistoryId/:patientID', // Ruta para la historia clinica cirujia bucal
                loadComponent: () =>
                    import('./pages/history-clinics/oral-surgery/students-oral-surgery-history.component').then(
                        (m) => m.StudentsOralSurgeryHistoryComponent
                    ),
            },
            {
                path: 'dentalOperation/:id/patient/:patient/patientHistoryId/:patientID', // Ruta para operatoria dental
                loadComponent: () =>
                    import('./pages/history-clinics/dental-operation/students-dental-operation.component').then(
                        (m) => m.StudentsDentalOperationComponent
                    ),
            },
            {
                path: 'oralProsthesis/:id/patient/:patient/patientHistoryId/:patientID', // Ruta para operatoria dental
                loadComponent: () =>
                    import('./pages/history-clinics/oral-prosthesis/oral-prosthesis.component').then(
                        (m) => m.OralProsthesisComponent
                    ),
            },
            {
                path: 'preventiveDentistryPublicHealth/:id/patient/:patient/patientHistoryId/:patientID', // Ruta para HISTORIA CLÍNICA CLÍNICA DE ODONTOLOGÍA PREVENTIVA Y SALUD PÚBLICA
                loadComponent: () =>
                    import('./pages/history-clinics/preventive-dentistry-public-health/preventive-dentistry-public-health.component').then(
                        (m) => m.PreventiveDentistryPublicHealthComponent
                    ),
            },
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('../admins/components/dashboard/dashboard.component').then(
                        (m) => m.DashboardComponent
                    ),
            },
            {
                path: 'user',
                loadComponent: () =>
                    import('../admins/components/form-user/form-user.component').then(
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
                path: '**',
                pathMatch: 'full',
                redirectTo: 'dashboard',
            },
        ],
    },
] as Routes;
