import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { BaseChartDirective } from 'ng2-charts';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@mean/services';
import { HttpHeaders } from '@angular/common/http';
import { UriConstants } from '@mean/utils';
import { ToastrService } from 'ngx-toastr';
interface Row {
  label: string;
  values: any;
  symbol: string;
}

interface TabStructure {
  upperVestibular: TabSection;
  lowerPalatino: TabSection;
  upperLingual: TabSection;
  lowerVestibular: TabSection;
}

interface TabSection {
  title: string;
  id: number;
  columns: number[];
  rows: Row[];
}

interface SurfaceMeasurement {
  toothPosition: string;
  pocketDepth: number;
  lesionLevel: number;
  plaque: boolean;
  bleeding: boolean;
  calculus: boolean;
}

interface SurfaceEvaluation {
  surface: string;
  surfaceMeasurements: SurfaceMeasurement[];
}

interface ToothEvaluation {
  idTooth: string;
  mobility: number;
  surfaceEvaluations: SurfaceEvaluation[];
}

interface PatientEvaluation {
  patientId: string;
  plaqueIndex: number;
  bleedingIndex: number;
  notes: string;
  toothEvaluations: ToothEvaluation[];
}

@Component({
  selector: 'app-history-initial-bag',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, BaseChartDirective, MatCheckboxModule, MatInputModule, MatFormFieldModule, FormsModule],
  templateUrl: './history-initial-bag.component.html',
  styleUrl: './history-initial-bag.component.scss',
})
export class HistoryInitialBagComponent implements OnInit {
  notes: string = '';
  private apiService = inject(ApiService);
  private toastr = inject(ToastrService);
  @Input({ required: true }) patientId!: string;
  @Output() nextTabEventEmitted = new EventEmitter<boolean>();
  @Output() nextMatTab = new EventEmitter<void>();
  @Output() previousMatTab = new EventEmitter<void>();

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
    //console.log('paciente', this.patientId);
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

  onInputChange(tableKey: keyof TabStructure, row: Row, event: Event | MatCheckboxChange, columnIndex: number, inputIndex: number): void {
    let value: number | boolean;
  
    if (event instanceof MatCheckboxChange) {
      // Para checkboxes, usar la propiedad `checked`
      value = event.checked;
    } else {
      // Para inputs de texto, mantener la lógica actual
      const inputElement = event.target as HTMLInputElement;
      const inputValue = inputElement.value.replace(/\D/g, ''); // Eliminar caracteres no numéricos
  
      // Limitar el valor a un solo dígito (1-15)
      if (inputValue.length > 2) {
        inputElement.value = inputValue.substring(0, 2);
        return;
      }
  
      // Validar que el valor esté entre 1 y 15
      const numericValue = parseInt(inputValue, 10);
      if (isNaN(numericValue) || numericValue < 1 || numericValue > 15) {
        inputElement.value = '';
        return;
      }
  
      value = numericValue;
    }
  
    // Actualizar el valor en la fila correspondiente
    const rowIndex = this.tab[tableKey].rows.indexOf(row);
    if (rowIndex !== -1) {
      if (row.symbol === 'M. D.') {
        // Para la fila M. D., asignar el valor directamente a la columna correspondiente
        this.tab[tableKey].rows[rowIndex].values[columnIndex] = value;
      } else {
        // Para otras filas, mantener la lógica actual
        this.tab[tableKey].rows[rowIndex].values[columnIndex * 3 + inputIndex] = value;
      }
    }
  }

  sendDataPeriodontogram() {
    const periodontogramData = this.mapPeriodontogramToPost();
    this.postPeriodontogram(periodontogramData);
  }

