import { Component } from '@angular/core';

@Component({
  selector: 'app-profilaxis',
  standalone: true,
  imports: [],
  templateUrl: './profilaxis.component.html',
  styleUrl: './profilaxis.component.scss'
})
export class ProfilaxisComponent {
  figures = Array(16).fill(0); // Arreglo de 16 elementos
  figureSize = 70; // Tamaño de la figura (ancho y alto)

  // Variable para almacenar el polígono seleccionado
  selectedPolygon: string | null = null;

  // Método para cambiar el color de un polígono al hacer clic
  changeColor(polygonId: string) {
    this.selectedPolygon = polygonId; // Almacena el polígono seleccionado
    console.log("Poligono seleccionado: ", this.selectedPolygon);
  }

  // Método para verificar si un polígono está seleccionado
  isSelected(polygonId: string): boolean {
    console.log("selected: ", this.selectedPolygon);
    return this.selectedPolygon === polygonId;
  }}
