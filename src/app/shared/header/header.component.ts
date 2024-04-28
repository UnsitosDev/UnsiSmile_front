import { Component, EventEmitter, Output } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';

import { Router, RouterLinkActive } from '@angular/router';
import { AuthService } from '@mean/services';
import { SessionStorageConstants } from 'src/app/utils/session.storage';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [MatMenuModule],
})
export class HeaderComponent {
  @Output() closeSidebar = new EventEmitter<void>();

  toggleSidebar() {
    this.closeSidebar.emit();
    console.log('emiting');
  }

  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Cierra la sesión del usuario.
   * Si hay un token de sesión almacenado, lo elimina de la sesión.
   * Luego redirige al usuario a la página principal.
   */

  logout(): void {
    const token = this.authService.getToken();
    if (token) {
      sessionStorage.removeItem(SessionStorageConstants.USER_TOKEN);
    }
    this.router.navigate(['/']);
  }
}
