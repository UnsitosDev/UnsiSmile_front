import { ChangeDetectionStrategy, Component, inject, Input, ViewChild } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Validators, FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
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
import { STATUS, STATUS_TREATMENTS } from 'src/app/utils/statusToReview';

@Component({
  selector: 'app-dialog-new-treatment',
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
  public nameTreatment: string = '';
  
  // Identificar modo edición
  public isEditMode: boolean = false;
  public treatmentDetailId: number = 0;


  ngOnInit(): void {
    this.fetchTreatmentData();
    
    // Comprobar si estamos en modo edición
    if (this.data.treatment) {
      this.isEditMode = true;
      this.loadExistingTreatmentData();
    }
  }

  loadExistingTreatmentData() {
    const treatment = this.data.treatment;
    
    // Guardar el ID del tratamiento para la actualización
    this.treatmentDetailId = treatment.idTreatmentDetail;
    
    // Establecer nombre del tratamiento
    this.nameTreatment = treatment.treatment.name;
    
    // Establecer el scope del tratamiento (Diente o General)
    this.selectedTreatmentsName = treatment.treatment.treatmentScope.name;
    
    // Convertir los arrays de fecha a objetos Date
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
    
    // Una vez cargados los tratamientos, seleccionamos el que coincide
    if (this.treatmentData.length > 0) {
      this.selectTreatmentById(treatment.treatment.idTreatment);
    } else {
      // Si aún no se han cargado los tratamientos, creamos un objeto temporal para el formulario
      const tempTreatment = {
        idTreatment: treatment.treatment.idTreatment,
        name: treatment.treatment.name,
        treatmentScope: treatment.treatment.treatmentScope
      };
      this.treatmentControl.setValue(tempTreatment as Treatments);
    }
    
    // Si hay dientes seleccionados
    if (treatment.teeth && Array.isArray(treatment.teeth)) {
      this.itemTeeth.setValue(treatment.teeth);
    }
  }

  selectTreatmentById(idTreatment: number) {
    const foundTreatment = this.treatmentData.find(t => t.idTreatment === idTreatment);
    if (foundTreatment) {
      this.treatmentControl.setValue(foundTreatment);
      if (foundTreatment.treatmentScope) {
        this.selectedTreatmentsName = foundTreatment.treatmentScope.name;
      }
    }
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
          
          // Si estamos en modo edición, seleccionamos el tratamiento después de cargar los datos
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

    // Asegurarnos que los objetos Date son convertidos a strings ISO
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
    // Log del payload para depuración
    console.log('Payload de actualización:', payload);
    
  }

  closeDialog() {
    this.dialogRef.close();
  }
}