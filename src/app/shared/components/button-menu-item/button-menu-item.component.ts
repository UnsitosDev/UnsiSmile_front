import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { MenuItem } from '@mean/models';
import { submenuAnimation, rotateIcon } from '../../animations/menu-animations';

@Component({
  selector: 'app-button-menu-item',
  standalone: true,
  imports: [
    FontAwesomeModule,
    RouterLink,
    RouterLinkActive,
    CommonModule
  ],
  templateUrl: './button-menu-item.component.html',
  styleUrl: './button-menu-item.component.scss',
  animations: [submenuAnimation, rotateIcon]
})
export class ButtonMenuItemComponent {
  @Input() item!: MenuItem;
  @Input() level: number = 0;
  @Output() menuSelect = new EventEmitter<void>();

  faChevronDown = faChevronDown;
  faChevronRight = faChevronRight;

  isLinkActive(link: string): boolean {
    return window.location.pathname.startsWith(link);
  }

  toggleExpand(item: MenuItem, event: Event) {
    event.preventDefault();
    item['expanded'] = !item['expanded'];
  }

  onMenuItemClick() {
    if (!this.item.children || (this.item.children && this.item.routerlink !== '#')) {
      this.menuSelect.emit();
    }
  }
}