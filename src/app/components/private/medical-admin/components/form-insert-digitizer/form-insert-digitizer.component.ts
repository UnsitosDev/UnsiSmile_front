import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { HttpHeaders } from '@angular/common/http';
import { LoadingComponent } from '@mean/shared';

interface UserInfo {
  username: string;
  role: string;
  email: string;
  fullName: string;
  idProfessor: string | null;
  career: string | null;
}

@Component({
  selector: 'app-form-insert-digitizer',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    LoadingComponent
  ],
  templateUrl: './form-insert-digitizer.component.html',
  styleUrls: ['./form-insert-digitizer.component.scss']
})
export class FormInsertDigitizerComponent implements OnInit {
  private apiService = inject(ApiService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  formGroup!: FormGroup;
  loading: boolean = false;
  userInfo: UserInfo | null = null;
  userFound: boolean = false;

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      username: ['', Validators.required]
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/digitizers']);
  }

  checkUser(): void {
    if (this.formGroup.invalid) {
      this.toastr.warning('Por favor, ingresa un nombre de usuario', 'Advertencia');
      return;
    }

    this.loading = true;
    const username = this.formGroup.get('username')?.value;
    
    this.apiService.getService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      url: `${UriConstants.GET_USER_BY_USERNAME}${username}`,
      data: {},
    }).subscribe({
      next: (response: UserInfo) => {
        this.loading = false;
        if (response) {
          this.userInfo = response;
          this.userFound = true;
          this.toastr.success('Usuario encontrado', 'Éxito');
        } else {
          this.userInfo = null;
          this.userFound = false;
          this.toastr.error('Usuario no encontrado', 'Error');
        }
      },
      error: (error) => {
        this.loading = false;
        this.userInfo = null;
        this.userFound = false;
        this.toastr.error('Usuario no encontrado', 'Error');
      }
    });
  }

  createDigitizer(): void {
    if (!this.userInfo) {
      this.toastr.warning('Primero debes verificar que el usuario exista', 'Advertencia');
      return;
    }

    this.loading = true;
    const username = this.formGroup.get('username')?.value;
    
    const digitizerData = {
      idMedicalRecordDigitizer: 0,
      username: username,
      type: this.userInfo.role === 'ROLE_PROFESSOR' ? 'PROFESSOR' : 'STUDENT'
    };

    this.apiService.postService({
      url: UriConstants.POST_DIGITIZER,
      data: digitizerData
    }).subscribe({
      next: () => {
        this.toastr.success('Capturador creado correctamente', 'Éxito');
        this.router.navigate(['/medical-admin/digitizers']);
        this.loading = false;
      },
      error: (error) => {
        const errorMsg = error?.error?.message || 'Error al crear el capturador';
        this.toastr.error(errorMsg, 'Error');
        this.loading = false;
      }
    });
  }
}

