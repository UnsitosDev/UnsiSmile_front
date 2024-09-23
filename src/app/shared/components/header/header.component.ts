import { Component, EventEmitter, Output } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common'; // Importa CommonModule

import { Router, RouterLinkActive } from '@angular/router';
import { AuthService } from '@mean/services';
import { SessionStorageConstants } from 'src/app/utils/session.storage';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [MatMenuModule,CommonModule],
})

export class HeaderComponent {
  @Output() closeSidebar = new EventEmitter<void>();

  isDarkTheme: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Al iniciar, cargar el tema guardado o aplicar el tema claro por defecto
    const savedTheme = localStorage.getItem('theme');
    this.isDarkTheme = savedTheme === 'dark';
    this.applyTheme(); // Aplica el tema de Angular Material
    this.applyGlobalTheme(); // Aplica el tema global que afecta a toda la aplicación
  }

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

  // Método para alternar el tema claro/oscuro
  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    this.applyTheme(); // Aplica el tema de Angular Material
    this.applyGlobalTheme(); // Aplica el tema global que afecta a toda la aplicación

    // Guardar la preferencia del usuario en localStorage
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
  }

  // Método para aplicar el tema de Angular Material
  private applyTheme(): void {
    const themeClass = this.isDarkTheme ? 'dark-theme' : '';
    document.documentElement.className = themeClass;
  }

  // Método para aplicar el tema global
  private applyGlobalTheme(): void {
    const body = document.body;

    if (this.isDarkTheme) {
      body.classList.add('dark-theme-material');
      body.classList.remove('light-theme-material');
    } else {
      body.classList.add('light-theme-material');
      body.classList.remove('dark-theme-material');
    }
  }
}
