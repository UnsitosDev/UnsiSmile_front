import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProfessorItems } from '@mean/models';
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
  professorItems = ProfessorItems;
  readonly userLink = '/professor/user';

  ngOnInit() {
    this.isSidebarOpen = window.innerWidth > 768;
  }

  onSidebarToggle() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}

