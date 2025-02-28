import { Component, signal, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { studentResponse, studentUserResponse } from 'src/app/shared/interfaces/student/student';
import { AdminResponse } from 'src/app/models/shared/admin/admin.model';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
import { ToastrService } from 'ngx-toastr';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';  // Agregar esta importación
import { ProfileResponse } from 'src/app/models/shared/profile/profile.model';

@Component({
  selector: 'app-form-user',
  standalone: true,
  imports: [FormsModule, MatCardModule],
  templateUrl: './form-user.component.html',
  styleUrl: './form-user.component.scss'
})
export class FormUserComponent implements OnInit {
  private userService = inject(ApiService<any, {}>);
  private profileService = inject(ApiService<ProfileResponse, {}>);
  private route = inject(Router);  
  tabs = ['Descripción General', 'Editar Datos', 'Cambiar Contraseña'];
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
  mostrarContrasenaActual = signal(false);
  mostrarNuevaContrasena = signal(false);
  mostrarConfirmarContrasena = signal(false);
  modoEdicion = signal(false);
  welcomeMessage = signal(''); 
  profilePicture = signal<string | null>(null);

  constructor(
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchUserData();
    this.fetchProfilePicture();
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
          this.router.navigate(['/dashboard']); 
        },
        error: (error) => {
        this.toastr.error(error,'Error');        }
      });
  }

  subirFoto(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      
      const formData = new FormData();
      formData.append('picture', file);

      this.userService
        .patchService({
          url: `${UriConstants.UPDATE_PROFILE_PICTURE}`,
          data: formData,
          headers: {}
        })
        .subscribe({
          next: (response) => {
            this.toastr.success('Foto de perfil actualizada exitosamente');
            // Recargar la página después de actualizar la imagen
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          },
          error: (error) => {
            console.error('Error completo:', error);
            this.toastr.error('Error al actualizar la foto de perfil');
          }
        });
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
          this.setWelcomeMessage();        },
        error: (error) => {
          console.error('Error fetching user data:', error);
        },
      });
  }

  fetchProfilePicture() {
    this.profileService
      .getService({
        url: `${UriConstants.GET_USER_PROFILE_PICTURE}`,
        responseType: 'blob' // Importante para recibir la imagen como blob
      })
      .subscribe({
        next: (blob: Blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            this.foto.set(reader.result as string);
          };
          reader.readAsDataURL(blob);
        },
        error: (error) => {
          console.error('Error al obtener la foto de perfil:', error);
        },
      });
  }
  

  setWelcomeMessage() {
    switch (this.user.person.gender.idGender) {
      case 1:
        this.welcomeMessage.set(`¡BIENVENIDO ${this.user.person.firstName}!`);
        break;
      case 2:
        this.welcomeMessage.set(`¡BIENVENIDA ${this.user.person.firstName}!`);
        break;
        case 99:
        this.welcomeMessage.set(`¡BIENVENIDE ${this.user.person.firstName}!`);
        break;
     
    }
  }

  toggleEdicion() {
    if (this.modoEdicion()) {
      // Si estamos saliendo del modo edición, preguntamos si quiere guardar
      if (confirm('¿Desea guardar los cambios?')) {
        this.actualizarDatosUsuario();
      } else {
        // Si no quiere guardar, revertimos los cambios
        this.fetchUserData();
      }
    }
    this.modoEdicion.set(!this.modoEdicion());
  }

}


