import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent, SideNavComponent } from '@mean/shared';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet, SideNavComponent, HeaderComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  isSidebarOpen = false;

  onSidebarToggle() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
