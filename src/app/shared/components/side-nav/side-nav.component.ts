import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from '@mean/models';
import { ApiService, AuthService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { Subject } from 'rxjs';
import {
  AdminProfile,
  ProfessorProfile,
  StudentProfile,
} from 'src/app/models/shared/profile/profile.model';
import { ProfilePictureService } from 'src/app/services/profile-picture.service';
import { ROLES } from 'src/app/utils/roles';
import { SessionStorageConstants } from 'src/app/utils/session.storage';
import { studentResponse } from '../../interfaces/student/student';
import { ButtonMenuItemComponent } from '../button-menu-item/button-menu-item.component';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [ButtonMenuItemComponent, RouterModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
})
export class SideNavComponent implements OnInit {
  @Input({ required: true }) userLink: string = ''; // Inicializamos con un valor por defecto
  @Input({ required: true }) menuItems: MenuItem[] = []; // Inicializamos como un array vacío
  private userService = inject(ApiService<studentResponse, {}>);
  user!: StudentProfile | AdminProfile | ProfessorProfile;
  welcomeMessage: string = 'Bienvenido';
  ROL = ROLES;
  private rol!: string;
  @Output() menuSelect = new EventEmitter<void>();
  profilePicture = signal<string | null>(null);
  private profilePictureUpdated = new Subject<string | null>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private profilePictureService: ProfilePictureService
  ) {
    this.profilePictureService.profilePictureUpdated.subscribe(
      (newProfilePicture) => {
        this.profilePicture.set(newProfilePicture);
      }
    );

    // Escuchar cambios en los datos del usuario
    this.profilePictureService.userDataUpdated.subscribe(
      (updatedUserData) => {
        this.user = updatedUserData;
        this.setWelcomeMessage();
      }
    );
  }

  @Input() isSidebarOpen = false;

  ngOnInit() {
    this.fetchUserData();
  }

  fetchUserData() {
    this.userService
      .getService({
        url: `${UriConstants.GET_USER_INFO}`,
      })
      .subscribe({
        next: (data: AdminProfile | StudentProfile | ProfessorProfile) => {
          this.user = data;
          this.rol = this.user.user.role.role;
          this.setMenuItems();
          this.setWelcomeMessage();
          if (this.user.user.profilePictureId) {
            this.fetchProfilePicture();
          }
          
          // Notificar a otros componentes que los datos del usuario han sido cargados
          this.profilePictureService.updateUserData(data);
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
        },
      });
  }

  fetchProfilePicture() {
    this.userService
      .getService({
        url: `${UriConstants.GET_USER_PROFILE_PICTURE}`,
        responseType: 'blob', // Importante para recibir la imagen como blob
      })
      .subscribe({
        next: (blob: Blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const newProfilePicture = reader.result as string;
            this.profilePicture.set(newProfilePicture);
            this.profilePictureService.updateProfilePicture(newProfilePicture);
          };
          reader.readAsDataURL(blob);
        },
        error: (error) => {
          console.error('Error al obtener la foto de perfil:', error);
        },
      });
  }

  setMenuItems() {
    const role = this.user.user.role.role;
  }

  setWelcomeMessage() {
    switch (this.user.person.gender.idGender) {
      case 1:
        this.welcomeMessage = 'Bienvenido';
        break;
      case 2:
        this.welcomeMessage = 'Bienvenida';
        break;
      case 99:
        this.welcomeMessage = 'Bienvenide';
        break;
    }
  }

  logout(): void {
    const token = this.authService.getToken();
    if (token) {
      sessionStorage.removeItem(SessionStorageConstants.USER_TOKEN);
    }
    this.router.navigate(['/']);
  }

  onMenuItemSelect() {
    if (window.innerWidth <= 768) {
      this.menuSelect.emit();
    }
  }
}
