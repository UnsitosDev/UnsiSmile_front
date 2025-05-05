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
import { MatCardModule } from '@angular/material/card';
import { ToastrService } from 'ngx-toastr';
import { Messages } from 'src/app/utils/messageConfirmLeave';
import { LoadingComponent } from '@mean/shared';




@Component({
  selector: 'app-form-insert-admin',
  standalone: true,
  imports: [MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    FieldComponentComponent,MatStep,MatStepperModule,AlertComponent,MatCardModule, LoadingComponent],
  templateUrl: './form-insert-admin.component.html',
  styleUrl: './form-insert-admin.component.scss'
})
export class FormInsertAdminComponent {
  private toastr = inject(ToastrService);
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
    this.markFormGroupTouched(this.formGroup);
    if (this.formGroup.valid) {
      const formValues = this.formGroup.value;
      
      // Crear un objeto con la estructura correcta para el backend
      const AdminData = {
        employeeNumber: formValues.employeeNumber,
        person: {
          curp: formValues.curp,
          firstName: formValues.firstName,
          secondName: formValues.secondName || '', // Hacemos el segundo nombre opcional
          firstLastName: formValues.firstLastName,
          secondLastName: formValues.secondLastName,
          phone: formValues.phone || '', // Hacemos el teléfono opcional
          birthDate: formValues.birthDate,
          email: formValues.email,
          gender: {
            idGender: formValues.gender
          }
        },
      };


      this.apiService
        .postService({
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
          url: `${UriConstants.POST_ADMIN}`,
          data: AdminData,
        })
        .subscribe({
          next: (response) => {
            this.toastr.success(Messages.SUCCES_INSERT_ADMIN, 'Éxito');
            this.router.navigate(['/admin/admins']);
          },
          error: (error) => {
            console.error('Error al guardar:', error);
            this.toastr.error(error.error?.message || 'Error al guardar el administrador', 'Error');
          },
        });
    } else {
            this.toastr.warning(Messages.WARNING_INSERT_ADMIN, 'Advertencia');
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

  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(controlName => {
      const control = formGroup.get(controlName);
      if (control) {
        control.markAsTouched();
        control.updateValueAndValidity(); 
      }

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

}
