import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldComponentComponent } from 'src/app/shared/components/field-component/field-component.component';
import { FormField } from 'src/app/models/form-fields/form-field.interface';
import { MatButtonModule } from '@angular/material/button';
import { medicalInterconsultationService } from 'src/app/services/history-clinics/general/medicalInterconsultation.service';
@Component({
  selector: 'app-form-medical-consultation',
  standalone: true,
  imports: [ReactiveFormsModule,FieldComponentComponent,MatButtonModule],
  templateUrl: './form-medical-consultation.component.html',
  styleUrl: './form-medical-consultation.component.scss'
})
export class FormMedicalConsultationComponent {
  formGroup!: FormGroup;
  medicalConsultationFields : FormField[] = [];

  constructor(
    private fb: FormBuilder,
    private medicalConsultation: medicalInterconsultationService,

  ) { }

  ngOnInit(): void {
    //Obtener los campos del formulario del servicio
    this.medicalConsultationFields = this.medicalConsultation.getMedicalInterconsultationFields();


    // Construcción del formulario
    this.formGroup = this.fb.group({}); // Inicializar el FormGroup
    [...this.medicalConsultationFields].forEach(field => {
      this.formGroup.addControl(
        field.name,
        this.fb.control(field.value || '', field.validators || [])
      );
    });
  }
  getFieldValue(fieldName: string) {
    return this.formGroup.get(fieldName)?.value;
  }

  @Output() nextTabEventEmitted = new EventEmitter<boolean>();
  emitNextTabEvent() {
      this.nextTabEventEmitted.emit(false);
  }
  
}
