import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TablaDataComponent } from 'src/app/shared/components/tabla-data/tabla-data.component';
import { HttpHeaders } from '@angular/common/http';
import { ApiService } from 'src/app/shared/services';
import { UriConstants } from '@mean/utils';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { LoadingComponent } from '@mean/shared';
import { Accion } from 'src/app/shared/models/tabla/tabla-columna';

interface PatientData {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  curp: string;
  medicalRecordNumber: number;
  idPatientMedicalRecord?: number;
}

@Component({
  selector: 'app-table-assign-digitizer',
  standalone: true,
  imports: [
    CommonModule,
    TablaDataComponent,
    MatButtonModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatInputModule,
    LoadingComponent
  ],
  templateUrl: './table-assign-digitizer.component.html',
  styleUrl: './table-assign-digitizer.component.scss'
})
export class TableAssignDigitizerComponent implements OnInit {
  title: string = 'Pacientes Asignados';
  patientsList: PatientData[] = [];
  columns: string[] = [ 'nombre', 'apellidos', 'email', 'curp'];
  digitizerUsername: string = '';
  digitizerName: string = '';
  
  private apiService = inject(ApiService);
  private toastr = inject(ToastrService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  currentPage = 0;
  itemsPerPage = 10;
  searchTerm: string = '';
  totalElements: number = 0;
  sortField: string = 'createdAt';
  sortAsc: boolean = false;
  sortableColumns = {
    'nombre': 'person.firstName',
    'apellidos': 'person.firstLastName',
    'email': 'person.email',
    'curp': 'person.curp',
    'medicalRecordNumber': 'patient.medicalRecordNumber'
  };

  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.digitizerUsername = params['username'];
      
      if (this.digitizerUsername) {
        this.getDigitizerInfo();
        this.getPatientsForDigitizer();

        // Configurar búsqueda con debounce
        this.searchSubject.pipe(
          debounceTime(300),
          distinctUntilChanged()
        ).subscribe(searchTerm => {
          this.currentPage = 0;
          this.getPatientsForDigitizer(this.currentPage, this.itemsPerPage, searchTerm);
        });
      } else {
        this.toastr.error('No se ha especificado un capturador', 'Error');
        this.router.navigate(['/medical-admin/digitizers']);
      }
    });
  }

  getDigitizerInfo(): void {
    // Esta función podría usarse para obtener información adicional del capturador
    // por ahora simplemente establecemos el nombre para mostrar en la interfaz
    const username = this.digitizerUsername;
    this.apiService.getService({
      url: `${UriConstants.GET_USER_BY_USERNAME}${username}`
    }).subscribe({
      next: (response: any) => {
        if (response) {
          this.digitizerName = response.name || username;
        }
      },
      error: () => {
        this.digitizerName = username;
      }
    });
  }

  getPatientsForDigitizer(page: number = 0, size: number = 10, keyword: string = ''): void {
    const encodedKeyword = encodeURIComponent(keyword);
    const url = `${UriConstants.GET_PATIENTS_DIGITIZER}?username=${this.digitizerUsername}&page=${page}&size=${size}&order=${this.sortField}&asc=${this.sortAsc}`;
    
    this.apiService.getService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      url,
      data: {},
    }).subscribe({
      next: (response) => {
        if (response && response.content && Array.isArray(response.content)) {
          this.totalElements = response.totalElements;
          this.patientsList = response.content.map((item: any) => {
            // Accedemos a los datos del paciente (que están en item.patient)
            const patient = item.patient || {};
            const person = patient.person || {};
            
            return {
              id: patient.idPatient || '',
              nombre: person.firstName || '',
              apellidos: `${person.firstLastName || ''} ${person.secondLastName || ''}`,
              email: person.email || '',
              curp: person.curp || '',
              medicalRecordNumber: patient.medicalRecordNumber || 0,
              idPatientMedicalRecord: patient.idPatientMedicalRecord || 0
            };
          });
        } else {
          this.patientsList = [];
          this.totalElements = 0;
        }
      },
      error: (error) => {
        this.toastr.error('Error al cargar la lista de pacientes', 'Error');
        console.error('Error loading patients:', error);
        this.patientsList = [];
        this.totalElements = 0;
      },
    });
  }

  onPageChange(event: number): void {
    this.currentPage = event - 1;
    this.getPatientsForDigitizer(this.currentPage, this.itemsPerPage, this.searchTerm);
  }

  onPageSizeChange(newSize: number): void {
    this.itemsPerPage = newSize;
    this.currentPage = 0;
    this.getPatientsForDigitizer(this.currentPage, this.itemsPerPage, this.searchTerm);
  }

  onSearch(keyword: string): void {
    this.searchTerm = keyword;
    this.searchSubject.next(keyword);
  }

  onSort(event: {field: string, asc: boolean}): void {
    this.sortField = event.field;
    this.sortAsc = event.asc;
    this.getPatientsForDigitizer(this.currentPage, this.itemsPerPage, this.searchTerm);
  }

  onAction(accion: Accion): void {
    if (accion.accion === 'Detalles') {
      this.viewPatientDetails(accion.fila);
    }
  }

  viewPatientDetails(patient: PatientData): void {
    // Navegar a los detalles del paciente
    if (patient && patient.id) {
      this.router.navigate(['/medical-admin/patients/treatments/patient', patient.id]);
    } else {
      this.toastr.warning('Este paciente no tiene registros médicos disponibles', 'Información');
    }
  }

  goBack(): void {
    this.router.navigate(['/medical-admin/digitizers']);
  }
}
