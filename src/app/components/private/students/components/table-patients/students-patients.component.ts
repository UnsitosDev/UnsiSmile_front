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
import { StudentsGeneralHistoryComponent } from '../../pages/history-clinics/general/students-general-history.component';
import { DialogHistoryClinicsComponent } from '../dialog-history-clinics/dialog-history-clinics.component';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  // Asegúrate de importar estos módulos


@Component({
  selector: 'app-students-patients',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatCheckboxModule ,MatInputModule, TablaDataComponent, MatButtonModule, RouterLink],
  templateUrl: './students-patients.component.html',
  styleUrl: './students-patients.component.scss',
})
export class StudentsPatientsComponent implements OnInit {
  patientsList: patientsTableData[] = [];
  columnas: string[] = [];
  title: string = 'Pacientes';
  currentPage = 0;
  itemsPerPage = 10;
  private apiService = inject(ApiService<PatientResponse>);
  isChecked: boolean = false;
  searchTerm: string = ''; // Variable para almacenar el término de búsqueda


  check(event: any) {
    this.isChecked = event.checked; // Actualiza el estado según el valor del checkbox
  }
  constructor(
    public dialog: MatDialog,
    public router: Router,
    public route: ActivatedRoute
  ) { }

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

  editar(objeto: any) {
    this.dialog.open(DialogHistoryClinicsComponent, {
      width: '650px',
      data: objeto,
    });
  }

  eliminar(nombre: string) {
    console.log('eliminar', nombre);
  }

  mostrarAlerta() {
    alert('¡Haz clic en un icono!');
  }

  idPatientx: number = 0;
  patients!: Patient[];
  getPacientes(page: number, size: number, keyword: string = '') {
    const url = `${UriConstants.GET_PATIENTS}?keyword=${keyword}`;
    this.apiService.getService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      url,
      data: {},
    }).subscribe({
      next: (response) => {
        console.log('Respuesta del backend:', response); // Debug
        if (Array.isArray(response.content)) {
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
          this.patientsList = []; // Limpia la tabla si no hay resultados
        }
      },
      error: (error) => {
        console.error('Error en la autenticación o en la solicitud:', error);
      },
    });
  }
  

  onSearch(keyword: string) {
    console.log('Búsqueda recibida:', keyword); // Debug
    if (keyword.length >= 2 || keyword.length === 0) {
      this.currentPage = 0; // Reinicia la página a la primera
      this.getPacientes(this.currentPage, this.itemsPerPage, keyword);
    }
  }
  //filtar datos
}