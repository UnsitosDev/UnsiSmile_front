import { Component, inject } from '@angular/core';
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
  @Output() nextMatTab = new EventEmitter<void>(); // Evento para ir al siguiente tab
  @Output() previousMatTab = new EventEmitter<void>(); // Evento para ir al tab anterior

  formGroup!: FormGroup;

  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.section();
  }

  section() {
    // Función recursiva para procesar secciones y subsecciones
    const processSection = (section: formSectionFields) => {
      // Verificamos que `seccion` no sea null antes de iterar sobre ella
      if (section?.seccion) {
        section.seccion.forEach(sectionField => {
          this.formGroup.addControl(
            sectionField.name,
            this.fb.control(sectionField.value || '', sectionField.validators || [])
          );
        });
      }
      // Si hay una subsección (childFormSection), llamamos a la función recursivamente
      if (section?.childFormSection) {
        processSection(section.childFormSection);  // Llamada recursiva para la subsección
      }
    };
    this.formGroup = this.fb.group({});
    // Procesa directamente el objeto `fieldsTab`
    processSection(this.fieldsTab);
  }

  previousTab() {
      this.previousMatTab.emit(); // Emitir evento para volver al tab anterior
  }

  onSubmit() {
    this.nextMatTab.emit(); // Emitir evento para cambiar al siguiente tab
  }

}
