import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
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

@Component({
  selector: 'app-form-update-admin',
  standalone: true,
  imports: [
    CommonModule,
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
  employeeNumber: string = '';
  formGroup!: FormGroup;
  admin: FormField[] = [];
  private apiService = inject(ApiService<any>);
  alertConfig = new AlertModel.AlertaClass(false, '', AlertModel.AlertSeverity.ERROR);

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private adminFields: adminService,
    private router: Router
  ) {}

  ngOnInit() {
    this.employeeNumber = this.route.snapshot.params['employeeNumber'];
    this.admin = this.adminFields.getPersonalDataFields();
    this.initForm();
    this.loadAdminData();
  }

  private initForm() {
    this.formGroup = this.fb.group({});
    this.admin.forEach(field => {
      this.formGroup.addControl(
        field.name,
        this.fb.control({ value: '', disabled: true }, field.validators || [])
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
        this.formGroup.patchValue({
          employeeNumber: response.employeeNumber,
          curp: response.person.curp,
          firstName: response.person.firstName,
          secondName: response.person.secondName,
          firstLastName: response.person.firstLastName,
          secondLastName: response.person.secondLastName,
          phone: response.person.phone,
          birthDate: response.person.birthDate,
          email: response.person.email,
          gender: response.person.gender.idGender
        });
      },
      error: (error) => {
        console.error('Error al cargar los datos del administrador:', error);
        this.alertConfig.open = true;
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
}
