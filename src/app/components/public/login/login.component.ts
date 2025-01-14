import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, AuthService } from '@mean/services';
import { BaseComponent } from '@mean/shared';
import { UriConstants } from '@mean/utils';
import { LoadingComponent } from 'src/app/models/shared/loading/loading.component';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
import { SessionStorageConstants } from 'src/app/utils/session.storage';
import { Get, PostLogin } from './model/loginResponse.model';
import { ToastrService } from 'ngx-toastr';
import { AlertModel } from '@mean/models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, AlertComponent, CommonModule, LoadingComponent],
})
export class LoginComponent extends BaseComponent<Get, PostLogin> {
  private userService = inject(AuthService);
  showPassword: boolean = false;

  @Output() onSubmitLoginEvent = new EventEmitter();
  private toastr=inject (ToastrService);

  constructor(
    private readonly api: ApiService<Get, PostLogin>,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly authServise: AuthService,
   // private toastr: ToastrService 
  ) {
    super(api);
    this.formGroup = this.fb.group({
      user: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  // Maneja el inicio de sesión del usuario, guarda el token de sesión y redirige según el rol.
// En tu LoginComponent
handleLogin() {
  if (this.isFormValid()) {
    const { user, password } = this.formGroup.value;

    this.createService({
      url: `${UriConstants.USER_LOGIN}`,
      data: {
        username: user,
        password: password,
      },
    }).subscribe({
      next: (data) => {
        const { token } = data.response;
        this.authServise.saveToSession(
          SessionStorageConstants.USER_TOKEN,
          token
        );

        const tokenData = this.userService.getTokenDataUser(token);

        // Crear y mostrar toast de éxito
        const successAlert = new AlertModel.AlertaClass(
          true,
          'Inicio de sesión exitoso',
          AlertModel.AlertSeverity.SUCCESS,
          AlertModel.AlertIcon.SUCCESS
        );
        successAlert.showToast(this.toastr);

        this.userService.redirectByRole(tokenData.role[0].authority);
      },
      error: (error) => {
        // Crear y mostrar toast de error
        const errorAlert = new AlertModel.AlertaClass(
          true,
          error,
          AlertModel.AlertSeverity.ERROR,
          AlertModel.AlertIcon.EMAIL
        );
        errorAlert.showToast(this.toastr, {
          positionClass: 'toast-bottom-right',
          timeOut: 5000
        });

        this.loading = false;
      },
    });
  }
}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  
}