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
  streetId: string = '';
  private addressId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private personalDataFields: FormFieldsService
  ) {}

  async ngOnInit() {
    await this.loadRequiredData();
    this.route.params.subscribe(params => {
      this.patientId = params['idPatient'];
      if (this.patientId) {
        this.initializeForm();
        this.loadPatientData();
      }
    });
  }

  private async loadRequiredData(): Promise<void> {
    await Promise.all([
      this.loadGenderOptions(),
      this.loadHousingOptions(),
      this.loadNationalityOptions(),
      this.loadMaritalStatusOptions()
    ]);
  }

  private loadGenderOptions(): Promise<void> {
    return new Promise((resolve) => {
      this.patientService.getGender();
      const interval = setInterval(() => {
        if (this.patientService.genderOptions.length > 0) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }

  private loadHousingOptions(): Promise<void> {
    return new Promise((resolve) => {
      this.patientService.getHousingData();
      const interval = setInterval(() => {
        if (this.patientService.housingOptions.length > 0) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }

  private loadNationalityOptions(): Promise<void> {
    return new Promise((resolve) => {
      this.patientService.getNacionalityData();
      const interval = setInterval(() => {
        if (this.patientService.nationalityOptions.length > 0) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }

  private loadMaritalStatusOptions(): Promise<void> {
    return new Promise((resolve) => {
      this.patientService.getMaritalStatusData();
      const interval = setInterval(() => {
        if (this.patientService.maritalStatusOptions.length > 0) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }

  shouldShowField(field: any): boolean {
    switch (field.name) {
      case 'gender':
        return this.patientService.genderOptions.length > 0;
      case 'housingCategory':
        return this.patientService.housingOptions.length > 0;
      case 'nationality':
        return this.patientService.nationalityOptions.length > 0;
      case 'maritalStatus':
        return this.patientService.maritalStatusOptions.length > 0;
      case 'streetName':
        return !!this.neighborhoodId;
      case 'neighborhoodName':
        return !!this.localityId;
      case 'localityName':
        return !!this.municipalityNameId;
      case 'municipalityName':
        return !!this.stateNameId;
      default:
        return true;
    }
  }

  private initializeForm() {
    this.personal = this.personalDataFields.getPersonalDataFields();
    this.address = this.personalDataFields.getAddressFields();
    this.other = this.personalDataFields.getOtherDataFields();
    this.guardian = this.personalDataFields.getGuardianDataFields();
    
    const fieldsToInitialize = [
      { list: this.personal, fieldName: 'gender' },
      { list: this.other, fieldName: 'nationality' },
      { list: this.other, fieldName: 'maritalStatus' },
      { list: this.address, fieldName: 'housingCategory' }  
    ];

    fieldsToInitialize.forEach(({ list, fieldName }) => {
      const field = list.find(f => f.name === fieldName);
      if (field?.onClick) {
        field.onClick(new MouseEvent('click'));
      }
    });

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
      next: async (response) => {
        this.minorPatient = response.isMinor;
        await this.loadAddressData(response.address);
        this.setFormValues(response);
      },
      error: (error) => {
        this.toastr.error('Error al cargar los datos del paciente');
      }
    });
  }

  private async loadAddressData(address: any): Promise<void> {
    if (!address) return;

    try {
      const street = address.street;
      const neighborhood = street?.neighborhood;
      const locality = neighborhood?.locality;
      const municipality = locality?.municipality;
      const state = municipality?.state;

      if (state?.idState) {
        this.stateNameId = state.idState.toString();
        await this.loadStateData(state.name);
      }

      if (municipality?.idMunicipality) {
        this.municipalityNameId = municipality.idMunicipality.toString();
        await this.loadMunicipalityData(municipality.name);
      }

      if (locality?.idLocality) {
        this.localityId = locality.idLocality.toString();
        await this.loadLocalityData(locality.name);
      }

      if (neighborhood?.idNeighborhood) {
        this.neighborhoodId = neighborhood.idNeighborhood.toString();
        await this.loadNeighborhoodData(neighborhood.name);
      }

      if (street?.idStreet) {
        this.streetId = street.idStreet.toString();
        await this.loadStreetData(street.name);
      }
    } catch (error) {
      console.error('Error loading address data:', error);
      this.toastr.error('Error al cargar los datos de dirección');
    }
  }

  private loadStateData(stateName: string): Promise<void> {
    return new Promise((resolve) => {
      this.personalDataFields.handleStateClick(stateName, 0, 1000);
      const interval = setInterval(() => {
        if (this.patientService.stateOptions.length > 0) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }

  private loadMunicipalityData(municipalityName: string): Promise<void> {
    return new Promise((resolve) => {
      this.personalDataFields.handleMunicipalityClick(municipalityName, 0, 1000, this.stateNameId);
      const interval = setInterval(() => {
        if (this.patientService.municipalityOptions.length > 0) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }

  private loadLocalityData(localityName: string): Promise<void> {
    return new Promise((resolve) => {
      this.personalDataFields.handleLocalityClick(localityName, 0, 1000, this.municipalityNameId);
      const interval = setInterval(() => {
        if (this.patientService.localityOptions.length > 0) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }

  private loadNeighborhoodData(neighborhoodName: string): Promise<void> {
    return new Promise((resolve) => {
      this.personalDataFields.handleNeighborhoodClick(neighborhoodName, 0, 1000, this.localityId);
      const interval = setInterval(() => {
        if (this.patientService.neighborhoodOptions.length > 0) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }

  private loadStreetData(streetName: string): Promise<void> {
    return new Promise((resolve) => {
      this.personalDataFields.handleStreetClick(streetName, 0, 1000, this.neighborhoodId);
      const interval = setInterval(() => {
        if (this.patientService.streetsOptions.length > 0) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }

  private setFormValues(patient: any) {
    console.log('Datos recibidos del backend:', JSON.stringify({
      paciente: {
        id: patient.idPatient,
        esMenor: patient.isMinor,
        tieneDiscapacidad: patient.hasDisability,
        datosPersonales: {
          curp: patient.person.curp,
          nombre: patient.person.firstName,
          segundoNombre: patient.person.secondName,
          apellidoPaterno: patient.person.firstLastName,
          apellidoMaterno: patient.person.secondLastName,
          telefono: patient.person.phone,
          fechaNacimiento: patient.person.birthDate,
          email: patient.person.email,
          genero: patient.person.gender
        },
        direccion: {
          idDireccion: patient.address.idAddress,
          numeroExterior: patient.address.streetNumber,
          numeroInterior: patient.address.interiorNumber,
          tipoVivienda: patient.address.housing,
          calle: {
            id: patient.address.street.idStreet,
            nombre: patient.address.street.name,
            colonia: {
              id: patient.address.street.neighborhood.idNeighborhood,
              nombre: patient.address.street.neighborhood.name,
              localidad: {
                id: patient.address.street.neighborhood.locality.idLocality,
                nombre: patient.address.street.neighborhood.locality.name,
                codigoPostal: patient.address.street.neighborhood.locality.postalCode,
                municipio: {
                  id: patient.address.street.neighborhood.locality.municipality.idMunicipality,
                  nombre: patient.address.street.neighborhood.locality.municipality.name,
                  estado: {
                    id: patient.address.street.neighborhood.locality.municipality.state.idState,
                    nombre: patient.address.street.neighborhood.locality.municipality.state.name
                  }
                }
              }
            }
          }
        },
        otrosDatos: {
          nacionalidad: patient.nationality,
          estadoCivil: patient.maritalStatus,
          ocupacion: patient.occupation,
          grupoEtnico: patient.ethnicGroup,
          religion: patient.religion
        },
        tutor: patient.guardian
      }
    }, null, 2));

    const birthDate = patient.person.birthDate ? new Date(patient.person.birthDate).toISOString().split('T')[0] : '';
    const admissionDate = patient.admissionDate ? new Date(patient.admissionDate).toISOString().split('T')[0] : '';
    
    const street = patient.address.street;
    const streetValue = street.idStreet ? street.idStreet.toString() : street.name;
    
    this.stateNameId = patient.address.street.neighborhood.locality.municipality.state.idState.toString();
    this.municipalityNameId = patient.address.street.neighborhood.locality.municipality.idMunicipality.toString();
    this.localityId = patient.address.street.neighborhood.locality.idLocality.toString();
    this.neighborhoodId = patient.address.street.neighborhood.idNeighborhood.toString();
    this.streetId = patient.address.street.idStreet.toString(); 
    this.addressId = patient.address.idAddress;  

    const formData = {
      firstName: patient.person.firstName,
      secondName: patient.person.secondName,
      firstLastName: patient.person.firstLastName,
      secondLastName: patient.person.secondLastName,
      curp: patient.person.curp,
      phone: patient.person.phone,
      birthDate: birthDate, 
      email: patient.person.email,
      gender: patient.person.gender.idGender.toString(),

      postalCode: patient.address.street.neighborhood.locality.postalCode,
      stateName: patient.address.street.neighborhood.locality.municipality.state.name,
      municipalityName: patient.address.street.neighborhood.locality.municipality.name,
      localityName: patient.address.street.neighborhood.locality.name,
      neighborhoodName: patient.address.street.neighborhood.name,
      streetName: streetValue, 
      exteriorNumber: patient.address.streetNumber,
      interiorNumber: patient.address.interiorNumber,
      housingCategory: patient.address.housing.idHousing,

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

    const fieldsToUpdate = [
      { list: this.personal, fieldName: 'gender', value: patient.person.gender.idGender.toString() },
      { list: this.other, fieldName: 'nationality', value: patient.nationality?.idNationality?.toString() },
      { list: this.other, fieldName: 'maritalStatus', value: patient.maritalStatus?.idMaritalStatus?.toString() },
      { list: this.address, fieldName: 'housingCategory', value: patient.address.housing.idHousing.toString() },  
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

  onAgeStatusChange(isMinor: boolean) {
    this.minorPatient = isMinor;
  }

  onFieldValueChange(event: any) {
    const { name, value } = event;
    this.formGroup.get(name)?.setValue(value);
  }

  onSubmit() {
    const formValues = this.formGroup.value;
    if (this.formGroup.valid) {
      const patientData = {
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
          idAddress: 0,
          streetNumber: formValues.exteriorNumber,
          interiorNumber: formValues.interiorNumber,
          housing: {
            idHousing: +formValues.housingCategory,
            category: ""
          },
          street: {
            idStreet: +formValues.streetName > 0 ? +formValues.streetName : 
              (this.patientService.streetsOptions.find(option => 
                option.label.toLowerCase() === formValues.streetName?.toLowerCase())?.value || '0'),
            name: formValues.streetName || '',
            neighborhood: {
              idNeighborhood: +formValues.neighborhoodName > 0 ? +formValues.neighborhoodName : 
                (this.patientService.neighborhoodOptions.find(option => 
                  option.label.toLowerCase() === formValues.neighborhoodName?.toLowerCase())?.value || '0'),
              name: formValues.neighborhoodName || '',
              locality: {
                idLocality: +this.localityId > 0 ? +this.localityId : 
                  (this.patientService.localityOptions.find(option => 
                    option.label.toLowerCase() === formValues.localityName?.toLowerCase())?.value || '0'),
                name: formValues.localityName || "",
                postalCode: formValues.postalCode,
                municipality: {
                  idMunicipality: +this.municipalityNameId > 0 ? +this.municipalityNameId : 
                    (this.patientService.municipalityOptions.find(option => 
                      option.label.toLowerCase() === formValues.municipalityName?.toLowerCase())?.value || '0'),
                  name: formValues.municipalityName || "",
                  state: {
                    idState: +this.stateNameId > 0 ? +this.stateNameId : 
                      (this.patientService.stateOptions.find(option => 
                        option.label.toLowerCase() === formValues.stateName?.toLowerCase())?.value || '0'),
                    name: formValues.stateName || ""
                  }
                }
              }
            }
          }
        },
        isMinor: this.minorPatient,
        hasDisability: true,
        nationalityId: +formValues.nationality,
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
            idCatalog: 12
          },
          doctorName: formValues.doctorName
        } : null
      };

      console.log('JSON completo a enviar:', JSON.stringify(patientData, null, 2));

      this.apiService.patchService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.PATCH_PATIENT_BY_ID}${this.patientId}`,
        data: patientData,
      }).subscribe({
        next: (response) => {
          this.toastr.success(Messages.SUCCES_UPDATE_PATIENT, 'Éxito');
          setTimeout(() => {
            this.router.navigate(['/admin/patients']);
          }, 1000);
        },
        error: (error) => {
          this.toastr.error(error, 'Error');
        }
      });
    } else {
      this.toastr.warning(Messages.WARNING_INSERT_PATIENT, 'Advertencia');
    }
  }
}
