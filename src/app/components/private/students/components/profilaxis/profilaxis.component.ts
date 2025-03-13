import { Component } from '@angular/core';

@Component({
  selector: 'app-profilaxis',
  standalone: true,
  imports: [],
  templateUrl: './profilaxis.component.html',
  styleUrl: './profilaxis.component.scss'
})
export class ProfilaxisComponent {
  toothDisabled: boolean = true;
  figures = Array(16).fill(0); // Arreglo de 16 elementos

  // Conjunto para almacenar los polígonos seleccionados
  selectedPolygons: Set<string> = new Set();

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

  deleteTooth() {
    this.toothDisabled = false;
  }

  restoreTooth() {
    this.toothDisabled = true;
  }
}
