import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent, SideNavComponent } from '@mean/shared';

@Component({
  selector: 'app-layout-clinical-area-supervisor',
  standalone: true,
  imports: [
    RouterOutlet, SideNavComponent, HeaderComponent,
  ],
  templateUrl: './layout-clinical-area-supervisor.component.html',
  styleUrl: './layout-clinical-area-supervisor.component.scss'
})
export class LayoutClinicalAreaSupervisorComponent {
  isSidebarOpen = false; // Cambiamos el valor inicial a false

  ngOnInit() {
    this.isSidebarOpen = window.innerWidth > 768;
  }

  onSidebarToggle() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
