import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent, SideNavComponent } from '@mean/shared';
import { NewPasswordComponent } from "../../../../../shared/components/new-password/new-password.component";
import { AuthService } from '@mean/services';
import { TokenData } from 'src/app/components/public/login/model/tokenData';
import { SessionStorageConstants } from 'src/app/utils/session.storage';


@Component({
  selector: 'app-students-layout',
  standalone: true,
  imports: [
    RouterOutlet, SideNavComponent, HeaderComponent,
    NewPasswordComponent
],
  templateUrl: './students-layout.component.html',
  styleUrls: ['./students-layout.component.scss']
})
export class StudentsLayoutComponent implements OnInit  {
  private token!: string;
  private tokenData!:  TokenData;
  ngOnInit(): void {
    this.token = this.userService.getToken() ?? "";
     this.tokenData = this.userService.getTokenDataUser(this.token);
     this.showPasswordModal = this.tokenData.firstLogin;
  }

  private userService = inject(AuthService);
  isSidebarOpen = true; 
  showPasswordModal = true;

  onSidebarToggle() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  openPasswordModal() {
    this.showPasswordModal = true;
  }

  onPasswordModalClose() {
    this.showPasswordModal = false;
  }
}
