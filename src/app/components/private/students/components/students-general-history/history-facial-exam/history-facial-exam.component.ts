import { ApiService } from './../../../../../../services/api.service';
import { NgFor } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '@mean/services';
import { UriConstants } from '@mean/utils';

@Component({
  selector: 'app-history-facial-exam',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    NgFor,
    MatButtonModule 
  ],
  templateUrl: './history-facial-exam.component.html',
  styleUrl: './history-facial-exam.component.scss'
})
export class HistoryFacialExamComponent {

  // Formularios
  facialExamForms: FormGroup;
  constructor(
    private authService : AuthService,
    private apiService: ApiService,
    private fb: FormBuilder
    
  ){

    // Inicializando formularios
    this.facialExamForms = this.fb.group({

    })
  }

  SendExamFacial() {
    const token = this.authService.getToken();
    console.log(token);
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

         console.log('response: ', response);

        },
        error: (error) => {
          console.error('Error en la autenticación:', error);
        },
      });
  }



}
