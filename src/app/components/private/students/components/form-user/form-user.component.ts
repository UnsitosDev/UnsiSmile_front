import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { studentResponse, studentUserResponse } from 'src/app/shared/components/interfaces/student/student';
import { AdminResponse } from 'src/app/models/shared/admin/admin.model';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-form-user',
  standalone: true,
  imports: [FormsModule, AlertComponent],
  templateUrl: './form-user.component.html',
  styleUrl: './form-user.component.scss'
})
export class FormUserComponent {
  private userService = inject(ApiService<studentResponse, {}>);
  tabs = ['Datos de Usuario', 'Contraseña'];
  activeTab = signal(0);
  nombre = signal('');
  email = signal('');
  contrasenaActual = signal('');
  nuevaContrasena = signal('');
  confirmarContrasena = signal('');
  foto = signal<string | null>(null);
  user!: studentUserResponse | AdminResponse;
  successMessage = signal<string | null>(null);
  private toastr=inject (ToastrService);
  

  ngOnInit() {
    this.fetchUserData();
  }

  setActiveTab(index: number) {
    this.activeTab.set(index);
  }

  actualizarDatosUsuario() {
    console.log('Actualizando datos de usuario:', { nombre: this.nombre(), email: this.email() });
    //lógica para actualizar los datos en el backend
  }

  actualizarContrasena() {
    if (this.nuevaContrasena() !== this.confirmarContrasena()) {
      this.toastr.warning('Las contraseñas no coinciden');
      return;
    }

    const payload = {
      oldPassword: this.contrasenaActual(),
      newPassword: this.nuevaContrasena(),
      confirmPassword: this.confirmarContrasena()
    };

    console.log('Payload:', payload); // Verificar el payload

    this.userService
      .patchService({
        url: `${UriConstants.PATCH_UPDATE_PASSWORD}`,
        data: payload 
      })
      .subscribe({
        next: () => {
          this.contrasenaActual.set('');
          this.nuevaContrasena.set('');
          this.confirmarContrasena.set('');
          this.toastr.success('Contraseña actualizada exitosamente');
        },
        error: (error) => {
        this.toastr.error(error,'Error');        }
      });
  }

  subirFoto(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.foto.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  
  fetchUserData() {
    this.userService
      .getService({
        url: `${UriConstants.GET_USER_INFO}`,
      })
      .subscribe({
        next: (data) => {
          this.user = data;
          console.log('user data: ', data);
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
        },
      });
  }


}


