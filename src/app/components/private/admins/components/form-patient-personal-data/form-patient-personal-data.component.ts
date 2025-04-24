import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
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


import { MatStepper, MatStepperModule } from '@angular/material/stepper';
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
import { studentService } from 'src/app/services/student.service';
import { DialogConfirmGuardianComponent } from '../dialog-confirm-guardian/dialog-confirm-guardian.component';


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
  disabledPatient: boolean = false;  // Nueva variable para controlar si el paciente es discapacitado
  private studentService = inject(studentService);
  needsGuardian: boolean = false; // Nueva variable para controlar si el paciente discapacitado necesita tutor

  formGroup!: FormGroup;
  personal: FormField[] = [];
  address: FormField[] = [];
  other: FormField[] = [];
  guardian: FormField[] = [];
  studentFields: FormField[] = [];
  private currentPage: number = 0;
  // Variables para navegación
  private navigationSubscription!: Subscription;
  private navigationTarget: string = '';
  private navigationInProgress: boolean = false;
  private isNavigationPrevented: boolean = true;
  private navigationComplete: boolean = false;
  private additionalRoutes = ['/students/user'];
  private route = inject(Router);
  @ViewChild('stepper') stepper!: MatStepper;
  patientId: number | null = null; // Añadir esta propiedad
  patientCurp: string = ''; // Añadir esta propiedad
  canAccessStudentTab: boolean = false;

  constructor(
    private fb: FormBuilder,
    private personalDataFields: FormFieldsService,
    private addressDataFields: FormFieldsService,
    private otherDataFields: FormFieldsService,
    private guardianField: FormFieldsService,
    private router: Router,
    private cdr: ChangeDetectorRef // Agregamos ChangeDetectorRef para forzar la actualización de la vista
  ) { }

  ngOnInit(): void {
    // Obtener los campos del formulario del servicio
    this.personal = this.personalDataFields.getPersonalDataFields();
    this.address = this.addressDataFields.getAddressFields();
    this.other = this.otherDataFields.getOtherDataFields();
    this.guardian = this.guardianField.getGuardianDataFields();
    this.studentFields = this.studentService.studentFields;

    // Construcción del formulario
    this.formGroup = this.fb.group({}); // Inicializar el FormGroup
    [...this.personal, ...this.address, ...this.other, ...this.guardian].forEach(field => {
      this.formGroup.addControl(
        field.name,
        this.fb.control(field.value || '', field.validators || [])
      );
    });

    this.studentFields.forEach(field => {
      this.formGroup.addControl(
        field.name,
        this.fb.control(field.value || '', field.validators || [])
      );
    });

    this.formGroup.get('hasDisability')?.valueChanges.subscribe(value => {
      const newValue = value === 'true';
      
      if (newValue && !this.disabledPatient && !this.minorPatient) {
        this.showGuardianConfirmDialog();
      } else if (this.minorPatient) {
        this.needsGuardian = true;
      }
      
      this.disabledPatient = newValue;
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
  }

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

  ngAfterViewInit() {
    this.stepper.selectionChange.subscribe((e: any) => {
      // Si está intentando ir a la última pestaña (alumno) y no está habilitada
      const shouldShowGuardianStep = this.minorPatient || (this.disabledPatient && this.needsGuardian);
      const lastStepIndex = shouldShowGuardianStep ? 4 : 3;
      if (e.selectedIndex === lastStepIndex && !this.canAccessStudentTab) {
        // Prevenir la navegación volviendo al índice anterior
        setTimeout(() => {
          this.stepper.selectedIndex = e.previouslySelectedIndex;
        });
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
    
    // Si es menor de edad, automáticamente necesita tutor sin importar la discapacidad
    if (isMinor) {
      this.needsGuardian = true;
    } else {
      // Si no es menor de edad, la necesidad de tutor depende de la discapacidad
      this.needsGuardian = this.disabledPatient && this.needsGuardian;
    }
  }

  private validateEthnicGroup(value: string): boolean {
    return this.patientService.ethnicGroupOptions.some(option => 
      option.value === value || option.label.toLowerCase() === value.toLowerCase()
    );
  }

  private validateReligion(value: string): boolean {
    return this.patientService.religionOptions.some(option => 
      option.value === value || option.label.toLowerCase() === value.toLowerCase()
    );
  }

  onSubmit() {
    this.markFormGroupTouched(this.formGroup);
    const formValues = this.formGroup.value;

    // Validar grupo étnico
    if (!this.validateEthnicGroup(formValues.ethnicGroup)) {
      this.toastr.error('Debe seleccionar un grupo étnico válido de la lista', 'Error de validación');
      return;
    }

    // Validar religión
    if (!this.validateReligion(formValues.religion)) {
      this.toastr.error('Debe seleccionar una religión válida de la lista', 'Error de validación');
      return;
    }

    if (this.formGroup.valid) {
      const patientData = {
        isMinor: this.minorPatient,
        hasDisability: formValues.hasDisability === 'true',
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
        guardian: (this.minorPatient || (this.disabledPatient && this.needsGuardian)) ? {
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
            // También podemos mostrar la respuesta del servidor            
            this.isNavigationPrevented = false;
            this.navigationComplete = true;
            this.toastr.success(Messages.SUCCES_INSERT_PATIENT, 'Éxito');
            this.canAccessStudentTab = true; // Habilitar la pestaña de alumno
            this.patientCurp = formValues.curp; // Guardar la CURP del paciente
            setTimeout(() => {
              this.searchPatientByCurp(this.patientCurp); // Buscar el ID usando la CURP
            });
          },
          error: (error) => {
            // También mostrar errores detallados
            this.toastr.error(error, 'Error');
          },
        });
    } else {
      this.toastr.warning(Messages.WARNING_INSERT_PATIENT, 'Advertencia');
    }
  }
  
  // Método auxiliar para obtener todos los errores de validación
  getFormValidationErrors() {
    const result: any[] = [];
    Object.keys(this.formGroup.controls).forEach(key => {
      const controlErrors = this.formGroup.get(key)?.errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach(keyError => {
          result.push({
            control: key,
            error: keyError,
            value: controlErrors[keyError]
          });
        });
      }
    });
    return result;
  }

  // Agregar nuevo método para buscar paciente por CURP
  searchPatientByCurp(curp: string) {
    if (!curp) {
      this.toastr.error('CURP no válida', 'Error');
      return;
    }

    this.apiService
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_PATIENTS}?keyword=${curp}`,
        data: {},
      })
      .subscribe({
        next: (response) => {
          if (response.content && response.content.length > 0) {
            const patient = response.content[0];
            this.patientId = patient.idPatient;
            
            this.stepper.next();
          } else {
            this.toastr.error('No se encontró el paciente con la CURP proporcionada', 'Error');
          }
        },
        error: (error) => {
          this.toastr.error('Error al buscar el paciente: ' + error, 'Error');
        },
      });
  }

  assignStudentToPatient() {
    const formValues = this.formGroup.value;
    
    if (!this.patientId || !formValues.studentEnrollment) {
      this.toastr.error('Faltan datos requeridos para la asignación', 'Error');
      return;
    }

    const assignmentData = {
      patientId: this.patientId.toString(),
      studentEnrollment: formValues.studentEnrollment
    };

    this.apiService
      .postService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: UriConstants.POST_PATIENT_STUDENT,
        data: assignmentData,
      })
      .subscribe({
        next: (response) => {
          this.toastr.success('Alumno asignado correctamente', 'Éxito');
          this.router.navigate(['/admin/patients']);
        },
        error: (error) => {
          this.toastr.error(error);
        },
      });
  }

  handleStudentEnrollmentSearch(searchTerm: string) {
    if (searchTerm && searchTerm.length >= 2) {
      this.apiService.getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_STUDENTS}?keyword=${searchTerm}`,
        data: {},
      }).subscribe({
        next: (response) => {
          const enrollmentField = this.studentFields.find(field => field.name === 'studentEnrollment');
          if (enrollmentField && response.content) {
            enrollmentField.options = response.content.map((student: any) => ({
              value: student.enrollment,
              label: `${student.enrollment} - ${student.person.firstName} ${student.person.firstLastName}`
            }));
          }
        },
        error: (error) => {
          this.toastr.error(error);
        }
      });
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
