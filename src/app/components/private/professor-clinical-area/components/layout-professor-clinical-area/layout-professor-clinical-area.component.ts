import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent, SideNavComponent } from '@mean/shared';

@Component({
  selector: 'app-layout-professor-clinical-area',
  standalone: true,
  imports: [
    RouterOutlet, SideNavComponent, HeaderComponent,
  ],
  templateUrl: './layout-professor-clinical-area.component.html',
  styleUrl: './layout-professor-clinical-area.component.scss'
})
export class LayoutProfessorClinicalAreaComponent {
  isSidebarOpen = false; // Cambiamos el valor inicial a false

  ngOnInit() {
    this.isSidebarOpen = window.innerWidth > 768;
  }

  onSidebarToggle() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
