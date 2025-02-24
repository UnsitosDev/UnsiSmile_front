import { Component, Input, OnInit, inject, Output, EventEmitter } from '@angular/core';
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
  private userService = inject(ApiService<studentResponse, {}>);
  user!: studentUserResponse | AdminResponse;
  welcomeMessage: string = 'Bienvenido'; 
  @Output() menuSelect = new EventEmitter<void>();

  constructor(
      private authService: AuthService,
      private router: Router,

    ) {}

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
        next: (data) => {
          this.user = data;
          this.setMenuItems();
          this.setWelcomeMessage(); 
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
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
    if (this.user.person.gender.gender === 'Masculino') {
      this.welcomeMessage = 'Bienvenido';
    } else {
      this.welcomeMessage = 'Bienvenida';
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
