import { Component, OnInit } from '@angular/core';
import { storeProphylaxis } from 'src/app/services/prophylaxis.service';

@Component({
  selector: 'app-profilaxis',
  standalone: true,
  imports: [],
  templateUrl: './profilaxis.component.html',
  styleUrl: './profilaxis.component.scss'
})
export class ProfilaxisComponent implements OnInit{
  teeth = storeProphylaxis.theetProphylaxis; // Asigna los dientes a una propiedad
  toothDisabled: boolean[] = Array(16).fill(true); // Inicialmente, todos los dientes están visibles
  toothDeactivated: boolean[] = Array(16).fill(false); // Inicialmente, ningún diente está deshabilitado
  showTriangle: boolean[] = Array(16).fill(false); // Inicialmente, el triángulo está oculto

  // Conjunto para almacenar los polígonos seleccionados
  selectedPolygons: Set<string> = new Set();

  ngOnInit(): void {
    // Inicializa los estados para cada diente
    this.toothDisabled = this.teeth.map(() => true); // Todos los dientes están habilitados por defecto
    this.toothDeactivated = this.teeth.map(() => false); // Ningún diente está desactivado por defecto
    this.showTriangle = this.teeth.map(() => false); // El triángulo está oculto por defecto
  }

  // Método para cambiar el color de un polígono al hacer clic
  changeColor(polygonId: string) {
    if (this.selectedPolygons.has(polygonId)) {
      // Si el polígono ya está seleccionado, lo eliminamos
      this.selectedPolygons.delete(polygonId);
    } else {
      // Si no está seleccionado, lo agregamos
      this.selectedPolygons.add(polygonId);
    }
    console.log("Polígonos seleccionados: ", this.selectedPolygons);
  }

  // Método para verificar si un polígono está seleccionado
  isSelected(polygonId: string): boolean {
    return this.selectedPolygons.has(polygonId);
  }

  // Método para ocultar un diente y borrar sus condiciones
  deleteTooth(index: number) {
    this.toothDisabled[index] = false; // Oculta el diente en la posición `index`

    // Eliminar todos los polígonos seleccionados asociados a este diente
    this.clearPolygonsForTooth(index);
  }

  // Método para restaurar un diente
  restoreTooth(index: number) {
    this.toothDisabled[index] = true; // Muestra el diente en la posición `index`
  }

  // Método para limpiar los polígonos seleccionados de un diente específico
  clearPolygonsForTooth(index: number) {
    // Definimos los IDs de los polígonos asociados a este diente
    const polygonIds = [
      `polygon1-${index}`,
      `polygon2-${index}`,
      `polygon3-${index}`,
      `polygon4-${index}`,
    ];

    // Eliminamos cada polígono del conjunto `selectedPolygons`
    polygonIds.forEach((id) => this.selectedPolygons.delete(id));
  }

  // Método para desactivar un diente y mostrar el triángulo
  deactivateTooth(index: number) {
    this.clearPolygonsForTooth(index);
    this.toothDeactivated[index] = !this.toothDeactivated[index]; // Cambia el estado de deshabilitación
    this.showTriangle[index] = this.toothDeactivated[index]; // Muestra/oculta el triángulo
  }
}
