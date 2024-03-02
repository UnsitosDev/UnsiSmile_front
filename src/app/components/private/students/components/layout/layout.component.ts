import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { SideNavComponent } from 'src/app/shared/side-nav/side-nav.component';


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
    console.log("comunicating");
  }
}
