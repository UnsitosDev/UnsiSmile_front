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
                path: 'rate-treatment/treatment-detail/:idTreatmentDetail/patient/:patientID/medical-record/:medicalRecordId', // Ruta para historia clínica general
                loadComponent: () =>
                    import('./pages/rate-treatment-container/rate-treatment-container.component').then(
                        (m) => m.RateTreatmentContainerComponent
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
                path: 'review-treatment',
                loadComponent: () =>
                    import('./components/review-treatment/presentation/review-treatment.component').then(
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
