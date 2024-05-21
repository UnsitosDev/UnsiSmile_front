import { facialProfilesResponse } from './../models/facialProfiles/facialProfiles';
import { facialFrontResponse } from './../models/facialFront/facialFront';
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

interface FacialFrontData {
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
  /**
   * Constructor del componente.
   * @param authService Servicio de autenticación para la gestión de la sesión del usuario.
   * @param apiService Servicio para realizar llamadas a la API para obtener o enviar datos.
   * @param fb Constructor de FormBuilder para la creación de formularios reactivos.
   */

  public apiService = inject(ApiService);
  constructor(private authService: AuthService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.fetchFacialFronts();
    this.fetchFacialProfile();
  }

  onSubmit() {
    const token = this.authService.getToken();
    this.apiService
      .postService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        }),
        url: `${UriConstants.POST_FACIAL_EXAM}`,
        data: {},
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

  namefacialFront: facialFrontResponse[] = [];
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
          this.namefacialFront = response;
          // console.log('Facial front + ', this.namefacialFront);
        },
        error: (error) => {
          console.error('Error en la autenticación:', error);
        },
      });
  }

  nameFacialProfile: facialProfilesResponse[] = [];
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
          this.nameFacialProfile = response;
          // console.log('facial profile =>', this.nameFacialProfile);
        },
        error: (error) => {
          console.error('Error en la autenticación:', error);
        },
      });
  }
}
