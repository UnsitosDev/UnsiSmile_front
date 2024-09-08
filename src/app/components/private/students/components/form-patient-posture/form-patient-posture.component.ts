import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldComponentComponent } from 'src/app/shared/components/field-component/field-component.component';
import { FormField } from 'src/app/models/form-fields/form-field.interface';
import { MatButtonModule } from '@angular/material/button';
import { patientPostureService } from 'src/app/services/history-clinics/general/patientPostureFields.service';

@Component({
  selector: 'app-form-patient-posture',
  standalone: true,
  imports: [ReactiveFormsModule,FieldComponentComponent,MatButtonModule],
  templateUrl: './form-patient-posture.component.html',
  styleUrl: './form-patient-posture.component.scss'
})
export class FormPatientPostureComponent {
  formGroup!: FormGroup;
  patientPostureFields : FormField[] = [];

  constructor(
    private fb: FormBuilder,
    private patientPosture: patientPostureService,

  ) { }

  ngOnInit(): void {
    //Obtener los campos del formulario del servicio
    this.patientPostureFields = this.patientPosture.getPatientPosture();


    // Construcción del formulario
    this.formGroup = this.fb.group({}); // Inicializar el FormGroup
    [...this.patientPostureFields].forEach(field => {
      this.formGroup.addControl(
        field.name,
        this.fb.control(field.value || '', field.validators || [])
      );
    });
  }
  getFieldValue(fieldName: string) {
    return this.formGroup.get(fieldName)?.value;
  }

  onSubmit(){
    this.nextTab();
    this.emitNextTabEvent();
  }

  @Output() nextTabEventEmitted = new EventEmitter<boolean>();
  emitNextTabEvent() {
      this.nextTabEventEmitted.emit(false);
  }
  

  @Output() nextMatTab = new EventEmitter<number>();
  nextTab() {
    this.nextMatTab.emit(0);
  }
  
}
