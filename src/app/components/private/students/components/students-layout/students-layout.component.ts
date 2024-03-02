import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent, SideNavComponent } from '@mean/shared';

@Component({
  selector: 'app-students-layout',
  standalone: true,
  imports: [
    RouterOutlet, SideNavComponent, HeaderComponent
  ],
  templateUrl: './students-layout.component.html',
  styleUrl: './students-layout.component.scss'
})
export class StudentsLayoutComponent {
  isSidebarOpen = false;

  onSidebarToggle() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
