import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () =>
      import(
        './pages/layout-clinical-area-supervisor/layout-clinical-area-supervisor.component'
      ).then((m) => m.LayoutClinicalAreaSupervisorComponent),
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
          import(
            './pages/table-review-medical-record/review-medical-record.component'
          ).then((m) => m.ReviewMedicalRecordComponent),
        children: [],
      },
      {
        path: 'general/:id/patient/:patient/medical-record-id/:patientID', // Ruta para historia clínica general
        loadComponent: () =>
          import(
            '../students/pages/medical-records-forms/general/students-general-history.component'
          ).then((m) => m.StudentsGeneralHistoryComponent),
      },
      {
        path: 'rate-treatment/treatment-detail/:idTreatmentDetail/patient/:patientID/medical-record/:medicalRecordId/status/:idStatus', // Ruta para historia clínica general
        loadComponent: () =>
          import(
            './pages/rate-treatment-container/rate-treatment-container.component'
          ).then((m) => m.RateTreatmentContainerComponent),
      },
      {
        path: 'user',
        loadComponent: () =>
          import(
            '../../../shared/components/form-user/form-user.component'
          ).then((m) => m.FormUserComponent),
      },
      {
        path: 'review-treatment',
        loadComponent: () =>
          import(
            './components/review-treatment/presentation/review-treatment.component'
          ).then((m) => m.ReviewTreatmentComponent),
      },
      {
        path: 'approval-treatments',
        loadComponent: () =>
          import(
            './components/approval-of-treatments/approval-of-treatments.component'
          ).then((m) => m.ApprovalOfTreatmentsComponent),
      },
      {
        path: 'authorize-treatments/patient/:patientUuid/treatment-detail/:idTreatmentDetail/status/:statusId',
        loadComponent: () =>
          import(
            './pages/autorize-treatment/autorize-treatment.component'
          ).then((m) => m.AutorizeTreatmentComponent),
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
    ],
  },
] as Routes;
