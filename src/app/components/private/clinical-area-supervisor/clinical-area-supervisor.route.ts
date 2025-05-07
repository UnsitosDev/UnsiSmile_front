import { Routes } from '@angular/router';

export default [
    {
        path: '',
        loadComponent: () =>
            import('./components/layout-clinical-area-supervisor/layout-clinical-area-supervisor.component').then(
                (m) => m.LayoutClinicalAreaSupervisorComponent
            ),
        children: [
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./components/dashboard/dashboard.component').then(
                        (m) => m.DashboardProfessorClinicalComponent
                    ),
            },
            {
                path: 'history-clinics',
                loadComponent: () =>
                    import('./components/review-medical-record/review-medical-record.component').then(
                        (m) => m.ReviewMedicalRecordComponent
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
                path: 'preventive-dentistry-public-health/:id/patient/:patient/medical-record-id/:patientID',
                loadComponent: () =>
                    import('../students/pages/history-clinics/preventive-dentistry-public-health/preventive-dentistry-public-health.component').then(
                        (m) => m.PreventiveDentistryPublicHealthComponent
                    ),
                children: [
                    {
                        path: 'treatment-detail/:idTreatmentDetail', 
                        loadComponent: () =>
                            import('../students/pages/history-clinics/preventive-dentistry-public-health/preventive-dentistry-public-health.component').then(
                                (m) => m.PreventiveDentistryPublicHealthComponent
                            ),
                    }
                ]
            },
            {
                path: 'user',
                loadComponent: () =>
                    import('../../../shared/components/form-user/form-user.component').then(
                        (m) => m.FormUserComponent
                    ),
            },
            {
                path: 'review-treatment',
                loadComponent: () =>
                    import('../clinical-area-supervisor/components/review-treatment/review-treatment.component').then(
                        (m) => m.ReviewTreatmentComponent
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
