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
    // Obtiene los valores seleccionados para el perfil facial y la vista frontal del formulario
    const selectedIdFacialProfileValue =
      this.facialExamForms?.get('facialProfile')?.value;
    const selectedIdFacialFrontValue =
      this.facialExamForms?.get('facialFront')?.value;

    // Busca el objeto correspondiente a la vista frontal seleccionada en la lista namefacialFront
    const matchedItem = this.namefacialFront.find(
      (item) =>
        item.idFacialFront.toString() === selectedIdFacialFrontValue.toString()
    );

    // Busca el objeto correspondiente al perfil facial seleccionado en la lista nameFacialProfile
    const matchedItemFacial = this.nameFacialProfile.find(
      (item) =>
        item.idFacialProfile.toString() ===
        selectedIdFacialProfileValue.toString()
    );

    // Verifica si se encontró el objeto correspondiente a la vista frontal seleccionada
    if (matchedItem) {
      // Imprimir en consola el valor de facialFront correspondiente
      // console.log('Facial Front seleccionado:', matchedItem.facialFront);
    } else {
      // Si no se encuentra un objeto correspondiente, manejar el caso según sea necesario
      // console.log('No se encontró un Facial Front correspondiente para el id seleccionado:',selectedIdFacialFrontValue);
    }

    // Verifica si se encontró el objeto correspondiente al perfil facial seleccionado
    if (matchedItemFacial) {
      // console.log('Facial Front seleccionado:', matchedItemFacial.facialProfile);
    } else {
      // console.log('No se encontró un Facial Front correspondiente para el id seleccionado:',selectedIdFacialProfileValue);
    }

    // Crea un objeto exampleFacialExam que contiene la información del examen facial
    const exampleFacialExam = {
      idFacialExam: this.facialExamForms?.get('idFacialExam')?.value ?? 0,
      distinguishingFeatures:
        this.facialExamForms?.get('distinguishingFeatures')?.value ?? '',
      facialProfile: {
        idFacialProfile: selectedIdFacialProfileValue,
        facialProfile: matchedItemFacial.facialProfile,
      },
      facialFront: {
        idFacialFront: selectedIdFacialFrontValue,
        facialFront: matchedItem.facialFront,
      },
    };

    // console.log(exampleFacialExam);
    const token = this.authService.getToken();
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
          // console.log('enviado');
        },
        error: (error) => {
          console.error('Error en la autenticación:', error);
        },
      });
  }
  /**
   * Método para recuperar las opciones disponibles para la vista frontal del examen facial desde el backend.
   * Realiza una solicitud GET al backend y asigna los datos recuperados a la lista namefacialFront.
   * Además, crea un arreglo comparefacialFront a partir de la respuesta del backend.
   */
  namefacialFront: any[] = [];
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
            this.namefacialFront = response.map((item) => ({
              facialFront: item.facialFront,
              idFacialFront: item.idFacialFront,
            }));
            // Crear el arreglo comparefacialFront a partir de la respuesta del backend
            const comparefacialFront: any[] = [];

            for (const item of response) {
              comparefacialFront.push({
                facialFront: item.facialFront,
                idFacialFront: item.idFacialFront,
              });
            }
          }
        },
        error: (error) => {
          console.error('Error en la autenticación:', error);
        },
      });
  }

  /**
   * Método para recuperar las opciones disponibles para el perfil facial del examen facial desde el backend.
   * Realiza una solicitud GET al backend y asigna los datos recuperados a la lista nameFacialProfile.
   * Además, crea un arreglo comparefacialFacial a partir de la respuesta del backend.
   */
  nameFacialProfile: any[] = [];
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
            this.nameFacialProfile = response.map((item) => ({
              facialProfile: item.facialProfile,
              idFacialProfile: item.idFacialProfile,
            }));
            // Crear el arreglo comparefacialFacial a partir de la respuesta del backend
            const comparefacialFacial: any[] = [];

            for (const item of response) {
              comparefacialFacial.push({
                facialProfile: item.facialProfile,
                idFacialProfile: item.idFacialProfile,
              });
            }
          }
        },
        error: (error) => {
          console.error('Error en la autenticación:', error);
        },
      });
  }
}
