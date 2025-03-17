import { Component, Input, OnInit, inject, Output, EventEmitter, signal } from '@angular/core';
import { ButtonMenuItemComponent } from '../button-menu-item/button-menu-item.component';
import { StudentItems, AdminItems, MenuItem } from '@mean/models';
import {
  studentResponse,
  studentUserResponse,
} from '../../interfaces/student/student';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { AdminResponse } from 'src/app/models/shared/admin/admin.model';
import { RouterModule } from '@angular/router'; 
import { AuthService } from '@mean/services';
import { SessionStorageConstants } from 'src/app/utils/session.storage';
import { Router, RouterLinkActive } from '@angular/router';
import { Subject } from 'rxjs';
import { ProfilePictureService } from 'src/app/services/profile-picture.service';
import { AdminProfile, StudentProfile } from 'src/app/models/shared/profile/profile.model';




@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [ButtonMenuItemComponent, RouterModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
})
export class SideNavComponent implements OnInit {
  userLink = '';  // Inicializamos vacía para luego asignarle el valor correcto
  public menuItems: MenuItem[] = [];
  private userService = inject(ApiService);
  user!: StudentProfile | AdminProfile;
  welcomeMessage: string = 'Bienvenido'; 
  @Output() menuSelect = new EventEmitter<void>();
  profilePicture = signal<string | null>(null);
  private profilePictureUpdated = new Subject<string | null>();

  constructor(
      private authService: AuthService,
      private router: Router,
      private profilePictureService: ProfilePictureService

    ) {
      this.profilePictureService.profilePictureUpdated.subscribe((newProfilePicture) => {
        this.profilePicture.set(newProfilePicture);
      });
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
        next: (data: StudentProfile | AdminProfile) => {
          this.user = data;
          this.setMenuItems();
          this.setWelcomeMessage();
          if (this.user.user.profilePicture != null) {
            this.fetchProfilePicture();
          }
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
        responseType: 'blob' // Importante para recibir la imagen como blob
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
    if (this.user.user.role.role === 'ROLE_STUDENT') {
      this.menuItems = StudentItems;
      this.userLink = '/students/user';  
    } else if (this.user.user.role.role === 'ROLE_ADMIN') {
      this.menuItems = AdminItems;
      this.userLink = '/admin/user';  
    }
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
