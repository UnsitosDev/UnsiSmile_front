import { Component, OnInit, inject } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { ActivatedRoute } from '@angular/router';
import { TablaDataComponent } from 'src/app/shared/components/tabla-data/tabla-data.component';
import { MatCardModule } from '@angular/material/card';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationAlertComponent } from '../confirmation-alert/confirmation-alert.component';
import { MatDialog } from '@angular/material/dialog';
import { Accion } from 'src/app/models/tabla/tabla-columna';
import { LoadingComponent } from '@mean/shared';

@Component({
  selector: 'app-table-professor-clinical',
  standalone: true,
  imports: [TablaDataComponent, MatCardModule, LoadingComponent],
  templateUrl: './table-professor-clinical.component.html',
  styleUrl: './table-professor-clinical.component.scss'
})
export class TableProfessorClinicalComponent implements OnInit {
  professorsList: any[] = [];
  columns: string[] = ['nombre', 'apellido', 'correo', 'numero empleado'];
  title: string = 'Profesores del Área Clínica';
  areaId: string | null = null;
  areaName: string = '';
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  sortField = 'professor.person.firstName';
  sortAsc = true;

  private apiService = inject(ApiService);
  private route = inject(ActivatedRoute);
  private toastr = inject(ToastrService);
  private dialog = inject(MatDialog);

  ngOnInit() {
    this.areaId = this.route.snapshot.paramMap.get('id');
    if (this.areaId) {
      this.loadProfessors(this.areaId);
    }
  }

  loadProfessors(areaId: string) {
    const url = `${UriConstants.GET_CLINICAL_AREAS}/${areaId}?professorPage=${this.currentPage}&professorSize=${this.pageSize}&professorOrder=${this.sortField}&professorAsc=${this.sortAsc}`;
    
    this.apiService.getService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      url,
      data: {},
    }).subscribe({
      next: (response) => {
        
        if (response) {
          this.areaName = response.clinicalArea;
          this.totalElements = response.professors.totalElements;

          // Mapeamos incluyendo explícitamente el ID de asignación
          this.professorsList = response.professors.content.map((prof: any) => {
            const mappedProf = {
              nombre: prof.person.firstName || '',
              apellido: `${prof.person.firstLastName || ''} ${prof.person.secondLastName || ''}`.trim(),
              correo: prof.person.email || '',
              'numero empleado': prof.employeeNumber || '',
              idAsignacion: prof.idProfessorClinicalArea 
            };
            return mappedProf;
          });
        }
      },
      error: (error) => {
        this.professorsList = [];
      }
    });
  }

  onPageChange(event: number) {
    this.currentPage = event - 1;
    if (this.areaId) {
      this.loadProfessors(this.areaId);
    }
  }

  onPageSizeChange(newSize: number) {
    this.pageSize = newSize;
    this.currentPage = 0;
    if (this.areaId) {
      this.loadProfessors(this.areaId);
    }
  }

  onAction(accion: Accion) {
    if (accion.accion === 'Eliminar') {
      this.deleteProfessorArea(accion.fila);
    }
  }

  deleteProfessorArea(professor: any) {
    const dialogRef = this.dialog.open(ConfirmationAlertComponent, {
      width: '350px',
      data: { 
        title: 'Confirmar eliminación',
        message: `¿Está seguro que desea eliminar al profesor "${professor.nombre} ${professor.apellido}" del área clínica?` 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && professor.idAsignacion) { // Verificamos que exista el ID
        
        this.apiService.deleteService({
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
          url: `${UriConstants.DELETE_PROFESSOR_CLINICAL_AREAS}${professor.idAsignacion}`,
          data: {}
        }).subscribe({
          next: () => {
            this.toastr.success('Profesor eliminado del área clínica con éxito');
            if (this.areaId) {
              this.loadProfessors(this.areaId);
            }
          },
          error: (error) => {
            this.toastr.error('Error al eliminar el profesor del área clínica');
          }
        });
      } else if (result) {
        this.toastr.error('No se encontró el ID de asignación del profesor');
      }
    });
  }
}
