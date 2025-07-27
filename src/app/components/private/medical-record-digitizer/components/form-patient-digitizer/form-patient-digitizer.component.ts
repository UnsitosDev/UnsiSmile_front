import { HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ApiService, FormDigitizerPatientService } from '@mean/services';
import { studentResponse } from '@mean/shared';
import { UriConstants } from '@mean/utils';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
import { Messages } from 'src/app/utils/messageConfirmLeave';
import { FieldComponentComponent } from "../../../../../shared/components/field-component/field-component.component";
import { FormPatientPersonalDataComponent } from '../../../students/components/form-patient-personal-data/form-patient-personal-data.component';

@Component({
  selector: 'app-form-patient-digitizer',
  standalone: true,
  imports: [
    MatButtonModule, MatStepperModule, FormsModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatDividerModule,
    MatGridListModule, MatIconModule, MatDatepickerModule, MatSelectModule,
    AlertComponent, FieldComponentComponent
  ],
  templateUrl: './form-patient-digitizer.component.html',
  styleUrl: './form-patient-digitizer.component.scss'
})
export class FormPatientDigitizerComponent extends FormPatientPersonalDataComponent implements OnInit {

  private userService = inject(ApiService<studentResponse, {}>);
  private enrollment!: string;

  constructor(
    fb: FormBuilder,
    personalDataFields: FormDigitizerPatientService,
    addressDataFields: FormDigitizerPatientService,
    otherDataFields: FormDigitizerPatientService,
    guardianField: FormDigitizerPatientService,
    router: Router,
    cdr: ChangeDetectorRef,
    private digitizerPatientService: FormDigitizerPatientService
  ) {
    super(fb, personalDataFields, addressDataFields, otherDataFields, guardianField, router, cdr);
    this.fetchUserData();
  }

  fetchUserData() {
    this.userService
      .getService({
        url: `${UriConstants.GET_USER_INFO}`,
      })
      .subscribe({
        next: (data) => {
          this.enrollment = data.enrollment;
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
        },
      });
  }

  override onSubmit() {
    this.updateGuardianValidations();

    this.markFormGroupTouched(this.formGroup);
    const formValues = this.formGroup.value;

    if (!this.validateEthnicGroup(formValues.ethnicGroup)) {
      this.toastr.error('Debe seleccionar un grupo étnico válido de la lista', 'Error de validación');
      return;
    }

    if (!this.validateReligion(formValues.religion)) {
      this.toastr.error('Debe seleccionar una religión válida de la lista', 'Error de validación');
      return;
    }

    if (!this.validateNationality(formValues.nationality)) {
      this.toastr.error('Debe seleccionar una nacionalidad válida de la lista', 'Error de validación');
      return;
    }

    let hasErrors = false;
    const shouldRequireGuardian = this.minorPatient || (this.disabledPatient && this.needsGuardian);

    Object.keys(this.formGroup.controls).forEach(key => {
      const control = this.formGroup.get(key);
      const isGuardianField = this.guardian.some(field => field.name === key);

      if (control?.errors && (!isGuardianField || shouldRequireGuardian)) {
        hasErrors = true;
      }
    });

    if (!hasErrors) {
      const basePatientData = this.buildBasePatientData(formValues, shouldRequireGuardian);

      const extendedPatientData = {
        ...basePatientData,
        medicalRecordNumber: formValues.medicalRecordNumber,
        studentEnrollment: this.enrollment
      };

      // Enviar los datos extendidos
      this.submitPatientData(extendedPatientData);
    } else {
      this.toastr.warning(Messages.WARNING_INSERT_PATIENT, 'Advertencia');
    }
  }

  private buildBasePatientData(formValues: any, shouldRequireGuardian: boolean) {
    return {
      isMinor: this.minorPatient,
      hasDisability: formValues.hasDisability === 'true',
      nationalityId: isNaN(+formValues.nationality) ? 0 : +formValues.nationality,
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
                  name: formValues.stateName || "",
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
      guardian: (this.minorPatient || (this.disabledPatient && this.needsGuardian)) ? {
        idGuardian: this.guardianId || 0,
        person: {
          curp: formValues.guardianCurp,
          firstName: formValues.firstGuardianName,
          secondName: formValues.secondGuardianName,
          firstLastName: formValues.lastGuardianName,
          secondLastName: formValues.secondLastGuardianName,
          phone: formValues.phoneGuardian,
          birthDate: formValues.guardianBirthDate,
          email: formValues.emailGuardian,
          gender: {
            idGender: +formValues.guardianGender,
            gender: this.patientService.genderOptions.find(option => option.value === formValues.guardianGender)?.label || ""
          }
        },
        parentalStatus: {
          idCatalogOption: +formValues.parentsMaritalStatus,
          optionName: this.patientService.parentsMaritalStatusOptions.find(option => option.value === formValues.parentsMaritalStatus)?.label || "",
          idCatalog: 12,
        },
        doctorName: formValues.doctorName
      } : null
    };
  }

  // Método auxiliar para enviar los datos
  private submitPatientData(patientData: any) {
    if (patientData.nationalityId === 0 && this.formGroup.value.nationality) {
      const matchingNationality = this.patientService.nationalityOptions.find(
        option => option.label.toLowerCase() === this.formGroup.value.nationality.toLowerCase()
      );
      if (matchingNationality) {
        patientData.nationalityId = +matchingNationality.value;
      }
    }

    this.apiService
      .postService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.POST_PATIENT_DIGITIZER}`,
        data: patientData,
      })
      .subscribe({
        next: (response) => {
          this.toastr.success(Messages.SUCCES_INSERT_PATIENT, 'Éxito');
          this.router.navigate(['/medical-record-digitizer/patients']);
        },
        error: (error) => {
          this.toastr.error(error, 'Error');
        },
      });
  }
}
