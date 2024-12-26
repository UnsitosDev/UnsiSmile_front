import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { TabViewModule } from 'primeng/tabview';
import { MatInputModule } from '@angular/material/input';

// Componentes
import { cardGuardian, CardPatientDataComponent } from "../../../components/card-patient-data/card-patient-data.component";
import { TabFormComponent } from 'src/app/shared/components/tab-form/tab-form.component';
import { StudentsOdontogramComponent } from '../../../components/odontogram/students-odontogram.component';
import { HistoryInitialBagComponent } from "../../../components/form-history-initial-bag/history-initial-bag.component";

// Servicios
import { ApiService } from '@mean/services';
import { GeneralHistoryService } from 'src/app/services/history-clinics/general/general-history.service';

// Modelos
import { Patient } from 'src/app/models/shared/patients/patient/patient';
import { dataTabs } from 'src/app/models/form-fields/form-field.interface';
import { UriConstants } from '@mean/utils';
import { cardPatient } from 'src/app/models/shared/patients/cardPatient';

@Component({
  selector: 'app-students-dental-operation',
  standalone: true,
  imports: [StudentsOdontogramComponent, MatInputModule, TabFormComponent, MatTabsModule, MatDialogModule, MatTabsModule, MatDialogModule, MatCardModule, MatButtonModule, CardPatientDataComponent, TabViewModule, HistoryInitialBagComponent],
  templateUrl: './students-dental-operation.component.html',
  styleUrl: './students-dental-operation.component.scss'
})
export class StudentsDentalOperationComponent {
  private router = inject(ActivatedRoute);
  private historyData = inject(GeneralHistoryService);
  private patientService = inject(ApiService<Patient, {}>);
  private id!: number;
  private idpatient!: string;
  private year?: number;
  private month?: number;
  private day?: number;
  private nextpage: boolean = true;
  private patient!: Patient;
  public patientData!: cardPatient;
  public guardianData!: cardGuardian;
  public currentIndex: number = 0; // Índice del tab activo
  public mappedHistoryData!: dataTabs;
  private idPatientClinicalHistory!: number;

  constructor() { }

  ngOnInit(): void {
    this.router.params.subscribe((params) => {
      this.id = params['id']; // Id Historia Clinica
      this.idpatient = params['patient']; // Id Paciente
      this.idPatientClinicalHistory = params ['patientID']; // idPatientClinicalHistory
      this.historyData.getHistoryClinics(this.idpatient, this.id).subscribe({
        next: (mappedData: dataTabs) => {
          this.mappedHistoryData = mappedData;
        }
      });
      this.fetchPatientData();
    });
  }

  fetchPatientData(): void {
    if (this.idpatient) {
      this.patientService.getService({
        url: `${UriConstants.GET_PATIENTS}/${this.idpatient}`,
      }).subscribe({
        next: (data) => {
          this.patient = data;
          console.log('Paciente', this.patient);
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
          this.patientData = {
            fullName: this.getFullName(firstName, secondName, firstLastName, secondLastName),
            gender: gender.gender,
            birthDate: formattedBirthDate,
            phone: phone,
            address: this.formatAddress(address),
            email: email,
            admissionDate: this.formatDate(admissionDate),
            curp: curp
          };
          this.guardianData = {
            firstName: this.patient.guardian.firstName,
            lastName: this.patient.guardian.lastName,
            email: this.patient.guardian.email,
            phone: this.patient.guardian.phone
          }
        },
        error: (error) => {
          console.error('Error fetching patient data:', error);
        },
      });
    }
  }

  // Método auxiliar para obtener el nombre completo
  private getFullName(firstName: string, secondName: string, firstLastName: string, secondLastName: string): string {
    return `${firstName} ${secondName} ${firstLastName} ${secondLastName}`.trim();
  }

  // Método auxiliar para formatear la dirección
  private formatAddress(address: any): string {
    const { street } = address;
    return `${street.name} , ${street.neighborhood.name}, ${street.neighborhood.locality.name}, ${street.neighborhood.locality.municipality.name}, ${street.neighborhood.locality.municipality.state.name}`;
  }

  // Método para formatear fecha
  formatDate(dateArray: number[]): string {
    const [year, month, day] = dateArray;
    return `${day}/${month}/${year}`;
  }

  onNextTab(): void {
    this.currentIndex++; // Incrementar el índice del tab activo
    if (this.currentIndex >= this.mappedHistoryData.tabs.length) {
      this.currentIndex = this.mappedHistoryData.tabs.length - 1; // Limitar el índice si excede la cantidad de tabs
    }
  }

  onPreviousTab(): void {
    this.currentIndex--; // Decrementar el índice del tab activo
    if (this.currentIndex < 0) {
      this.currentIndex = 0; // Limitar el índice si es menor que cero
    }
  }

}
