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
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatList } from '@angular/material/list';
import {MatListItem} from '@angular/material/list';

interface Professor {
  employeeNumber: string;
  person: {
    firstName: string;
    firstLastName: string;
  };
}

@Component({
  selector: 'app-form-clinical-area',
  standalone: true,
  imports: [
    MatListItem,
    MatList,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule,
    MatPaginatorModule,
    MatInputModule
  ],
  templateUrl: './form-clinical-area.component.html',
  styleUrl: './form-clinical-area.component.scss'
})
export class FormClinicalAreaComponent implements OnInit {
  areaId: string | null = null;
  professorForm: FormGroup;
  professors: Professor[] = [];
  private apiService = inject(ApiService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  totalElements: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  orderBy: string = 'person.firstName';
  ascending: boolean = true;
  searchKeyword: string = '';
  selectedProfessors: Professor[] = [];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.professorForm = this.fb.group({
      selectedProfessor: ['']
    });
  }

  ngOnInit() {
    this.areaId = this.route.snapshot.params['id'];
      this.loadProfessors();
    };
  

  loadProfessors(page: number = this.pageIndex, size: number = this.pageSize) {
    const url = `${UriConstants.GET_PROFESSORS}?page=${page}&size=${size}&order=${this.orderBy}&asc=${this.ascending}&keyword=${this.searchKeyword}`;
    
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

  handlePageEvent(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.loadProfessors();
  }

  onSearch(event: any) {
    this.searchKeyword = event.target.value;
    this.pageIndex = 0;
    this.loadProfessors();
  }

  addProfessor() {
    const selectedProf = this.professors.find(
      p => p.employeeNumber === this.professorForm.get('selectedProfessor')?.value
    );
    
    if (selectedProf && !this.selectedProfessors.some(p => p.employeeNumber === selectedProf.employeeNumber)) {
      this.selectedProfessors.push(selectedProf);
      this.professorForm.get('selectedProfessor')?.reset();
    }
  }

  removeProfessor(employeeNumber: string) {
    this.selectedProfessors = this.selectedProfessors.filter(
      p => p.employeeNumber !== employeeNumber
    );
  }

  onSubmit() {
    if (this.areaId && this.selectedProfessors.length > 0) {
      const requests = this.selectedProfessors.map(professor => {
        const professorArea = {
          idProfessorClinicalArea: 0,
          idClinicalArea: this.areaId,
          idProfessor: professor.employeeNumber
        };

        return this.apiService.postService({
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
          url: UriConstants.POST_PROFESSOR_CLINICAL_AREAS,
          data: professorArea,
        }).toPromise();
      });

      Promise.all(requests)
        .then(() => {
          this.toastr.success('Profesores asignados exitosamente al área clínica');
          this.router.navigate(['/admin/areas']);
        })
        .catch(error => {
          console.error('Error al asignar profesores:', error);
          this.toastr.error('Error al asignar los profesores al área clínica', 'Error');
        });
    }
  }
}
