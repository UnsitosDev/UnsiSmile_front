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
  selector: 'app-form-clinical-area',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './form-clinical-area.component.html',
  styleUrl: './form-clinical-area.component.scss'
})
export class FormClinicalAreaComponent implements OnInit {
  areaId: string | null = null;
  professorForm: FormGroup;
  professors: any[] = [];
  private apiService = inject(ApiService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.professorForm = this.fb.group({
      selectedProfessor: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.areaId = this.route.snapshot.params['id'];
      this.loadProfessors();
    };
  

  loadProfessors(page: number = 0, size: number = 10) {
    const url = `${UriConstants.GET_PROFESSORS}?page=${page}&size=${size}`;
    
    this.apiService.getService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      url,
      data: {},
    }).subscribe({
      next: (response) => {
        if (response && response.content) {
          this.professors = response.content;
        }
      },
      error: (error) => {
        console.error('Error al cargar profesores:', error);
        this.toastr.error('Error al cargar la lista de profesores', 'Error');
      }
    });
  }

  onSubmit() {
    if (this.professorForm.valid && this.areaId) {
      const professorArea = {
        idProfessorClinicalArea: 0,
        idClinicalArea: this.areaId,
        idProfessor: this.professorForm.value.selectedProfessor
      };

      this.apiService.postService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: UriConstants.POST_PROFESSOR_CLINICAL_AREAS,
        data: professorArea,
      }).subscribe({
        next: (response) => {
          this.toastr.success('Profesor asignado exitosamente al área clínica');
          this.router.navigate(['/admin/areas']);
        },
        error: (error) => {
          console.error('Error al asignar profesor:', error);
          this.toastr.error(
            error.error?.message || 'Error al asignar el profesor al área clínica',
            'Error'
          );
        }
      });
    }
  }
}
