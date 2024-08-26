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
import { inject} from '@angular/core';
import { Validators} from '@angular/forms';


import {MatStepperModule} from '@angular/material/stepper';
import { AlertModel } from '@mean/models';

interface Gender {
  idGender: number;
  gender: string;
}

interface Person {
  curp: string;
  firstName: string;
  secondName: string;
  firstLastName: string;
  secondLastName: string;
  phone: string;
  birthDate: string;
  email: string;
  gender: Gender;
}

interface Housing {
  idHousing: string;
  category: string;
}

interface Street {
  idStreet: number;
  name: string;
  neighborhood: {
      idNeighborhood: number;
      name: string;
      locality: {
          idLocality: string;
          name: string;
          postalCode: string;
          municipality: {
              idMunicipality: string;
              name: string;
              state: {
                  idState: string;
                  name: string;
              }
          }
      }
  }
}

interface Address {
  idAddress: number;
  streetNumber: string;
  interiorNumber: string;
  housing: Housing;
  street: Street;
}

interface Guardian {
  idGuardian: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

interface FormData {
  idPatient: number;
  admissionDate: string;
  isMinor: boolean;
  hasDisability: boolean;
  nationalityId: number;
  person: Person;
  address: Address;
  maritalStatusId: number;
  occupationId: number;
  ethnicGroupId: number;
  religionId: number;
  guardian: Guardian;
}

@Component({
  selector: 'app-form-patient-personal-data',
  standalone: true,
  imports: [   MatButtonModule,
    MatStepperModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,MatDividerModule, MatButtonModule, MatGridListModule, MatFormFieldModule, MatIconModule, MatInputModule, MatDatepickerModule, FormsModule, ReactiveFormsModule, MatSelectModule, AlertComponent, FieldComponentComponent],
  templateUrl: './form-patient-personal-data.component.html',
  styleUrl: './form-patient-personal-data.component.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})



export class FormPatientPersonalDataComponent {
  private _formBuilder = inject(FormBuilder);

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
  handleSetFieldValue(event: { field: string, value: any }) {
    this.formGroup.get(event.field)?.setValue(event.value);
  }

  alertMessage: string = '';
  alertSeverity: string = AlertModel.AlertSeverity.ERROR;
  showAlert: boolean = false;
  onSubmit() {
    if (this.formGroup.valid) {
      console.log('Todos los datos del formulario:', this.formGroup.value);
    } else {
      this.alertMessage = 'Por favor, completa todos los campos correctamente.';
      this.showAlert = true;    }
  }

  transformAndSubmitData() {
    console.log('Entrando a la funion')
    if (this.formGroup.valid) {
        // Mapeo de los datos del formulario al nuevo formato
        const formValues = this.formGroup.value;

        const transformedData: FormData = {
            idPatient: 0, // Valor de prueba
            admissionDate: formValues.admissionDate || '2024-08-25',
            isMinor: false, // Asumimos que no es menor de edad
            hasDisability: true, // Asumimos que tiene discapacidad
            nationalityId: 1, // Valor de prueba (ID para México)
            person: {
                curp: formValues.curp || 'AOPS011028HOCNRLA4',
                firstName: formValues.firstName || 'Salvador',
                secondName: formValues.secondName || 'Elioenai',
                firstLastName: formValues.firstLastName || 'Antonio',
                secondLastName: formValues.secondLastName || 'Perez',
                phone: formValues.phone || '9514008591',
                birthDate: formValues.birthDate || '2001-10-28',
                email: formValues.email || 'elio@gmail.com',
                gender: {
                    idGender: parseInt(formValues.gender, 10) || 1, // 1 = Masculino, 2 = Femenino
                    gender: formValues.gender === '1' ? 'Masculino' : 'Femenino' // Basado en el valor del campo
                }
            },
            address: {
                idAddress: 9876, // Valor de prueba
                streetNumber: formValues.exteriorNumber || '19',
                interiorNumber: formValues.interiorNumber || '1',
                housing: {
                    idHousing: formValues.housingCategory || '1', // Valor de prueba (ID para Casa)
                    category: formValues.housingCategory === '1' ? 'Casa' : (formValues.housingCategory === '2' ? 'Departamento' : 'Otro')
                },
                street: {
                    idStreet: 123, // Valor de prueba
                    name: formValues.streetName || '12',
                    neighborhood: {
                        idNeighborhood: 456, // Valor de prueba
                        name: formValues.neighborhoodName || 'Melchor',
                        locality: {
                            idLocality: '789', // Valor de prueba
                            name: formValues.localityName || 'Cieneguilla',
                            postalCode: formValues.postalCode || '70877',
                            municipality: {
                                idMunicipality: '101', // Valor de prueba
                                name: formValues.municipalityName || 'San Sebastián',
                                state: {
                                    idState: '202', // Valor de prueba
                                    name: formValues.stateName || 'Oaxaca'
                                }
                            }
                        }
                    }
                }
            },
            maritalStatusId: parseInt(formValues.maritalStatus, 10) || 2, // 1 = Soltero, 2 = Casado
            occupationId: 303, // Valor de prueba
            ethnicGroupId: 404, // Valor de prueba
            religionId: 505, // Valor de prueba
            guardian: {
                idGuardian: 606, // Valor de prueba
                firstName: 'Maria', // Valor de prueba
                lastName: 'Lopez', // Valor de prueba
                phone: '9512345678', // Valor de prueba
                email: 'maria.lopez@example.com' // Valor de prueba
            }
        };

        // Enviar datos transformados
        console.log('Transformed Data:', transformedData);
        // Aquí puedes enviar `transformedData` al servidor
    }
}

}
