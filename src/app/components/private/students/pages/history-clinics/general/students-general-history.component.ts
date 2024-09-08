import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';

import { HistoryPersonalDataComponent } from '../../../components/form-personal-data/history-personal-data.component';
import { HistoryVitalSignsComponent } from '../../../components/form-history-vital-signs/history-vital-signs.component';
//import { HistoryFacialExamComponent } from './history-facial-exam/history-facial-exam.component';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentsOdontogramComponent } from '../../../components/odontogram/students-odontogram.component';
import { HistoryFacialExamComponent } from '../../../components/form-history-facial-exam/history-facial-exam.component';
import { HistoryFamilyHistoryComponent } from '../../../components/form-history-family-history/history-family-history.component';
import { HistoryInitialBagComponent } from '../../../components/form-history-initial-bag/history-initial-bag.component';
import { NoPathologicalPersonalHistoryComponent } from '../../../components/form-no-pathological-personal-history/no-pathological-personal-history.component';
import { PathologicalPersonalHistoryComponent } from '../../../components/form-pathological-personal-history/pathological-personal-history.component';
import { StudentsPatientDetailComponent } from '../../../components/form-patient-detail/students-patient-detail.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Patient } from 'src/app/models/shared/patients/patient/patient';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { Dialog } from '@angular/cdk/dialog';
import { DialogPersonalDataComponent } from '../../../components/dialog-personal-data/dialog-personal-data.component';
import { clinicalExamComponent } from "../../../components/form-clinical-exam/form-clinical-exam.component";
import { FormFunctionalAnalisisComponent } from "../../../components/form-functional-analisis/form-functional-analisis.component";
import { FormPatientPostureComponent } from "../../../components/form-patient-posture/form-patient-posture.component";
import { FormBucalExamComponent } from "../../../components/form-bucal-exam/form-bucal-exam.component";
import { FormRadiographicAnalysisComponent } from "../../../components/form-radiographic-analysis/form-radiographic-analysis.component";
import { FormStudyModelsAndPhotographsComponent } from "../../../components/form-study-models-and-photographs/form-study-models-and-photographs.component";
import { FormLaboratoryStudyAndBiopsyComponent } from "../../../components/form-laboratory-study-and-biopsy/form-laboratory-study-and-biopsy.component";
import { FormMedicalConsultationComponent } from "../../../components/form-medical-consultation/form-medical-consultation.component";


export interface PatientSummary {
  fullName: string;
  gender: string;
  birthDate: string;
  phone: string;
  address: string;
  email: string;
  admissionDate: string;
  curp: string
}

export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}
@Component({
  selector: 'app-students-general-history',
  standalone: true,
  templateUrl: './students-general-history.component.html',
  styleUrl: './students-general-history.component.scss',
  imports: [
    MatTabsModule,
    HistoryPersonalDataComponent,
    HistoryVitalSignsComponent,
    HistoryFacialExamComponent,
    HistoryFamilyHistoryComponent,
    NoPathologicalPersonalHistoryComponent,
    PathologicalPersonalHistoryComponent,
    StudentsOdontogramComponent,
    HistoryInitialBagComponent,
    MatDialogModule,
    MatTabsModule,
    MatDialogModule,
    StudentsPatientDetailComponent,
    MatCardModule,
    MatButtonModule,
    clinicalExamComponent,
    FormFunctionalAnalisisComponent,
    FormPatientPostureComponent,
    FormBucalExamComponent,
    FormRadiographicAnalysisComponent,
    FormStudyModelsAndPhotographsComponent,
    FormLaboratoryStudyAndBiopsyComponent,
    FormMedicalConsultationComponent
  ],
})
export class StudentsGeneralHistoryComponent implements OnInit {


  public id!: number;
  vitalSigns = true;
  facialExam = true;
  familyMedicalHistory = true;
  personalNonPathologicalHistory = true;
  personalPathologicalHistory = true;
  initialOntogram = true;
  finalOntogram = true;
  initialBagMeasurement = true;
  evaluation = true;
  functionalAnalysis = true;
  patientPosture = true;
  oralExam = true;
  radiographicAnalysis = true;
  studyModelsAndPhotographs = true;
  laboratoryStudies = true;
  medicalConsultation = true;

  facialExamEvent(event: boolean) {
    this.facialExam = event;
  }

