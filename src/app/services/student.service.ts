import { inject, Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormField } from '../models/form-fields/form-field.interface';
import { curpValidator, emailValidator, phoneNumberValidator, minimumAgeValidator, enrollmentValidator } from '../utils/validators';
import { PatientService } from './patient/patient.service';
import { FieldNames } from '../models/form-fields/form-utils';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './api.service';
import { UriConstants } from '@mean/utils';

@Injectable({
    providedIn: 'root'
})
export class studentService {
    patientService = inject(PatientService);
    private apiService = inject(ApiService);
    private http = inject(HttpClient);

    careerOptions: Array<{ value: string; label: string }> = [];
    groupOptions: Array<{ value: string; label: string }> = [];
    semesterOptions: Array<{ value: string; label: string }> = [];

    private personalDataFields: FormField[] = [
        {
            type: 'input',
            label: 'Primer Nombre',
            name: 'firstName',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Primer Nombre es requerido.'
            }
        },
        {
            type: 'input',
            label: 'Segundo Nombre',
            name: 'secondName',
            required: false,
            errorMessages: {
                required: 'El campo Segundo Nombre es requerido.'
            }
        },
        {
            type: 'input',
            label: 'Apellido Paterno',
            name: 'firstLastName',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Apellido Paterno es requerido.'
            }
        },
        {
            type: 'input',
            label: 'Apellido Materno',
            name: 'secondLastName',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Apellido Materno es requerido.',
            }
        },
        {
            type: 'input',
            label: 'Matrícula',
            name: 'enrollment',
            required: true,
            validators: [Validators.required, enrollmentValidator()],
            errorMessages: {
                required: 'El campo Matrícula es requerido.',
                lastError: 'La matrícula debe contener exactamente 10 números'
            }
        },
        {
            type: 'input',
            label: 'CURP',
            name: 'curp',
            validators: [Validators.required, curpValidator()],
            errorMessages: {
                required: 'El campo CURP es requerido.',
                lastError: 'Introduzca una CURP válida'
            },
        },
        {
            type: 'input',
            label: 'Teléfono',
            name: 'phone',
            required: false,
            validators: [Validators.required, phoneNumberValidator()],
            errorMessages: {
                required: 'El campo Telefono es requerido.',
                lastError: 'Por favor, introduce un número de teléfono válido.'
            }
        },
        {
            type: 'datepicker',
            label: 'Fecha de Nacimiento',
            name: 'birthDate',
            validators: [
                Validators.required,
                minimumAgeValidator(18)
            ],
            errorMessages: {
                required: 'El campo Fecha de Nacimiento es requerido.',
                underage: 'Debes ser mayor de 18 años'
            }
        },
        {
            type: 'input',
            label: 'Correo electrónico',
            name: 'email',
            validators: [
                Validators.required,
                emailValidator()
            ],
            errorMessages: {
                required: 'El campo Correo electrónico es requerido.',
                lastError: 'Por favor, introduce un correo electrónico válido (ejemplo: usuario@dominio.com)'
            }
        },
        {
            type: 'select',
            label: 'Género',
            name: 'gender',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo GENERO es requerido.'
            },
            onClick: this.handleGenderClick.bind(this)
        },
        {
            type: 'select',
            label: 'Carrera',
            name: 'career',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'La carrera es requerida'
            },
            onClick: this.handleCareerClick.bind(this)
        },
        {
            type: 'select',
            label: 'Semestre',
            name: 'semester',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El semestre es requerido'
            },
            onClick: this.handleSemesterClick.bind(this)
        },
        {
            type: 'select',
            label: 'Grupo',
            name: 'group',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El grupo es requerido'
            },
            onClick: this.handleGroupClick.bind(this)
        },
      
    ];

    public studentFields: FormField[] = [
        {
          type: 'autocompleteoptions',
          label: 'Matrícula del Alumno',
          name: 'studentEnrollment',
          required: false,
          errorMessages: {
            required: 'La matrícula es requerida'
          },
          onInputChange: {
            changeFunction: this.handleStudentEnrollmentSearch.bind(this),
            length: 2  // Aquí se define el número mínimo de caracteres
          }
        }
      ];

      handleStudentEnrollmentSearch(searchTerm: string) {
        if (searchTerm && searchTerm.length >= 2) {  // Aquí se valida la longitud
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
                // Mapear solo las matrículas y nombres de los estudiantes
                enrollmentField.options = response.content.map((student: any) => {
                  const option = {
                    value: student.enrollment,
                    label: `${student.enrollment} - ${student.person.firstName} ${student.person.firstLastName}`
                  };
                  return option;
                });
                
              }
            },
            error: (error) => {
                console.error('Error al obtener estudiantes del servidor:', error);
            }
          });
        }
      }

    // Eventos

    constructor() {
        this.loadInitialData();
    }

    private loadInitialData(): void {
        // Cargar el género inmediatamente al inicializar el servicio
        this.patientService.getGender();
        
        // Forzar la actualización del campo de género con las opciones disponibles
        setTimeout(() => {
            this.handleGenderClick({} as MouseEvent);
            this.handleCareerClick();
            this.handleGroupClick();
            this.handleSemesterClick();
        }, 0);
    }

    public handleGenderClick(event: MouseEvent): void {
        this.patientService.getGender();
        const genderField = this.personalDataFields.find(field => field.name === FieldNames.GENDER);
        if (genderField) {
            genderField.options = this.patientService.genderOptions;
            if (genderField.options && genderField.options.length > 0) {
                genderField.value = genderField.options[0].value; // Seleccionar el primer valor por defecto
            }
        }
    }

    private handleCareerClick(): void {
        this.apiService.getService({
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            url: UriConstants.GET_CAREERS,
            data: {}
        }).subscribe({
            next: (response: Array<{ idCareer: string, career: string }>) => {
                this.careerOptions = response.map(item => ({
                    value: item.idCareer,
                    label: 'Odontología' 
                }));
                const careerField = this.personalDataFields.find(field => field.name === 'career');
                if (careerField) {
                    careerField.options = this.careerOptions;
                }
            }
        });
    }

    private handleGroupClick(): void {
        this.apiService.getService({
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            url: UriConstants.GET_GROUPS,
            data: {}
        }).subscribe({
            next: (response: any) => {                
                try {
                    const groups = Array.isArray(response) ? response : response.content;
                    
                    if (!groups) {
                        return;
                    }

                    this.groupOptions = groups
                        .filter((item: { idGroup: number; groupName: string }) => item && item.idGroup) // Cambiado de id a idGroup
                        .map((item: { idGroup: number; groupName: string }) => ({
                            value: item.idGroup.toString(), // Cambiado de id a idGroup
                            label: item.groupName
                        }));

                    const groupField = this.personalDataFields.find(field => field.name === 'group');
                    if (groupField) {
                        groupField.options = this.groupOptions;
                    }
                } catch (error) {
                    console.error('Error al procesar los grupos:', error);
                }
            },
            error: (error) => {
                this.groupOptions = [];
                const groupField = this.personalDataFields.find(field => field.name === 'group');
                if (groupField) {
                    groupField.options = [];
                }
            }
        });
    }

    private handleSemesterClick(): void {
        this.apiService.getService({
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            url: UriConstants.GET_SEMESTERS,
            data: {}
        }).subscribe({
            next: (response: Array<{ idSemester: string, semesterName: string }>) => {
                this.semesterOptions = response.map(item => ({
                    value: item.idSemester,
                    label: item.semesterName 
                }));
                const semesterField = this.personalDataFields.find(field => field.name === 'semester');
                if (semesterField) {
                    semesterField.options = this.semesterOptions;
                }
            }
        });
    }

    // Formularios
    getPersonalDataFields(): FormField[] {
        return this.personalDataFields;
    }

}