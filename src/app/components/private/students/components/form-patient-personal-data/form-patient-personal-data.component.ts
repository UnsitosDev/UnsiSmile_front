import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ChangeDetectionStrategy, } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { FieldComponentComponent } from "../../../../../shared/components/field-component/field-component.component";
import { FormField } from 'src/app/models/form-fields/form-field.interface';
import { FormFieldsService } from 'src/app/services/form-fields.service';
import { inject } from '@angular/core';
import { Validators } from '@angular/forms';


import { MatStepperModule } from '@angular/material/stepper';
import { AlertModel } from '@mean/models';
import { PatientService } from 'src/app/services/patient/patient.service';
import { religionRequest } from 'src/app/models/shared/patients/Religion/religion';
import { ApiService } from '@mean/services';
import { HttpHeaders } from '@angular/common/http';
import { UriConstants } from '@mean/utils';
import { Router } from '@angular/router';


@Component({
  selector: 'app-form-patient-personal-data',
  standalone: true,
  imports: [MatButtonModule,
    MatStepperModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDividerModule, MatButtonModule, MatGridListModule, MatFormFieldModule, MatIconModule, MatInputModule, MatDatepickerModule, FormsModule, ReactiveFormsModule, MatSelectModule, AlertComponent, FieldComponentComponent],
  templateUrl: './form-patient-personal-data.component.html',
  styleUrl: './form-patient-personal-data.component.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})



export class FormPatientPersonalDataComponent {
  private apiService = inject(ApiService<religionRequest>);
  private patientService = inject(PatientService);
  formGroup!: FormGroup;
  personal: FormField[] = [];
  address: FormField[] = [];
  other: FormField[] = [];

  constructor(
    private fb: FormBuilder,
    private personalDataFields: FormFieldsService,
    private addressDataFields: FormFieldsService,
    private otherDataFields: FormFieldsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Obtener los campos del formulario del servicio
    this.personal = this.personalDataFields.getPersonalDataFields();
    this.address = this.addressDataFields.getAddressFields();
    this.other = this.otherDataFields.getOtherDataFields();

    // Construcción del formulario
    this.formGroup = this.fb.group({}); // Inicializar el FormGroup
    [...this.personal, ...this.address, ...this.other].forEach(field => {
      this.formGroup.addControl(
        field.name,
        this.fb.control(field.value || '', field.validators || [])
      );
    });
  }

  onFieldValueChange(event: any) {
    const { name, value } = event;
    this.formGroup.get(name)?.setValue(value);

    // Si el campo es el código postal, llama a la función para obtener los datos
    if (name === 'postalCode' && value.length === 5) {
      this.handlePostalCodeClick(value);
    }
  }
  
  localityId: string = '';
  municipalityNameId: string = '';
  stateNameId: string = '';
  handlePostalCodeClick(param: string): void {
    this.patientService.getPostalCode(param).subscribe({
      next: (response) => {
        // Actualiza los campos de autocompletado
        this.formGroup.get('localityName')?.setValue(response[0].name);
        this.formGroup.get('municipalityName')?.setValue(response[0].municipality.name);
        this.formGroup.get('stateName')?.setValue(response[0].municipality.state.name);
        // Guardar los ids
        this.localityId = response[0].idLocality;
        this.municipalityNameId = response[0].municipality.idMunicipality;
        this.stateNameId = response[0].municipality.state.idState;
      }
    });
  }

  getFieldValue(fieldName: string) {
    return this.formGroup.get(fieldName)?.value;
  }

  alertMessage: string = '';
  alertSeverity: string = AlertModel.AlertSeverity.ERROR;
  showAlert: boolean = false;

  onSubmit() {
    if (this.formGroup.valid) {
      const formValues = this.formGroup.value;

      const patientData = {
        idPatient: 0, 
        admissionDate: formValues.admissionDate,
        isMinor: false,
        hasDisability: true,
        nationalityId: +formValues.nationality,
        person: {
          curp: formValues.curp,
          firstName: formValues.firstLastName,
          secondName: formValues.secondName,
          firstLastName: formValues.firstLastName,
          secondLastName: formValues.secondLastName,
          phone: formValues.phone,
          birthDate: formValues.birthDate,
          email: formValues.email,
          gender: {
            idGender: +formValues.gender,
            gender: ""
          }
        },
        address: {
          idAddress: 0,
          streetNumber: formValues.exteriorNumber,
          interiorNumber: formValues.interiorNumber,
          housing: {
            idHousing: +formValues.housingCategory,
            category: ""
          },
          street: {
            idStreet: +formValues.streetName,
            name: '',
            neighborhood: {
              idNeighborhood: +formValues.neighborhoodName,
              name: '',
              locality: {
                idLocality: +this.localityId,
                name: "",
                postalCode: formValues.postalCode,
                municipality: {
                  idMunicipality: +this.municipalityNameId,
                  name: "",
                  state: {
                    idState: +this.stateNameId,
                    name: ""
                  }
                }
              }
            }
          }
        },
        maritalStatusId: +formValues.maritalStatus,
        occupationId: +formValues.occupation,
        ethnicGroupId: +formValues.ethnicGroup,
        religionId: +formValues.religion,
        guardian: null,
      };
      this.apiService
        .postService({
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
          url: `${UriConstants.POST_PATIENT}`,
          data: patientData,
        })
        .subscribe({
          next: (response) => {
            this.router.navigate(['/students/patients']);
            this.alertConfiguration('SUCCESS', "Se ha insertado correctamente el usuario.");
            this.openAlert();
          },
          error: (error) => {
            console.error('Error en la autenticación:', error);
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
