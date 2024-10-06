import { Component, inject } from '@angular/core';
import { EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldComponentComponent } from 'src/app/shared/components/field-component/field-component.component';
import { FormField, formSectionFields, subSeccion } from 'src/app/models/form-fields/form-field.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { faL } from '@fortawesome/free-solid-svg-icons';

interface FormData {
  idPatientClinicalHistory: number;
  idQuestion: number;
  answerBoolean: boolean;
  answerNumeric: number;
  answerText: string;
  answerDate: string;
  idCatalogOption: any;
  isFile: boolean;
}
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

  idPatientClinicalHistory: number = 0;
  idQuestion: number = 0;
  answerBoolean: boolean = false;
  answerNumeric: number = 0;
  answerText: string = '';
  answerDate: string = '';
  idCatalogOption: number = 0;
  isFile: boolean = false;

  // Tipa el arreglo send como FormData[]
  send: FormData[] = [];

  sendFormData() {
    // Obtenemos los valores del formulario
    const formData = this.formGroup.value;
  
    // Iteramos sobre los campos del formulario
    Object.keys(formData).forEach((fieldName, index) => {
      const fieldValue = formData[fieldName];
  
      // Para cada campo, creamos un objeto con la estructura que necesitas
      const data: FormData = {
        idPatientClinicalHistory: this.idPatientClinicalHistory,  // Valor constante o variable
        idQuestion: index,                                        // Puedes usar el índice o un valor real según tu caso
        answerBoolean: typeof fieldValue === 'boolean' ? fieldValue : false, // Si el valor es booleano, lo asignamos
        answerNumeric: typeof fieldValue === 'number' ? fieldValue : 0,      // Si el valor es numérico, lo asignamos
        answerText: typeof fieldValue === 'string' ? fieldValue : '',        // Si es texto, lo asignamos
        answerDate: this.answerDate || new Date().toISOString().split('T')[0], // Usamos la fecha actual como valor por defecto
        idCatalogOption: formData.idCatalogOption || 0,                      // Valor por defecto o asignado
        isFile: false                                                        // Por ahora, asumimos que no es archivo
      };
  
      // Añadimos el objeto al arreglo
      this.send.push(data);
    });
  
    // Mostramos el arreglo en consola para verificar los datos
    console.log('Datos a enviar:', this.send);
  }
  
  previousTab() {
      this.previousMatTab.emit(); // Emitir evento para volver al tab anterior
  }

  onSubmit() {
    this.sendFormData();
    this.nextMatTab.emit(); // Emitir evento para cambiar al siguiente tab
  }

}
