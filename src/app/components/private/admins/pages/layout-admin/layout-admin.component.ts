import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminItems } from '@mean/models';
import { HeaderComponent, SideNavComponent } from '@mean/shared';

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
  readonly userLink = '/admin/user';

  ngOnInit() {
    this.isSidebarOpen = window.innerWidth > 768;
  }

  onSidebarToggle() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
