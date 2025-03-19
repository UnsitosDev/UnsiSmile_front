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
                path: '**',
                pathMatch: 'full',
                redirectTo: 'dashboard',
            },
        ],
    },
] as Routes;
