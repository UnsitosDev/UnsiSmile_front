import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, AuthService } from '@mean/services';
import { BaseComponent } from '@mean/shared';
import { UriConstants } from '@mean/utils';
import { SessionStorageConstants } from 'src/app/utils/session.storage';
import {Get,PostLogin} from './model/loginResponse.model'
import { AlertComponent } from 'src/app/shared/alert/alert.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    BaseComponent,
    ReactiveFormsModule,
    FormsModule,
    AlertComponent
  ]
})


export class LoginComponent extends BaseComponent<Get,PostLogin> {
  @Output() onSubmitLoginEvent = new EventEmitter();
  constructor(
    private readonly api: ApiService<Get,PostLogin>,
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

  handleLogin() {
    if (this.isFormValid()) {
      const { user, password } = this.formGroup.value;

      this.createService({
         url: `${UriConstants.USER_LOGIN}`,
         data: {
          username : user,
          password: password
         }
        }).subscribe({
          next: data => {
            console.log(data);
            console.log(data.response)
            const {token} = data.response;
            this.authServise.saveToSession(SessionStorageConstants.USER_TOKEN, token);
            console.log(token);
          },
          error: error => {
            this.alertConfiguration('ERROR', error);
            this.openAlert();
            this.loading = false;
          }
        })
    }
  }
}
