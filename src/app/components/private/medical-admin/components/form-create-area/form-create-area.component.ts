import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UriConstants } from '../../../../../utils/uris.contants';
import { ClinicalArea } from '../../../../../shared/models/shared/admin/clinical-area.interface';
import { LoadingComponent } from "../../../../../shared/models/shared/loading/loading.component";
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/shared/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-create-area',
  standalone: true,
  imports: [MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatNativeDateModule,
    MatTabsModule,
    MatCardModule,
    LoadingComponent],
  templateUrl: './form-create-area.component.html',
  styleUrl: './form-create-area.component.scss'
})
export class FormCreateAreaComponent {
  areaForm: FormGroup;
  private toastr = inject(ToastrService);
 private apiService = inject(ApiService);
  


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
    
  ) {
    this.areaForm = this.fb.group({
      clinicalArea: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.areaForm.valid) {
      const clinicalArea = {
        idClinicalArea: 0,
        clinicalArea: this.areaForm.value.clinicalArea
      };

      this.apiService.postService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        url: UriConstants.POST_CLINICAL_AREA,
        data: clinicalArea,
      }).subscribe({
        next: (response) => {
          this.toastr.success('Área clínica creada exitosamente');
          this.areaForm.reset();
          this.router.navigate(['/medical-admin/areas']); // Asegúrate de que esta ruta existe
        },
        error: (error) => {
          this.toastr.error(
            error.error?.message || 'Error al crear el área clínica', 
            'Error'
          );
        },
      });
    }
  }
}
