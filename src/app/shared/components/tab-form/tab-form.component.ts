import { HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output, inject } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef); // Inyecta ChangeDetectorRef para manejar la detección de cambios manualmente.
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
      this.cdr.detectChanges(); // Fuerza la detección de cambios
    });
  }

  // Construcción de secciones y campos dinámicos en el formulario
  section() {
    // Inicializamos el formGroup vacío para agregar controles dinámicamente
    this.formGroup = this.fb.group({});
    // Procesamos la sección principal (campos raíz de la estructura)
    if (this.fieldsTab?.seccion) {
      // Ordenamos los campos de la sección principal según la propiedad 'order'
      const sortedSections = this.fieldsTab.seccion.sort((a, b) => (a.order! - b.order!));
      // Iteramos sobre los campos ordenados y los agregamos al formGroup
      sortedSections.forEach(sectionField => {
        this.formGroup.addControl(
          sectionField.name,
          this.fb.control(sectionField.value || '', // Valor inicial del control (vacío si no está definido)
            sectionField.validators || [] // Validaciones asociadas al campo
          )
        );
      });
    }

    // Procesamos las subsecciones definidas en 'childFormSection', si existen
    if (this.fieldsTab?.childFormSection) {
      // Ordenamos las subsecciones según la propiedad 'order'
      const sortedChildSections = this.fieldsTab.childFormSection.sort((a, b) => (a.order! - b.order!));
      // Iteramos sobre cada subsección ordenada
      sortedChildSections.forEach(childSection => {
        // Verificamos si la subsección tiene preguntas asociadas
        if (childSection.questions) {
          // Ordenamos las preguntas dentro de la subsección según la propiedad 'order'
          const sortedQuestions = childSection.questions.sort((a, b) => (a.order! - b.order!));
          // Iteramos sobre las preguntas ordenadas y las agregamos al formGroup
          sortedQuestions.forEach(questionField => {
            // Agregamos los controles de las preguntas al formulario
            this.formGroup.addControl(
              questionField.name,// Nombre del control, único por cada pregunta
              this.fb.control(questionField.value || '',// Valor inicial de la pregunta (vacío si no está definido)
                questionField.validators || [] // Validaciones asociadas a la pregunta
              )
            );
          });
        }
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

  // Función para insertar
  postHc() {

    // Validar si el formulario es valido
    if (!this.formGroup.valid) {
      console.log('El formulario contiene errores');
      return;
    }

    const formData = this.formGroup.value;
    const sendData: FormData[] = [];

    Object.keys(formData).forEach((fieldName) => {
      const fieldValue = formData[fieldName];
      const questionID = this.questionIDs[fieldName];
      const idAnswer = this.idAnswers[fieldName] ?? 0;
      const isDateField = fieldName.toLowerCase().includes('fecha') && !isNaN(Date.parse(fieldValue));

      const hcData: FormData = {
        idPatientClinicalHistory: this.patientID,
        idQuestion: questionID,
        answerBoolean: typeof fieldValue === 'boolean' ? fieldValue : null,
        answerNumeric: typeof fieldValue === 'number' ? fieldValue : null,
        answerText: typeof fieldValue === 'string' ? fieldValue.trim() : null,
        answerDate: isDateField ? fieldValue : null,
        idCatalogOption: formData.idCatalogOption || null,
      }
      if (hcData.idQuestion) {
        sendData.push(hcData);
      }

    });
    // Manejo de archivos (si los hay)
    if (this.files && this.files.length > 0) {
      this.sendFiles();
    }
    console.log(sendData);
    this.apiService
      .patchService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.POST_SECTION_FORM}`,
        data: sendData,
      })
      .subscribe({
        next: (response) => {
          this.openSnackBar();
          sendData.length = 0
          this.nextMatTab.emit();
        },
        error: (error) => {
          console.log('Error al guardar datos: ', error);
        },
      });
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