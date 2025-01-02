import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { formSectionFields, subSeccion } from 'src/app/models/form-fields/form-field.interface';
import { FieldComponentComponent } from "../field-component/field-component.component";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { StudentsOdontogramComponent } from "../../../components/private/students/components/odontogram/students-odontogram.component";
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FieldNames } from 'src/app/models/form-fields/form-utils';
import { ApiService } from '@mean/services';
import { HttpHeaders } from '@angular/common/http';
import { UriConstants } from '@mean/utils';

interface updateFormData {
  idPatientClinicalHistory: number;
  idQuestion: number;
  answerBoolean: boolean | null;
  answerNumeric: number | null;
  answerText: string | null;
  answerDate: string | null;
  idCatalogOption: any;
  idAnswer: number
}

@Component({
  selector: 'app-tab-form-update',
  standalone: true,
  imports: [FieldComponentComponent, FormsModule, ReactiveFormsModule, MatCardModule, StudentsOdontogramComponent, MatButtonModule],
  templateUrl: './tab-form-update.component.html',
  styleUrl: './tab-form-update.component.scss'
})
export class TabFormUpdateComponent {
  @Input() fieldsTab!: formSectionFields;
  @Input() fieldsSubTab!: subSeccion;
  @Output() nextMatTab = new EventEmitter<void>(); // Evento para ir al siguiente tab
  @Output() previousMatTab = new EventEmitter<void>(); // Evento para ir al tab anterior

  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  apiService = inject(ApiService);
  formGroup!: FormGroup;
  id: number = 0;           // Variable para el parámetro 'id'
  patientID: number = 0;    // Variable para el parámetro 'patientID'
  patientUuid!: string;

  ngOnInit(): void {
    this.section();
    this.route.paramMap.subscribe(params => {
      this.id = +params.get('id')!;
      this.patientID = +params.get('patientID')!;
      this.patientUuid = params.get('patient')!;
    });
  }

  // Construcción de secciones
  section() {
    // Inicializamos el formGroup vacío
    this.formGroup = this.fb.group({});
    // Procesamos la sección principal
    if (this.fieldsTab?.seccion) {
      this.fieldsTab.seccion.forEach(sectionField => {
        this.formGroup.addControl(sectionField.name, this.fb.control(sectionField.value || '', sectionField.validators || []));
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

  idQuestion!: number;
  idAnswer!: number;
  questionIDs: { [key: string]: number } = {};  // Definimos questionIDs como un objeto que almacena questionID
  idAnswers: { [key: string]: number } = {};  // Definimos idAnswers como un objeto que almacena idAnswer

  handleFieldValue(event: any) {
    this.idQuestion = event.questionID;
    this.idAnswer = event.idAnswer;
    if (event.idAnswer !== undefined) {
      this.idAnswers[event.field] = event.idAnswer; // Guarda idAnswer para el campo específico
    }
    this.questionIDs[event.field] = this.idQuestion; // Guarda el questionID para el campo específico
  }

  files: FileList | null = null; // Almacena el FileList

  // Método para manejar el valor del archivo
  handleFileValue(event: { value: FileList; questionID: number; type: string }) {
    this.idQuestion = event.questionID; // Obtener el ID de la pregunta
    this.files = event.value; // Almacenar el FileList

    // Verificar si hay archivos
    if (this.files && this.files.length > 0) {
      for (let i = 0; i < this.files.length; i++) {
        const file = this.files[i];
      }
    } else {
      console.error('No se recibieron archivos.');
    }
  }

  updateHc() {

    // Validar si el formulario es valido
    if (!this.formGroup.valid) {
      console.log('El formulario contiene errores');
      return;
    }

    const formData = this.formGroup.value;
    const updateData: updateFormData[] = [];

    Object.keys(formData).forEach((fieldName) => {
      const fieldValue = formData[fieldName];
      const questionID = this.questionIDs[fieldName];
      const idAnswer = this.idAnswers[fieldName] ?? 0;
      const isDateField = fieldName.toLowerCase().includes('fecha') && !isNaN(Date.parse(fieldValue));

      const update: updateFormData = {
        idPatientClinicalHistory: this.patientID,
        idQuestion: questionID,
        answerBoolean: typeof fieldValue === 'boolean' ? fieldValue : null,
        answerNumeric: typeof fieldValue === 'number' ? fieldValue : null,
        answerText: typeof fieldValue === 'string' ? fieldValue.trim() : null,
        answerDate: isDateField ? fieldValue : null,
        idCatalogOption: formData.idCatalogOption || null,
        idAnswer: idAnswer,
      }
      if (update.idQuestion) {
        updateData.push(update);
      }

    });
    console.log(updateData);
    this.apiService
      .patchService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.POST_SECTION_FORM}`,
        data: updateData,
      })
      .subscribe({
        next: (response) => {
          updateData.length = 0
          this.nextMatTab.emit();
        },
        error: (error) => {
          console.log('Error al guardar datos: ', error);
        },
      });
  }

  previousTab() {
    this.previousMatTab.emit();
  }
}
