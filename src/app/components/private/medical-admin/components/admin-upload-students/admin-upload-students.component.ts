import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { UriConstants } from '@mean/utils';
import { ApiService } from 'src/app/shared/services';
import { HttpHeaders } from '@angular/common/http';
import { LoadingComponent } from "../../../../../shared/models/shared/loading/loading.component";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Messages } from 'src/app/utils/messageConfirmLeave';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
interface Cycle {
  idCycle: number;
  cycleName: string;
}

interface Semester {
  idSemester: number;
  semesterName: string;
  fechaInicio: [number, number, number];
  fechaFin: [number, number, number];
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
    MatNativeDateModule,
    LoadingComponent,
    MatTabsModule,
    MatCardModule
  ],
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
export class AdminUploadStudentsComponent implements OnInit {
  @ViewChild('stepper') private stepper!: MatStepper;
  file: File | null = null;
  isEditable = false;
  currentSemester: boolean = true;

  private _formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef);
  apiService = inject(ApiService);

  ngOnInit(): void {
    this.getCycles();
  }

  cycle: Cycle[] = [];
  getCycles() {
    this.apiService
      .getListService({
        headers: new HttpHeaders({}),
        url: `${UriConstants.GET_ALL_CYCLES}`,
        data: {},
      })
      .subscribe({
        next: (response) => {
          this.cycle = response;
        },
        error: (error) => {
          console.log('Error', error);
        },
      });
  }

  // Ciclo
  firstFormGroup = this._formBuilder.group({
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    semester: ['', Validators.required]
  });

  // Archivo
  secondFormGroup = this._formBuilder.group({
    fileStudent: ['', Validators.required],
  });

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.file = file;
    }
  }

  sendStudents() {
    if (this.firstFormGroup.invalid) {
      this.toastr.warning(Messages.WARNING_INSERT_CYCLE);
      return;
    }

    // Obtener los valores del formulario
    const startDate = this.firstFormGroup.get('startDate')?.value;
    const endDate = this.firstFormGroup.get('endDate')?.value;
    const semesterId = this.firstFormGroup.get('semester')?.value;

    // Convertir semesterId a número (si es una cadena)
    const semesterIdNumber = Number(semesterId);

    // Buscar el ciclo correspondiente en el arreglo de ciclos
    const selectedCycle = this.cycle.find(cycle => cycle.idCycle === semesterIdNumber);

    // Formatear las fechas a YYYY-MM-DD
    const formatDate = (date: Date): string => {
      return date.toISOString().split('T')[0];
    };

    const semester = {
      startDate: startDate ? formatDate(new Date(startDate)) : null,
      endDate: endDate ? formatDate(new Date(endDate)) : null,
      cycle: {
        idCycle: selectedCycle?.idCycle || 0,
        cycleName: selectedCycle?.cycleName || 'string'
      }
    };

    this.apiService
      .postService({
        headers: new HttpHeaders({}),
        url: `${UriConstants.POST_SEMESTERS}`,
        data: semester,
      })
      .subscribe({
        next: (response) => {
          this.toastr.success(Messages.SUCCES_INSERT_CYCLE);
          this.isEditable = true;
          this.stepper.next();
        },
        error: (error) => {
          console.log('Error', error);
        },
      });
  }

  sendFile() {
    if (!this.file) {
      this.toastr.warning(Messages.WARNING_NO_FILE_SELECTED);
      return;
    }

    const formData = new FormData();
    formData.append('file', this.file);

    this.apiService
      .postService({
        headers: new HttpHeaders({
        }),
        url: `${UriConstants.UPLOAD_STUDENTS}`,
        data: formData,
      })
      .subscribe({
        next: (response) => {
          this.router.navigate(['/medical-admin/students']);
        },
        error: (error) => {
          this.toastr.error(Messages.ERROR_INSERT_FILE);
        },
      });
  }
}
