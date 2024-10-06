import { Component, inject } from '@angular/core';
import { EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldComponentComponent } from 'src/app/shared/components/field-component/field-component.component';
import { FormField, formSectionFields, subSeccion } from 'src/app/models/form-fields/form-field.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';

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
  route = inject(ActivatedRoute);

  formGroup!: FormGroup;

  private fb = inject(FormBuilder);
  id: number = 0;           // Variable para el parámetro 'id'
  patientID: number = 0;    // Variable para el parámetro 'patientID'

  ngOnInit(): void {
    this.section();
    this.route.paramMap.subscribe(params => {
      this.id = +params.get('id')!;
      this.patientID = +params.get('patientID')!;
    });
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

  handleFieldValue(event: any) {
    this.idQuestion = event.questionID;
    const fieldValue = event.value;
    this.questionIDs[event.field] = this.idQuestion; // Guarda el questionID para el campo específico
  }

  idPatientClinicalHistory: number = 0;
  idQuestion: number = 0;
  answerBoolean: boolean = false;
  answerNumeric: number = 0;
  answerText: string = '';
  answerDate: string = '';
  idCatalogOption: number = 0;
  isFile: boolean = false;

  send: FormData[] = [];

  questionIDs: { [key: string]: number } = {};  // Definimos questionIDs como un objeto que almacena números
  sendFormData() {
    const formData = this.formGroup.value;

    Object.keys(formData).forEach((fieldName) => {
      const fieldValue = formData[fieldName];
      const questionID = this.questionIDs[fieldName]; // Recuperamos el questionID como un número

      const data: FormData = {
        idPatientClinicalHistory: this.id,
        idQuestion: questionID,  // Usamos el questionID correspondiente
        answerBoolean: typeof fieldValue === 'boolean' ? fieldValue : false,  // Asignar false si no es booleano
        answerNumeric: typeof fieldValue === 'number' ? fieldValue : 0,        // Asignar 0 si no es número
        answerText: typeof fieldValue === 'string' ? fieldValue : '',          // Asignar cadena vacía si no es string
        answerDate: this.answerDate ? this.answerDate : '',                    // Asignar cadena vacía si no hay fecha
        idCatalogOption: formData.idCatalogOption || 0,                       // Asignar 0 si no hay idCatalogOption
        isFile: false                                                          // Si quieres permitir archivos, puedes ajustar esto
      };

      this.send.push(data);
    });
    console.log('Datos a enviar:', this.send);
  }

  previousTab() {
    this.previousMatTab.emit(); // Emitir evento para volver al tab anterior
  }

  onSubmit() {
    this.sendFormData();
    this.send = []; // Vaciamos el array después de enviar los datos
    this.nextMatTab.emit(); // Emitir evento para cambiar al siguiente tab
  }
}