  postPeriodontogram(data: any) {
    this.apiService
      .postService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.POST_PERIODONTOGRAM_HC}`,
        data: data,
      })
      .subscribe({
        next: (response) => {
          this.toastr.success('Periodontograma Guardado');
          this.nextMatTab.emit();
        },
        error: (error) => {
          this.toastr.error(error);
        },
      });
  }

  // Mapeo de nombres de superficies
  surfaceNameMapping: { [key: string]: string } = {
    'VESTIBULARES SUPERIORES': 'VESTIBULAR',
    'PALATINOS INFERIORES': 'PALATINO',
    'LINGUALES SUPERIORES': 'LINGUAL',
    'VESTIBULARES INFERIORES': 'VESTIBULAR_INFERIOR',
  };

  mapPeriodontogramToPost(): any {
    const toothEvaluations: ToothEvaluation[] = [];
  
    // Recorrer cada tabla
    Object.keys(this.tab).forEach((tableKey) => {
      const table = this.tab[tableKey as keyof TabStructure];
  
      // Obtener la fila de movilidad (M. D.)
      const mdRow = table.rows.find((row) => row.symbol === 'M. D.');
  
      // Recorrer cada columna (diente)
      table.columns.forEach((toothId, columnIndex) => {
        // Obtener el valor de movilidad (M. D.) para este diente
        const mobility = mdRow ? parseFloat(mdRow.values[columnIndex]) || 0 : 0;
  
        // Crear el objeto toothEvaluation para este diente
        const toothEvaluation: ToothEvaluation = {
          idTooth: toothId.toString(),
          mobility, // Asignar el valor de mobility para este diente
          surfaceEvaluations: [],
        };
  
        // Definir las posiciones (MESIAL, CENTRAL, DISTAL)
        const positions = ['MESIAL', 'CENTRAL', 'DISTAL'];
  
        // Crear la evaluación de la superficie para esta tabla
        const surfaceEvaluation: SurfaceEvaluation = {
          surface: this.surfaceNameMapping[table.title], // Aplicar el mapeo al nombre de la tabla
          surfaceMeasurements: [],
        };
  
        // Procesar las filas P. B. y N. I. (pocketDepth y lesionLevel)
        const pbRow = table.rows.find((row) => row.symbol === 'P. B.');
        const niRow = table.rows.find((row) => row.symbol === 'N. I.');
  
        // Procesar las filas SANGRA, PLACA, CALCULO (bleeding, plaque, calculus)
        const sangraRow = table.rows.find((row) => row.symbol === 'SANGRA');
        const placaRow = table.rows.find((row) => row.symbol === 'PLACA');
        const calculoRow = table.rows.find((row) => row.symbol === 'CALCULO');
  
        positions.forEach((position, positionIndex) => {
          const pocketDepth = pbRow ? parseFloat(pbRow.values[columnIndex * 3 + positionIndex]) : null;
          const lesionLevel = niRow ? parseFloat(niRow.values[columnIndex * 3 + positionIndex]) : null;
          const bleeding = sangraRow ? sangraRow.values[columnIndex * 3 + positionIndex] === true : false;
          const plaque = placaRow ? placaRow.values[columnIndex * 3 + positionIndex] === true : false;
          const calculus = calculoRow ? calculoRow.values[columnIndex * 3 + positionIndex] === true : false;
  
          // Verificar si hay valores válidos para esta posición
          const hasValidValues =
            (pocketDepth !== null && !isNaN(pocketDepth)) ||
            (lesionLevel !== null && !isNaN(lesionLevel)) ||
            bleeding ||
            plaque ||
            calculus;
  
          if (hasValidValues) {
            // Crear la medición para esta posición
            const surfaceMeasurement: SurfaceMeasurement = {
              toothPosition: position,
              pocketDepth: pocketDepth !== null && !isNaN(pocketDepth) ? pocketDepth : 0,
              lesionLevel: lesionLevel !== null && !isNaN(lesionLevel) ? lesionLevel : 0,
              plaque,
              bleeding,
              calculus,
            };
  
            // Agregar la medición a la evaluación de la superficie
            surfaceEvaluation.surfaceMeasurements.push(surfaceMeasurement);
          }
        });
  
        // Agregar la evaluación de la superficie al diente solo si tiene mediciones válidas
        if (surfaceEvaluation.surfaceMeasurements.length > 0) {
          toothEvaluation.surfaceEvaluations.push(surfaceEvaluation);
        }
  
        // Agregar el diente al arreglo de evaluaciones solo si tiene evaluaciones válidas
        if (toothEvaluation.surfaceEvaluations.length > 0) {
          toothEvaluations.push(toothEvaluation);
        }
      });
    });
  
    const data = {
      patientId: this.patientId,
      plaqueIndex: 0,
      bleedingIndex: 0,
      notes: this.notes,
      toothEvaluations,
      formSection: "GENERAL_CLINICAL_HISTORY"
    };
  
    console.log(data);
    return data;
  }

  previousTab() {
    this.previousMatTab.emit();
  }
}