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
                path: 'add-patient',
                loadComponent: () =>
                    import('../medical-record-digitizer/components/form-patient-digitizer/form-patient-digitizer.component').then(
                        (m) => m.FormPatientDigitizerComponent
                    ),
            },
            {
                path: 'patients',
                loadComponent: () =>
                    import('../medical-record-digitizer/components/table-patients-digitizer/table-patients-digitizer.component').then(
                        (m) => m.TablePatientsDigitizerComponent
                    ),
            },
            {
                path: 'medical-records/patient/:patientID',
                loadComponent: () =>
                    import('./components/pages/medical-records-diditizer/medical-records-digitizer.component').then(
                        (m) => m.MedicalRecordsDigitizerComponent
                    ),
            },
            {
                path: 'medical-record/:medical-record/patient/:patientID',
                loadComponent: () =>
                    import('./components/pages/digitize-medical-record/digitize-medical-record.component').then(
                        (m) => m.DigitizeMedicalRecordComponent
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
