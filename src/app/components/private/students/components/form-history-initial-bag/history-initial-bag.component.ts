import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

interface Row {
  label: string;
  values: string[];
  symbol: string;
}

interface TabStructure {
  upperVestibular: {
    title: string;
    id: number;
    columns: number[];
    rows: Row[];
  };
  lowerPalatino: {
    title: string;
    id: number;
    columns: number[];
    rows: Row[];
  };
  upperLingual: {
    title: string;
    id: number;
    columns: number[];
    rows: Row[];
  };
  lowerVestibular: {
    title: string;
    id: number;
    columns: number[];
    rows: Row[];
  };
}

@Component({
  selector: 'app-history-initial-bag',
  standalone: true,
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './history-initial-bag.component.html',
  styleUrl: './history-initial-bag.component.scss',
})
export class HistoryInitialBagComponent implements OnInit {
  // Estructura de las tablas
  tab: TabStructure = {
    upperVestibular: {
      title: 'VESTIBULARES SUPERIORES',
      id: 1,
      columns: [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
      rows: [],
    },
    lowerPalatino: {
      title: 'PALATINOS INFERIORES',
      id: 2,
      columns: [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
      rows: [],
    },
    upperLingual: {
      title: 'LINGUALES SUPERIORES',
      id: 3,
      columns: [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38],
      rows: [],
    },
    lowerVestibular: {
      title: 'VESTIBULARES INFERIORES',
      id: 4,
      columns: [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38],
      rows: [],
    },
  };

  // Símbolos para la columna SIGNO
  signSymbols = ['P. B.', 'N. I.', 'M. D.', 'SANGRA', 'PLACA', 'CALCULO'];

  ngOnInit(): void {
    this.initializeTables();
  }

  // Inicializa las filas de las tablas
  initializeTables(): void {
    Object.keys(this.tab).forEach((key) => {
      const tableKey = key as keyof TabStructure;
      this.tab[tableKey].rows = this.generateRows(this.tab[tableKey].columns);
    });
  }

  // Genera las filas para cada tabla
  generateRows(columns: number[]): Row[] {
    return this.signSymbols.map((symbol) => ({
      label: '',
      values: Array(columns.length).fill(''), // Valores vacíos para los dientes
      symbol,
    }));
  }

  // Obtiene las claves del objeto `tab`
  getTableKeys(): (keyof TabStructure)[] {
    return Object.keys(this.tab) as (keyof TabStructure)[];
  }

  // Maneja los cambios en los campos de entrada
  onInputChange(tableKey: keyof TabStructure, row: Row, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let newValue = inputElement.value.replace(/\D/g, ''); // Elimina caracteres no numéricos
  
    // Limita a 3 dígitos
    if (newValue.length > 3) {
      newValue = newValue.substring(0, 3);
    }
  
    // Formatea el valor como 0-0-0
    const formattedValue = newValue.replace(/(\d{1})(\d{1})(\d{1})/, '$1-$2-$3');
  
    // Asigna el valor formateado al input
    inputElement.value = formattedValue;
  
    // Actualiza el valor en la tabla
    const rowIndex = this.tab[tableKey].rows.indexOf(row);
    const columnIndex = Array.from(inputElement.parentElement!.parentElement!.children).indexOf(inputElement.parentElement!) - 1;
  
    if (rowIndex !== -1 && columnIndex !== -1) {
      this.tab[tableKey].rows[rowIndex].values[columnIndex] = formattedValue;
    }
  }
  
}