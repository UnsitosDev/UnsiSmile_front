import { Component, inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { clinicalExamComponent } from "../../../components/form-clinical-exam/form-clinical-exam.component";
import { FormFunctionalAnalisisComponent } from "../../../components/form-functional-analisis/form-functional-analisis.component";
import { FormPatientPostureComponent } from "../../../components/form-patient-posture/form-patient-posture.component";
import { FormBucalExamComponent } from "../../../components/form-bucal-exam/form-bucal-exam.component";
import { FormRadiographicAnalysisComponent } from "../../../components/form-radiographic-analysis/form-radiographic-analysis.component";
import { FormStudyModelsAndPhotographsComponent } from "../../../components/form-study-models-and-photographs/form-study-models-and-photographs.component";
import { FormLaboratoryStudyAndBiopsyComponent } from "../../../components/form-laboratory-study-and-biopsy/form-laboratory-study-and-biopsy.component";
import { FormMedicalConsultationComponent } from "../../../components/form-medical-consultation/form-medical-consultation.component";
import { CardPatientDataComponent } from "../../../components/card-patient-data/card-patient-data.component";
import { TabFormComponent } from 'src/app/shared/components/tab-form/tab-form.component';
import { dataTabs, FormField, formSectionFields } from 'src/app/models/form-fields/form-field.interface';
import { multidiciplinaryEvaluationService } from 'src/app/services/history-clinics/general/clinicalExamFields.service';
import { VitalSignsFormService } from 'src/app/services/history-clinics/general/vitalSigns.service';
import { bucalExamService } from 'src/app/services/history-clinics/general/bucalExamFields.service';
import { TabViewModule } from 'primeng/tabview';

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

@Component({
  selector: 'app-students-general-history',
  standalone: true,
  templateUrl: './students-general-history.component.html',
  styleUrl: './students-general-history.component.scss',

  imports: [
    TabFormComponent,
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
    FormMedicalConsultationComponent,
    CardPatientDataComponent,
    TabViewModule
  ],
})
export class StudentsGeneralHistoryComponent implements OnInit {
  @Input() idPatient: number = 0;

  private router = inject(ActivatedRoute);
  private bucalExam = inject(bucalExamService);
  private vitalSingsService = inject(VitalSignsFormService);
  private patientService = inject(ApiService<Patient, {}>);

  public id!: number;
  public patient!: Patient;
  public vitalSingsFields!: formSectionFields;
  public bucalExamFields!: formSectionFields;
  public data!: dataTabs;
  public nextpage: boolean = true;

  public year?: number;
  public month?: number;
  public day?: number;

  public patientSummary: PatientSummary[] = []; 

  constructor() {
    this.bucalExamFields = this.bucalExam.getOralExamFields();
    this.vitalSingsFields = this.vitalSingsService.getVitalSignsFields();
  }

  ngOnInit(): void {
    this.router.params.subscribe((params) => {
      this.id = params['id'];
      this.fetchPatientData();
    });
    this.initializeData();
  }

  private initializeData(): void {
    this.data = {
      title: 'HISTORIA CLINICA GENERAL',
      tabs: [this.vitalSingsFields, this.bucalExamFields]
    };
  }

  fetchPatientData() {
    this.patientService
      .getService({
        url: `${UriConstants.GET_PATIENTS}/${this.id}`,
      })
      .subscribe({
        next: (data) => {
          this.patient = data;

          // obtener datos del paciente
          const { person, address, admissionDate } = data;
          const { firstName, secondName, firstLastName, secondLastName, gender, birthDate, phone, email, curp } = person;

          // Formatear la fecha de nacimiento
          const formattedBirthDate = this.formatDate(birthDate);

          // Asignar año, mes y día
          const birthDateObj = new Date(birthDate);
          this.year = birthDateObj.getFullYear();
          this.month = birthDateObj.getMonth() + 1; // getMonth() devuelve el mes (0-11), sumamos 1 para obtener el mes (1-12)
          this.day = birthDateObj.getDate();

          // Crear un resumen del paciente
          const summary: PatientSummary = {
            fullName: this.getFullName(firstName, secondName, firstLastName, secondLastName),
            gender: gender.gender,
            birthDate: formattedBirthDate,
            phone: phone,
            address: this.formatAddress(address),
            email: email,
            admissionDate: this.formatDate(admissionDate),
            curp: curp
          };

          // Agregar el resumen a la lista
          this.patientSummary.push(summary);
        },
        error: (error) => {
          console.error('Error fetching patient data:', error);
        },
      });
  }

  // Método auxiliar para obtener el nombre completo
  private getFullName(firstName: string, secondName: string, firstLastName: string, secondLastName: string): string {
    return `${firstName} ${secondName} ${firstLastName} ${secondLastName}`.trim();
  }

  // Método auxiliar para formatear la dirección
  private formatAddress(address: any): string {
    const { street } = address;
    return `${street.name} # ${street.streetNumber}, ${street.neighborhood.name}, ${street.neighborhood.locality.name}, ${street.neighborhood.locality.municipality.name}, ${street.neighborhood.locality.municipality.state.name}`;
  }

  formatDate(dateArray: number[]): string {
    const [year, month, day] = dateArray;
    return `${day}/${month}/${year}`;
  }

}

