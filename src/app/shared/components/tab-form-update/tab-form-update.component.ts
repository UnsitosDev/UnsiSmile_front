import { HttpHeaders } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import {
  formSectionFields,
  subSeccion,
} from 'src/app/models/form-fields/form-field.interface';
import { FieldComponentComponent } from '../field-component/field-component.component';
import { ToastrService } from 'ngx-toastr';
import { Messages } from 'src/app/utils/messageConfirmLeave';

interface updateFormData {
  idPatientClinicalHistory: number;
  idQuestion: number;
  answerBoolean: boolean | null;
  answerNumeric: number | null;
  answerText: string | null;
  answerDate: string | null;
  idCatalogOption: any;
  idAnswer: number;
}

@Component({
  selector: 'app-tab-form-update',
  standalone: true,
  imports: [
    FieldComponentComponent,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './tab-form-update.component.html',
  styleUrl: './tab-form-update.component.scss',
})
export class TabFormUpdateComponent {
  @Input() fieldsTab!: formSectionFields;
  @Input() fieldsSubTab!: subSeccion;
  @Output() nextMatTab = new EventEmitter<void>(); // Evento para ir al siguiente tab
  @Output() previousMatTab = new EventEmitter<void>(); // Evento para ir al tab anterior

  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  apiService = inject(ApiService);
  private cdr = inject(ChangeDetectorRef); // Inyecta ChangeDetectorRef para manejar la detección de cambios manualmente.
  private toastr = inject(ToastrService);
  formGroup!: FormGroup;
  id: number = 0; // Variable para el parámetro 'id'
  patientID: number = 0; // Variable para el parámetro 'patientID'
  patientUuid!: string;

  ngOnInit(): void {
    this.section();
    this.route.paramMap.subscribe((params) => {
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
      const sortedSections = this.fieldsTab.seccion.sort(
        (a, b) => a.order! - b.order!
      );
      // Iteramos sobre los campos ordenados y los agregamos al formGroup
      sortedSections.forEach((sectionField) => {
        this.formGroup.addControl(
          sectionField.name,
          this.fb.control(
            sectionField.value || '', // Valor inicial del control (vacío si no está definido)
            sectionField.validators || [] // Validaciones asociadas al campo
          )
        );
      });
    }

    // Procesamos las subsecciones definidas en 'childFormSection', si existen
    if (this.fieldsTab?.childFormSection) {
      // Ordenamos las subsecciones según la propiedad 'order'
      const sortedChildSections = this.fieldsTab.childFormSection.sort(
        (a, b) => a.order! - b.order!
      );
      // Iteramos sobre cada subsección ordenada
      sortedChildSections.forEach((childSection) => {
        // Verificamos si la subsección tiene preguntas asociadas
        if (childSection.questions) {
          // Ordenamos las preguntas dentro de la subsección según la propiedad 'order'
          const sortedQuestions = childSection.questions.sort(
            (a, b) => a.order! - b.order!
          );
          // Iteramos sobre las preguntas ordenadas y las agregamos al formGroup
          sortedQuestions.forEach((questionField) => {
            // Agregamos los controles de las preguntas al formulario
            this.formGroup.addControl(
              questionField.name, // Nombre del control, único por cada pregunta
              this.fb.control(
                questionField.value || '', // Valor inicial de la pregunta (vacío si no está definido)
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
  questionIDs: { [key: string]: number } = {}; // Definimos questionIDs como un objeto que almacena questionID
  idAnswers: { [key: string]: number } = {}; // Definimos idAnswers como un objeto que almacena idAnswer

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
  handleFileValue(event: {
    value: FileList;
    questionID: number;
    type: string;
  }) {
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

  handleSubmission() {
    const hasFiles = this.files && this.files.length > 0;
    if (hasFiles) {
      this.sendFiles();
    }
    this.postHcData();
  }

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


    this.apiService
      .postService({
        headers: new HttpHeaders({
        }),
        url: `${UriConstants.POST_FILES}`,
        data: formData,
      })
      .subscribe({
        next: (response) => {
          this.nextMatTab.emit();
          this.toastr.success(Messages.SUCCESS_DATA_UPDATED);
        },
        error: (error) => {
          console.log('Error al guardar archivos: ', error);
        },
      });
  }

  postHcData() {

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
            updateData.length = 0
            this.toastr.success(Messages.SUCCESS_DATA_UPDATED);
            this.nextMatTab.emit();
          },
          error: (error) => {
            console.log('Error al guardar datos: ', error);
          },
        });
    } else {
      const hasFiles = this.files && this.files.length > 0;
      if (!hasFiles) {
        this.toastr.warning(Messages.WARNING_NO_DATA_TO_UPDATE);
      }
    }
  }

  previousTab() {
    this.previousMatTab.emit();
  }
}
