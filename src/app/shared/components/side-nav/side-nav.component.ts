import { Component, Input, OnInit, inject } from '@angular/core';
import { ButtonMenuItemComponent } from '../button-menu-item/button-menu-item.component';
import { StudentItems, AdminItems, MenuItem } from '@mean/models';
import {
  studentResponse,
  studentUserResponse,
} from '../interfaces/student/student';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { AdminResponse } from 'src/app/models/shared/admin/admin.model';
import { RouterModule } from '@angular/router'; 
import { MenuService } from 'src/app/services/menu.service';

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
  private menuService = inject(MenuService);
  user!: studentUserResponse | AdminResponse;

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

  onMenuItemClicked(link: string) {
    this.menuService.emitRoute(link); // Emitir ruta seleccionada
  }
}
