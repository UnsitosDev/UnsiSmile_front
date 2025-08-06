import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormField } from 'src/app/shared/models/form-fields/form-field.interface';
import { FormFieldsService } from 'src/app/shared/services/form-fields.service';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
import { FieldComponentComponent } from "../../../../../shared/components/field-component/field-component.component";


import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { NavigationStart, Router } from '@angular/router';
import { AlertModel } from 'src/app/shared/models';
import { ApiService } from 'src/app/shared/services';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { religionRequest } from 'src/app/shared/models/shared/patients/Religion/religion';
import { PatientService } from 'src/app/shared/services/patient/patient.service';
import { studentService } from 'src/app/shared/services/student.service';
import { Messages } from 'src/app/utils/messageConfirmLeave';
import { DialogConfirmLeaveComponent } from '../../../students/components/dialog-confirm-leave/dialog-confirm-leave.component';
import { DialogConfirmGuardianComponent } from '../dialog-confirm-guardian/dialog-confirm-guardian.component';
import { StudentItems } from '../../../students/pages/layout/student-menu-items.model';

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
  guardianId: number = 0; // Nueva propiedad para almacenar el ID del tutor

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
  canAccessStudentTab: boolean = false;
  patientData: any = null; // Guardaremos los datos del paciente aquí

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

    // Añadir listener para cuando se encuentra una persona por CURP
    document.addEventListener('personFound', ((event: CustomEvent) => {
      this.fillFormWithPersonData(event.detail);
    }) as EventListener);

    // Añadir listener para cuando se encuentra un tutor por CURP
    document.addEventListener('guardianFound', ((event: CustomEvent) => {
      this.fillFormWithGuardianData(event.detail);
    }) as EventListener);
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
    
    // Eliminar los listeners cuando se destruye el componente
    document.removeEventListener('personFound', ((event: CustomEvent) => {
      this.fillFormWithPersonData(event.detail);
    }) as EventListener);

    document.removeEventListener('guardianFound', ((event: CustomEvent) => {
      this.fillFormWithGuardianData(event.detail);
    }) as EventListener);
  }

  // Nuevo método para rellenar el formulario con los datos de la persona
  fillFormWithPersonData(person: any): void {
    if (!person) return;
    
    // Primero cargamos las opciones de género
    this.patientService.getGender();
    
    setTimeout(() => {
      // Actualizar los campos del formulario con los datos de la persona
      this.formGroup.patchValue({
        firstName: person.firstName || '',
        secondName: person.secondName || '',
        firstLastName: person.firstLastName || '',
        secondLastName: person.secondLastName || '',
        phone: person.phone || '',
        email: person.email || '',
        birthDate: person.birthDate ? new Date(person.birthDate) : null,
      });
      
      // Si la persona tiene género, asegurarse que el campo tenga las opciones primero
      if (person.gender?.idGender) {
        // Buscar el campo de género para actualizar sus opciones
        const genderField = this.personal.find(field => field.name === 'gender');
        if (genderField) {
          genderField.options = this.patientService.genderOptions;
        }
        
        // Luego establecer el valor
        this.formGroup.patchValue({
          gender: person.gender.idGender.toString()
        });
      }

      // Calcular si es menor de edad
      if (person.birthDate) {
        const birthDate = new Date(person.birthDate);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const isMinor = age < 18;
        
        // Actualizar el estado del componente para mostrar la pestaña de tutor si es menor
        this.onAgeStatusChange(isMinor);
      }

      // Forzar actualización de la vista para reflejar los cambios
      this.cdr.detectChanges();
      
      // Notificar al usuario
    }, 300); // Un pequeño retraso para asegurar que los datos se hayan cargado
  }

  // Nuevo método para rellenar el formulario con los datos del tutor
  fillFormWithGuardianData(guardian: any): void {
    if (!guardian) return;

    // Guardar el ID del tutor si existe
    if (guardian.idGuardian) {
      this.guardianId = guardian.idGuardian;
    }

    // Cargar primero las opciones de género y estado civil parental
    this.patientService.getGender();
    this.patientService.getParentsMaritalStatusData();
    
    setTimeout(() => {
      // Actualizar los campos del formulario con los datos del tutor
      this.formGroup.patchValue({
        firstGuardianName: guardian.person?.firstName || '',
        secondGuardianName: guardian.person?.secondName || '',
        lastGuardianName: guardian.person?.firstLastName || '',
        secondLastGuardianName: guardian.person?.secondLastName || '',
        phoneGuardian: guardian.person?.phone || '',
        emailGuardian: guardian.person?.email || '',
        guardianBirthDate: guardian.person?.birthDate ? new Date(guardian.person.birthDate) : null,
        doctorName: guardian.doctorName || ''
      });

      // Asegurar que los campos select tengan opciones antes de establecer valores
      
      // Para el género del tutor
      const guardianGenderField = this.guardian.find(field => field.name === 'guardianGender');
      if (guardianGenderField) {
        guardianGenderField.options = this.patientService.genderOptions;
      }
      
      if (guardian.person?.gender?.idGender) {
        this.formGroup.patchValue({
          guardianGender: guardian.person.gender.idGender.toString()
        });
      }
      
      // Para el estado civil parental
      const maritalStatusField = this.guardian.find(field => field.name === 'parentsMaritalStatus');
      if (maritalStatusField) {
        maritalStatusField.options = this.patientService.parentsMaritalStatusOptions;
      }
      
      if (guardian.parentalStatus?.idCatalogOption) {
        this.formGroup.patchValue({
          parentsMaritalStatus: guardian.parentalStatus.idCatalogOption.toString()
        });
      }

      // Forzar actualización de la vista para reflejar los cambios
      this.cdr.detectChanges();
      
      // Notificar al usuario
    }, 300); // Un pequeño retraso para asegurar que los datos se hayan cargado
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
    
    // Actualizar validaciones después de cambio de estado
    this.updateGuardianValidations();
  }

  // Agregar métodos de validación que faltan
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
  
  // Agregar método para validar nacionalidad
  private validateNationality(value: string): boolean {
    return this.patientService.nationalityOptions.some(option => 
      option.value === value || option.label.toLowerCase() === value.toLowerCase()
    );
  }

  // Método para actualizar las validaciones del tutor según se necesite o no
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

  onSubmit() {
    // Actualizar validaciones antes de validar el formulario
    this.updateGuardianValidations();
    
    const formValues = this.formGroup.value;

    // Validar grupo étnico, religión y nacionalidad
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

    // Verificar si hay errores en el formulario, filtrando los campos del tutor cuando no se necesitan
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
      // Crear el objeto de datos del paciente pero no enviarlo todavía
      this.patientData = {
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
          idGuardian: this.guardianId || 0, 
          person: {
            curp: formValues.guardianCurp,
            firstName: formValues.firstGuardianName,
            secondName: formValues.secondGuardianName,
            firstLastName: formValues.lastGuardianName,
            secondLastGuardianName: formValues.secondLastGuardianName,
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
      
      // Actualizar la estructura de los datos de nacionalidad en el objeto
      if (this.patientData.nationalityId === 0 && formValues.nationality) {
        const matchingNationality = this.patientService.nationalityOptions.find(
          option => option.label.toLowerCase() === formValues.nationality.toLowerCase()
        );
        if (matchingNationality) {
          this.patientData.nationalityId = +matchingNationality.value;
        }
      }
      
      // En lugar de enviar los datos ahora, solo habilitamos la pestaña del alumno
      this.canAccessStudentTab = true;
      
      // Avanzar a la siguiente pestaña
      setTimeout(() => {
        this.stepper.next();
      });
    } else {
      this.toastr.warning(Messages.WARNING_INSERT_PATIENT, 'Advertencia');
    }
  }

  // Eliminar el método searchPatientByCurp ya que no lo necesitamos más

  // Modificamos el método para enviar todos los datos juntos
  assignStudentToPatient() {
    const formValues = this.formGroup.value;
    
    if (!this.patientData || !formValues.studentEnrollment) {
      this.toastr.error('Faltan datos requeridos para la asignación', 'Error');
      return;
    }

    // Añadir el enrollment del estudiante al objeto de datos del paciente
    this.patientData.studentEnrollment = formValues.studentEnrollment;

    // Enviar todos los datos juntos
    this.studentService.createPatientWithStudent(this.patientData)
      .subscribe({
        next: (response) => {
          this.isNavigationPrevented = false;
          this.navigationComplete = true;
          this.toastr.success('Paciente creado y asignado correctamente', 'Éxito');
          setTimeout(() => {
            this.router.navigate(['/medical-admin/patients']);
          }, 1000);
        },
        error: (error) => {
          this.toastr.error(error, 'Error');
        },
      });
  }

  getFormValidationErrors() {
    const result: any[] = [];
    const shouldRequireGuardian = this.minorPatient || (this.disabledPatient && this.needsGuardian);
    
    Object.keys(this.formGroup.controls).forEach(key => {
      const controlErrors = this.formGroup.get(key)?.errors;
      const isGuardianField = this.guardian.some(field => field.name === key);
      
      // Solo incluir errores de campos del tutor si se requiere tutor
      if (controlErrors && (!isGuardianField || shouldRequireGuardian)) {
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
}
        