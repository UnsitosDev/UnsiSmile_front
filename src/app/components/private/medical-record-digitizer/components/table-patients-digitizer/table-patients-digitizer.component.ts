import { HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { Accion, PatientInfo, PatientResponse, patientsTableData } from '@mean/models';
import { ApiService, DataSharingService } from '@mean/services';
import { LoadingComponent, studentResponse, TablaDataComponent } from '@mean/shared';
import { UriConstants } from '@mean/utils';
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
  private cdr = inject(ChangeDetectorRef);

  title = 'Pacientes';
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
  username = '';

  currentPage = 0;
  itemsPerPage = 10;
  searchTerm = '';

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
          this.username = data.user.username;
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

  onAction(accion: Accion) {
    if (accion.accion === 'Editar') {
      this.editar(accion.fila);
    } else if (accion.accion === 'Detalles') {
      this.openDetailsDialog(accion.fila);
    } else if (accion.accion === 'Modificar') {
      this.edit(accion.fila);
    }
  }

  edit(objeto: any) {
    this.router.navigate(['/students/patients/updatePatient', objeto.patientID]);
  }

  editar(objeto: PatientInfo) {
    this.router.navigate(['/students/patients/treatments/patient/' + objeto.patientID]);
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

  getPacientes(page: number = 0, size: number = 10, keyword: string = '') {
    const url = `${UriConstants.GET_PATIENTS_DIGITIZER}?username=${this.username}&page=${page}&size=${size}&order=createdAt&asc=false`;

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
          this.patientsList = response.content.map((item: any) => {
            const patient = item.patient;
            const person = patient.person;

            return {
              patientID: patient.idPatient,
              nombres: `${person.firstName} ${person.secondName}`,
              apellidos: `${person.firstLastName} ${person.secondLastName}`,
              correo: person.email,
              curp: person.curp,
              idMedicalHistory: patient.medicalRecordNumber,
              estatus: 'Activo'
            } as patientsTableData;
          });
          this.cdr.detectChanges();
        } else {
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
    this.getPacientes(this.currentPage, this.itemsPerPage, this.searchTerm);
  }

  navigateToAddPatient() {
    this.router.navigate(['/medical-record-digitizer/add-patient']);
  }
}