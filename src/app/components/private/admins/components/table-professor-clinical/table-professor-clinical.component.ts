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

  private apiService = inject(ApiService);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.areaId = this.route.snapshot.paramMap.get('id');
    if (this.areaId) {
      this.loadProfessors(this.areaId);
    }
  }

  loadProfessors(areaId: string) {
    const url = `${UriConstants.GET_CLINICAL_AREAS}/${areaId}`;
    
    this.apiService.getService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      url,
      data: {},
    }).subscribe({
      next: (response) => {
        console.log('Respuesta completa del servidor:', response);
        
        if (response) {
          this.areaName = response.clinicalArea;
          console.log('Nombre del área:', this.areaName);

          // Mapeamos los profesores desde la respuesta
          this.professorsList = response.professors.map((prof: any) => {
            const professorData = {
              nombre: prof.person.firstName || '',
              apellido: `${prof.person.firstLastName || ''} ${prof.person.secondLastName || ''}`.trim(),
              correo: prof.person.email || '',
              'numero empleado': prof.employeeNumber || ''
            };
            console.log('Datos del profesor procesado:', professorData);
            return professorData;
          });

          console.log('Lista final de profesores:', this.professorsList);
        }
      },
      error: (error) => {
        console.error('Error al cargar profesores:', error);
        this.professorsList = [];
      }
    });
  }
}
