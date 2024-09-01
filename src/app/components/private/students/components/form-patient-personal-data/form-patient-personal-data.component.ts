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
  private _formBuilder = inject(FormBuilder);
  private patientService = inject(PatientService); // Asegúrate de inyectar el servicio aquí


  firstFormGroup = this._formBuilder.group({
  });
  secondFormGroup = this._formBuilder.group({
  });

  formGroup!: FormGroup;

  personal: FormField[] = [];
  address: FormField[] = [];
  other: FormField[] = [];

  constructor(
    private fb: FormBuilder,
    private personalDataFields: FormFieldsService,
    private addressDataFields: FormFieldsService,
    private otherDataFields: FormFieldsService
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
        console.log(this.localityId, this.municipalityNameId, this.stateNameId);
        // Mostrar mensaje de éxito
        this.showAlert = true;
        this.alertMessage = 'Datos actualizados correctamente';
        this.alertSeverity = AlertModel.AlertSeverity.SUCCESS;
      },
      error: (error) => {
        // Manejar errores
        this.showAlert = true;
        this.alertMessage = 'Error al obtener los datos del código postal';
        this.alertSeverity = AlertModel.AlertSeverity.ERROR;
        console.error('Error al obtener los datos del código postal:', error);
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
      console.log('Todos los datos del formulario:', this.formGroup.value);
      const formValues = this.formGroup.value;


      const transformedData = {
        idPatient: 0, // Valor de prueba
        admissionDate: "2024-08-31",
        isMinor: true,
        hasDisability: true,
        nationalityId: 0,
        person: {
          curp: "stringstringstring",
          firstName: "string",
          secondName: "string",
          firstLastName: "string",
          secondLastName: "string",
          phone: "6804661135",
          birthDate: "2024-08-31",
          email: "string",
          gender: {
            idGender: 0,
            gender: "string"
          }
        },
        address: {
          idAddress: 0,
          streetNumber: "st",
          interiorNumber: "st",
          housing: {
            idHousing: "st",
            category: "string"
          },
          street: {
            idStreet: 0,
            name: "string",
            neighborhood: {
              idNeighborhood: 0,
              name: "string",
              locality: {
                idLocality: "strin",
                name: "string",
                postalCode: "strin",
                municipality: {
                  idMunicipality: "stri",
                  name: "string",
                  state: {
                    idState: "st",
                    name: "string"
                  }
                }
              }
            }
          }
        },
        maritalStatusId: 0,
        occupationId: 0,
        ethnicGroupId: 0,
        religionId: 0,
        guardian: {
          idGuardian: 0,
          firstName: "string",
          lastName: "string",
          phone: "string",
          email: "string"
        }
      };
      console.log('Transformed Data:', transformedData);

      // Aquí puedes enviar `transformedData` a tu API o manejarlo como necesites
    } else {
      this.alertMessage = 'Por favor, completa todos los campos correctamente.';
      this.showAlert = true;
    }
  }


}
