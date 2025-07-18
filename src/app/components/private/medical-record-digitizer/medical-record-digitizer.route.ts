import { Routes } from '@angular/router';

export default [
    {
        path: '',
        loadComponent: () =>
            import('./components/layout-medical-record-digitizer/layout-medical-record-digitizer.component').then(
                (m) => m.LayoutMedicalRecordDigitizerComponent
            ),
        children: [
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('../medical-record-digitizer/components/dashboard-medical-record-digitizer/dashboard-medical-record-digitizer.component').then(
                        (m) => m.DashboardMedicalRecordDigitizerComponent
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
