import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldComponentComponent } from 'src/app/shared/components/field-component/field-component.component';
import { FormField } from 'src/app/models/form-fields/form-field.interface';
import { MatButtonModule } from '@angular/material/button';
import { laboratoryStudioBiopsyService } from 'src/app/services/history-clinics/general/laboratoryStudioBiopsy.service';
@Component({
  selector: 'app-form-laboratory-study-and-biopsy',
  standalone: true,
  imports: [ReactiveFormsModule,FieldComponentComponent,MatButtonModule],
  templateUrl: './form-laboratory-study-and-biopsy.component.html',
  styleUrl: './form-laboratory-study-and-biopsy.component.scss'
})
export class FormLaboratoryStudyAndBiopsyComponent {
  formGroup!: FormGroup;
  laboratoryStudyAndBiopsyFields : FormField[] = [];

  constructor(
    private fb: FormBuilder,
    private laboratoryStudyAndBiopsy: laboratoryStudioBiopsyService,

  ) { }

  ngOnInit(): void {
    //Obtener los campos del formulario del servicio
    this.laboratoryStudyAndBiopsyFields = this.laboratoryStudyAndBiopsy.getLaboratoryStudioBiopsyFields();


    // Construcción del formulario
    this.formGroup = this.fb.group({}); // Inicializar el FormGroup
    [...this.laboratoryStudyAndBiopsyFields].forEach(field => {
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
