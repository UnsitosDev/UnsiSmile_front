import { facialProfilesResponse } from '../../../../../models/models-students/facialProfiles/facialProfiles';
import { facialFrontResponse } from '../../../../../models/models-students/facialFront/facialFront';
import { ApiService } from '../../../../../services/api.service';

import { HttpHeaders } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
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
    MatButtonModule,
    ReactiveFormsModule
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
  constructor(private authService: AuthService, private fb: FormBuilder) {
    console.log('Componente receptor creado');
  }

  ngOnInit(): void {
    this.fetchFacialFronts();
    this.fetchFacialProfile();
  }

  onSubmit() {
    this.emitirEvento();
    this.irSiguienteTab();
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

  @Output() eventoEmitido = new EventEmitter<boolean>();
  pageNumber: number = 1;
  emitirEvento() {
    this.eventoEmitido.emit(false);
    console.log(false);
  }
  @Output() cambiarTab = new EventEmitter<number>();
  irSiguienteTab() {
    this.cambiarTab.emit(0);
  }
}
