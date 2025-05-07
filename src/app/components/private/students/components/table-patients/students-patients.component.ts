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
import { MatCardModule } from '@angular/material/card';
import { DetailsPatientsComponent } from '../details-patients/details-patients.component';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { TreatmentsComponent } from '../../pages/treatments/treatments.component';
import { PatientInfo } from 'src/app/models/patient-object-table/patient.object.table';
import { LoadingComponent } from '@mean/shared';


@Component({
  selector: 'app-students-patients',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatCheckboxModule, MatInputModule, TablaDataComponent, MatButtonModule, RouterLink, MatCardModule, LoadingComponent],
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
  totalElements: number = 0; // Agregar esta propiedad
  sortField: string = 'person.student.firstName';
  role = 'student'
  sortAsc: boolean = true;
  sortableColumns = {
    'nombres': 'person.firstName',
    'apellidos': 'person.firstLastName',
    'correo': 'person.email',
    'curp': 'person.curp',
    'estatus': 'user.status'  // Agregado el campo estatus para ordenamiento
  };
  private dataSharingService = inject(DataSharingService);


  check(event: any) {
    this.isChecked = event.checked; // Actualiza el estado según el valor del checkbox
  }
  constructor(
    public dialog: MatDialog,
    public router: Router,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.columnas = [...getEntityPropiedades('patients'), 'estatus'];
    this.getPacientes(this.currentPage, this.itemsPerPage, this.searchTerm);
  }

  onPageSizeChange(newSize: number) {
    this.itemsPerPage = newSize;
    this.currentPage = 0;  // Opcionalmente, reinicia a la primera página
    this.getPacientes(this.currentPage, this.itemsPerPage, this.searchTerm);
  }

  openDialog(objeto: any) {
    this.dialog.open(StudentsGeneralHistoryComponent, {
      data: objeto,
    });
  }

  onAction(accion: Accion) {
    if (accion.accion === 'Editar') {  // Cambiado de 'Editar' a 'Modificar'
      this.editar(accion.fila);
    } else if (accion.accion === 'Eliminar') {
      this.delete(accion.fila.nombre);
    } else if (accion.accion === 'Detalles') {
      this.openDetailsDialog(accion.fila);
    }  else if (accion.accion === 'Modificar') {
      this.edit(accion.fila);
    }
  }
  
  delete(nombre: string) {
    console.log('eliminar', nombre);
  }

  edit(objeto: any) {
    this.router.navigate(['/students/patients/updatePatient', objeto.patientID]);
  }

  editar(objeto: PatientInfo) {
    this.router.navigate(['/students/treatments/patient/' + objeto.patientID]);
  }

  eliminar(nombre: string) {
    console.log('eliminar', nombre);
  }

  mostrarAlerta() {
    alert('¡Haz clic en un icono!');
  }

  // Agregar este nuevo método
  openDetailsDialog(patient: any): void {
    this.dataSharingService.setPatientData(patient);
    const dialogRef = this.dialog.open(DetailsPatientsComponent, {
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      height: 'auto',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  idPatientx: number = 0;
  patients!: Patient[];
  getPacientes(page: number = 0, size: number = 10, keyword: string = '') {
    const encodedKeyword = encodeURIComponent(keyword.trim());
    const url = `${UriConstants.GET_PATIENTS}?page=${page}&size=${size}&keyword=${encodedKeyword}&order=${this.sortField}&asc=${this.sortAsc}`;
    
    this.apiService.getService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      url,
      data: {},
    }).subscribe({
      next: (response) => {
        if (Array.isArray(response.content)) {
          this.totalElements = response.totalElements;
          this.patientsList = response.content.map((patient: Patient) => {
            const person = patient.person;
            return {
              patientID: patient.idPatient, 
              nombres: person.firstName,
              apellidos: `${person.firstLastName} ${person.secondLastName}`,
              correo: person.email,
              curp: person.curp,
              telefono: person.phone,
              fechaNacimiento: person.birthDate,
              estatus: 'Activo'
            };
          });
        } else {
          console.error('La respuesta no contiene un array en content.');
          this.patientsList = [];
          this.totalElements = 0;
        }
      },
      error: (error) => {
        console.error('Error en la autenticación:', error);
        this.patientsList = [];
        this.totalElements = 0;
      },
    });
  }

  onSearch(keyword: string) {
    this.searchTerm = keyword;
    this.currentPage = 0;
    this.getPacientes(this.currentPage, this.itemsPerPage, this.searchTerm);
  }

  onPageChange(event: number) {
    this.currentPage = event - 1;
    this.getPacientes(this.currentPage, this.itemsPerPage, this.searchTerm);
  }
  
  onSort(event: {field: string, asc: boolean}) {
    this.sortField = event.field;
    this.sortAsc = event.asc;
    this.getPacientes(this.currentPage, this.itemsPerPage, this.searchTerm);
  }
  //filtar datos
}