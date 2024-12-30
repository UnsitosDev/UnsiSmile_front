import { HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { formSectionFields, subSeccion } from 'src/app/models/form-fields/form-field.interface';
import { FieldComponentComponent } from 'src/app/shared/components/field-component/field-component.component';
import { HistoryInitialBagComponent } from "../../../components/private/students/components/form-history-initial-bag/history-initial-bag.component";
import { StudentsOdontogramComponent } from "../../../components/private/students/components/odontogram/students-odontogram.component";
import { AlertComponent } from "../alert/alert.component";

interface FormData {
  idPatientClinicalHistory: number;
  idQuestion: number;
  answerBoolean: boolean | null;
  answerNumeric: number | null;
  answerText: string | null;
  answerDate: string | null;
  idCatalogOption: any;
}

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
  selector: 'app-tab-form',
  standalone: true,
  imports: [MatInputModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, FieldComponentComponent, MatButtonModule, MatTabsModule, MatCardModule, AlertComponent, StudentsOdontogramComponent, HistoryInitialBagComponent],
  templateUrl: './tab-form.component.html',
  styleUrl: './tab-form.component.scss'
})
export class TabFormComponent {

  @Input() fieldsTab!: formSectionFields;
  @Input() fieldsSubTab!: subSeccion;
  @Output() nextMatTab = new EventEmitter<void>(); // Evento para ir al siguiente tab
  @Output() previousMatTab = new EventEmitter<void>(); // Evento para ir al tab anterior
  route = inject(ActivatedRoute);
  apiService = inject(ApiService);
  private fb = inject(FormBuilder);
  formGroup!: FormGroup;
  id: number = 0;           // Variable para el parámetro 'id'
  patientID: number = 0;    // Variable para el parámetro 'patientID'
  patientUuid!: string;
  sendFile!: boolean;

  // snackBar
  private _snackBar = inject(MatSnackBar);
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  durationInSeconds = 3;

  // Abrir snackbar
  openSnackBar() {
    this._snackBar.openFromComponent(Alert, {
      duration: this.durationInSeconds * 1000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

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

  handleFieldValue(event: any) {
    this.idQuestion = event.questionID;
    this.idAnswer = event.idAnswer; 
    if (event.idAnswer !== undefined) { 
      this.idAnswers[event.field] = event.idAnswer; // Guarda idAnswer para el campo específico
    }
    this.questionIDs[event.field] = this.idQuestion; // Guarda el questionID para el campo específico
  }

  questionIDs: { [key: string]: number } = {};  // Definimos questionIDs como un objeto que almacena questionID
  idAnswers: { [key: string]: number } = {};  // Definimos idAnswers como un objeto que almacena idAnswer

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

  // Función para enviar archivos
  sendFiles() {
    if (!this.files || this.files.length === 0) {
      return;
    }
    const formData = new FormData();
    // Agrega cada archivo al FormData
    for (let i = 0; i < this.files.length; i++) {
      formData.append('files', this.files[i]);
    }

    formData.append('idPatient', this.patientUuid);
    formData.append('idQuestion', this.idQuestion.toString());

    console.log('formData', this.patientID);
    this.apiService
      .postService({
        headers: new HttpHeaders({
        }),
        url: `${UriConstants.POST_FILES}`,
        data: formData,
      })
      .subscribe({
        next: (response) => {
          this.openSnackBar();
          this.nextMatTab.emit();
        },
        error: (error) => {
          console.log('Error al guardar archivos: ', error);
        },
      });
  }

  // Función para insertar y actualizar
  sendAndUpdateData() {
    
    // Validar si el furmulario es valido 
    if (!this.formGroup.valid) {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.formGroup.controls).forEach((fieldName) => {
        const control = this.formGroup.get(fieldName);
        control?.markAllAsTouched();
      });
      console.log('El formulario contiene errores');
      return; // Salir si el formulario no es valido
    }

    const formData = this.formGroup.value;
    // Arreglos para almacenar los datos que tienen y no tienen idAnswer
    const send: FormData[] = [];
    const updateData: updateFormData[] = [];

    Object.keys(formData).forEach((fieldName) => {
      const fieldValue = formData[fieldName];
      const questionID = this.questionIDs[fieldName]; // Recuperamos el questionID como un número
      const idAnswer = this.idAnswers[fieldName];
      const isDateField = fieldName.toLowerCase().includes('fecha') && !isNaN(Date.parse(fieldValue));

      // Datos para insertar (cuando no existe idAnswer)
      const insert: FormData = {
        idPatientClinicalHistory: this.patientID,
        idQuestion: questionID,  // Usamos el questionID correspondiente
        answerBoolean: typeof fieldValue === 'boolean' ? fieldValue : null,
        answerNumeric: typeof fieldValue === 'number' ? fieldValue : null,
        answerText: typeof fieldValue === 'string' ? fieldValue : null,
        answerDate: isDateField ? fieldValue : null,
        idCatalogOption: formData.idCatalogOption || null,
      };

      // Datos para actualizar (cuando existe idAnswer)
      const update: updateFormData = {
        idPatientClinicalHistory: this.patientID,
        idQuestion: questionID,
        answerBoolean: typeof fieldValue === 'boolean' ? fieldValue : null,
        answerNumeric: typeof fieldValue === 'number' ? fieldValue : null,
        answerText: typeof fieldValue === 'string' ? fieldValue.trim() : null,
        answerDate: isDateField ? fieldValue : null,
        idCatalogOption: formData.idCatalogOption || null,
        idAnswer: idAnswer,
      };

      // Verificación para actualizar (cuando existe idAnswer)
      if (idAnswer) {
        const hasValidData =
          update.answerBoolean !== null ||
          update.answerNumeric !== null ||
          (update.answerText && update.answerText !== '') ||
          update.answerDate !== null ||
          update.idCatalogOption !== null;

        if (hasValidData) {
          updateData.push(update);
        }
      }

      // Verificación para insertar (cuando no existe idAnswer)
      if (idAnswer === null || idAnswer === undefined && questionID != undefined) {
        const hasValidData =
          insert.answerBoolean !== null ||
          insert.answerNumeric !== null ||
          (typeof insert.answerText === 'string' && insert.answerText.trim() !== '') ||
          insert.answerDate !== null ||
          insert.idCatalogOption !== null;

        if (hasValidData) {
          send.push(insert);
        }
      }
    });

    // Manejo de archivos (si los hay)
    if (this.files && this.files.length > 0) {
      this.sendFiles();
    }

    if (updateData.length > 0) {
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
            this.openSnackBar();
            updateData.length = 0;
            this.nextMatTab.emit();
          },
          error: (error) => {
            console.log('Error al guardar datos: ', error);

          },
        });
    }

    if (send.length > 0) {
      this.apiService
        .postService({
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
          url: `${UriConstants.POST_SECTION_FORM}`,
          data: send,
        })
        .subscribe({
          next: (response) => {
            this.openSnackBar();
            send.length = 0
            this.nextMatTab.emit();
          },
          error: (error) => {
            console.log('Error al guardar datos: ', error);
          },
        });
    }

  }

  // Emitir evento para volver al tab anterior
  previousTab() {
    this.previousMatTab.emit();
  }

}

@Component({
  selector: 'snack-bar-component-example-snack',
  template: `
    <span class="custom">
    <i class="fas fa-check-circle"></i> Datos guardados correctamente.
    </span>
  `,
  styles: [`
    .custom {
    color: var(--on-primary);
  
  }
    i{
      color: green;
      font-size: 20px;
    }

  `],
  standalone: true,
})
export class Alert { }