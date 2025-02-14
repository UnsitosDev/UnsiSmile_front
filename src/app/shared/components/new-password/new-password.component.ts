import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { Router } from '@angular/router';
import { AuthService } from '@mean/services';
import { SessionStorageConstants } from 'src/app/utils/session.storage';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    FontAwesomeModule, 
    MatStepperModule,
    MatButtonModule
  ],
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent {
  @Input() isVisible: boolean = true;
  @Output() closeModal = new EventEmitter<void>();
  
  private toastr = inject(ToastrService);
  private userService = inject(ApiService<any, {}>);
  private router = inject(Router);
  private authService = inject(AuthService);

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  errorMessage = '';

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  showWelcomeMessage = true;  // Nueva propiedad

  activeStep = 0;

  ngOnInit() {
    // Aumentar el tiempo a 8 segundos (8000ms)
    setTimeout(() => {
      this.showWelcomeMessage = false;
    }, 9000);
  }

  togglePasswordVisibility(field: string) {
    switch (field) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }

  welcomeStep() {
    this.activeStep = 1;
  }

  backStep() {
    this.activeStep--;
  }

  nextStep() {
    this.activeStep++;
  }

  onSubmit() {
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    const payload = {
      oldPassword: this.currentPassword,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword
    };

    this.userService
      .patchService({
        url: `${UriConstants.PATCH_UPDATE_PASSWORD}`,
        data: payload 
      })
      .subscribe({
        next: () => {
          this.toastr.success('Contraseña actualizada exitosamente');
          // Limpiar sesión y redirigir
          sessionStorage.removeItem(SessionStorageConstants.USER_TOKEN);
          setTimeout(() => {
            this.router.navigate(['']);
          }, 500);
        },
        error: (error) => {
          this.errorMessage = error;
        }
      });
  }

  private resetForm() {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.errorMessage = '';
  }

  onClose() {
    this.resetForm();
    this.closeModal.emit();
    this.router.navigate(['/login']); // Redirigir al login

  }
}
