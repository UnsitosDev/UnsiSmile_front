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
  
  patientId: string = '';
  formGroup!: FormGroup;
  personal: any[] = [];
  address: any[] = [];
  other: any[] = [];
  guardian: any[] = [];
  minorPatient: boolean = false;
  private currentPage: number = 0;


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
        console.log('Respuesta del servidor:', response);
        this.minorPatient = response.isMinor;
        this.setFormValues(response);
      },
      error: (error) => {
        console.error('Error al cargar los datos del paciente:', error);
        this.toastr.error('Error al cargar los datos del paciente');
      }
    });
  }

  private setFormValues(patient: any) {
    // Formatear las fechas
    const birthDate = patient.person.birthDate ? new Date(patient.person.birthDate).toISOString().split('T')[0] : '';
    const admissionDate = patient.admissionDate ? new Date(patient.admissionDate).toISOString().split('T')[0] : '';
    
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

      // Dirección
      postalCode: patient.address.street.neighborhood.locality.postalCode,
      stateName: patient.address.street.neighborhood.locality.municipality.state.name,
      municipalityName: patient.address.street.neighborhood.locality.municipality.name,
      localityName: patient.address.street.neighborhood.locality.name,
      neighborhoodName: patient.address.street.neighborhood.name,
      streetName: patient.address.street.name,
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
      { list: this.address, fieldName: 'housingCategory', value: patient.address.housing.idHousing.toString() }  // Agregar actualización de categoría de vivienda
    ];

    fieldsToUpdate.forEach(({ list, fieldName, value }) => {
      const field = list.find(f => f.name === fieldName);
      if (field) {
        field.value = value;
      }
    });

    
  }

  onBack() {
    this.router.navigate(['/admin/patients']);
  }

  onSubmit() {
    if (this.formGroup.valid) {
      // Implementar la lógica de actualización
      this.toastr.success('Paciente actualizado con éxito');
      this.router.navigate(['/admin/patients']);
    } else {
      this.toastr.warning(Messages.WARNING_INSERT_PATIENT);
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
