import { ApiService } from './../../../../../../services/api.service';
import { NgFor } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
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
export class HistoryFacialExamComponent {
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
    private apiService: ApiService,
    private fb: FormBuilder
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

  /**
   * Método para manejar la presentación del formulario.
   * Este método se activa cuando se envía el formulario.
   * Procesa los datos del formulario y los imprime en la consola.
   */
  onSubmit() {
    // Variables para almacenar los ID asociados a las opciones seleccionadas
    let idFacialProfile = 0; // Valor predeterminado para "Recto"
    let idFacialFront = 0; // Valor predeterminado para "Braquifacial"

    // Obtener el valor seleccionado del perfil facial
    const selectedProfile =
      this.facialExamForms?.get('facialProfile')?.value ?? 0;
    // Determinar el ID asociado al perfil facial seleccionado
    if (selectedProfile === 'Recto') {
      idFacialProfile = 0;
    } else if (selectedProfile === 'Cóncavo') {
      idFacialProfile = 2;
    } else if (selectedProfile === 'Convexo') {
      idFacialProfile = 3;
    }

    // Obtener el valor seleccionado del frente facial
    const selectedFront = this.facialExamForms?.get('facialFront')?.value ?? 0;
    // Determinar el ID asociado al frente facial seleccionado
    if (selectedFront === 'Braquifacial') {
      idFacialFront = 0;
    } else if (selectedFront === 'Normofacial') {
      idFacialFront = 1;
    } else if (selectedFront === 'Dolicofacial') {
      idFacialFront = 2;
    }

    // Objeto para enviar
    const exampleFacialExam = {
      idFacialExam: this.facialExamForms?.get('idFacialExam')?.value ?? 0,
      distinguishingFeatures:
        this.facialExamForms?.get('distinguishingFeatures')?.value ?? '',
      facialProfile: {
        idFacialProfile: idFacialProfile,
        facialProfile: this.facialExamForms?.get('facialProfile')?.value ?? '',
      },
      facialFront: {
        idFacialFront: idFacialFront,
        facialFront: this.facialExamForms?.get('facialFront')?.value ?? '',
      },
    };

    console.log(exampleFacialExam);
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
          console.log('response: ', response);
        },
        error: (error) => {
          console.error('Error en la autenticación:', error);
        },
      });
  }
}
