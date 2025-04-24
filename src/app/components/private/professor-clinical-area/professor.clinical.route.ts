import { Routes } from '@angular/router';

export default [
    {
        path: '',
        loadComponent: () =>
            import('./components/layout-professor-clinical-area/layout-professor-clinical-area.component').then(
                (m) => m.LayoutProfessorClinicalAreaComponent
            ),
        children: [
            {
                path: 'professor-clinical-area',
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
                    import('../professor-clinical-area/components/dashboard/dashboard.component').then(
                        (m) => m.DashboardProfessorClinicalComponent
                    ),
            },
            {
                path: 'history-clinics',
                loadComponent: () =>
                    import('../professor-clinical-area/components/review-history-clinics/review-history-clinics.component').then(
                        (m) => m.ReviewHistoryClinicsComponent
                    ),
            },
            {
                path: 'general/:id/patient/:patient/patientHistoryId/:patientID', // Ruta para historia clínica general
                loadComponent: () =>
                    import('../students/pages/history-clinics/general/students-general-history.component').then(
                        (m) => m.StudentsGeneralHistoryComponent
                    ),
            },
            {
                path: 'periodontics/:id/patient/:patient/patientHistoryId/:patientID', // Ruta para historia clínica periodoncia
                loadComponent: () =>
                    import('../students/pages/history-clinics/periodontics/students-periodontics-history.component').then(
                        (m) => m.StudentsPeriodonticsHistoryComponent
                    ),
            },
            {
                path: 'oralSurgery/:id/patient/:patient/patientHistoryId/:patientID', // Ruta para la historia clínica cirugía bucal
                loadComponent: () =>
                    import('../students/pages/history-clinics/oral-surgery/students-oral-surgery-history.component').then(
                        (m) => m.StudentsOralSurgeryHistoryComponent
                    ),
            },
            {
                path: 'dentalOperation/:id/patient/:patient/patientHistoryId/:patientID', // Ruta para operatoria dental
                loadComponent: () =>
                    import('../students/pages/history-clinics/dental-operation/students-dental-operation.component').then(
                        (m) => m.StudentsDentalOperationComponent
                    ),
            },
            {
                path: 'oralProsthesis/:id/patient/:patient/patientHistoryId/:patientID', // Ruta para prótesis oral
                loadComponent: () =>
                    import('../students/pages/history-clinics/oral-prosthesis/oral-prosthesis.component').then(
                        (m) => m.OralProsthesisComponent
                    ),
            },
            {
                path: 'preventiveDentistryPublicHealth/:id/patient/:patient/patientHistoryId/:patientID', // Ruta para odontología preventiva y salud pública
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
