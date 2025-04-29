import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';

import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';

import { ToastrService } from 'ngx-toastr';

import { Treatments } from '@mean/models';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { SpanishDateAdapter } from 'src/app/shared/adapters/spanish-date.adapter';
import { storeProphylaxis } from 'src/app/services/prophylaxis.service';


@Component({
  selector: 'app-dialog-new-treatment',
  standalone: true,
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: DateAdapter, useClass: SpanishDateAdapter } 
  ], 
  imports: [MatListModule, MatDialogModule, MatCardModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule],
  templateUrl: './dialog-new-treatment.component.html',
  styleUrl: './dialog-new-treatment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogNewTreatmentComponent {
  private dialogRef = inject(MatDialogRef<DialogNewTreatmentComponent>);
  private readonly apiService = inject(ApiService);
  public readonly troast = inject(ToastrService);
  public treatmentData!: Treatments[];
  public dentalOrgan: boolean = false;
  public selectedTreatments: Treatments[] = [];
  public selectedTreatmentsName!: string;
  public teeth = storeProphylaxis.theetProphylaxis;
  
  public itemTeeth = new FormControl('');

  ngOnInit(): void {
    this.fetchTreatmentData();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  fetchTreatmentData() {
    this.apiService
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_TREATMENTS}`,
        data: {},
      })
      .subscribe({
        next: (response: Treatments[]) => {
          this.treatmentData = response;
          console.log('Tratamientos: ', this.treatmentData)
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  onTreatmentSelected(event: MatSelectChange): void {
    const selectedTreatment = event.value;    
    if (selectedTreatment && selectedTreatment.treatmentScope) {
      this.selectedTreatmentsName = selectedTreatment.treatmentScope.name;
    }
    this.selectedTreatments;
  }

}
