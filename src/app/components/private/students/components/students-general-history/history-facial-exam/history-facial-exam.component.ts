import { ApiService } from './../../../../../../services/api.service';
import { NgFor } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { ReactiveFormsModule } from '@angular/forms';

interface FacialFront {
  idFacialFront: number;
  facialFront: string;
}

@Component({
  selector: 'app-history-facial-exam',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    NgFor,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './history-facial-exam.component.html',
  styleUrl: './history-facial-exam.component.scss',
})
export class HistoryFacialExamComponent implements OnInit {
  // Formulario para el examen facial
  facialExamForms: FormGroup;

  /**
   * Constructor del componente.
   * @param authService Servicio de autenticación para la gestión de la sesión del usuario.
   * @param apiService Servicio para realizar llamadas a la API para obtener o enviar datos.
   * @param fb Constructor de FormBuilder para la creación de formularios reactivos.
   */
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    // Inicialización del formulario facialExamForms utilizando FormBuilder
    this.facialExamForms = this.fb.group({
      // ID del examen facial con valor predeterminado de 0
      idFacialExam: [0],
      // Características distintivas con un campo de texto vacío por defecto
      distinguishingFeatures: [''],
      // Perfil facial con opción vacía seleccionada por defecto
      facialProfile: [''],
      // ID del perfil facial con valor predeterminado de 1
      idFacialProfile: [1],
      // Frente facial con opción vacía seleccionada por defecto
      facialFront: [''],
      // ID del frente facial con un campo vacío por defecto
      idFacialFront: [],
    });
  }

  ngOnInit(): void {
    this.fetchFacialFronts();
    this.fetchFacialProfile();
  }
  /**
   * Método para manejar la presentación del formulario.
   * Este método se activa cuando se envía el formulario.
   * Procesa los datos del formulario y los imprime en la consola.
   */
  onSubmit() {
 

    // Objeto para enviar
    const exampleFacialExam = {
      idFacialExam: this.facialExamForms?.get('idFacialExam')?.value ?? 0,
      distinguishingFeatures:
        this.facialExamForms?.get('distinguishingFeatures')?.value ?? '',
      facialProfile: {
        idFacialProfile: '',
        facialProfile: this.facialExamForms?.get('facialProfile')?.value ?? '',
      },
      facialFront: {
        idFacialFront:'' ,
        facialFront: this.facialExamForms?.get('facialFront')?.value ?? '',
      },
    };

    console.log(exampleFacialExam);
    const token = this.authService.getToken();
    console.log(token);
    this.apiService
      .postService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        }),
        url: `${UriConstants.POST_FACIAL_EXAM}`,
        data: exampleFacialExam,
      })
      .subscribe({
        next: (response) => {
          console.log('enviado');
        },
        error: (error) => {
          console.error('Error en la autenticación:', error);
        },
      });
  }

  namefacialFront: any[] = [];
  idfacialFront: any[] = [];
  fetchFacialFronts() {   
    this.apiService
      .getListService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_FACIAL_FRONT}`,
        data: {},
      })
      .subscribe({
        next: (response) => {
          // Verifica si la respuesta contiene datos antes de asignar
          if (response && Array.isArray(response)) {
            this.namefacialFront = response.map(item => item.facialFront);
            this.idfacialFront = response.map(item => item.idFacialFront);
          }
        },
        error: (error) => {
          console.error('Error en la autenticación:', error);
        },
      });
  }
  
  nameFacialProfile: any[] = [];
  idFacialProfile: any[] = [];
  fetchFacialProfile() {   
    this.apiService
      .getListService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_FACIAL_PROFILE}`,
        data: {},
      })
      .subscribe({
        next: (response) => {
          // Verifica si la respuesta contiene datos antes de asignar
          if (response && Array.isArray(response)) {
            this.nameFacialProfile = response.map(item => item.facialProfile);
            this.idFacialProfile = response.map(item => item.idFacialProfile);
          }
        },
        error: (error) => {
          console.error('Error en la autenticación:', error);
        },
      });
  }
  

  
}
