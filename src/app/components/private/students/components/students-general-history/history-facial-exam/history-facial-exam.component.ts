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
  // Formularios
  facialExamForms: FormGroup;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private fb: FormBuilder
  ) {
    this.facialExamForms = this.fb.group({
      idFacialExam: [0],
      distinguishingFeatures: [''],
      // facial profile
      facialProfile: [''],
      idFacialProfile:[1],
      // facial front
      facialFront: [''],
      idFacialFront:[1] 
    });
  }

  onSubmit() {
    const exampleFacialExam = {
      idFacialExam: this.facialExamForms?.get('idFacialExam')?.value ?? 0,
      distinguishingFeatures: this.facialExamForms?.get('distinguishingFeatures')?.value ?? '',
      facialProfile: {
        idFacialProfile: this.facialExamForms?.get('idFacialProfile')?.value ?? 0,
        facialProfile: this.facialExamForms?.get('facialProfile')?.value ?? ''
      },
      facialFront: {
        idFacialFront: this.facialExamForms?.get('idFacialFront')?.value ?? 0,
        facialFront: this.facialExamForms?.get('facialFront')?.value ?? ''
      }
    };
  
    console.log(exampleFacialExam);
  }
  
}


  // const token = this.authService.getToken();
    // this.apiService
    //   .postService({
    //     headers: new HttpHeaders({
    //       'Content-Type': 'application/json',
    //       Authorization: 'Bearer ' + token,
    //     }),
    //     url: `${UriConstants.POST_FACIAL_EXAM}`,
    //     data: this.formData,
    //   })
    //   .subscribe({
    //     next: (response) => {
    //       console.log('response: ', response);
    //     },
    //     error: (error) => {
    //       console.error('Error en la autenticación:', error);
    //     },
    //   });