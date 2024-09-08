import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldComponentComponent } from 'src/app/shared/components/field-component/field-component.component';
import { FormField } from 'src/app/models/form-fields/form-field.interface';
import { MatButtonModule } from '@angular/material/button';
import { modelsAndPhotosService } from 'src/app/services/history-clinics/general/modelsAndPhotos.service';
@Component({
  selector: 'app-form-study-models-and-photographs',
  standalone: true,
  imports: [ReactiveFormsModule,FieldComponentComponent,MatButtonModule],
  templateUrl: './form-study-models-and-photographs.component.html',
  styleUrl: './form-study-models-and-photographs.component.scss'
})
export class FormStudyModelsAndPhotographsComponent {
  formGroup!: FormGroup;
  studyAndPhotographsFields : FormField[] = [];

  constructor(
    private fb: FormBuilder,
    private studyAndPhotographs: modelsAndPhotosService,

  ) { }

  ngOnInit(): void {
    //Obtener los campos del formulario del servicio
    this.studyAndPhotographsFields = this.studyAndPhotographs.getModelsAndPhotosFields();


    // Construcción del formulario
    this.formGroup = this.fb.group({}); // Inicializar el FormGroup
    [...this.studyAndPhotographsFields].forEach(field => {
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
