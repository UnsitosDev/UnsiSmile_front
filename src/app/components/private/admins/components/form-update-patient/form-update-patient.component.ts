import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@mean/services';
import { HttpHeaders } from '@angular/common/http';
import { UriConstants } from '@mean/utils';
import { ToastrService } from 'ngx-toastr';
import { FormFieldsService } from 'src/app/services/form-fields.service';
import { FieldComponentComponent } from 'src/app/shared/components/field-component/field-component.component';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
import { Messages } from 'src/app/utils/messageConfirmLeave';
import { PatientService } from 'src/app/services/patient/patient.service';

@Component({
  selector: 'app-form-update-patient',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatButtonModule,
    FieldComponentComponent,
    AlertComponent
  ],
  templateUrl: './form-update-patient.component.html',
  styleUrl: './form-update-patient.component.scss'
})
export class FormUpdatePatientComponent implements OnInit {
  private toastr = inject(ToastrService);
  private apiService = inject(ApiService<any>);
  private patientService = inject(PatientService);
  
  patientId: string = '';
  formGroup!: FormGroup;
  personal: any[] = [];
  address: any[] = [];
  other: any[] = [];
  guardian: any[] = [];
  minorPatient: boolean = false;
  private currentPage: number = 0;

  localityId: string = '';
  municipalityNameId: string = '';
  stateNameId: string = '';
  neighborhoodId: string = '';
  streetId: string = ''; // Agregar esta propiedad
  private addressId: number = 0; // Agregar la propiedad addressId a la clase

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private personalDataFields: FormFieldsService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.route.params.subscribe(params => {
      this.patientId = params['idPatient'];
      if (this.patientId) {
        this.loadPatientData();
      }
    });
  }

  handlePostalCodeClick(param: string): void {
    this.patientService.getPostalCode(param).subscribe({
      next: (response) => {
        
        // Actualiza los campos de autocompletado
        this.formGroup.get('localityName')?.setValue(response[0].name);
        this.formGroup.get('municipalityName')?.setValue(response[0].municipality.name);
        this.formGroup.get('stateName')?.setValue(response[0].municipality.state.name);

        // Guardar los ids
        this.localityId = response[0].idLocality?.toString();
        this.municipalityNameId = response[0].municipality?.idMunicipality?.toString();
        this.stateNameId = response[0].municipality?.state?.idState?.toString();

        // Cargar las colonias usando el ID de localidad
        if (this.localityId) {
          this.personalDataFields.handleNeighborhoodClick('', 0, 1000, this.localityId);
        }
      }
    });
  }

  private initializeForm() {
    this.personal = this.personalDataFields.getPersonalDataFields();
    this.address = this.personalDataFields.getAddressFields();
    this.other = this.personalDataFields.getOtherDataFields();
    this.guardian = this.personalDataFields.getGuardianDataFields();
    
    // Inicializar campos que requieren carga inmediata
    const fieldsToInitialize = [
      { list: this.personal, fieldName: 'gender' },
      { list: this.other, fieldName: 'nationality' },
      { list: this.other, fieldName: 'maritalStatus' },
      { list: this.address, fieldName: 'housingCategory' }  // Agregar inicialización de categoría de vivienda
    ];

    fieldsToInitialize.forEach(({ list, fieldName }) => {
      const field = list.find(f => f.name === fieldName);
      if (field?.onClick) {
        field.onClick(new MouseEvent('click'));
      }
    });

    // Inicializar otros campos
    this.other.forEach(field => {
      if (field.onInputChange) {
        field.onInputChange.changeFunction('', 0, 1000);
      }
    });
    
    this.formGroup = this.fb.group({});
    [...this.personal, ...this.address, ...this.other, ...this.guardian].forEach(field => {
      this.formGroup.addControl(
        field.name,
        this.fb.control(field.value || '', field.validators || [])
      );
    });
  }

  private loadPatientData() {
    this.apiService.getService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      url: `${UriConstants.GET_PATIENT_BY_ID}${this.patientId}`,
      data: {},
    }).subscribe({
      next: (response) => {
        this.minorPatient = response.isMinor;
        this.setFormValues(response);
      },
      error: (error) => {
        this.toastr.error('Error al cargar los datos del paciente');
      }
    });
  }

  private setFormValues(patient: any) {
    // Formatear las fechas
    const birthDate = patient.person.birthDate ? new Date(patient.person.birthDate).toISOString().split('T')[0] : '';
    const admissionDate = patient.admissionDate ? new Date(patient.admissionDate).toISOString().split('T')[0] : '';
    
    // Extraer los datos de la calle
    const street = patient.address.street;
    const streetValue = street.idStreet ? street.idStreet.toString() : street.name;
    
    // Guardar los IDs de la dirección con valores específicos
    this.stateNameId = patient.address.street.neighborhood.locality.municipality.state.idState.toString();
    this.municipalityNameId = patient.address.street.neighborhood.locality.municipality.idMunicipality.toString();
    this.localityId = patient.address.street.neighborhood.locality.idLocality.toString();
    this.neighborhoodId = patient.address.street.neighborhood.idNeighborhood.toString();
    this.streetId = patient.address.street.idStreet.toString(); // Guardar el ID de la calle
    this.addressId = patient.address.idAddress;  // Agregar esta línea

    const formData = {
      // Datos personales
      firstName: patient.person.firstName,
      secondName: patient.person.secondName,
      firstLastName: patient.person.firstLastName,
      secondLastName: patient.person.secondLastName,
      curp: patient.person.curp,
      phone: patient.person.phone,
      birthDate: birthDate, // Usar la fecha formateada
      email: patient.person.email,
      gender: patient.person.gender.idGender.toString(),

      // Dirección (actualizar la parte de la calle)
      postalCode: patient.address.street.neighborhood.locality.postalCode,
      stateName: patient.address.street.neighborhood.locality.municipality.state.name,
      municipalityName: patient.address.street.neighborhood.locality.municipality.name,
      localityName: patient.address.street.neighborhood.locality.name,
      neighborhoodName: patient.address.street.neighborhood.name,
      streetName: streetValue, // Usar el valor procesado
      exteriorNumber: patient.address.streetNumber,
      interiorNumber: patient.address.interiorNumber,
      housingCategory: patient.address.housing.idHousing,

      // Otros datos
      nationality: patient.nationality?.idNationality?.toString(),
      maritalStatus: patient.maritalStatus?.idMaritalStatus?.toString(),
      occupation: patient.occupation?.idOccupation?.toString(),
      ethnicGroup: patient.ethnicGroup?.idEthnicGroup?.toString(),
      religion: patient.religion?.idReligion?.toString(),
      lastConsultation: admissionDate,
      consultationReason: patient.consultationReason || ''
    };

    Object.assign(formData, {
      nationality: patient.nationality?.idNationality?.toString(),
      maritalStatus: patient.maritalStatus?.idMaritalStatus?.toString(),
      occupation: patient.occupation?.idOccupation?.toString(),
      ethnicGroup: patient.ethnicGroup?.idEthnicGroup?.toString(),
      religion: patient.religion?.idReligion?.toString()
    });

    // Si es menor de edad, agregar datos del tutor
    if (patient.guardian) {
      Object.assign(formData, {
        firstGuardianName: patient.guardian.firstName,
        lastGuardianName: patient.guardian.lastName,
        phoneGuardian: patient.guardian.phone,
        emailGuardian: patient.guardian.email,
        parentsMaritalStatus: patient.guardian.parentalStatus.idCatalogOption,
        doctorName: patient.guardian.doctorName
      });
    }

    this.formGroup.patchValue(formData);

    // Forzar la actualización de los campos select
    const fieldsToUpdate = [
      { list: this.personal, fieldName: 'gender', value: patient.person.gender.idGender.toString() },
      { list: this.other, fieldName: 'nationality', value: patient.nationality?.idNationality?.toString() },
      { list: this.other, fieldName: 'maritalStatus', value: patient.maritalStatus?.idMaritalStatus?.toString() },
      { list: this.address, fieldName: 'housingCategory', value: patient.address.housing.idHousing.toString() },  // Agregar actualización de categoría de vivienda
      { 
        list: this.address, 
        fieldName: 'streetName', 
        value: street.name,
        id: street.idStreet
      },
      {
        list: this.address,
        fieldName: 'neighborhoodName',
        value: patient.address.street.neighborhood.name,
        id: patient.address.street.neighborhood.idNeighborhood
      }
    ];

    fieldsToUpdate.forEach(({ list, fieldName, value }) => {
      const field = list.find(f => f.name === fieldName);
      if (field) {
        field.value = value;
      }
    });

    // Inicializar y cargar las opciones en orden correcto
    if (this.stateNameId && this.stateNameId !== '0') {
      this.personalDataFields.handleStateClick(formData.stateName || '', 0, 1000);
      if (this.municipalityNameId && this.municipalityNameId !== '0') {
        this.personalDataFields.handleMunicipalityClick(formData.municipalityName || '', 0, 1000, this.stateNameId);
        if (this.localityId && this.localityId !== '0') {
          this.personalDataFields.handleLocalityClick(formData.localityName || '', 0, 1000, this.municipalityNameId);
          if (this.neighborhoodId && this.neighborhoodId !== '0') {
            this.personalDataFields.handleNeighborhoodClick(formData.neighborhoodName || '', 0, 1000, this.localityId);
            this.personalDataFields.handleStreetClick('', 0, 1000, this.neighborhoodId);
          }
        }
      }
    }
  }

  onBack() {
    this.router.navigate(['/admin/patients']);
  }

  onSubmit() {
    const formValues = this.formGroup.value;
    if (this.formGroup.valid) {
      const patientData = {
        isMinor: this.minorPatient,
        hasDisability: true,
        nationalityId: +formValues.nationality,
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
            gender: this.patientService.genderOptions.find(option => option.value === formValues.gender)?.label || ""
          }
        },
        address: {
          idAddress: this.addressId, // Usar el ID guardado en lugar de 0
          streetNumber: formValues.exteriorNumber,
          interiorNumber: formValues.interiorNumber,
          housing: {
            idHousing: +formValues.housingCategory,
            category: this.patientService.housingOptions.find(option => 
              option.value === formValues.housingCategory.toString()
            )?.label || ""
          },
          street: {
            idStreet: isNaN(+formValues.streetName) ? 0 : +formValues.streetName,
            name: isNaN(+formValues.streetName) ? formValues.streetName : '',
            neighborhood: {
              idNeighborhood: isNaN(+formValues.neighborhoodName) ? 0 : +formValues.neighborhoodName,
              name: isNaN(+formValues.neighborhoodName) ? formValues.neighborhoodName : '',
              locality: {
                idLocality: isNaN(+this.localityId) || +this.localityId === 0 ? 0 : +this.localityId,
                name: isNaN(+this.localityId) || +this.localityId === 0 ? formValues.localityName : "",
                postalCode: formValues.postalCode,
                municipality: {
                  idMunicipality: isNaN(+this.municipalityNameId) || +this.municipalityNameId === 0 ? 0 : +this.municipalityNameId,
                  name: isNaN(+this.municipalityNameId) || +this.municipalityNameId === 0 ? formValues.municipalityName : "",
                  state: {
                    idState: isNaN(+this.stateNameId) ? 0 : +this.stateNameId,
                    name: formValues.stateName
                  }
                }
              }
            }
          }
        },
        maritalStatus: {
          idMaritalStatus: +formValues.maritalStatus,
          maritalStatus: this.patientService.maritalStatusOptions.find(option => option.value === formValues.maritalStatus)?.label || ""
        },
        occupation: {
          idOccupation: isNaN(+formValues.occupation) ? 0 : +formValues.occupation,
          occupation: isNaN(+formValues.occupation) ? formValues.occupation : (this.patientService.occupationOptions.find(option => option.value === formValues.occupation)?.label || "")
        },
        ethnicGroup: {
          idEthnicGroup: +formValues.ethnicGroup,
          ethnicGroup: this.patientService.ethnicGroupOptions.find(option => option.value === formValues.ethnicGroup)?.label || ""
        },
        religion: {
          idReligion: +formValues.religion,
          religion: this.patientService.religionOptions.find(option => option.value === formValues.religion)?.label || ""
        },
        guardian: this.minorPatient ? {
          idGuardian: 0,
          firstName: formValues.firstGuardianName,
          lastName: formValues.lastGuardianName,
          phone: formValues.phoneGuardian,
          email: formValues.emailGuardian,
          parentalStatus: {
            idCatalogOption: +formValues.parentsMaritalStatus,
            optionName: this.patientService.parentsMaritalStatusOptions.find(option => option.value === formValues.parentsMaritalStatus)?.label || "",
            idCatalog: 12,
          },
          doctorName: formValues.doctorName
        } : null
      };
      
      this.apiService
        .patchService({
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
          url: `${UriConstants.PATCH_PATIENT_BY_ID}${this.patientId}`,
          data: patientData,
        })
        .subscribe({
          next: (response) => {
            this.toastr.success(Messages.SUCCES_INSERT_PATIENT, 'Éxito');
            setTimeout(() => {
            });
          },
          error: (error) => {
            this.toastr.error(error, 'Error');
          },
        });
    } else {
      this.toastr.warning(Messages.WARNING_INSERT_PATIENT, 'Advertencia');
    }
  }

  onFieldValueChange(event: any) {
    const { name, value } = event;
    this.formGroup.get(name)?.setValue(value);
  }

  onAgeStatusChange(isMinor: boolean) {
    this.minorPatient = isMinor;
  }


  onScroll(event: any): void {
    const element = event.target;
    if (element.scrollHeight - element.scrollTop === element.clientHeight) {
      this.currentPage++;
      this.personalDataFields.handleStateClick('', this.currentPage);
      this.personalDataFields.handleMunicipalityClick('', this.currentPage);
      this.personalDataFields.handleLocalityClick('', this.currentPage);
      this.personalDataFields.handleNeighborhoodClick('', this.currentPage);
      this.personalDataFields.handleStreetClick('', this.currentPage);

    }
  }
}
