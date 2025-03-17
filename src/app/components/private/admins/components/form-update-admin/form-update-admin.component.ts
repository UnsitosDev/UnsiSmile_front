import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { adminService } from 'src/app/services/admin.service';
import { FieldComponentComponent } from 'src/app/shared/components/field-component/field-component.component';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
import { ApiService } from '@mean/services';
import { HttpHeaders } from '@angular/common/http';
import { UriConstants } from '@mean/utils';
import { FormField } from 'src/app/models/form-fields/form-field.interface';
import { AlertModel } from '@mean/models';
import { Messages } from 'src/app/utils/messageConfirmLeave';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-form-update-admin',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatStepperModule,
    FieldComponentComponent,
    AlertComponent,
    MatCardModule
],
  templateUrl: './form-update-admin.component.html',
  styleUrl: './form-update-admin.component.scss'
})
export class FormUpdateAdminComponent implements OnInit {
  private toastr = inject(ToastrService);
  employeeNumber: string = '';
  formGroup!: FormGroup;
  admin: FormField[] = [];
  private apiService = inject(ApiService<any>);
  alertConfig = new AlertModel.AlertaClass(false, '', AlertModel.AlertSeverity.ERROR);
  alertMessage: string = '';
  alertSeverity: string = AlertModel.AlertSeverity.ERROR;
  showAlert: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private adminFields: adminService,
    private router: Router
  ) {}

  ngOnInit() {
    this.employeeNumber = this.route.snapshot.params['employeeNumber'];
    this.admin = this.adminFields.getPersonalDataFields();
    
    // Asegurarnos de que se carguen las opciones de género antes de inicializar el form
    const genderField = this.admin.find(field => field.name === 'gender');
    if (genderField && genderField.onClick) {
      genderField.onClick(new MouseEvent('click'));
    }
    
    this.initForm();
    this.loadAdminData();
  }

  private initForm() {
    this.formGroup = this.fb.group({});
    this.admin.forEach(field => {
      this.formGroup.addControl(
        field.name,
        this.fb.control({ 
          value: '', 
          disabled: false 
        }, field.validators || [])
      );
    });
  }

  private loadAdminData() {
    this.apiService.getService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      url: `${UriConstants.GET_ADMIN_BY_EMPLOYEENUMBER}${this.employeeNumber}`,
      data: {},
    }).subscribe({
      next: (response) => {
        // Formatear la fecha antes de asignarla
        const birthDate = response.person.birthDate ? new Date(response.person.birthDate).toISOString().split('T')[0] : '';
        
        this.formGroup.patchValue({
          employeeNumber: response.employeeNumber,
          curp: response.person.curp,
          firstName: response.person.firstName,
          secondName: response.person.secondName,
          firstLastName: response.person.firstLastName,
          secondLastName: response.person.secondLastName,
          phone: response.person.phone,
          birthDate: birthDate, // Usar la fecha formateada
          email: response.person.email,
          gender: response.person.gender.idGender.toString() // Convertir a string
        });

        // Forzar la actualización del select de género
        const genderField = this.admin.find(field => field.name === 'gender');
        if (genderField) {
          genderField.value = response.person.gender.idGender.toString();
        }

        // Marcar el formulario como "touched" para que se muestren los valores
        Object.keys(this.formGroup.controls).forEach(key => {
          const control = this.formGroup.get(key);
          control?.markAsTouched();
        });
      },
      error: (error) => {
        this.alertConfig.singleMessage = 'Error al cargar los datos del administrador';
      },
    });
  }

  getFieldValue(fieldName: string) {
    return this.formGroup.get(fieldName)?.value;
  }

  onBack() {
    this.router.navigate(['/admin/admins']);
  }

  // Agregar método para guardar cambios
  onSubmit() {
    if (this.formGroup.valid) {
      const formValues = this.formGroup.value;
      const AdminData = {
        employeeNumber: formValues.employeeNumber,
        person: {
          curp: formValues.curp,
          firstName: formValues.firstName,
          secondName: formValues.secondName || '',
          firstLastName: formValues.firstLastName,
          secondLastName: formValues.secondLastName,
          phone: formValues.phone || '',
          birthDate: formValues.birthDate,
          email: formValues.email,
          gender: {
            idGender: parseInt(formValues.gender)
          }
        }
      };


      this.apiService.patchService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.PATCH_ADMIN_BY_EMPLOYEENUMBER}${formValues.employeeNumber}`,
        data: AdminData,
      }).subscribe({
        next: () => {
          this.toastr.success(Messages.SUCCES_UPDATE_ADMIN, 'Éxito');
          setTimeout(() => {
            this.router.navigate(['/admin/admins']);
          }, 2000);
        },
        error: (error) => {
          this.toastr.error(error);
        },
      });
    } else {
      this.toastr.warning(Messages.WARNING_INSERT_CYCLE, 'Error');
    }
  }
}
