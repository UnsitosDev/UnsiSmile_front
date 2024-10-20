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
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UriConstants } from '@mean/utils';
import { AlertModel } from '@mean/models';
import { AlertComponent } from "../alert/alert.component";
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { StudentsOdontogramComponent } from "../../../components/private/students/components/odontogram/students-odontogram.component";
import { HistoryInitialBagComponent } from "../../../components/private/students/components/form-history-initial-bag/history-initial-bag.component";

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
  formGroup!: FormGroup;
  apiService = inject(ApiService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  id: number = 0;           // Variable para el parámetro 'id'
  patientID: number = 0;    // Variable para el parámetro 'patientID'

  // _snackBar
  private _snackBar = inject(MatSnackBar);
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  durationInSeconds = 3;

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

  sendFile!: boolean;

  files: FileList | null = null; // Almacena el FileList

  // Método para manejar el valor del archivo
  handleFileValue(event: { value: FileList; questionID: number; type: string }) {
    this.idQuestion = event.questionID; // Obtener el ID de la pregunta
    this.files = event.value; // Almacenar el FileList

    // Verificar si hay archivos
    if (this.files && this.files.length > 0) {
      console.log('Archivos recibidos del componente hijo:', this.files);
      for (let i = 0; i < this.files.length; i++) {
        const file = this.files[i];
        console.log(`Archivo ${i + 1}:`, file.name, file.size, file.type);
      }
    } else {
      console.error('No se recibieron archivos.');
    }
  }

  sendFiles() {
    if (!this.files || this.files.length === 0) {
      return;
    }

    const formData = new FormData();

    // Agrega cada archivo al FormData
    for (let i = 0; i < this.files.length; i++) {
      formData.append('files', this.files[i]); // 'files' debe coincidir con el nombre del campo esperado en el backend
    }

    // Puedes agregar más datos al FormData si es necesario
    formData.append('idPatientClinicalHistory', this.id.toString()); // Cambia '1' por el valor adecuado
    formData.append('idQuestion', this.idQuestion.toString());

    this.apiService
      .postService({
        headers: new HttpHeaders({
        }),
        url: `${UriConstants.POST_FILES}`, // URL del backend
        data: formData,
      })
      .subscribe({
        next: (response) => {
          console.log('ok', response);
        },
        error: (error) => {

        },
      });
  }

  sendFormData() {

    const formData = this.formGroup.value;

    Object.keys(formData).forEach((fieldName) => {
      const fieldValue = formData[fieldName];
      const questionID = this.questionIDs[fieldName]; // Recuperamos el questionID como un número
      const isDateField = fieldName.toLowerCase().includes('fecha') && !isNaN(Date.parse(fieldValue));

      const data: FormData = {
        idPatientClinicalHistory: this.patientID,
        idQuestion: questionID,  // Usamos el questionID correspondiente
        answerBoolean: typeof fieldValue === 'boolean' ? fieldValue : null,  // Si es booleano, asignar su valor, de lo contrario null
        answerNumeric: typeof fieldValue === 'number' ? fieldValue : null,   // Si es numérico, asignar su valor, de lo contrario null
        answerText: typeof fieldValue === 'string' ? fieldValue : null,      // Si es string, asignar su valor, de lo contrario null
        answerDate: isDateField ? fieldValue : null,  // Si es una fecha válida, asignar su valor, de lo contrario null
        idCatalogOption: formData.idCatalogOption || null,                   // Asignar null si no hay idCatalogOption
      };

      // Verificar si al menos uno de los campos tiene un valor válido (que no sea null o vacío)
      const hasValidData =
        data.answerBoolean !== null ||
        data.answerNumeric !== null ||
        (typeof data.answerText === 'string' && data.answerText.trim() !== '') ||
        data.answerDate !== null ||
        data.idCatalogOption !== null;

      // Si tiene al menos un dato válido, agregar al arreglo
      if (hasValidData) {
        this.send.push(data);
      }
    });

    // Verificar si hay archivos antes de hacer la petición
    if (this.files && this.files.length > 0) {
      // Si hay archivos, primero ejecutamos sendFiles
      this.sendFiles();
    }

    // Hacer la petición después de llenar el arreglo con los datos válidos
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
          this.openSnackBar();
          this.send = []; // Limpiar el arreglo si la petición es exitosa
        },
        error: (error) => {
          console.log('Error al guardar datos: ', error);

        },
      });
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