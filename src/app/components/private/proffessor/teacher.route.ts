import { Routes } from '@angular/router';

export default [
    {
        path: '',
        loadComponent: () =>
            import('./components/layout/proffessor-layout.component').then(
                (m) => m.ProffesorLayoutComponent
            ),
        children: [
            {
                path: 'students',
                children: [
                    {
                        path: '',
                        loadComponent: () =>
                            import('../proffessor/components/table-students/table-students.component').then(
                                (m) => m.TableStudentsComponent
                            ),
                    },
                ],
            },
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('../proffessor/components/dashboard/dashboard.component').then(
                        (m) => m.DashboardComponent
                    ),
            },
            {
                path: 'history-clinics',
                loadComponent: () =>
                    import('../clinical-area-supervisor/components/review-history-clinics/review-history-clinics.component').then(
                        (m) => m.ReviewHistoryClinicsComponent
                    ),
            },
            {
                path: 'general/:id/patient/:patient/medical-record-id/:patientID', // Ruta para historia clínica general
                loadComponent: () =>
                    import('../students/pages/history-clinics/general/students-general-history.component').then(
                        (m) => m.StudentsGeneralHistoryComponent
                    ),
            },
            {
                path: 'periodontics/:id/patient/:patient/medical-record-id/:patientID', // Ruta para historia clínica periodoncia
                loadComponent: () =>
                    import('../students/pages/history-clinics/periodontics/students-periodontics-history.component').then(
                        (m) => m.StudentsPeriodonticsHistoryComponent
                    ),
            },
            {
                path: 'oral-surgery/:id/patient/:patient/medical-record-id/:patientID', // Ruta para la historia clínica cirugía bucal
                loadComponent: () =>
                    import('../students/pages/history-clinics/oral-surgery/students-oral-surgery-history.component').then(
                        (m) => m.StudentsOralSurgeryHistoryComponent
                    ),
            },
            {
                path: 'dental-operation/:id/patient/:patient/medical-record-id/:patientID', // Ruta para operatoria dental
                loadComponent: () =>
                    import('../students/pages/history-clinics/dental-operation/students-dental-operation.component').then(
                        (m) => m.StudentsDentalOperationComponent
                    ),
            },
            {
                path: 'oral-prosthesis/:id/patient/:patient/medical-record-id/:patientID', // Ruta para prótesis oral
                loadComponent: () =>
                    import('../students/pages/history-clinics/oral-prosthesis/oral-prosthesis.component').then(
                        (m) => m.OralProsthesisComponent
                    ),
            },
            {
                path: 'preventive-dentistry-public-health/:id/patient/:patient/medical-record-id/:patientID', // Ruta para odontología preventiva y salud pública
                loadComponent: () =>
                    import('../students/pages/history-clinics/preventive-dentistry-public-health/preventive-dentistry-public-health.component').then(
                        (m) => m.PreventiveDentistryPublicHealthComponent
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
