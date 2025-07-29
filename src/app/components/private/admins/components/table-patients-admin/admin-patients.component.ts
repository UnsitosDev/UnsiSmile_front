import { Patient, PatientResponse } from 'src/app/models/shared/patients/patient/patient';
import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { patientsTableData } from 'src/app/models/shared/patients';
import { AssignStudentComponent } from '../assign-student/assign-student.component';
import { AssignDigitizerComponent } from '../assign-digitizer/assign-digitizer.component';
import {
  Accion,
  getEntityPropiedades,
} from 'src/app/models/tabla/tabla-columna';
import { TablaDataComponent } from 'src/app/shared/components/tabla-data/tabla-data.component';
import { StudentsGeneralHistoryComponent } from '../../../students/pages/medicalRecords/general/students-general-history.component';
import { DialogHistoryClinicsComponent } from '../../../students/components/dialog-history-clinics/dialog-history-clinics.component';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  // Asegúrate de importar estos módulos
import { MatCardModule } from '@angular/material/card';
import { LoadingComponent } from '@mean/shared';
import { ToastrService } from 'ngx-toastr';
import { PatientInfo } from 'src/app/models/patient-object-table/patient.object.table';


@Component({
  selector: 'app-students-patients',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatCheckboxModule ,MatInputModule, TablaDataComponent, MatButtonModule, RouterLink, MatCardModule],
  templateUrl: './admin-patients.component.html',
  styleUrl: './admin-patients.component.scss',
})
export class AdminPatientsComponent implements OnInit {
  patientsList: patientsTableData[] = [];
  columnas: string[] = [];
  title: string = 'Pacientes';
  role = 'admin';
  currentPage = 0;
  itemsPerPage = 10;
  private apiService = inject(ApiService<PatientResponse>);
  private toastr = inject(ToastrService);
  isChecked: boolean = false;
  searchTerm: string = ''; // Variable para almacenar el término de búsqueda
  totalElements: number = 0; // Agregar esta propiedad
  sortField: string = 'person.firstName';
  sortAsc: boolean = true;
  sortableColumns = {
    'nombres': 'person.firstName',
    'apellidos': 'person.firstLastName',
    'correo': 'person.email',
    'curp': 'person.curp',
    'estatus': 'user.status'  // Agregado el campo estatus para ordenamiento
  };


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
    if (accion.accion === 'Editar') {
      this.editar(accion.fila);
    } else if (accion.accion === 'Eliminar') {
      this.delete(accion.fila.nombre);
    } else if (accion.accion === 'Detalles') {
      this.openDetailsDialog(accion.fila);
    } else if (accion.accion === 'Modificar') {
      this.edit(accion.fila);
    } else if (accion.accion === 'Asignar') {
      this.openAssignStudentDialog(accion.fila);
    } else if (accion.accion === 'AsignarDigitalizador') {
      this.openAssignDigitizerDialog(accion.fila);
    }
  }

  openAssignStudentDialog(patient: patientsTableData): void {
    console.log('ID del paciente que se enviará:', patient.patientID);
    
    const dialogRef = this.dialog.open(AssignStudentComponent, {
      width: '500px',
      data: {
        patientId: patient.patientID.toString(), // Convertir a string para asegurar compatibilidad
        patientName: `${patient.nombres} ${patient.apellidos}`
      }
    });

    console.log('Datos enviados al diálogo:', {
      patientId: patient.patientID.toString(),
      patientName: `${patient.nombres} ${patient.apellidos}`
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Refrescar la lista de pacientes después de asignar un estudiante
        this.getPacientes(this.currentPage, this.itemsPerPage, this.searchTerm);
      }
    });
  }

edit(objeto: PatientInfo) {
    this.router.navigate(['/admin/patients/treatments/patient/' + objeto.patientID]);
  }

  openAssignDigitizerDialog(patient: patientsTableData): void {
    console.log('ID del paciente para asignar digitalizador:', patient.patientID);
    
    const dialogRef = this.dialog.open(AssignDigitizerComponent, {
      width: '500px',
      data: {
        patientId: patient.patientID.toString(),
        patientName: `${patient.nombres} ${patient.apellidos}`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Refrescar la lista de pacientes después de asignar un digitalizador
        this.getPacientes(this.currentPage, this.itemsPerPage, this.searchTerm);
      }
    });
  }

  editar(objeto: any) {
    this.dialog.open(DialogHistoryClinicsComponent, {
      width: '650px',
      data: { objeto, role: this.role },
    });
  }

   // Agregar método para abrir el diálogo de detalles
    openDetailsDialog(admin: patientsTableData): void {
      
      };

    delete(nombre: string) {
  }

  mostrarAlerta() {
    alert('¡Haz clic en un icono!');
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
          this.patientsList = [];
          this.totalElements = 0;
        }
      },
      error: (error) => {
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