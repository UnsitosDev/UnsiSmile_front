import { Component } from '@angular/core';
import { EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldComponentComponent } from 'src/app/shared/components/field-component/field-component.component';
import { FormField, formSectionFields } from 'src/app/models/form-fields/form-field.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
@Component({
  selector: 'app-tab-form',
  standalone: true,
  imports: [ReactiveFormsModule, FieldComponentComponent, MatButtonModule, MatTabsModule],
  templateUrl: './tab-form.component.html',
  styleUrl: './tab-form.component.scss'
})
export class TabFormComponent {
  @Input() fieldsTab!: formSectionFields;

  formGroup!: FormGroup;

  constructor(private fb: FormBuilder) {}

 ngOnInit(): void {
  // Función recursiva para procesar secciones y subsecciones
  const processSection = (section: formSectionFields) => {
    // Verificamos que `seccion` no sea null antes de iterar sobre ella
    if (section.seccion) {
      section.seccion.forEach(sectionField => {
        this.formGroup.addControl(
          sectionField.name,
          this.fb.control(sectionField.value || '', sectionField.validators || [])
        );
      });
    }

    // Si hay una subsección (childFormSection), llamamos a la función recursivamente
    if (section.childFormSection) {
      processSection(section.childFormSection);  // Llamada recursiva para la subsección
    }
  };

  // Procesa directamente el objeto `fieldsTab`
  processSection(this.fieldsTab);  
}



  // Inicializa el formulario con los campos
  // private initializeForm() {
  //   this.formGroup = this.fb.group({});
  //   this.fieldsTab.forEach(tab => {
  //     tab.seccion.forEach(sectionField => {
  //       this.formGroup.addControl(
  //         sectionField.name,
  //         this.fb.control(sectionField.value || '', sectionField.validators || [])
  //       );
  //     });
  //   });
  // }
  getFieldValue(fieldName: string) {
    return this.formGroup.get(fieldName)?.value;
  }

  @Output() nextTabEventEmitted = new EventEmitter<boolean>();
  emitNextTabEvent() {
    this.nextTabEventEmitted.emit(false);
  }

  @Output() nextMatTab = new EventEmitter<number>();
  nextTab() {
    this.nextMatTab.emit(0);
  }

  currentTabIndex: number = 0;
  @Output() previousMatTab = new EventEmitter<number>();
  previousTab() {
    this.currentTabIndex = Math.max(this.currentTabIndex - 1, 0);
    this.previousMatTab.emit(this.currentTabIndex);
  }

  onSubmit(){

  }
}
