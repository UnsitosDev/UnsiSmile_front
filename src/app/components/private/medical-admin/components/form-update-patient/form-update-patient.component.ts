import { Component, OnInit, ViewChild, inject, ChangeDetectorRef } from '@angular/core';


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
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmGuardianComponent } from '../dialog-confirm-guardian/dialog-confirm-guardian.component';
import { LoadingComponent } from '@mean/shared';

@Component({
  selector: 'app-form-update-patient',
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatButtonModule,
    FieldComponentComponent,
    AlertComponent,
    LoadingComponent
],
  templateUrl: './form-update-patient.component.html',
  styleUrl: './form-update-patient.component.scss'
})
export class FormUpdatePatientComponent implements OnInit {
  private toastr = inject(ToastrService);
  private apiService = inject(ApiService<any>);
  private patientService = inject(PatientService);
  readonly dialog = inject(MatDialog);
  
  patientId: string = '';
  formGroup!: FormGroup;
  personal: any[] = [];
  address: any[] = [];
  other: any[] = [];
  guardian: any[] = [];
  minorPatient: boolean = false;
  disabledPatient: boolean = false;  // Nueva variable para controlar si el paciente es discapacitado
  needsGuardian: boolean = false;    // Nueva variable para controlar si el paciente discapacitado necesita tutor
  private currentPage: number = 0;
  

  localityId: string = '';
  municipalityNameId: string = '';
  stateNameId: string = '';
  neighborhoodId: string = '';
  streetId: string = '';
  private addressId: number = 0;

