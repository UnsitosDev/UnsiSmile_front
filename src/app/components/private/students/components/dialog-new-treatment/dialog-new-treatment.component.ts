import { HttpHeaders } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
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
import { Treatments } from '@mean/models';
import { ApiService, storeDentalOrgans } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { ToastrService } from 'ngx-toastr';
import { ThoothProphylaxis } from 'src/app/models/shared/prophylaxis/prophylaxis.model';
import { RequestTreatment } from 'src/app/models/treatments/payloadtreatments.model';
import { SpanishDateAdapter } from 'src/app/shared/adapters/spanish-date.adapter';
import { STATUS } from 'src/app/utils/statusToReview';

export interface TreatmentTooth {
  idDetailTooth: number;
  idTooth: string;
}

export type ToothInput = TreatmentTooth | ThoothProphylaxis;
export type ToothOption = TreatmentTooth;

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

  public treatmentControl = new FormControl<Treatments | null>(null, Validators.required);
  public startDateControl = new FormControl<Date | null>(null, Validators.required);
  public endDateControl = new FormControl<Date | null>(null, Validators.required);
  public itemTeeth = new FormControl<any[]>([], Validators.required);

  public treatmentData: Treatments[] = [];
  public selectedTreatmentsName: string = '';
  public nameTreatment: string = '';

  public teeth = storeDentalOrgans.teethDentalOrgans.map(tooth => ({
    idTooth: tooth.idTooth.toString(),
    idDetailTooth: 0 
  })) as ToothInput[];

  STATUS = STATUS;

  // Identificar modo edición
  public isEditMode: boolean = false;
  public treatmentDetailId: number = 0;

  ngOnInit(): void {
    this.fetchTreatmentData();

    if (this.data.treatment) {
      this.isEditMode = true;
      this.loadExistingTreatmentData();
    }
  }

  /**
 * Obtiene los dientes actualmente seleccionados en el formulario.
 * @returns {Array} Retorna un array de dientes seleccionados o un array vacío si no hay ninguno.
 */
  get selectedTeeth() {
    return this.itemTeeth.value || [];
  }

  /**
 * Obtiene los dientes disponibles que no están seleccionados.
 * Compara los dientes de storeProphylaxis con los ya seleccionados.
 * @returns {Array} Retorna un array de dientes disponibles para selección.
 */
  get availableTeeth() {
    // Obtener los IDs de los dientes ya seleccionados como strings
    const selectedIds = this.selectedTeeth.map(item => item.idTooth.toString());

    // Filtrar los dientes de storeProphylaxis excluyendo los ya seleccionados
    return this.teeth.filter(tooth =>
      !selectedIds.includes(tooth.idTooth.toString())
    );
  }

  /**
  * Normaliza el formato de un diente para ser usado como opción en el select.
  * @param {Object} tooth - El objeto diente a normalizar
  * @returns {Object} Retorna el diente en formato compatible con el formulario
  */
  toothToOption(tooth: ToothInput): ToothOption {
    if ('idDetailTooth' in tooth) {
      return tooth;
    }

    return {
      idDetailTooth: 0,
      idTooth: tooth.idTooth.toString()
    };
  }

  /**
 * Carga los datos de un tratamiento existente para edición.
 * Configura todos los controles del formulario con los valores del tratamiento.
 */
  public loadExistingTreatmentData() {
    const treatment = this.data.treatment;

    if (this.isEditMode) {
      this.treatmentControl.disable();
      this.startDateControl.disable();
    }

    // Configuración del tratamiento
    this.treatmentDetailId = treatment.idTreatmentDetail;
    this.nameTreatment = treatment.treatment.name;
    this.selectedTreatmentsName = treatment.treatment.treatmentScope.name;

    // Conversión de fechas
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

    // Selección del tratamiento en el control
    if (this.treatmentData.length > 0) {
      this.selectTreatmentById(treatment.treatment.idTreatment);
    } else {
      // Creación temporal si los datos no están cargados
      const tempTreatment = {
        idTreatment: treatment.treatment.idTreatment,
        name: treatment.treatment.name,
        treatmentScope: treatment.treatment.treatmentScope
      };
      this.treatmentControl.setValue(tempTreatment as Treatments);
    }

    // Configuración de dientes seleccionados
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

          if (this.isEditMode && this.data.treatment) {
            this.selectTreatmentById(this.data.treatment.treatment.idTreatment);
          }
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
    if (!this.validateAndMarkControls()) {
      return;
    }

    const payload = this.buildTreatmentPayload();

    if (this.isEditMode) {
      this.updateTreatment(payload);
    } else {
      this.sendTreatmentRequest(payload);
    }
  }

  private validateAndMarkControls(): boolean {
    this.treatmentControl.markAsTouched();
    this.startDateControl.markAsTouched();
    this.endDateControl.markAsTouched();

    if (this.selectedTreatmentsName === 'Diente') {
      this.itemTeeth.markAsTouched();
    }

    const basicFieldsValid = this.treatmentControl.value && this.startDateControl.value;
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
    const selectedTeeth =
      this.itemTeeth.value?.map((tooth) => tooth.idTooth.toString()) || [];

    const startDateISO = this.startDateControl.value ? this.startDateControl.value.toISOString() : '';
    const endDateISO = this.endDateControl.value ? this.endDateControl.value.toISOString() : '';

    return {
      idTreatmentDetail: this.isEditMode ? this.treatmentDetailId : 0,
      patientId: this.isEditMode ? this.data.treatment.patientId : this.data.patientUuid,
      treatmentId: this.isEditMode
        ? this.data.treatment.treatment.idTreatment
        : this.treatmentControl.value!.idTreatment,
      startDate: startDateISO,
      endDate: endDateISO,
      treatmentDetailToothRequest: {
        idTreatmentDetail: this.isEditMode ? this.treatmentDetailId : 0,
        idTeeth: selectedTeeth,
      },
    };
  }

  private sendTreatmentRequest(payload: RequestTreatment): void {
    this.apiService
      .postService({
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        url: `${UriConstants.POST_TREATMENTS}`,
        data: payload,
      })
      .subscribe({
        next: () => {
          this.toast.success('Tratamiento creado exitosamente');
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.toast.error(error);
        },
      });
  }

  private updateTreatment(payload: RequestTreatment): void {
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
        error: (error) => {
          this.toast.error(error);
        },
      });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}