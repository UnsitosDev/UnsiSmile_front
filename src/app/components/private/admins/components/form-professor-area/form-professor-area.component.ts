import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-form-professor-area',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './form-professor-area.component.html',
  styleUrl: './form-professor-area.component.scss'
})
export class FormProfessorAreaComponent implements OnInit {
  employeeNumber: string = '';
  areaForm: FormGroup;
  areas: any[] = [];
  private apiService = inject(ApiService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.areaForm = this.fb.group({
      selectedArea: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.employeeNumber = this.route.snapshot.params['employeeNumber'];
    this.loadAreas();
  }

  loadAreas(page: number = 0, size: number = 10) {
    const url = `${UriConstants.GET_CLINICAL_AREAS}?page=${page}&size=${size}`;
    
    this.apiService.getService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      url,
      data: {},
    }).subscribe({
      next: (response) => {
        if (response && response.content) {
          this.areas = response.content;
        }
      },
      error: (error) => {
        console.error('Error al cargar áreas:', error);
      }
    });
  }

  onSubmit() {
    if (this.areaForm.valid) {
      const professorArea = {
        idProfessorClinicalArea: 0,
        idClinicalArea: this.areaForm.value.selectedArea,
        idProfessor: this.employeeNumber
      };

      this.apiService.postService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: UriConstants.POST_PROFESSOR_CLINICAL_AREAS,
        data: professorArea,
      }).subscribe({
        next: (response) => {
          this.toastr.success('Área clínica asignada exitosamente');
          this.router.navigate(['/admin/professors']);
        },
        error: (error) => {
          console.error('Error al asignar área:', error);
          this.toastr.error(
            error.error?.message || 'Error al asignar el área clínica',
            'Error'
          );
        }
      });
    }
  }
}
