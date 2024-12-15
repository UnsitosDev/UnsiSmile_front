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
import { SessionStorageConstants } from 'src/app/utils/session.storage';
import { Get, PostLogin } from './model/loginResponse.model';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [BaseComponent, ReactiveFormsModule, FormsModule, AlertComponent, CommonModule],
})
export class LoginComponent extends BaseComponent<Get, PostLogin> {
  private userService = inject(AuthService);
  showPassword: boolean = false;

  @Output() onSubmitLoginEvent = new EventEmitter();
  constructor(
    private readonly api: ApiService<Get, PostLogin>,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly authServise: AuthService
  ) {
    super(api);
    this.formGroup = this.fb.group({
      user: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  // Maneja el inicio de sesión del usuario, guarda el token de sesión y redirige según el rol.
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

          // Decodifica el token JWT proporcionado para obtener los datos asociados del usuario.
          const tokenData = this.userService.getTokenDataUser(token);

          // Redirige al usuario según el rol obtenido del token decodificado.
          this.userService.redirectByRole(tokenData.role[0].authority);

        },
        error: (error) => {
          this.alertConfiguration('ERROR', error);
          this.openAlert();
          this.loading = false;
        },
      });
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  
}