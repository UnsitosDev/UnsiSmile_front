import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatSelectModule } from '@angular/material/select';

import { MatNativeDateModule } from '@angular/material/core';
import { UriConstants } from '@mean/utils';
import { ApiService } from '@mean/services';
import { HttpHeaders } from '@angular/common/http';
interface Semester {
  id: number;
  cycleName: string;
}

@Component({
  selector: 'app-admin-upload-students',
  standalone: true,
  imports: [
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatNativeDateModule],
  templateUrl: './admin-upload-students.component.html',
  styleUrl: './admin-upload-students.component.scss',
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUploadStudentsComponent {

  private _formBuilder = inject(FormBuilder);
  apiService = inject(ApiService);

  // Periodo
  firstFormGroup = this._formBuilder.group({
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    semester: ['', Validators.required]
  });

  // Archivo
  secondFormGroup = this._formBuilder.group({
    fileStudent: ['', Validators.required], // Asegúrate de que esté inicializado
  });

  cycle: Semester[] = [
    { id: 1, cycleName: 'A' },
    { id: 2, cycleName: 'B' },
  ];

  sendStudents() {
    // Obtener los valores del formulario
    const startDate = this.firstFormGroup.get('startDate')?.value;
    const endDate = this.firstFormGroup.get('endDate')?.value;
    const semesterId = this.firstFormGroup.get('semester')?.value;

    // Convertir semesterId a número (si es una cadena)
    const semesterIdNumber = Number(semesterId);

    // Buscar el ciclo correspondiente en el arreglo de ciclos
    const selectedCycle = this.cycle.find(cycle => cycle.id === semesterIdNumber);

    // Formatear las fechas a YYYY-MM-DD
    const formatDate = (date: Date): string => {
      return date.toISOString().split('T')[0];
    };

    const semester = {
      startDate: startDate ? formatDate(new Date(startDate)) : null,
      endDate: endDate ? formatDate(new Date(endDate)) : null,
      cycle: {
        idCycle: selectedCycle?.id || 0,
        cycleName: selectedCycle?.cycleName || 'string'
      }
    };

    this.apiService
      .postService({
        headers: new HttpHeaders({
        }),
        url: `${UriConstants.POST_SEMESTERS}`,
        data: semester,
      })
      .subscribe({
        next: (response) => {
        },
        error: (error) => {
          console.log('Error al guardar archivos: ', error);
        },
      });
  }
}
