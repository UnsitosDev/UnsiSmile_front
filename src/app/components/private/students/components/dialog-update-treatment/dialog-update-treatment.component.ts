import { HttpHeaders } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DateAdapter, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { PaginatedData, ProfessorClinicalAreaResponse, RequestTreatment, ThoothProphylaxis, Treatments } from '@mean/models';
import { ApiService, storeDentalOrgans } from '@mean/services';
import { SpanishDateAdapter } from '@mean/shared';
import { UriConstants } from '@mean/utils';
import { ToastrService } from 'ngx-toastr';

export interface TreatmentTooth {
  idDetailTooth: number;
  idTooth: string;
}

export type ToothInput = TreatmentTooth | ThoothProphylaxis;
export type ToothOption = TreatmentTooth;

@Component({
  selector: 'app-dialog-update-treatment',
  standalone: true,
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: DateAdapter, useClass: SpanishDateAdapter }
  ],
  imports: [
    MatListModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule
  ],
  templateUrl: './dialog-update-treatment.component.html',
  styleUrl: './dialog-update-treatment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogUpdateTreatmentComponent implements OnInit {
  @ViewChild('endPicker') endPicker!: MatDatepicker<Date>;

  public data = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<DialogUpdateTreatmentComponent>);
  private readonly apiService = inject(ApiService);
  public readonly toast = inject(ToastrService);

  public treatmentControl = new FormControl<Treatments | null>(null, Validators.required);
  public startDateControl = new FormControl<Date | null>({ value: null, disabled: true }, Validators.required);
  public endDateControl = new FormControl<Date | null>(null, Validators.required);
  public itemTeeth = new FormControl<any[]>([], Validators.required);
  public professorControl = new FormControl<number | null>(null, Validators.required);

  public treatmentData: Treatments[] = [];
  public professorAreasData: PaginatedData<ProfessorClinicalAreaResponse> | null = null;
  public selectedTreatmentsName!: string;
  public nameTreatment!: string;
  public idTreatment: number = 0;

  public teeth = storeDentalOrgans.teethDentalOrgans.map(tooth => ({
    idTooth: tooth.idTooth.toString(),
    idDetailTooth: 0
  })) as ToothInput[];

  public treatmentDetailId: number = 0;

  ngOnInit(): void {
    this.fetchTreatmentData();
    this.fetchProfessorAreas();
    this.loadExistingTreatmentData();
  }

  public cancel() {
    this.dialogRef.close();
  }

  get selectedTeeth() {
    return this.itemTeeth.value || [];
  }

  get availableTeeth() {
    const selectedIds = this.selectedTeeth.map(item => item.idTooth.toString());
    return this.teeth.filter(tooth =>
      !selectedIds.includes(tooth.idTooth.toString())
    );
  }

  toothToOption(tooth: ToothInput): ToothOption {
    if ('idDetailTooth' in tooth) { return tooth; }
    return { idDetailTooth: 0, idTooth: tooth.idTooth.toString() };
  }

  public loadExistingTreatmentData() {
    const treatment = this.data.treatment;
    this.startDateControl.disable();

    this.treatmentDetailId = treatment.idTreatmentDetail;
    this.nameTreatment = treatment.treatment.name;
    this.selectedTreatmentsName = treatment.treatment.treatmentScope.name;

    this.professorControl.setValue(treatment.treatment.professor);

    if (treatment.startDate && Array.isArray(treatment.startDate)) {
      const [year, month, day, hour, minute] = treatment.startDate;
      const startDate = new Date(year, month - 1, day, hour, minute);
      this.startDateControl.setValue(startDate);
    }

    if (treatment.endDate && Array.isArray(treatment.endDate)) {
      const [year, month, day, hour, minute] = treatment.endDate;
      const endDate = new Date(year, month - 1, day, hour, minute);
      this.endDateControl.setValue(endDate);
    }

    if (this.treatmentData.length > 0) {
      this.selectTreatmentById(treatment.treatment.idTreatment);
    }

    if (treatment.teeth && Array.isArray(treatment.teeth)) {
      this.itemTeeth.setValue(treatment.teeth);
    }
  }

  public selectTreatmentById(idTreatment: number) {
    const foundTreatment = this.treatmentData.find(t => t.idTreatment === idTreatment);
    if (foundTreatment) {
      this.treatmentControl.setValue(foundTreatment);
      if (foundTreatment.treatmentScope) {
        this.selectedTreatmentsName = foundTreatment.treatmentScope.name;
      }
    }
  }

  public fetchTreatmentData() {
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
          this.selectTreatmentById(this.data.treatment.treatment.idTreatment);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  public onTreatmentSelected(event: MatSelectChange): void {
    const selectedTreatment = event.value;
    this.idTreatment = selectedTreatment.idTreatment;
    if (selectedTreatment?.treatmentScope) {
      this.selectedTreatmentsName = selectedTreatment.treatmentScope.name;
    }
  }

  public updateTreatment() {
    if (!this.validateAndMarkControls()) { return; }
    const payload = this.buildTreatmentPayload();

    this.apiService
      .patchService({
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        url: `${UriConstants.PUT_TREATMENT}/${this.treatmentDetailId}`,
        data: payload,
      })
      .subscribe({
        next: () => {
          this.toast.success('Tratamiento actualizado');
          this.dialogRef.close(true);
        },
        error: (error) => { this.toast.error(error); },
      });
  }

  private validateAndMarkControls(): boolean {
    this.treatmentControl.markAsTouched();
    this.startDateControl.markAsTouched();
    this.endDateControl.markAsTouched();
    this.professorControl.markAsTouched();

    if (this.selectedTreatmentsName === 'Diente') { this.itemTeeth.markAsTouched(); }

    const basicFieldsValid = this.treatmentControl.value && this.startDateControl.value && this.professorControl.value;
    const teethValid =
      this.selectedTreatmentsName !== 'Diente' ||
      (this.itemTeeth.value?.length ?? 0) > 0;

    if (!basicFieldsValid || !teethValid) {
      this.toast.warning('Por favor, complete todos los campos obligatorios.');
      return false;
    }

    return true;
  }

  private buildTreatmentPayload(): RequestTreatment {
    const selectedTeeth = this.itemTeeth.value?.map((tooth) => tooth.idTooth.toString()) || [];

    const startDateISO = this.startDateControl.value ? this.startDateControl.value.toISOString() : '';
    const endDateISO = this.endDateControl.value ? this.endDateControl.value.toISOString() : '';

    return {
      idTreatmentDetail: this.treatmentDetailId,
      professorClinicalAreaId: this.professorControl.value || 0,
      patientId: this.data.treatment.patient.id,
      treatmentId: this.treatmentControl.value?.idTreatment || this.idTreatment,
      startDate: startDateISO,
      endDate: endDateISO,
      treatmentDetailToothRequest: {
        idTreatmentDetail: this.treatmentDetailId,
        idTeeth: selectedTeeth,
      },
    };
  }

  public fetchProfessorAreas() {
    this.apiService.getService({
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      url: UriConstants.GET_PROFESSORS_AREAS,
      data: {},
    }).subscribe({
      next: (response: PaginatedData<ProfessorClinicalAreaResponse>) => {
        this.professorAreasData = response;
      },
      error: (error) => { this.toast.error(error); }
    });
  }

  public closeDialog() {
    this.dialogRef.close();
  }
}