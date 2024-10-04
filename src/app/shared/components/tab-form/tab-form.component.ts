import { Component, inject } from '@angular/core';
import { EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldComponentComponent } from 'src/app/shared/components/field-component/field-component.component';
import { FormField, formSectionFields, subSeccion } from 'src/app/models/form-fields/form-field.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-tab-form',
  standalone: true,
  imports: [ReactiveFormsModule, FieldComponentComponent, MatButtonModule, MatTabsModule, MatCardModule],
  templateUrl: './tab-form.component.html',
  styleUrl: './tab-form.component.scss'
})
export class TabFormComponent {
  @Input() fieldsTab!: formSectionFields;
  @Input() fieldsSubTab!: subSeccion;
  @Output() nextMatTab = new EventEmitter<void>(); // Evento para ir al siguiente tab
  @Output() previousMatTab = new EventEmitter<void>(); // Evento para ir al tab anterior

  formGroup!: FormGroup;

  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.section();
  }
  section() {
    // Inicializamos el formGroup vacío
    this.formGroup = this.fb.group({});
  
    // Procesamos la sección principal
    if (this.fieldsTab?.seccion) {
      this.fieldsTab.seccion.forEach(sectionField => {
        this.formGroup.addControl(
          sectionField.name,
          this.fb.control(sectionField.value || '', sectionField.validators || [])
        );
      });
    }
  
    // Procesamos los campos de childFormSection si existen
    if (this.fieldsTab?.childFormSection) {
      this.fieldsTab.childFormSection.forEach(childSection => {
        // Iteramos sobre las preguntas de la subsección
        childSection.questions.forEach(questionField => {
          this.formGroup.addControl(
            questionField.name,
            this.fb.control(questionField.value || '', questionField.validators || [])
          );
        });
      });
    }
  }
  

  previousTab() {
      this.previousMatTab.emit(); // Emitir evento para volver al tab anterior
  }

  onSubmit() {
    this.nextMatTab.emit(); // Emitir evento para cambiar al siguiente tab
  }

}
