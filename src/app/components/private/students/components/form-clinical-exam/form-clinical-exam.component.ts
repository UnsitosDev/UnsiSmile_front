import { Component, EventEmitter, Output } from '@angular/core';
import { InputField, bucalExam, funcionalAnalysis, inputs, medicalConsultation, patientPosture, radiographicAnalisys, studyLab, studyModels } from '../../../../../models/models-history-multidiciplinary-evaluation/inputs';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup } from '@angular/forms';
import { multidiciplinaryEvaluationService } from 'src/app/services/history-clinics/general/clinicalExamFields.service';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldComponentComponent } from 'src/app/shared/components/field-component/field-component.component';
import { FormField } from 'src/app/models/form-fields/form-field.interface';

@Component({
  selector: 'app-clinical-exam',
  standalone: true,
  imports: [MatIconModule, MatInputModule, MatFormFieldModule, MatButtonModule, FieldComponentComponent, ReactiveFormsModule],
  templateUrl: './form-clinical-exam.component.html',
  styleUrl: './form-clinical-exam.component.scss'
})
export class clinicalExamComponent {

  formGroup!: FormGroup;
  clinicalExamFields: FormField[] = [];

  constructor(
    private fb: FormBuilder,
    private clinicalExam: multidiciplinaryEvaluationService,

  ) { }

  ngOnInit(): void {
    //Obtener los campos del formulario del servicio
    this.clinicalExamFields = this.clinicalExam.getClinicExamFields();


    // Construcción del formulario
    this.formGroup = this.fb.group({}); // Inicializar el FormGroup
    [...this.clinicalExamFields].forEach(field => {
      this.formGroup.addControl(
        field.name,
        this.fb.control(field.value || '', field.validators || [])
      );
    });
  }
  getFieldValue(fieldName: string) {
    return this.formGroup.get(fieldName)?.value;
  }

  sendData() {
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
