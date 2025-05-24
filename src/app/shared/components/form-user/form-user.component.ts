import { Component, inject, OnInit, signal, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router'; // Agregar esta importación
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import {
  AdminProfile,
  ProfileResponse,
  StudentProfile,
} from 'src/app/models/shared/profile/profile.model';
import { ProfilePictureService } from 'src/app/services/profile-picture.service';

@Component({
  selector: 'app-form-user',
  standalone: true,
  imports: [FormsModule, MatCardModule],
  templateUrl: './form-user.component.html',
  styleUrl: './form-user.component.scss',
})
export class FormUserComponent implements OnInit, AfterViewInit {
  private userService = inject(ApiService<any, {}>);
  private profileService = inject(ApiService<ProfileResponse, {}>);
  private route = inject(Router);
  // Actualizamos la lista de pestañas para que sea más clara
  tabs = ['Información General', 'Datos Personales', 'Seguridad'];
  activeTab = signal(0);
  nombre = signal('');
  email = signal('');
  contrasenaActual = signal('');
  nuevaContrasena = signal('');
  confirmarContrasena = signal('');
  foto = signal<string | null>(null);
  user!: StudentProfile | AdminProfile;
  isStudent = signal(false);
  successMessage = signal<string | null>(null);
  private toastr = inject(ToastrService);
  mostrarContrasenaActual = signal(false);
  mostrarNuevaContrasena = signal(false);
  mostrarConfirmarContrasena = signal(false);
  modoEdicion = signal(false);
  welcomeMessage = signal('');
  profilePicture = signal<string | null>(null);
  private profilePictureUpdated = new Subject<string | null>();
  employeeNumber = signal('');
  birthDate = signal<string | null>(null);
  selectedGender = signal(1);
  genders = [
    { idGender: 1, gender: 'Masculino' },
    { idGender: 2, gender: 'Femenino' },
    { idGender: 99, gender: 'No binario' }
  ];

  @ViewChild('tabList') tabList!: ElementRef;
  @ViewChild('tabsWrapper') tabsWrapper!: ElementRef;

  isScrollLeftEnd = true;
  isScrollRightEnd = false;

  constructor(
    private router: Router,
    private profilePictureService: ProfilePictureService
  ) {
    this.profilePictureService.profilePictureUpdated.subscribe(
      (newProfilePicture) => {
        this.foto.set(newProfilePicture);
      }
    );
  }

  ngOnInit() {
    this.fetchUserData();
  }

  ngAfterViewInit() {
    setTimeout(() => this.checkScrollableNavigation(), 300);
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScrollableNavigation();
  }

  getTabTitle(): string {
    switch(this.activeTab()) {
      case 0: return 'Información General';
      case 1: return 'Datos Personales';
      case 2: return 'Cambiar Contraseña';
      default: return 'Perfil de Usuario';
    }
  }

  // Ya no necesitamos estos métodos relacionados con el scroll horizontal
  scrollTabs(direction: 'left' | 'right') {
    // Método simplificado, lo mantenemos para evitar errores
  }

  checkScrollableNavigation() {
    // Método simplificado, lo mantenemos para evitar errores
  }

  setActiveTab(index: number) {
    this.activeTab.set(index);
  }
  
  actualizarDatosUsuario() {
    // Crear el payload con los datos de la sección de edición
    const payload = {
      firstName: this.user.person.firstName,
      secondName: this.user.person.secondName,
      firstLastName: this.user.person.firstLastName,
      secondLastName: this.user.person.secondLastName,
      phone: this.user.person.phone,
      email: this.user.person.email,
      gender: {
        idGender: this.selectedGender(),
        gender: this.genders.find(g => g.idGender === this.selectedGender())?.gender || ''
      }
    };
    
    // Llamar al servicio con el nuevo endpoint
    this.userService
      .patchService({
        url: `${UriConstants.PATCH_PERSON_BY_CURP}${this.user.person.curp}`,
        data: payload,
      })
      .subscribe({
        next: (response) => {
          this.toastr.success('Datos actualizados exitosamente');
          this.modoEdicion.set(false);
          // Actualizar los datos locales con los datos del servidor
          this.fetchUserData();
        },
        error: (error) => {
          this.toastr.error(error || 'Error al actualizar los datos');
          console.error('Error al actualizar los datos:', error);
        },
      });
  }

  actualizarContrasena() {
    if (this.nuevaContrasena() !== this.confirmarContrasena()) {
      this.toastr.warning('Las contraseñas no coinciden');
      return;
    }

    const payload = {
      oldPassword: this.contrasenaActual(),
      newPassword: this.nuevaContrasena(),
      confirmPassword: this.confirmarContrasena(),
    };

    this.userService
      .patchService({
        url: `${UriConstants.PATCH_UPDATE_PASSWORD}`,
        data: payload,
      })
      .subscribe({
        next: () => {
          this.contrasenaActual.set('');
          this.nuevaContrasena.set('');
          this.confirmarContrasena.set('');
          this.toastr.success('Contraseña actualizada exitosamente');
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.toastr.error(error);
        },
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
          headers: {},
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
          },
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
          this.selectedGender.set(data.person.gender.idGender);
          this.isStudent.set('enrollment' in data);
          if (this.isStudent()) {
            this.employeeNumber.set(data.enrollment);
          } else {
            this.employeeNumber.set(data.employeeNumber);
          }
          this.birthDate.set(data.person.birthDate.join('-'));
          this.setWelcomeMessage();
          if (this.user.user.profilePictureId) {
            this.fetchProfilePicture();
          }
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
        },
      });
  }

  fetchProfilePicture() {
    this.profileService
      .getService({
        url: `${UriConstants.GET_USER_PROFILE_PICTURE}`,
        responseType: 'blob', // Importante para recibir la imagen como blob
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
