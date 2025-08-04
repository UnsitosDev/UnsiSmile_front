import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent, SideNavComponent } from '@mean/shared';
import { AdminItems } from './admin-menu-items.model';

@Component({
  selector: 'app-layout-admin',
  standalone: true,
  imports: [RouterOutlet, SideNavComponent, HeaderComponent],
  templateUrl: './layout-admin.component.html',
  styleUrl: './layout-admin.component.scss'
})
export class LayoutAdminComponent implements OnInit {
  isSidebarOpen = false; // Cambiamos el valor inicial a false
  adminMenuItems = AdminItems;
  readonly userLink = '/medical-admin/user';

  ngOnInit() {
    this.isSidebarOpen = window.innerWidth > 768;
  }

  onSidebarToggle() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
