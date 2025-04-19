import { Component, OnInit, inject } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { ActivatedRoute } from '@angular/router';
import { TablaDataComponent } from 'src/app/shared/components/tabla-data/tabla-data.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-table-professor-clinical',
  standalone: true,
  imports: [TablaDataComponent, MatCardModule],
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

          // Mapeamos los profesores desde la respuesta paginada
          this.professorsList = response.professors.content.map((prof: any) => {
            const professorData = {
              nombre: prof.person.firstName || '',
              apellido: `${prof.person.firstLastName || ''} ${prof.person.secondLastName || ''}`.trim(),
              correo: prof.person.email || '',
              'numero empleado': prof.employeeNumber || ''
            };
            return professorData;
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
}
