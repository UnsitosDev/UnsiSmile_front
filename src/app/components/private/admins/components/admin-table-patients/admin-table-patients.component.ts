import { Patient, PatientResponse } from 'src/app/models/shared/patients/patient/patient';
import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { patientsTableData } from 'src/app/models/shared/patients';
import {
  Accion,
  getEntityPropiedades,
} from 'src/app/models/tabla/tabla-columna';
import { TablaDataComponent } from 'src/app/shared/components/tabla-data/tabla-data.component';
import { StudentsGeneralHistoryComponent } from '../../../students/pages/history-clinics/general/students-general-history.component';

@Component({
  selector: 'app-admin-table-patients',
  standalone: true,
  imports: [TablaDataComponent, MatButtonModule, RouterLink],
  templateUrl: './admin-table-patients.component.html',
  styleUrl: './admin-table-patients.component.scss'
})
export class AdminTablePatientsComponent {
  patientsList: patientsTableData[] = [];
  columnas: string[] = [];
  title: string = 'Pacientes';
  currentPage = 0;
  itemsPerPage = 10;
  private apiService = inject(ApiService<PatientResponse>);

  constructor(
    public dialog: MatDialog,
    public router: Router,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.columnas = getEntityPropiedades('patients');
    this.getPacientes(this.currentPage, this.itemsPerPage);
  }

  onPageSizeChange(newSize: number) {
    this.itemsPerPage = newSize;
    this.currentPage = 0;  // Opcionalmente, reinicia a la primera página
    this.getPacientes(this.currentPage, this.itemsPerPage);
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
  patients!: Patient[];
  getPacientes(page: number, size: number) {
    this.apiService.getService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      url: `${UriConstants.GET_PATIENTS}?page=${page}&size=${size}`, // Mantén los parámetros de paginación en la URL
      data: {},
    }).subscribe({
      next: (response) => {  
        if (Array.isArray(response.content)) {
          // Imprimir el contenido específico de la respuesta
          this.patientsList = response.content.map((patient: Patient) => {
            const person = patient.person;
            const medicalHistory = patient.medicalHistoryResponse?.idMedicalHistory ?? 0;
            return {
              nombres: person.firstName,
              apellidos: `${person.firstLastName} ${person.secondLastName}`,
              correo: person.email,
              curp: person.curp,
              idMedicalHistory: medicalHistory,
              patientID: patient.idPatient,
            };
          });
  
        } else {
          console.error('La respuesta no contiene un array en content.');
        }
      },
      error: (error) => {
        console.error('Error en la autenticación o en la solicitud:', error);
        // Si la API devuelve un error específico en su cuerpo, puedes imprimirlo
        if (error.error) {
          console.error('Detalle del error:', error.error);
        }
      }
    });
  }
  //filtar datos
}