import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, ViewEncapsulation, inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, AuthService } from '@mean/services';
import { BaseComponent } from '@mean/shared';
import { Messages, ROLES, UriConstants } from '@mean/utils';
import { ToastrService } from 'ngx-toastr';
import { LoadingComponent } from 'src/app/models/shared/loading/loading.component';
import { SessionStorageConstants } from 'src/app/utils/session.storage';
import { Get, PostLogin } from './model/loginResponse.model';
import { TokenData } from './model/tokenData';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, LoadingComponent],
})
export class LoginComponent
  extends BaseComponent<Get, PostLogin>
  implements OnInit {
  private userService = inject(AuthService);
  showPassword: boolean = false;
  returnUrl: string = '/';

  @Output() onSubmitLoginEvent = new EventEmitter();
  private toastr = inject(ToastrService);

  constructor(
    private readonly api: ApiService<Get, PostLogin>,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly authServise: AuthService
  ) {
    super(api);
    this.formGroup = this.fb.group({
      user: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'];
    this.returnUrl = returnUrl ? decodeURIComponent(returnUrl) : '';
  }

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
          const { refreshToken } = data.response;
          this.authServise.saveToSession(
            SessionStorageConstants.USER_TOKEN,
            token
          );

          this.authServise.saveToSession(
            SessionStorageConstants.USER_REFRESH_TOKEN,
            refreshToken
          );

          const tokenData: TokenData = this.userService.getTokenDataUser(token);

          if (tokenData.firstLogin) {
            this.router.navigate(['/new-password']);
          } else if (tokenData.role[0].authority === ROLES.ROLE_MEDICAL_RECORD_DIGITIZER) {
            this.router.navigate(['/medical-record-digitizer']);
          } else {
            this.userService.redirectByRole(tokenData.role[0].authority, this.returnUrl);
          }

        },
        error: (error) => {
          if (error != Messages.ERROR) {
            this.toastr.error(error, 'Error');
          }

          this.loading = false;
        },
      });
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
