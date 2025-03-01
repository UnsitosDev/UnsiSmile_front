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
import { Subject } from 'rxjs';
import { ProfilePictureService } from 'src/app/services/profile-picture.service';

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
  private profilePictureUpdated = new Subject<string | null>();
  employeeNumber = signal('');
  birthDate = signal<string | null>(null);

  constructor(
    private router: Router,
    private profilePictureService: ProfilePictureService
  ) {
    this.profilePictureService.profilePictureUpdated.subscribe((newProfilePicture) => {
      this.foto.set(newProfilePicture);
    });
  }

  ngOnInit() {
    this.fetchUserData();
    this.fetchProfilePicture();
  }

  setActiveTab(index: number) {
    this.activeTab.set(index);
  }

  actualizarDatosUsuario() {
    console.log('Actualizando datos de usuario:', { nombre: this.nombre(), email: this.email() });
    // lógica para actualizar los datos en el backend
    const payload = {
      employeeNumber: this.employeeNumber(),
      person: {
        curp: this.user.person.curp,
        firstName: this.user.person.firstName,
        secondName: this.user.person.secondName,
        firstLastName: this.user.person.firstLastName,
        secondLastName: this.user.person.secondLastName,
        phone: this.user.person.phone,
        birthDate: this.birthDate(),
        email: this.user.person.email,
        gender: this.user.person.gender
      }
    };
    // Lógica para enviar el payload al backend
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
        this.toastr.error(error);        }
      });
  }

  subirFoto(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
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
            // Esperar un momento antes de recargar la imagen
            setTimeout(() => {
              this.fetchProfilePicture();
            }, 1000);
          },
          error: (error) => {
            console.error('Error completo:', error);
            this.toastr.error(error);
            input.value = '';
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
          this.employeeNumber.set(data.employeeNumber);
          this.birthDate.set(data.person.birthDate.join('-'));
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
            const newProfilePicture = reader.result as string;
            this.foto.set(newProfilePicture);
            this.profilePictureService.updateProfilePicture(newProfilePicture);
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
      // Si estamos saliendo del modo edición, revertimos los cambios
      this.fetchUserData();
    }
    this.modoEdicion.set(!this.modoEdicion());
  }

}


