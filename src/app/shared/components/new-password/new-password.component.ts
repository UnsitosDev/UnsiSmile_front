import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent {
  @Input() isVisible: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  
  private toastr = inject(ToastrService);
  private userService = inject(ApiService<any, {}>);

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  errorMessage = '';

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

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
          this.resetForm();
          this.closeModal.emit();
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
  }
}
