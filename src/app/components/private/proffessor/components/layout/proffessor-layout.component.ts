import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent, SideNavComponent } from '@mean/shared';



@Component({
  selector: 'app-students-layout',
  standalone: true,
  imports: [
    RouterOutlet, SideNavComponent, HeaderComponent,
],
  templateUrl: './proffessor-layout.component.html',
  styleUrls: ['./proffessor-layout.component.scss']
})
export class ProffesorLayoutComponent implements OnInit  {
  isSidebarOpen = false; // Cambiamos el valor inicial a false

  ngOnInit() {
    this.isSidebarOpen = window.innerWidth > 768;
  }

  onSidebarToggle() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}

