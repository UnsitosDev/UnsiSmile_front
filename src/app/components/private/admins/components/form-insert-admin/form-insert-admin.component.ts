import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { FormField } from 'src/app/models/form-fields/form-field.interface';
import { FieldComponentComponent } from "../../../../../shared/components/field-component/field-component.component";
import { MatStep } from '@angular/material/stepper';
import { MatStepperModule } from '@angular/material/stepper';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
import { AlertModel } from '@mean/models';
import { ApiService } from '@mean/services';
import { HttpHeaders } from '@angular/common/http';
import { UriConstants } from '@mean/utils';
import { Router } from '@angular/router';
import { religionRequest } from 'src/app/models/shared/patients/Religion/religion';
import { adminService } from 'src/app/services/admin.service';



@Component({
  selector: 'app-form-insert-admin',
  standalone: true,
  imports: [MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    FieldComponentComponent,MatStep,MatStepperModule],
  templateUrl: './form-insert-admin.component.html',
  styleUrl: './form-insert-admin.component.scss'
})
export class FormInsertAdminComponent {

  private apiService = inject(ApiService<religionRequest>);
  formGroup!: FormGroup;
  admin: FormField[] = [];
  accountStudent: FormField[]=[];

  constructor(
    private fb: FormBuilder,
    private adminFields: adminService,
    private router: Router
  ) { }

  alertMessage: string = '';
  alertSeverity: string = AlertModel.AlertSeverity.ERROR;
  showAlert: boolean = false;

  ngOnInit(): void {
    // Obtener los campos del formulario del servicio
    this.admin = this.adminFields.getPersonalDataFields();


    // Construcción del formulario
    this.formGroup = this.fb.group({}); // Inicializar el FormGroup
    [...this.admin].forEach(field => {
      this.formGroup.addControl(
        field.name,
        this.fb.control(field.value || '', field.validators || [])
      );
    });
  }
  getFieldValue(fieldName: string) {
    return this.formGroup.get(fieldName)?.value;
  }

  onSubmit() {
    if (this.formGroup.valid) {
      const formValues = this.formGroup.value;
  
      const AdminData = {
        employeeNumber: formValues.employeeNumber,  // Matrícula del estudiante
        person: {
          curp: formValues.curp,
          firstName: formValues.firstName,
          secondName: formValues.secondName,
          firstLastName: formValues.firstLastName,
          secondLastName: formValues.secondLastName,
          phone: formValues.phone,
          birthDate: formValues.birthDate,
          email: formValues.email,
          gender: {
            idGender: +formValues.gender,
            gender: ''  // Se podría rellenar con el valor correspondiente más adelante
          }
        },
      };
  
      // Imprimir en consola los datos que se enviarán
      console.log('Datos enviados:', AdminData);
  
      this.apiService
        .postService({
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
          url: `${UriConstants.POST_ADMIN}`,  // Define la URL para el endpoint de estudiantes
          data: AdminData,
        })
        .subscribe({
          next: (response) => {
            this.router.navigate(['/admin']);  // Redirige después de un éxito
            this.alertConfiguration('SUCCESS', "El administrador ha sido registrado correctamente.");
            this.openAlert();
          },
          error: (error) => {
            console.error('Error en el registro:', error);
            this.alertConfiguration('ERROR', error);
            this.openAlert();
          },
        });
  
    } else {
      this.alertMessage = 'Por favor, completa todos los campos correctamente.';
      this.showAlert = true;
    }
  }
  
  
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

}
