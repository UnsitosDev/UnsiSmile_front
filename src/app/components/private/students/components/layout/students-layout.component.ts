import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent, SideNavComponent } from '@mean/shared';
import { NewPasswordComponent } from "../../../../../shared/components/new-password/new-password.component";

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
export class StudentsLayoutComponent {
  isSidebarOpen = true; 
  showPasswordModal = false;

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
