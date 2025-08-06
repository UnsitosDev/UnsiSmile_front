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
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, AuthService } from 'src/app/shared/services';
import { ROLES, UriConstants } from '@mean/utils';
import {
  formSectionFields,
  subSeccion,
} from 'src/app/shared/models/form-fields/form-field.interface';
import { FieldComponentComponent } from '../field-component/field-component.component';
import { ToastrService } from 'ngx-toastr';
import { Messages } from 'src/app/utils/messageConfirmLeave';
import { TokenData } from 'src/app/components/public/login/model/tokenData';

interface updateFormData {
  idPatientMedicalRecord: number;
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
  @Input() patientMedicalRecord!: number; 
  @Input() readonlyTreatment: boolean = false;
  @Output() nextMatTab = new EventEmitter<void>(); // Evento para ir al siguiente tab
  @Output() previousMatTab = new EventEmitter<void>(); // Evento para ir al tab anterior
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  apiService = inject(ApiService);
  private cdr = inject(ChangeDetectorRef); // Inyecta ChangeDetectorRef para manejar la detección de cambios manualmente.
  private toastr = inject(ToastrService);
  private userService = inject(AuthService);
  private token!: string;
  private tokenData!: TokenData;
  role!: string;
  router = inject(Router); 
  formGroup!: FormGroup;
  id: number = 0; // Variable para el parámetro 'id'
  patientID: number = 0; // Variable para el parámetro 'patientID'
  patientUuid!: string;
  disabledControl = false;
  public ROL = ROLES;

  ngOnInit(): void {
    this.section();
    this.route.paramMap.subscribe((params) => {
      this.id = +params.get('id')!; // Id historia clinica
      this.patientID = +params.get('patientID')!; // id paciente hc
      this.patientUuid = params.get('patient')!; // uuid paciente
      this.cdr.detectChanges(); // Fuerza la detección de cambios
    });
    this.getRole();   
  }

  getRole() {
    this.token = this.userService.getToken() ?? "";
    this.tokenData = this.userService.getTokenDataUser(this.token);
    this.role = this.tokenData.role[0].authority;

    if (this.role !== this.ROL.STUDENT && this.role !== this.ROL.ROLE_MEDICAL_RECORD_DIGITIZER || this.readonlyTreatment) {
      this.disableForm(); 
    }
  }

  disableForm() {
    if (this.formGroup) {
      Object.keys(this.formGroup.controls).forEach((controlName) => {
        this.formGroup.get(controlName)?.disable(); 
      });
    }
    this.disabledControl = true;
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
  checkboxValues: { [key: string]: boolean } = {}; // Almacena los valores de checkbox por campo
  textValues: { [key: string]: string } = {}; // Almacena los valores de texto por campo

  handleFieldValue(event: any): void {
    this.checkboxValues[event.field] = event.value.checkboxValue; 
    this.textValues[event.field] = event.value.textValue; 
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

    formData.append('idPatientMedicalRecord', this.patientMedicalRecord.toString());
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
        idPatientMedicalRecord: this.patientMedicalRecord,
        idQuestion: questionID,
        answerBoolean: this.checkboxValues[fieldName] || typeof fieldValue === 'boolean' ? fieldValue : null,
        answerNumeric: typeof fieldValue === 'number' ? fieldValue : null,
        answerText: this.valueText(this.textValues[fieldName]) || this.valueText(fieldValue),
        answerDate: isDateField ? fieldValue : null,
        idCatalogOption: formData.idCatalogOption || null,
        idAnswer: idAnswer,
      };
  
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

  valueText(value: string): string | null {
    return typeof value === 'string' && value.trim() !== '' ? value.trim() : null;
  }
  
  previousTab() {
    this.previousMatTab.emit();
  }

  nextTab(){
    this.nextMatTab.emit();
  }
}
