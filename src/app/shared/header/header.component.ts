import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports:[
  ]
})
export class HeaderComponent {

  @Output() closeSidebar = new EventEmitter<void>();

  toggleSidebar() {
    this.closeSidebar.emit();
    console.log("emiting");
  }

}
