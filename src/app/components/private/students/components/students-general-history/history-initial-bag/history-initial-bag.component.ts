import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { InputField, inputs } from './models/inputs';

@Component({
  selector: 'app-history-initial-bag',
  standalone: true,
  imports: [NgFor],
  templateUrl: './history-initial-bag.component.html',
  styleUrl: './history-initial-bag.component.scss'
})

export class HistoryInitialBagComponent {
  // inputs
  formFields: InputField[] = inputs;

  etiquetasColumnasDerecha = ['8', '7', '6', '5', '4', '3', '2', '1'];
  etiquetasColumnasIzquierda = ['1', '2', '3', '4', '5', '6', '7', '8'];

  filasDatos = ['D', 'M', 'M'];
  columnasAdicionales = ['D', 'M', 'M']; // Valores correspondientes a la columna adicional

  registros: { value: string, row: string, column: string }[] = []; // Arreglo para almacenar los registros
  Coordenadas: any[] = []; // Arreglo para almacenar las coordenadas

  onCellInput(event: Event, rowIndex: number, colIndex: number | string): void {
    const inputValue = (event.target as HTMLTableCellElement).innerText.trim();
    const rowLabel = this.filasDatos[rowIndex];
    const colLabel = typeof colIndex === 'number' ? this.getColumnLabel(colIndex) : 'Additional Column';

    const registro = {
      value: inputValue,
      row: rowLabel,
      column: colLabel
    };

    this.registros.push(registro); // Almacenar el objeto en el arreglo de registros
    this.Coordenadas = [...this.registros]; // Asignar el arreglo de registros al arreglo de coordenadas

    console.log('Registro agregado:', registro);
    console.log('Coordenadas:', this.Coordenadas);
  }

  getColumnLabel(index: number): string {
    if (index < this.etiquetasColumnasDerecha.length) {
      return `1 ${this.etiquetasColumnasDerecha[index]}`;
    } else if (index === this.etiquetasColumnasDerecha.length) {
      return 'Additional Column';
    } else {
      return `2 ${this.etiquetasColumnasIzquierda[index - this.etiquetasColumnasDerecha.length - 1]}`;
    }
  }
}
