import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { TabViewModule } from 'primeng/tabview';

// Componentes
import { CardPatientDataComponent } from "../../../components/card-patient-data/card-patient-data.component";
import { TabFormComponent } from 'src/app/shared/components/tab-form/tab-form.component';

// Servicios
import { ApiService } from '@mean/services';
import { GeneralHistoryService } from 'src/app/services/history-clinics/general/general-history.service';
import { HistoryData } from 'src/app/models/form-fields/form-field.interface';

// Modelos
import { Patient } from 'src/app/models/shared/patients/patient/patient';
import { dataTabs } from 'src/app/models/form-fields/form-field.interface';
import { UriConstants } from '@mean/utils';
import { cardPatient } from 'src/app/models/shared/patients/cardPatient';
import { HttpHeaders } from '@angular/common/http';

import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-students-general-history',
  standalone: true,
  templateUrl: './students-general-history.component.html',
  styleUrl: './students-general-history.component.scss',
  imports: [MatInputModule, TabFormComponent, MatTabsModule, MatDialogModule, MatTabsModule, MatDialogModule, MatCardModule, MatButtonModule, CardPatientDataComponent, TabViewModule],
})

export class StudentsGeneralHistoryComponent implements OnInit {
  @Input() idPatient: number = 0;
  private router = inject(ActivatedRoute);
  private historyData = inject(GeneralHistoryService);
  private patientService = inject(ApiService<Patient, {}>);
  public id!: number;
  public idpatient!: number;
  public year?: number;
  public month?: number;
  public day?: number;
  public nextpage: boolean = true;
  public patient!: Patient;
  public data!: dataTabs;
  public patientData!: cardPatient;
  public currentIndex: number = 0; // Índice del tab activo
  public mappedHistoryData!: dataTabs;
  

  constructor() { }

  ngOnInit(): void {
    this.router.params.subscribe((params) => {
      this.id = params['id'];
      this.idpatient = params['patientID']; 
       // Llamar al servicio y suscribirse a los datos
       this.historyData.getHistoryClinics(this.id, this.idpatient).subscribe({
        next: (mappedData: dataTabs) => {
          this.mappedHistoryData = mappedData; // Asignar los datos mapeados a la variable
          console.log('Datos mapeados en el componente:', this.mappedHistoryData);
        }
      });
      this.fetchPatientData();   
      this.historyData.getHistoryClinics(this.id, this.idpatient)
    });    
  }

  fetchPatientData(): void {
    if (this.id !== undefined) {
      this.patientService.getService({
        url: `${UriConstants.GET_PATIENTS}/${this.id}`,
      }).subscribe({
        next: (data) => {
          this.patient = data;
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
    return `${street.name} # ${street.streetNumber}, ${street.neighborhood.name}, ${street.neighborhood.locality.name}, ${street.neighborhood.locality.municipality.name}, ${street.neighborhood.locality.municipality.state.name}`;
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

