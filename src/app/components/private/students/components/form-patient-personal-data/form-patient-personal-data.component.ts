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
import { AlertModel, StudentItems } from '@mean/models';
import { PatientService } from 'src/app/services/patient/patient.service';
import { religionRequest } from 'src/app/models/shared/patients/Religion/religion';
import { ApiService } from '@mean/services';
import { HttpHeaders } from '@angular/common/http';
import { UriConstants } from '@mean/utils';
import { NavigationStart, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmLeaveComponent } from '../../../students/components/dialog-confirm-leave/dialog-confirm-leave.component';
import { Messages } from 'src/app/utils/messageConfirmLeave';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-form-patient-personal-data',
  standalone: true,
  imports: [MatButtonModule,
    MatStepperModule, FormsModule, ReactiveFormsModule,MatCardModule, MatFormFieldModule, MatInputModule, MatDividerModule, MatButtonModule, MatGridListModule, MatFormFieldModule, MatIconModule, MatInputModule, MatDatepickerModule, FormsModule, ReactiveFormsModule, MatSelectModule, AlertComponent, FieldComponentComponent],
  templateUrl: './form-patient-personal-data.component.html',
  styleUrl: './form-patient-personal-data.component.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})



export class FormPatientPersonalDataComponent {
  private apiService = inject(ApiService<religionRequest>);
  private patientService = inject(PatientService);
  private toastr = inject(ToastrService);
  readonly dialog = inject(MatDialog);
  minorPatient: boolean = false;

  formGroup!: FormGroup;
  personal: FormField[] = [];
  address: FormField[] = [];
  other: FormField[] = [];
  guardian: FormField[] = [];
  private currentPage: number = 0;
  // Variables para navegación
  private navigationSubscription!: Subscription;
  private navigationTarget: string = '';
  private navigationInProgress: boolean = false;
  private isNavigationPrevented: boolean = true;
  private navigationComplete: boolean = false;
  private additionalRoutes = ['/students/user'];
  private route = inject(Router);

  constructor(
    private fb: FormBuilder,
    private personalDataFields: FormFieldsService,
    private addressDataFields: FormFieldsService,
    private otherDataFields: FormFieldsService,
    private guardianField: FormFieldsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Obtener los campos del formulario del servicio
    this.personal = this.personalDataFields.getPersonalDataFields();
    this.address = this.addressDataFields.getAddressFields();
    this.other = this.otherDataFields.getOtherDataFields();
    this.guardian = this.guardianField.getGuardianDataFields();

    // Construcción del formulario
    this.formGroup = this.fb.group({}); // Inicializar el FormGroup
    [...this.personal, ...this.address, ...this.other, ...this.guardian].forEach(field => {
      this.formGroup.addControl(
        field.name,
        this.fb.control(field.value || '', field.validators || [])
      );
    });

    // Combina las rutas de StudentItems y las adicionales
    const allRoutes = [
      ...StudentItems.map(item => item.routerlink),
      ...this.additionalRoutes
    ];

    // Interceptamos la navegación antes de que se realice
    this.navigationSubscription = this.route.events.subscribe((event) => {
      if (event instanceof NavigationStart && !this.navigationInProgress && !this.navigationComplete) {
        const targetUrl = event.url;

        // Verifica si la ruta es una de las que queremos prevenir
        if (allRoutes.includes(targetUrl)) {
          this.navigationTarget = targetUrl;

          // Detiene la navegación y mostramos el diálogo
          this.openDialog('300ms', '200ms', Messages.CONFIRM_LEAVE_CREATE_PATIENT);
        }
      }
    });
     // Precargar el grupo étnico con ID 1 y establecerlo en el formulario
     this.patientService.getEthnicGroupById(1).subscribe(response => {
      if (response) {
          // Asignar el valor al control del formulario después de que las opciones estén cargadas
          setTimeout(() => {
              const ethnicGroupField = this.other.find(field => field.name === 'ethnicGroup');
              if (ethnicGroupField) {
                  ethnicGroupField.value = '1'; // Establecer el valor predeterminado en el campo
              }
              this.formGroup.get('ethnicGroup')?.setValue('1');
              // Forzar la detección de cambios para actualizar la vista
              this.formGroup.get('ethnicGroup')?.updateValueAndValidity();
          }, 100);
      }
  });
    // Precargar la religión con ID 999999 y establecerla en el formulario
    this.patientService.getReligionById(999999).subscribe(response => {
      if (response) {
          setTimeout(() => {
              const religionField = this.other.find(field => field.name === 'religion');
              if (religionField) {
                  religionField.value = '999999';
              }
              this.formGroup.get('religion')?.setValue('999999');
              this.formGroup.get('religion')?.updateValueAndValidity();
          }, 100);
      }
  });
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, message: string): void {
    // Inicialmente, mantenemos al usuario en la misma página si no se ha aceptado la navegación
    if (this.isNavigationPrevented) {
      // Mantiene al usuario en el componente StudentsGeneralHistoryComponent
      this.route.navigateByUrl(this.route.url);
    }

    const dialogRef = this.dialog.open(DialogConfirmLeaveComponent, {
      width: '400px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: { message }
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.navigationInProgress = false; // Restablecemos la variable cuando el diálogo se cierra
      if (result) {
        // Desactivamos la prevención de la navegación después de aceptar
        this.isNavigationPrevented = false;
        // Marca que la navegación se completó
        this.navigationComplete = true;
        setTimeout(() => {
          this.route.navigateByUrl(this.navigationTarget); // Navegar a la ruta almacenada
        }, 0);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
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

        // Cargar las colonias usando el ID de localidad
        this.personalDataFields.handleNeighborhoodClick('', 0, 1000, this.localityId);
      }
    });
  }

  alertMessage: string = '';
  alertSeverity: string = AlertModel.AlertSeverity.ERROR;
  showAlert: boolean = false;


  onAgeStatusChange(isMinor: boolean) {
    this.minorPatient = isMinor;
  }


  onSubmit() {
    this.markFormGroupTouched(this.formGroup);
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
          idAddress: 0,
          streetNumber: formValues.exteriorNumber,
          interiorNumber: formValues.interiorNumber,
          housing: {
            idHousing: +formValues.housingCategory,
            category: "" // Si tienes el nombre de la categoría, agrégalo aquí
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
        .postService({
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
          url: `${UriConstants.POST_PATIENT}`,
          data: patientData,
        })
        .subscribe({
          next: (response) => {
            this.isNavigationPrevented = false;
            this.navigationComplete = true;
            this.router.navigate(['/students/patients']);
            this.toastr.success(Messages.SUCCES_INSERT_PATIENT, 'Éxito');
          },
          error: (error) => {
            this.toastr.error(error, 'Error');
          },
        });
    } else {
      this.toastr.warning(Messages.WARNING_INSERT_PATIENT, 'Advertencia');
    }
  }



  onScroll(event: any): void {
    const element = event.target;
    if (element.scrollHeight - element.scrollTop === element.clientHeight) {
      this.currentPage++;
      this.personalDataFields.handleStateClick('', this.currentPage);
      this.personalDataFields.handleMunicipalityClick('', this.currentPage);
      this.personalDataFields.handleLocalityClick('', this.currentPage);

    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(controlName => {
      const control = formGroup.get(controlName);
      if (control) {
        control.markAsTouched();
        control.updateValueAndValidity(); 
      }

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

}