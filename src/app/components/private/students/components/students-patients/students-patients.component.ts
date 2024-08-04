import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import {
  patientResponse
} from 'src/app/models/shared/patients/patient/patient';
import { patientsTableData } from 'src/app/models/tabla/patients';
import {
  Accion,
  getEntityPropiedades,
} from 'src/app/models/tabla/tabla-columna';
import { ProductService } from 'src/app/services/product.service';
import { TablaDataComponent } from 'src/app/shared/tabla-data/tabla-data.component';
import { StudentsGeneralHistoryComponent } from '../students-general-history/students-general-history.component';

@Component({
  selector: 'app-students-patients',
  standalone: true,
  imports: [TablaDataComponent, MatButtonModule, RouterLink],
  templateUrl: './students-patients.component.html',
  styleUrl: './students-patients.component.scss',
})
export class StudentsPatientsComponent implements OnInit {
  patientsList: patientsTableData[] = [];
  columnas: string[] = [];
  title: string = 'Pacientes';
  private apiService = inject(ApiService<patientResponse>);

  constructor(
    public dialog: MatDialog,
    public router: Router,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.columnas = getEntityPropiedades('patients');
    this.getPacientes();
  }

  openDialog(objeto: any) {
    this.dialog.open(StudentsGeneralHistoryComponent, {
      data: objeto,
    });
  }

  onAction(accion: Accion) {
    if (accion.accion == 'Editar') {
      this.editar(accion.fila);
    } else if (accion.accion == 'Eliminar') {
      this.eliminar(accion.fila.nombre);
    } else if (accion.accion == 'MostrarAlerta') {
      this.mostrarAlerta();
    }
  }

  // Id paciente
  editar(objeto: any) {
  // console.log('osddsfsdf',objeto.patientID);
  this.router.navigate(['/students', 'historyClinic', objeto.patientID]);
}

  eliminar(nombre: string) {
    console.log('eliminar', nombre);
  }

  mostrarAlerta() {
    alert('¡Haz clic en un icono!');
  }

  idPatientx: number = 0;
  pacientesData: patientResponse[] = [];
  getPacientes() {
    this.apiService
      .getListService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_PATIENTS}`,
        data: {},
      })
      .subscribe({
        next: (response) => {
          this.pacientesData = response;
         // console.log('Respuesta del servidor:', this.pacientesData);


          // Mapear los datos deseados de cada paciente
          this.patientsList = this.pacientesData.map((patient) => {
            const person = patient.person; // Obtener el objeto "person"
            this.idPatientx = patient.idPatient;
            // console.log('idpatiendfsdfsdf', this.idPatientx);
            //const medicalHistory = patient.medicalHistoryResponse;
            const medicalHistory =
              patient.medicalHistoryResponse?.idMedicalHistory ?? 0;
            return {
              nombre: person.firstName,
              apellido: `${person.firstLastName} ${person.secondLastName}`,
              correo: person.email,
              curp: person.curp,
              idMedicalHistory: medicalHistory,
              patientID:this.idPatientx
            };
          });
          // console.log('Respuesta del servidor:', this.patientsList);
        },
        error: (error) => {
          console.error('Error en la autenticación:', error);
        },
      });
  }

  //filtar datos
}
