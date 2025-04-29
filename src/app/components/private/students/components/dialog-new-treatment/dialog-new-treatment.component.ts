import { ChangeDetectionStrategy, Component, inject, Input, ViewChild } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';

import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';
import { Treatments } from '@mean/models';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { SpanishDateAdapter } from 'src/app/shared/adapters/spanish-date.adapter';
import { storeProphylaxis } from 'src/app/services/prophylaxis.service';
import { RequestTreatment } from 'src/app/models/treatments/payloadtreatments.model';
import { STATUS } from 'src/app/utils/statusToReview';

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
  @ViewChild('startPicker') startPicker!: MatDatepicker<Date>;
  @ViewChild('endPicker') endPicker!: MatDatepicker<Date>;

  public data = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<DialogNewTreatmentComponent>);
  private readonly apiService = inject(ApiService);
  public readonly toast = inject(ToastrService);
  STATUS = STATUS;
  public treatmentControl = new FormControl<Treatments | null>(null, Validators.required);
  public startDateControl = new FormControl<Date | null>(null, Validators.required);
  public endDateControl = new FormControl<Date | null>(null, Validators.required);
  public itemTeeth = new FormControl<any[]>([], Validators.required);

  public treatmentData: Treatments[] = [];
  public selectedTreatmentsName: string = '';
  public teeth = storeProphylaxis.theetProphylaxis;

  ngOnInit(): void {
    this.fetchTreatmentData();
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
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  onTreatmentSelected(event: MatSelectChange): void {
    const selectedTreatment = event.value;
    if (selectedTreatment?.treatmentScope) {
      this.selectedTreatmentsName = selectedTreatment.treatmentScope.name;
    }
  }

  saveTreatment() {
    this.treatmentControl.markAsTouched();
    this.startDateControl.markAsTouched();
    this.endDateControl.markAsTouched();

    if (this.selectedTreatmentsName === 'Diente') {
      this.itemTeeth.markAsTouched();
    }

    if (!this.treatmentControl.value || !this.startDateControl.value ||
      (this.selectedTreatmentsName === 'Diente' && this.itemTeeth.value?.length === 0)) {
      this.toast.error('Por favor, complete todos los campos obligatorios.');
      return;
    }

    const selectedTeeth = this.itemTeeth.value
      ? this.itemTeeth.value.map((tooth: any) => tooth.idTooth.toString())
      : [];

    const payload: RequestTreatment = {
      idTreatmentDetail: 0,
      patientId: this.data.patientUuid,
      treatmentId: this.treatmentControl.value.idTreatment,
      startDate: this.startDateControl.value.toISOString(),
      endDate: this.endDateControl.value?.toISOString() || '',
      professorId: "1696",
      status: STATUS.IN_REVIEW,
      treatmentDetailToothRequest: {
        idTreatmentDetail: 0,
        idTeeth: selectedTeeth
      }
    };

    this.apiService.postService({
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      url: `${UriConstants.POST_TREATMENTS}`,
      data: payload
    }).subscribe({
      next: () => {
        this.toast.success('Tratamiento creado exitosamente');
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error(error);
        this.toast.error('Error al crear tratamiento');
      }
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
