import { NgFor } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { ButtonMenuItemComponent } from '../button-menu-item/button-menu-item.component';
import { items } from '@mean/models';
import {
  studentResponse,
  studentUserResponse,
} from '../interfaces/student/student';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [ButtonMenuItemComponent, NgFor],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
})
export class SideNavComponent implements OnInit {
  public menuItems = items;

  private userService = inject(ApiService<studentResponse, {}>);

  user!: studentUserResponse;

  constructor() {}

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
          console.log('patient data: ', data);
        },
        error: (error) => {},
      });
  }
}
