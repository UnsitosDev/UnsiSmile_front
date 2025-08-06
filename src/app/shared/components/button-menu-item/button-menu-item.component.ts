import { Component, EventEmitter, Input, Output } from '@angular/core';

import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { MenuItem } from 'src/app/shared/models';
import { submenuAnimation, rotateIcon } from '../../animations/menu-animations';

@Component({
  selector: 'app-button-menu-item',
  standalone: true,
  imports: [
    FontAwesomeModule,
    RouterLink,
    RouterLinkActive
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

  // Método exclusivo para expandir/colapsar al hacer clic en la flecha
  toggleExpandOnly(event: Event) {
    event.preventDefault();
    event.stopPropagation(); // Detiene la propagación al elemento padre
    if (this.item.children) {
      this.item['expanded'] = !this.item['expanded'];
    }
  }

  // Este método ahora solo maneja la navegación
  onMenuItemClick() {
    // Solo emite el evento si no es un ítem con submenú o si tiene una ruta válida
    if (!this.item.children || (this.item.children && this.item.routerlink !== '#')) {
      this.menuSelect.emit();
    }
  }
}