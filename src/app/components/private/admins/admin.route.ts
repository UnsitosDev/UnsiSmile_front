import { Routes } from '@angular/router';

export default [
    {
        path: '',
        loadComponent: () =>
            import('./components/layout-admin/layout-admin.component').then(
                (m) => m.LayoutAdminComponent
            ),
        children: [
            {
                path: 'students',
                loadComponent: () =>
                    import('./components/table-students/table-students.component').then(
                        (m) => m.TableStudentsComponent
                    ),
            },
            {
                path: 'addStudent',
                loadComponent: () =>
                    import('./components/form-insert-student/form-insert-student.component').then(
                        (m) => m.FormInsertStudentComponent
                    ),
            },
            {
                path: 'patients',
                loadComponent: () =>
                    import('../admins/components/table-patients-admin/admin-patients.component').then(
                        (m) => m.AdminPatientsComponent
                    ),
            },
            {
                path: 'addPatient',
                loadComponent: () =>
                    import('../admins/components/form-patient-personal-data/form-patient-personal-data.component').then(
                        (m) => m.FormPatientPersonalDataComponent
                    ),
            },
            {
                path: 'addAdmin',
                loadComponent: () =>
                    import('./components/form-insert-admin/form-insert-admin.component').then(
                        (m) => m.FormInsertAdminComponent
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
                path: 'upload-students',
                loadComponent: () =>
                    import('./components/admin-upload-students/admin-upload-students.component').then(
                        (m) => m.AdminUploadStudentsComponent
                    ),
            },
            {
                path: 'upload-patients',
                loadComponent: () =>
                    import('./components/admin-upload-patients/admin-upload-patients.component').then(
                        (m) => m.AdminUploadPatientsComponent
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
                path: 'admins',
                loadComponent: () =>
                    import('./components/table-admin/table-admin.component').then(
                        (m) => m.TableAdminComponent
                    ),
            },
            {
                path: 'upload-files',
                loadComponent: () =>
                    import('./components/admin-files-section/admin-files-section.component').then(
                        (m) => m.AdminFilesSectionComponent
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
