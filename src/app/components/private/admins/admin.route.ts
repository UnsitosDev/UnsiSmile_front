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
                children: [
                    {
                        path: '',
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
                    }
                ]
            },
            {
                path: 'patients',
                children: [
                    {
                        path: '',
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
                    }
                ]
            },
            {
                path: 'admins',
                children: [
                    {
                        path: '',
                        loadComponent: () =>
                            import('./components/table-admin/table-admin.component').then(
                                (m) => m.TableAdminComponent
                            ),
                    },
                    {
                        path: 'addAdmin',
                        loadComponent: () =>
                            import('./components/form-insert-admin/form-insert-admin.component').then(
                                (m) => m.FormInsertAdminComponent
                            ),
                    }
                ]
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
                path: 'upload-files',
                loadComponent: () =>
                    import('./components/admin-files-section/admin-files-section.component').then(
                        (m) => m.AdminFilesSectionComponent
                    ),
            },
            {
                path: 'general/:id/patient/:patient/patientHistoryId/:patientID', // Ruta para historia clinica general
                loadComponent: () =>
                    import('../students/pages/history-clinics/general/students-general-history.component').then(
                        (m) => m.StudentsGeneralHistoryComponent
                    ),
            },
            {
                path: 'periodontics/:id/patient/:patient/patientHistoryId/:patientID', // Ruta para historia clinica periodoncia
                loadComponent: () =>
                    import('../students/pages/history-clinics/periodontics/students-periodontics-history.component').then(
                        (m) => m.StudentsPeriodonticsHistoryComponent
                    ),
            },
            {
                path: 'oralSurgery/:id/patient/:patient/patientHistoryId/:patientID', // Ruta para la historia clinica cirujia bucal
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
                path: 'oralProsthesis/:id/patient/:patient/patientHistoryId/:patientID', // Ruta para operatoria dental
                loadComponent: () =>
                    import('../students/pages/history-clinics/oral-prosthesis/oral-prosthesis.component').then(
                        (m) => m.OralProsthesisComponent
                    ),
            },
            {
                path: 'preventiveDentistryPublicHealth/:id/patient/:patient/patientHistoryId/:patientID', // Ruta para HISTORIA CLÍNICA CLÍNICA DE ODONTOLOGÍA PREVENTIVA Y SALUD PÚBLICA
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
