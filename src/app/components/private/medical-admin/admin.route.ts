import { Routes } from '@angular/router';

export default [
    {
        path: '',
        loadComponent: () =>
            import('./pages/layout-admin/layout-admin.component').then(
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
                    },
                    {
                        path: 'updateStudent/:matricula',
                        loadComponent: () =>
                            import('./components/form-update-student/form-update-student.component').then(
                                (m) => m.FormUpdateStudentComponent
                            ),
                    },
                ]
            },
            {
                path: 'patients',
                children: [
                    {
                        path: '',
                        loadComponent: () =>
                            import('./components/table-patients-admin/admin-patients.component').then(
                                (m) => m.AdminPatientsComponent
                            ),
                    },
                    {
                        path: 'addPatient',
                        loadComponent: () =>
                            import('./components/form-patient-personal-data/form-patient-personal-data.component').then(
                                (m) => m.FormPatientPersonalDataComponent
                            ),
                    },
                    {
                        path: 'updatePatient/:idPatient',
                        loadComponent: () =>
                            import('./components/form-update-patient/form-update-patient.component').then(
                                (m) => m.FormUpdatePatientComponent
                            ),
                    },
                      {
                        path: 'treatments/patient/:patientID',
                        loadComponent: () =>
                            import('./pages/treatment/treatment.component').then(
                                (m) => m.TreatmentComponent
                            ),
                    },

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
                    },
                    {
                        path: 'updateAdmin/:employeeNumber',
                        loadComponent: () =>
                            import('./components/form-update-admin/form-update-admin.component').then(
                                (m) => m.FormUpdateAdminComponent
                            ),
                    },
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
                    import('../../../shared/components/form-user/form-user.component').then(
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
                path: 'general/:id/patient/:patient/medical-record-id/:patientID', // Ruta para historia clinica general
                loadComponent: () =>
                    import('../students/pages/medical-records-forms/general/students-general-history.component').then(
                        (m) => m.StudentsGeneralHistoryComponent
                    ),
            },
            {
                path: 'periodontics/:id/patient/:patient/medical-record-id/:patientID', // Ruta para historia clinica periodoncia
                loadComponent: () =>
                    import('../students/pages/medical-records-forms/periodontics/students-periodontics-history.component').then(
                        (m) => m.StudentsPeriodonticsHistoryComponent
                    ),
            },
            {
                path: 'oral-surgery/:id/patient/:patient/medical-record-id/:patientID', // Ruta para la historia clinica cirujia bucal
                loadComponent: () =>
                    import('../students/pages/medical-records-forms/oral-surgery/students-oral-surgery-history.component').then(
                        (m) => m.StudentsOralSurgeryHistoryComponent
                    ),
            },
            {
                path: 'dental-operation/:id/patient/:patient/medical-record-id/:patientID', // Ruta para operatoria dental
                loadComponent: () =>
                    import('../students/pages/medical-records-forms/dental-operation/students-dental-operation.component').then(
                        (m) => m.StudentsDentalOperationComponent
                    ),
            },
            {
                path: 'oral-prosthesis/:id/patient/:patient/medical-record-id/:patientID', // Ruta para operatoria dental
                loadComponent: () =>
                    import('../students/pages/medical-records-forms/oral-prosthesis/oral-prosthesis.component').then(
                        (m) => m.OralProsthesisComponent
                    ),
            },
            {
                path: 'preventive-dentistry-public-health/:id/patient/:patient/medical-record-id/:patientID', // Ruta para HISTORIA CLÍNICA CLÍNICA DE ODONTOLOGÍA PREVENTIVA Y SALUD PÚBLICA
                loadComponent: () =>
                    import('../students/pages/medical-records-forms/preventive-dentistry-public-health/preventive-dentistry-public-health.component').then(
                        (m) => m.PreventiveDentistryPublicHealthComponent
                    ),
            },
            {
                path: 'professors',
                children: [
                    {
                        path: '',
                        loadComponent: () =>
                            import('./components/table-professor-admin/table-professor-admin.component').then(
                                (m) => m.TableProfessorAdminComponent
                            ),
                    },
                    {
                        path: 'addProfessor',
                        loadComponent: () =>
                            import('./components/form-insert-professor/form-insert-professor.component').then(
                                (m) => m.FormInsertProfessorComponent
                            ),
                    },
                    {
                        path: 'updateProfessor/:professorId',
                        loadComponent: () =>
                            import('./components/form-update-professor/form-update-professor.component').then(
                                (m) => m.FormUpdateProfessorComponent
                            ),
                    },
                    {
                        path: 'details/professor/:professorId',
                        loadComponent: () =>
                            import('./pages/details-professor/details-professor.component').then(
                                (m) => m.DetailsProfessorComponent
                            ),
                    },
                ]
            },
              {
                path: 'digitizers',
                children: [
                    {
                        path: '',
                        loadComponent: () =>
                            import('./components/table-digitizers/table-digitizers.component').then(
                                (m) => m.TableDigitizersComponent
                            ),
                    },
                    {
                        path: 'addDigitizer',
                        loadComponent: () =>
                            import('./components/form-insert-digitizer/form-insert-digitizer.component').then(
                                (m) => m.FormInsertDigitizerComponent
                            ),
                    },
                    {
                        path: 'patients/:username',
                        loadComponent: () =>
                            import('./components/table-assign-digitizer/table-assign-digitizer.component').then(
                                (m) => m.TableAssignDigitizerComponent
                            ),
                    },
                ]
            },
            {
                path: 'create-area',
                loadComponent: () =>
                    import('./components/form-create-area/form-create-area.component').then(
                        (m) => m.FormCreateAreaComponent
                    ),
            },
            {
                path: 'areas',
                loadComponent: () =>
                    import('./components/table-area-admin/table-area-admin.component').then(
                        (m) => m.TableAreaAdminComponent
                    ),
            },
            {
                path: 'clinical-area/:id', // Modificado para incluir el parámetro
                loadComponent: () =>
                    import('./components/form-clinical-area/form-clinical-area.component').then(
                        (m) => m.FormClinicalAreaComponent
                    ),
            },
            {
                path: 'professors-area/:id',
                loadComponent: () =>
                    import('./components/table-professor-clinical/table-professor-clinical.component').then(
                        (m) => m.TableProfessorClinicalComponent
                    ),
            },
              {
                path: 'clinical-area',
                loadComponent: () =>
                    import('./components/table-professor-clinical-area/table-professor-clinical-area.component').then(
                        (m) => m.TableProfessorClinicalAreaComponent
                    ),
            },
            {
              path: 'treatments',
              loadComponent: () => import('./components/treatment-reports/treatment-reports.component').then(
                (m) => m.TreatmentReportsComponent
              )
            },
            {
                path: '**',
                pathMatch: 'full',
                redirectTo: 'dashboard',
            },
        ],
    },
] as Routes;
