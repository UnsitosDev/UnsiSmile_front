import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldComponentComponent } from 'src/app/shared/components/field-component/field-component.component';
import { FormField } from 'src/app/models/form-fields/form-field.interface';
import { functionalAnalisisService } from 'src/app/services/history-clinics/general/functionalAnalisis.service';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-form-functional-analisis',
  standalone: true,
  imports: [ReactiveFormsModule,FieldComponentComponent,MatButtonModule],
  templateUrl: './form-functional-analisis.component.html',
  styleUrl: './form-functional-analisis.component.scss'
})
export class FormFunctionalAnalisisComponent {
  formGroup!: FormGroup;
  functionalAnalisisFields: FormField[] = [];

  constructor(
    private fb: FormBuilder,
    private functionalAnalisis: functionalAnalisisService,

  ) { }

  ngOnInit(): void {
    //Obtener los campos del formulario del servicio
    this.functionalAnalisisFields = this.functionalAnalisis.getFunctionalAnalisisFields();


    // Construcción del formulario
    this.formGroup = this.fb.group({}); // Inicializar el FormGroup
    [...this.functionalAnalisisFields].forEach(field => {
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
  }
  @Output() nextMatTab = new EventEmitter<number>();
  nextTab() {
    this.nextMatTab.emit(0);
  }
}