  vitalSignsEvent(event: boolean) {
    this.vitalSigns = event;
  }

  familyMedicalHistoryEvent(event: boolean) {
    this.familyMedicalHistory = event;
  }

  personalNonPathologicalHistoryEvent(event: boolean) {
    this.personalNonPathologicalHistory = event;
  }

  personalPathologicalHistoryEvent(event: boolean) {
    this.personalPathologicalHistory = event;
  }

  initialOntogramEvent(event: boolean) {
    this.initialOntogram = event;
  }

  finalOntogramEvent(event: boolean) {
    this.finalOntogram = event;
  }

  initialBagMeasurementEvent(event: boolean) {
    this.initialBagMeasurement = event;
  }

  evaluationEvent(event: boolean) {
    this.evaluation = event;
  }

  functionalAnalysisEvent(event: boolean) {
    this.functionalAnalysis = event;
  }

  patientPostureEvent(event: boolean) {
    this.patientPosture = event;
  }

  oralExamEvent(event: boolean) {
    this.oralExam = event;
  }

  radiographicAnalysisEvent(event: boolean) {
    this.radiographicAnalysis  = event;
  }

  studyModelsAndPhotographsEvent(event: boolean) {
    this.studyModelsAndPhotographs = event;
  }

  laboratoryStudiesEvent(event: boolean) {
    this.laboratoryStudies = event;
  }

  medicalConsultationEvent(event: boolean) {
    this.medicalConsultation = event;
  }

  recibirTab() {
    this.irSiguienteTab();
  }

  nextpage: boolean = true;
  constructor(private router: ActivatedRoute) { }

  ngOnInit(): void {
    this.router.params.subscribe((params) => {
      this.id = params['id'];

      console.log('id del paciente: ', this.id);
      this.fetchPatientData();

    });
  }
  dialog = inject(Dialog);

  openDialog() {
    this.dialog.open(DialogPersonalDataComponent, {
      minWidth: '300px',
      data: {
        patient: this.patient,
        patientSummary: this.patientSummary,
      },
    });
  }

  @Input() idPatient: number = 0;
  public patient!: Patient;
  private patientService = inject(ApiService<Patient, {}>);
  year?: number;
  month?: number;
  day?: number;
  public patientSummary: PatientSummary[] = []; // Array of PatientSummary objects

  fetchPatientData() {
    this.patientService
      .getService({
        url: `${UriConstants.GET_PATIENTS + '/' + this.id}`,
      })
      .subscribe({
        next: (data) => {
          this.patient = data;
          // Extraer year, month y day del objeto Date
          const birthDate = new Date(this.patient.person.birthDate);
          const year = birthDate.getFullYear();
          const month = birthDate.getMonth() + 1; // getMonth() devuelve el mes (0-11), sumamos 1 para obtener el mes (1-12)
          const day = birthDate.getDate();
          // Asignar los valores a las propiedades
          this.year = year;
          this.month = month;
          this.day = day;

          const summary: PatientSummary = {
            fullName: `${data.person.firstName} ${data.person.secondName} ${data.person.firstLastName} ${data.person.secondLastName}`,
            gender: data.person.gender.gender,
            birthDate: this.formatDate(data.person.birthDate),
            phone: data.person.phone,
            address: `${data.address.street.name} # ${data.address.streetNumber}, ${data.address.street.neighborhood.name}, ${data.address.street.neighborhood.locality.name}, ${data.address.street.neighborhood.locality.municipality.name}, ${data.address.street.neighborhood.locality.municipality.state.name}`,
            email: data.person.email,
            admissionDate: this.formatDate(data.admissionDate),
            curp: data.person.curp
          };
          console.log(data)

          this.patientSummary.push(summary);
        },
        error: (error) => { },
      });
  }

  formatDate(dateArray: number[]): string {
    const [year, month, day] = dateArray;
    return `${day}/${month}/${year}`;
  }


  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  @ViewChild(MatTabGroup) tabGroup?: MatTabGroup;

  ngAfterViewInit() {
    this.tabGroup = this.tabGroup;
  }

  irSiguienteTab() {
    if (this.tabGroup) {
      this.tabGroup.selectedIndex = (this.tabGroup.selectedIndex ?? 0) + 1;
    }
  }
}

