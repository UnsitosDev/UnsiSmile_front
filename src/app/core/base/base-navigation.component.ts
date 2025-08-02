import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';

@Component({
  template: ''
})
export abstract class BaseNavigationComponent {
  private location = inject(Location);

  /**
   * Navega a la página anterior en el historial del navegador
   */
  goBack(): void {
    this.location.back();
  }

  /**
   * Navega a una ruta específica usando el Router
   * @param route Ruta a la que se desea navegar
   * @param extras Opciones adicionales de navegación
   */
  /*
  // Ejemplo de uso con Router
  navigate(route: string | string[], extras?: NavigationExtras): void {
    this.router.navigate(route, extras);
  }
  */
}
