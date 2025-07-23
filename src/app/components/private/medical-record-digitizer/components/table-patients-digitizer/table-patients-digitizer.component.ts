import { HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Asegúrate de importar estos módulos
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '@mean/services';
import { LoadingComponent, studentResponse } from '@mean/shared';
import { StudentsGeneralHistoryComponent } from '@mean/students';
import { UriConstants } from '@mean/utils';
import { PatientInfo } from 'src/app/models/patient-object-table/patient.object.table';
import { patientsTableData } from 'src/app/models/shared/patients';
import { Patient, PatientResponse } from 'src/app/models/shared/patients/patient/patient';
import {
  Accion
} from 'src/app/models/tabla/tabla-columna';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { TablaDataComponent } from 'src/app/shared/components/tabla-data/tabla-data.component';
import { DetailsPatientsComponent } from '../../../students/components/details-patients/details-patients.component';


@Component({
  selector: 'app-table-patients-digitizer',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatCheckboxModule, MatInputModule, TablaDataComponent, MatButtonModule, RouterLink, MatCardModule, LoadingComponent],
  templateUrl: './table-patients-digitizer.component.html',
  styleUrl: './table-patients-digitizer.component.scss'
})
export class TablePatientsDigitizerComponent {
  private userService = inject(ApiService<studentResponse, {}>);
  private apiService = inject(ApiService<PatientResponse>);
  private dataSharingService = inject(DataSharingService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  title = 'Pacientes';
  role = 'student';
  columnas: string[] = [];
  sortableColumns = {
    'nombres': 'person.firstName',
    'apellidos': 'person.firstLastName',
    'correo': 'person.email',
    'curp': 'person.curp',
    'estatus': 'user.status'
  };

  patientsList: patientsTableData[] = [];
  totalElements = 0;
  enrollment = '';

  currentPage = 0;
  itemsPerPage = 10;
  sortField = 'person.student.firstName';
  sortAsc = true;

  searchTerm = '';
  isChecked = false;

  check(event: any) {
    this.isChecked = event.checked;
  }

  ngOnInit(): void {
    this.fetchUserData();
    this.columnas = ['nombres', 'apellidos', 'correo', 'curp'];
  }

  fetchUserData() {
    this.userService
      .getService({
        url: `${UriConstants.GET_USER_INFO}`,
      })
      .subscribe({
        next: (data) => {
          this.enrollment = data.enrollment;
          this.getPacientes(this.currentPage, this.itemsPerPage, this.searchTerm);
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
        },
      });
  }

  onPageSizeChange(newSize: number) {
    this.itemsPerPage = newSize;
    this.currentPage = 0;
    this.getPacientes(this.currentPage, this.itemsPerPage, this.searchTerm);
  }

  openDialog(objeto: any) {
    this.dialog.open(StudentsGeneralHistoryComponent, {
      data: objeto,
    });
  }

  onAction(accion: Accion) {
    if (accion.accion === 'Editar') {
      this.editar(accion.fila);
    } else if (accion.accion === 'Eliminar') {
      this.delete(accion.fila.nombre);
    } else if (accion.accion === 'Detalles') {
      this.openDetailsDialog(accion.fila);
    } else if (accion.accion === 'Modificar') {
      this.edit(accion.fila);
    }
  }

  delete(nombre: string) {

  }

  edit(objeto: any) {
    this.router.navigate(['/students/patients/updatePatient', objeto.patientID]);
  }

  editar(objeto: PatientInfo) {
    this.router.navigate(['/students/patients/treatments/patient/' + objeto.patientID]);
  }

  eliminar(nombre: string) {

  }

  mostrarAlerta() {
    alert('¡Haz clic en un icono!');
  }

  openDetailsDialog(patient: any): void {
    this.dataSharingService.setPatientData(patient);
    const dialogRef = this.dialog.open(DetailsPatientsComponent, {
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      height: 'auto',
      panelClass: 'custom-dialog-container'
    });

  }

  idPatientx: number = 0;
  patients!: Patient[];
  getPacientes(page: number = 0, size: number = 10, keyword: string = '') {
    const encodedKeyword = encodeURIComponent(keyword.trim());
    const url = `${UriConstants.GET_PATIENTS_DIGITIZER}?enrollment=${this.enrollment}&page=${page}&size=${size}&keyword=${encodedKeyword}&order=${this.sortField}&asc=${this.sortAsc}`;

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

  onSort(event: { field: string, asc: boolean }) {
    this.sortField = event.field;
    this.sortAsc = event.asc;
    this.getPacientes(this.currentPage, this.itemsPerPage, this.searchTerm);
  }

  navigateToAddPatient() {
    this.router.navigate(['/medical-record-digitizer/add-patient']);
  }
}
