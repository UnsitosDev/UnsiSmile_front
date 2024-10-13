
import { Component, EventEmitter, Output } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-history-initial-bag',
  standalone: true,
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './history-initial-bag.component.html',
  styleUrl: './history-initial-bag.component.scss',
})
export class HistoryInitialBagComponent {
  // inputs

  etiquetasColumnasDerecha = ['8', '7', '6', '5', '4', '3', '2', '1'];
  etiquetasColumnasIzquierda = ['1', '2', '3', '4', '5', '6', '7', '8'];

  filasDatos = ['D', 'M', 'M'];
  columnasAdicionales = ['D', 'M', 'M']; // Valores correspondientes a la columna adicional

  registros: { value: string; row: string; column: string }[] = []; // Arreglo para almacenar los registros
  Coordenadas: any[] = []; // Arreglo para almacenar las coordenadas

  onCellInput(event: Event, rowIndex: number, colIndex: number | string): void {
    const inputValue = (event.target as HTMLTableCellElement).innerText.trim();
    const rowLabel = this.filasDatos[rowIndex];
    const colLabel =
      typeof colIndex === 'number'
        ? this.getColumnLabel(colIndex)
        : 'Additional Column';

    const registro = {
      value: inputValue,
      row: rowLabel,
      column: colLabel,
    };

    this.registros.push(registro); // Almacenar el objeto en el arreglo de registros
    this.Coordenadas = [...this.registros]; // Asignar el arreglo de registros al arreglo de coordenadas
  }

  getColumnLabel(index: number): string {
    if (index < this.etiquetasColumnasDerecha.length) {
      return `1 ${this.etiquetasColumnasDerecha[index]}`;
    } else if (index === this.etiquetasColumnasDerecha.length) {
      return 'Additional Column';
    } else {
      return `2 ${
        this.etiquetasColumnasIzquierda[
          index - this.etiquetasColumnasDerecha.length - 1
        ]
      }`;
    }
  }

  sendData() {
    this.nextTab();
    this.emitNextTabEvent();
  }

  @Output() nextTabEventEmitted = new EventEmitter<boolean>();
  emitNextTabEvent() {
      this.nextTabEventEmitted.emit(false);
  }

  @Output() nextMatTab = new EventEmitter<number>();
  nextTab() {
    this.nextMatTab.emit(0);
  }

  currentTabIndex: number = 0; // Índice del tab actual
  @Output() previousMatTab = new EventEmitter<number>();
  previousTab() {
      this.currentTabIndex = Math.max(this.currentTabIndex - 1, 0); // Decrementa el índice, asegurando que no sea menor que 0
      this.previousMatTab.emit(this.currentTabIndex); // Emite el índice del tab anterior
  }
}
