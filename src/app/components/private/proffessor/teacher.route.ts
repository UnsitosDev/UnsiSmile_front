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
                ]
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
                    import('../proffessor/components/review-history-clinics/review-history-clinics.component').then(
                        (m) => m.ReviewHistoryClinicsComponent
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
