import { Component, Input, OnInit, inject } from '@angular/core';
import { ButtonMenuItemComponent } from '../button-menu-item/button-menu-item.component';
import { studentItems, adminItems, MenuItem } from '@mean/models';
import {
  studentResponse,
  studentUserResponse,
} from '../interfaces/student/student';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [ButtonMenuItemComponent],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
})
export class SideNavComponent implements OnInit {
  public menuItems: MenuItem[] = [];

  private userService = inject(ApiService<studentResponse, {}>);

  user!: studentUserResponse;

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
          console.log('user data: ', data);
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
        },
      });
  }

  setMenuItems() {
    if (this.user.user.role.role === 'as') {
      this.menuItems = studentItems;
    } else if (this.user.user.role.role === 'ROLE_STUDENT') {
      this.menuItems = adminItems;
    }
  }
}
