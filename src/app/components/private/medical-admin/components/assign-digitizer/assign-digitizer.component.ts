import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/shared/services';
import { UriConstants } from '@mean/utils';
import { FieldComponentComponent } from 'src/app/shared/components/field-component/field-component.component';
import { FormField } from 'src/app/shared/models/form-fields/form-field.interface';
import { MatCardModule } from '@angular/material/card';
import { Observable, Subject, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs';

export interface AssignDigitizerDialogData {
  patientId: string;
  patientName: string;
}

interface Digitizer {
  idMedicalRecordDigitizer: number;
  digitizerName: string;
  username: string;
}

@Component({
  selector: 'app-assign-digitizer',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatCardModule,
  ],
  templateUrl: './assign-digitizer.component.html',
  styleUrl: './assign-digitizer.component.scss'
})
export class AssignDigitizerComponent implements OnInit {
  private apiService = inject(ApiService);
  private toastr = inject(ToastrService);
  private dialogRef = inject(MatDialogRef<AssignDigitizerComponent>);
  private fb = inject(FormBuilder);
  
  patientName: string = '';
  formGroup!: FormGroup;
  
  // Autocompletado
  filteredDigitizers: Observable<Digitizer[]> = new Observable<Digitizer[]>();
  digitizers: Digitizer[] = [];
  searchDigitizers = new Subject<string>();
  selectedDigitizer: Digitizer | null = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: AssignDigitizerDialogData) {}

  ngOnInit(): void {
    this.patientName = this.data?.patientName || 'Paciente';
    
    this.formGroup = this.fb.group({
      digitizerSearch: ['', Validators.required],
      medicalRecordDigitizerId: ['', Validators.required]
    });

    // Configurar búsqueda con debounce
    this.setupDigitizerSearch();
  }

  setupDigitizerSearch() {
    this.filteredDigitizers = this.searchDigitizers.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(keyword => this.searchDigitizersApi(keyword))
    );
  }

  searchDigitizersApi(keyword: string): Observable<Digitizer[]> {
    if (!keyword || keyword.trim() === '') {
      return new Observable(observer => {
        observer.next([]);
        observer.complete();
      });
    }
    
    return this.apiService.getService({
      url: `${UriConstants.GET_DIGITIZERS}?keyword=${encodeURIComponent(keyword)}`
    }).pipe(
      map((response: any) => {
        if (response && response.content) {
          return response.content.map((item: any) => ({
            idMedicalRecordDigitizer: item.idMedicalRecordDigitizer,
            digitizerName: item.digitizerName,
            username: item.username
          }));
        }
        return [];
      })
    );
  }

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchDigitizers.next(target.value);
  }

  displayFn(digitizer: Digitizer): string {
    return digitizer ? `${digitizer.digitizerName} (${digitizer.username})` : '';
  }

  selectDigitizer(event: any) {
    this.selectedDigitizer = event.option.value;
    if (this.selectedDigitizer) {
      this.formGroup.get('medicalRecordDigitizerId')?.setValue(this.selectedDigitizer.idMedicalRecordDigitizer);
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  assignDigitizer(): void {
    if (this.formGroup.invalid) {
      this.toastr.warning('Por favor, selecciona un capturador válido', 'Advertencia');
      return;
    }

    if (!this.data?.patientId) {
      this.toastr.error('No se ha especificado un ID de paciente válido', 'Error');
      return;
    }

    const assignmentData = {
      patientId: this.data.patientId,
      medicalRecordDigitizerId: this.formGroup.get('medicalRecordDigitizerId')?.value
    };

    this.apiService.postService({
      url: UriConstants.POST_PATIENT_DIGITIZER,
      data: assignmentData
    }).subscribe({
      next: () => {
        this.toastr.success('Capturador asignado correctamente', 'Éxito');
        this.dialogRef.close(true);
      },
      error: (error) => {
        const errorMsg = error?.error?.message || 'El paciente ya está asignado a este capturador.';
        this.toastr.warning(errorMsg, 'Advertencia');
      }
    });
  }
}