  isEditMode: boolean = false; // Variable para controlar el estado de edición
  public isLoading: boolean = true; // Agregada la variable isLoading
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private personalDataFields: FormFieldsService,
    private cdr: ChangeDetectorRef // Agregar ChangeDetectorRef para forzar la actualización de la vista
  ) {}

  async ngOnInit() {
    try {
      await this.loadRequiredData();
      this.route.params.subscribe(params => {
        this.patientId = params['idPatient'];
        if (this.patientId) {
          this.initializeForm();
          this.loadPatientData();
        }
      });
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
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
        this.fb.control({
          value: field.value || '',
          disabled: field.disabled || false
        }, field.validators || [])
      );
    });

    // Agregamos observador para cambios en hasDisability
    this.formGroup.get('hasDisability')?.valueChanges.subscribe(value => {
      const newValue = value === 'true';
      
      if (newValue && !this.disabledPatient && !this.minorPatient) {
        this.showGuardianConfirmDialog();
      } else if (this.minorPatient) {
        this.needsGuardian = true;
      }
      
      this.disabledPatient = newValue;
      
      // Actualizar validaciones después de cambio de estado
      this.updateGuardianValidations();
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
        this.disabledPatient = response.hasDisability;
        
        // Si es discapacitado y tiene tutor, establecer needsGuardian en true
        if (response.hasDisability && response.guardian) {
          this.needsGuardian = true;
        }
        
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
      consultationReason: patient.consultationReason || '',
      hasDisability: patient.hasDisability ? 'true' : 'false',
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
        guardianCurp: patient.guardian.person?.curp || '',
        firstGuardianName: patient.guardian.person?.firstName || '',
        secondGuardianName: patient.guardian.person?.secondName || '',
        lastGuardianName: patient.guardian.person?.firstLastName || '',
        secondLastGuardianName: patient.guardian.person?.secondLastName || '',
        phoneGuardian: patient.guardian.person?.phone || '',
        emailGuardian: patient.guardian.person?.email || '',
        guardianBirthDate: patient.guardian.person?.birthDate ? new Date(patient.guardian.person.birthDate).toISOString().split('T')[0] : '',
        guardianGender: patient.guardian.person?.gender?.idGender?.toString() || '',
        parentsMaritalStatus: patient.guardian.parentalStatus?.idCatalogOption?.toString() || '',
        doctorName: patient.guardian.doctorName || ''
      });
    }

    this.formGroup.patchValue(formData);

    // Deshabilitar todos los campos por defecto
    Object.keys(this.formGroup.controls).forEach(key => {
      this.formGroup.get(key)?.disable();
    });

    // Asegurar que los campos CURP y birthDate estén deshabilitados
    if (this.formGroup.get('curp')) {
      this.formGroup.get('curp')?.disable();
    }
    if (this.formGroup.get('birthDate')) {
      this.formGroup.get('birthDate')?.disable();
    }

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
    
    // Si es menor de edad, automáticamente necesita tutor sin importar la discapacidad
    if (isMinor) {
      this.needsGuardian = true;
    } else {
      // Si no es menor de edad, la necesidad de tutor depende de la discapacidad
      this.needsGuardian = this.disabledPatient && this.needsGuardian;
    }
    
    // Actualizar validaciones después de cambio de estado
    this.updateGuardianValidations();
  }

  // Nuevo método para mostrar el diálogo de confirmación de tutor
  showGuardianConfirmDialog(): void {
    const dialogRef = this.dialog.open(DialogConfirmGuardianComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      disableClose: true,
      data: { message: '¿Desea ingresar datos de un tutor para este paciente con discapacidad?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.needsGuardian = !!result;
      // Forzamos la detección de cambios para actualizar la vista inmediatamente
      this.cdr.detectChanges();
    });
  }

  // Nuevo método para actualizar las validaciones del tutor según se necesite o no
  updateGuardianValidations() {
    const shouldRequireGuardian = this.minorPatient || (this.disabledPatient && this.needsGuardian);
    
    this.guardian.forEach(field => {
      const control = this.formGroup.get(field.name);
      if (control) {
        if (shouldRequireGuardian) {
          // Si se requiere tutor, aplicar las validaciones originales
          if (field.required) {
            control.setValidators(field.validators || []);
          }
        } else {
          // Si no se requiere tutor, quitar todas las validaciones
          control.clearValidators();
        }
        control.updateValueAndValidity();
      }
    });
  }

  onFieldValueChange(event: any) {
    const { name, value } = event;
    this.formGroup.get(name)?.setValue(value);
  }

  // Método para habilitar la edición
  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    
    if (this.isEditMode) {
      // Habilitar todos los campos excepto CURP y fecha de nacimiento
      Object.keys(this.formGroup.controls).forEach(key => {
        if (key !== 'curp' && key !== 'birthDate') {
          this.formGroup.get(key)?.enable();
        }
      });
    } else {
      // Deshabilitar todos los campos
      Object.keys(this.formGroup.controls).forEach(key => {
        this.formGroup.get(key)?.disable();
      });
    }
  }

  onSubmit() {
    // Actualizar validaciones antes de validar el formulario
    this.updateGuardianValidations();
    
    if (this.formGroup.valid) {
      // Obtener todos los valores, incluyendo los campos deshabilitados
      const formValues = {
        ...this.formGroup.value,
        curp: this.formGroup.get('curp')?.value,
        birthDate: this.formGroup.get('birthDate')?.value
      };

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
          idAddress: this.addressId,
          streetNumber: formValues.exteriorNumber,
          interiorNumber: formValues.interiorNumber,
          housing: {
            idHousing: +formValues.housingCategory,
            category: this.patientService.housingOptions.find(option => option.value === formValues.housingCategory)?.label || ""
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
        hasDisability: this.disabledPatient,
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
        guardian: (this.minorPatient || (this.disabledPatient && this.needsGuardian)) ? {
          idGuardian: 0, // O el ID del guardián si existe
          parentalStatus: {
            idCatalogOption: +formValues.parentsMaritalStatus,
            optionName: this.patientService.parentsMaritalStatusOptions.find(option => option.value === formValues.parentsMaritalStatus)?.label || "",
            idCatalog: 12
          },
          doctorName: formValues.doctorName,
          person: {
            curp: formValues.guardianCurp || "",
            firstName: formValues.firstGuardianName,
            secondName: formValues.secondGuardianName || "",
            firstLastName: formValues.lastGuardianName,
            secondLastName: formValues.secondLastGuardianName || "",
            phone: formValues.phoneGuardian,
            birthDate: formValues.guardianBirthDate || null,
            email: formValues.emailGuardian || "",
            gender: {
              idGender: +formValues.guardianGender || 0,
              gender: this.patientService.genderOptions.find(option => option.value === formValues.guardianGender)?.label || ""
            }
          }
        } : null
      }; 

      this.apiService.patchService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.PATCH_PATIENT_BY_ID}${this.patientId}`,
        data: patientData,
      }).subscribe({
        next: (response) => {
          this.toastr.success(Messages.SUCCES_UPDATE_PATIENT, 'Éxito');
          // Desactivar modo edición tras guardar
          this.isEditMode = false;
          // Deshabilitar todos los campos de nuevo
          Object.keys(this.formGroup.controls).forEach(key => {
            this.formGroup.get(key)?.disable();
          });
          setTimeout(() => {
            this.router.navigate(['/medical-admin/patients']);
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

  onBack() {
    this.router.navigate(['/medical-admin/patients']);
  }

}
