import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    RouterModule
  ]
})
export class AppComponent implements OnInit {
  title = 'odonto_front';
  isDarkTheme: boolean = false;


  ngOnInit(): void {
    initFlowbite();
    // Al iniciar, cargar el tema guardado o aplicar el tema claro por defecto
    const savedTheme = localStorage.getItem('theme');
    this.isDarkTheme = savedTheme === 'dark';
    this.applyTheme(); // Aplica el tema de Angular Material
    this.applyGlobalTheme(); // Aplica el tema global que afecta a toda la aplicación
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
