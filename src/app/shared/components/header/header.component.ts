import { Component, EventEmitter, Output } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLinkActive } from '@angular/router';
import { AuthService } from '@mean/services';
import { SessionStorageConstants } from 'src/app/utils/session.storage';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [MatMenuModule],
})

export class HeaderComponent {
  @Output() closeSidebar = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    public themeService: ThemeService // Inyectar el servicio aquí
  ) {}

  toggleSidebar() {
    this.closeSidebar.emit();
    console.log('emiting');
  }

  logout(): void {
    const token = this.authService.getToken();
    if (token) {
      sessionStorage.removeItem(SessionStorageConstants.USER_TOKEN);
    }
    this.router.navigate(['/']);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme(); // Llama al método del servicio
  }
}