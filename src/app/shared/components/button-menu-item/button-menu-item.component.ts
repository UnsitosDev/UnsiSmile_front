import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { MenuItem } from '@mean/models';

@Component({
  selector: 'app-button-menu-item',
  standalone: true,
  imports: [
    FontAwesomeModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './button-menu-item.component.html',
  styleUrl: './button-menu-item.component.scss'
})
export class ButtonMenuItemComponent {
  @Input() buttonText: string = '';
  @Input() description: string = '';
  @Input() fontAwesomeIcon: any = faUser;
  @Input() subItems: MenuItem[] = []; 
  @Input() link: string = '/students/dashboard';

  isDropdownOpen: boolean = false;

  isLinkActive(link: string): boolean {
    return window.location.pathname.startsWith(link);
  }

  toggleDropdown(event: Event) {
    event.preventDefault(); // Evita la navegación si el ítem tiene sub-ítems
    this.isDropdownOpen = !this.isDropdownOpen; 
  }
}