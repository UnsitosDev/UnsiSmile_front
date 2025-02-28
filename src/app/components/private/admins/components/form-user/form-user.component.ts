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

@Component({
  selector: 'app-form-user',
  standalone: true,
  imports: [FormsModule, MatCardModule],
  templateUrl: './form-user.component.html',
  styleUrl: './form-user.component.scss'
})
export class FormUserComponent implements OnInit {
  private userService = inject(ApiService<studentResponse, {}>);
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
          this.router.navigate(['/admin/dashboard']); 
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
          this.setWelcomeMessage();        },
        error: (error) => {
          console.error('Error fetching user data:', error);
        },
      });
  }

  fetchProfilePicture() {
    this.userService
      .getService({
        url: `${UriConstants.GET_USER_PROFILE}`,
      })
      .subscribe({
        next: (data) => {
          if (data.profilePictureId) {
            this.foto.set(`${UriConstants.DOWLOAD_FILES}${data.profilePictureId}`);
          }
        },
        error: (error) => {
          console.error('Error fetching profile picture:', error);
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


