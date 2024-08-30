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

interface FormData {
  idPatient: number;
  admissionDate: string;
  isMinor: boolean;
  hasDisability: boolean;
  nationalityId: number;
  person: {
    curp: string;
    firstName: string;
    secondName: string;
    firstLastName: string;
    secondLastName: string;
    phone: string;
    birthDate: string;
    email: string;
    gender: {
      idGender: number;
      gender: string;
    };
  };
  address: {
    idAddress: number;
    streetNumber: string;
    interiorNumber: string;
    housing: {
      idHousing: number;
      category: string;
    };
    street: {
      idStreet: number;
      name: string;
      neighborhood: {
        idNeighborhood: number;
        name: string;
        locality: {
          idLocality: number;
          name: string;
          postalCode: string;
          municipality: {
            idMunicipality: number;
            name: string;
            state: {
              idState: number;
              name: string;
            };
          };
        };
      };
    };
  };
  maritalStatusId: number;
  occupationId: number;
  ethnicGroupId: number;
  religionId: number;
  guardian: {
    idGuardian: number;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
}

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
  
    handlePostalCodeClick(param: string): void {
      this.patientService.getPostalCode(param).subscribe({
        next: (response) => {
          // Actualiza los campos de autocompletado
          this.formGroup.get('localityName')?.setValue(response[0].name);
          this.formGroup.get('municipalityName')?.setValue(response[0].municipality.name);
          this.formGroup.get('stateName')?.setValue(response[0].municipality.state.name);
    
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
      

      const transformedData: FormData = {
        idPatient: 0, // Valor de prueba
        admissionDate: formValues.admissionDate,
        isMinor: false, // Asumimos que no es menor de edad
        hasDisability: true, // Asumimos que tiene discapacidad
        nationalityId: 1, // Valor de prueba (ID para México)
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
            idGender: parseInt(formValues.gender, 10) || 1, // 1 = Masculino, 2 = Femenino
            gender: formValues.gender === '1' ? 'Masculino' : 'Femenino' // Basado en el valor del campo
          }
        },
        address: {
          idAddress: 0, // Valor de prueba
          streetNumber: formValues.exteriorNumber || '19',
          interiorNumber: formValues.interiorNumber || '1',
          housing: {
            idHousing: 0, // Valor de prueba
            category: formValues.housingCategory === '1' ? 'Casa' : (formValues.housingCategory === '2' ? 'Departamento' : 'Otro')
          },
          street: {
            idStreet: 0, // Valor de prueba
            name: formValues.streetName || '12',
            neighborhood: {
              idNeighborhood: 0, // Valor de prueba
              name: formValues.neighborhoodName || 'Melchor',
              locality: {
                idLocality: 0, // Valor de prueba
                name: formValues.localityName || 'Cieneguilla',
                postalCode: formValues.postalCode || '70877',
                municipality: {
                  idMunicipality: 0, // Valor de prueba
                  name: formValues.municipalityName || 'San Sebastián',
                  state: {
                    idState: 0, // Valor de prueba
                    name: formValues.stateName || 'Oaxaca'
                  }
                }
              }
            }
          }
        },
        maritalStatusId: parseInt(formValues.maritalStatus, 10) || 2, // 1 = Soltero, 2 = Casado
        occupationId: 0, // Valor de prueba
        ethnicGroupId: 0, // Valor de prueba
        religionId: 0, // Valor de prueba
        guardian: {
          idGuardian: 0, // Valor de prueba
          firstName: 'Maria', // Valor de prueba
          lastName: 'Lopez', // Valor de prueba
          phone: '9512345678', // Valor de prueba
          email: 'maria.lopez@example.com' // Valor de prueba
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
