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
import { HistoryMultidiciplinaryEvaluationComponent } from '../../../components/form-history-multidiciplinary-evaluation/history-multidiciplinary-evaluation.component';
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
    HistoryMultidiciplinaryEvaluationComponent,
    MatDialogModule,
    MatTabsModule,
    MatDialogModule,
    StudentsPatientDetailComponent,
    MatCardModule,
    MatButtonModule
  ],
})
export class StudentsGeneralHistoryComponent implements OnInit {


  public id!: number;
  vitalSigns = true;
  facialExam = true;
  atecedentesHeredofamiliares = true;
  antecedentesPersonalesNoPatologicos = true;
  antecedentesPersonalesPatologicos = true;
  ontogramaInicial = true;
  ontogramaFinal = true;
  medicionDeBolsasInicial = true;
  evaluacion = true;

  facialExamEvent(evento: boolean) {
    this.facialExam = evento;
    this.irSiguienteTab();
  }

  vitalSignsEvent(evento: boolean) {
    this.vitalSigns = evento;
  }

  atecedentesHeredofamiliaresEvent(evento: boolean) {
    this.atecedentesHeredofamiliares = evento;
  }

  antecedentesPersonalesNoPatologicosEvent(evento: boolean) {
    this.antecedentesPersonalesNoPatologicos = evento;
  }

  antecedentesPersonalesPatologicosEvent(evento: boolean) {
    this.antecedentesPersonalesPatologicos = evento;
  }

  ontogramaInicialEvent(evento: boolean) {
    this.ontogramaInicial = evento;
  }

  ontogramaFinalEvent(evento: boolean) {
    this.ontogramaFinal = evento;
  }

  medicionDeBolsasIniciallEvent(evento: boolean) {
    this.medicionDeBolsasInicial = evento;
  }

  evaluacionEvent(evento: boolean) {
    this.evaluacion = evento;
  }

  recibirTab(evento: number) {
    console.log('pagina recibida', evento);
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
      console.log('tab', this.tabGroup.selectedIndex);
    }
  }
}

