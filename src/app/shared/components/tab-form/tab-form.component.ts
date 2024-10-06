import { Component, inject } from '@angular/core';
import { EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldComponentComponent } from 'src/app/shared/components/field-component/field-component.component';
import { FormField, formSectionFields, subSeccion } from 'src/app/models/form-fields/form-field.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@mean/services';
import { HttpHeaders } from '@angular/common/http';
import { UriConstants } from '@mean/utils';
import { AlertModel } from '@mean/models';
import { AlertComponent } from "../alert/alert.component";

interface FormData {
  idPatientClinicalHistory: number;
  idQuestion: number;
  answerBoolean: boolean | null;
  answerNumeric: number | null;
  answerText: string | null;
  answerDate: string | null;
  idCatalogOption: any;
  isFile: boolean | null;
}
@Component({
  selector: 'app-tab-form',
  standalone: true,
  imports: [ReactiveFormsModule, FieldComponentComponent, MatButtonModule, MatTabsModule, MatCardModule, AlertComponent],
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
  apiService = inject(ApiService);
  private router = inject(Router);
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
        answerBoolean: typeof fieldValue === 'boolean' ? fieldValue : null,  // Asignar null si no es booleano
        answerNumeric: typeof fieldValue === 'number' ? fieldValue : null,   // Asignar null si no es número
        answerText: typeof fieldValue === 'string' ? fieldValue : null,      // Asignar null si no es string
        answerDate: this.answerDate ? this.answerDate : null,                // Asignar null si no hay fecha
        idCatalogOption: formData.idCatalogOption || null,                   // Asignar null si no hay idCatalogOption
        isFile: null                                                         // Asignar null por defecto para archivos
      };
      
  
      this.send.push(data);
    });
  
    // Hacer la petición después de llenar el arreglo
    console.log('Datos a enviar:', this.send);
    
    this.apiService
      .postService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.POST_SECTION_FORM}`,
        data: this.send,
      })
      .subscribe({
        next: (response) => {
          console.log('ok');
          this.alertConfiguration('SUCCESS', "Datos guardados.");
          this.openAlert();
          this.send = []; // Limpiar el arreglo si la petición es exitosa
        },
        error: (error) => {
          this.alertConfiguration('ERROR', error);
          console.log(this.send)
          console.log('Error al guardar datos: ', error);
          this.openAlert();
        },
      });
  }
  

  alertMessage: string = '';
  alertSeverity: string = AlertModel.AlertSeverity.ERROR;
  showAlert: boolean = false;

  public alertConfiguration(severity: 'ERROR' | 'SUCCESS', msg: string) {
    this.alertConfig.severity = AlertModel.AlertSeverity[severity];
    this.alertConfig.singleMessage = msg;
  }

  alertConfig = new AlertModel.AlertaClass(
    false,
    'Ha ocurrido un error',
    AlertModel.AlertSeverity.ERROR
  );

  public openAlert() {
    this.alertConfig.open = true;
  }

  public closeAlert() {
    this.alertConfig.open = false;
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
