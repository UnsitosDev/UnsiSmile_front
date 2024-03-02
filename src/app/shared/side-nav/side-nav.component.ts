import { NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ButtonMenuItemComponent } from '../button-menu-item/button-menu-item.component';
import { items } from '@mean/models';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [ButtonMenuItemComponent, NgFor],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css',
})
export class SideNavComponent {
  public menuItems = items;

  constructor() {}

  @Input() isSidebarOpen = false;
}
