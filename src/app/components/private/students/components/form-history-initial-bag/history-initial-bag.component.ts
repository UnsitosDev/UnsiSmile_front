import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BaseChartDirective } from 'ng2-charts';

interface Row {
  label: string;
  values: any;
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

interface SurfaceMeasurement {
  toothPosition: string; // Posición del diente (no aplica aquí)
  pocketDepth: number; // Profundidad de bolsa (P. B.)
  lesionLevel: number; // Nivel de inserción (N. I.)
  plaque: boolean; // Placa (no aplica aquí)
  bleeding: boolean; // Sangrado (no aplica aquí)
  calculus: boolean; // Cálculo (no aplica aquí)
}

interface SurfaceEvaluation {
  surface: string; // Superficie del diente (vestibular, medio, lingual/palatino)
  surfaceMeasurements: SurfaceMeasurement[];
}

interface ToothEvaluation {
  idTooth: string; // Identificador del diente (ej: "18")
  mobility: number; // Movilidad del diente (no aplica aquí)
  surfaceEvaluations: SurfaceEvaluation[];
}

interface PatientEvaluation {
  patientId: string; // ID del paciente
  plaqueIndex: number; // Índice de placa (no aplica aquí)
  bleedingIndex: number; // Índice de sangrado (no aplica aquí)
  notes: string; // Notas adicionales (no aplica aquí)
  toothEvaluations: ToothEvaluation[];
}


@Component({
  selector: 'app-history-initial-bag',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, BaseChartDirective, MatCheckboxModule],
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

  onInputChange(tableKey: keyof TabStructure, row: Row, event: Event, columnIndex: number, inputIndex: number): void {
    const inputElement = event.target as HTMLInputElement;
    const inputType = inputElement.type; // Obtener el tipo de input (text, checkbox, etc.)
  
    if (inputType === 'text') {
      // Manejar inputs de tipo texto (números)
      let newValue = inputElement.value.replace(/\D/g, ''); // Elimina caracteres no numéricos
  
      // Limita el valor a un solo dígito (1-10)
      if (newValue.length > 2) { // Permitir hasta 2 dígitos (10)
        newValue = newValue.substring(0, 2);
      }
  
      // Validar que el valor esté entre 1 y 10
      const numericValue = parseInt(newValue, 15);
      if (isNaN(numericValue) || numericValue < 1 || numericValue > 15) {
        // Si el valor no es válido, limpiar el input
        inputElement.value = '';
        return;
      }
  
      // Asignar el valor numérico al input
      inputElement.value = newValue;
  
      // Actualizar el valor en la tabla
      const rowIndex = this.tab[tableKey].rows.indexOf(row);
  
      if (rowIndex !== -1 && columnIndex !== -1) {
        this.tab[tableKey].rows[rowIndex].values[columnIndex] = numericValue; // Guardar el valor numérico
      }
  
      // Imprimir la ubicación del input en la consola
      console.log(`Tabla: ${tableKey}, Fila: ${row.symbol}, Columna: ${this.tab[tableKey].columns[columnIndex]}, Input: ${inputIndex + 1}`);
    }
  }
  // Datos para la gráfica
  public lineChartData = {
    labels: ['18', '17', '16', '15', '14', '13', '12', '11', '21', '22', '23', '24', '25', '26', '27', '28'],
    datasets: [
      {
        label: 'My First Dataset',
        data: [1, 1, 2, NaN, 1, 1, 2, NaN, 4, 5, 1, 1, 2, NaN, 6, 7, 1, 2],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  // Opciones de la gráfica
  public lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  // Tipo de gráfica
  public lineChartType = 'line' as const;
}