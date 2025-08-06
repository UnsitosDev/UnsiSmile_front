import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { ApiService, AuthService } from 'src/app/shared/services';
import { HttpHeaders } from '@angular/common/http';
import { UriConstants } from '@mean/utils';
import { ToastrService } from 'ngx-toastr';
import { PatientEvaluation, Row, SurfaceEvaluation, SurfaceMeasurement, TabStructure, ToothEvaluation } from 'src/app/shared/models';
import { Messages } from 'src/app/utils/messageConfirmLeave';
import { TokenData } from 'src/app/components/public/login/model/tokenData';
import { ROLES } from "../../../../../utils/roles";
@Component({
  selector: 'app-history-initial-bag',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatCheckboxModule, MatInputModule, MatFormFieldModule, FormsModule],
  templateUrl: './history-initial-bag.component.html',
  styleUrl: './history-initial-bag.component.scss',
})
export class HistoryInitialBagComponent implements OnInit {
  @Input() patientId!: string;                                   // ID del paciente
  @Input() idQuestion!: number;                                  // ID de la pregunta asociada
  @Input() state!: 'create' | 'update' | 'read' | 'read-latest'; // Estado del formulario
  @Input() idMedicalRecordPatient!: number;                    // ID de la historia clínica

  @Output() nextTabEventEmitted = new EventEmitter<boolean>();     // Evento para cambiar pestaña
  @Output() nextMatTab = new EventEmitter<void>();                 // Evento siguiente pestaña (Material)
  @Output() previousMatTab = new EventEmitter<void>();             // Evento pestaña anterior (Material)

  private apiService = inject(ApiService);
  private toastr = inject(ToastrService);
  private userService = inject(AuthService);

  public notes: string = '';                  // Notas del periodontograma
  public id: number = 0;                      // ID del Periodontograma
  public role!: string;                       // Rol del usuario
  public token!: string;                      // Token de autenticación
  public tokenData!: TokenData;               // Datos decodificados del token
  public periodontogram!: PatientEvaluation;  // Datos del periodontograma del paciente

  private formSectionId = 8;                        // ID de la sección
  private plaqueIndex = 0;                          // Índice de placa bacteriana
  private bleedingIndex = 0;                        // Índice de sangrado
  public enabledButton: boolean = true;                     // Control de habilitación de botones

  ROL = ROLES;
  // Símbolos para la columna "SIGNO"
  signSymbols = ['P. B.', 'N. I.', 'M. D.', 'SANGRA', 'PLACA', 'CALCULO'];

  // Posiciones dentales
  positions = ['MESIAL', 'CENTRAL', 'DISTAL'];

  // Mapeo de nombres de superficies dentales
  surfaceNameMapping: { [key: string]: string } = {
    'VESTIBULARES SUPERIORES': 'VESTIBULAR',
    'PALATINAS': 'PALATINO',
    'VESTIBULARES INFERIORES': 'VESTIBULAR_INFERIOR',
    'LINGUALES': 'LINGUAL'
  };

  // Estructura de las tablas
  tab: TabStructure = {
    upperVestibular: {
      title: 'VESTIBULARES SUPERIORES',
      id: 1,
      columns: [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
      rows: [],
    },
    lowerPalatino: {
      title: 'PALATINAS',
      id: 2,
      columns: [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
      rows: [],
    },
     lowerVestibular: {
      title: 'VESTIBULARES INFERIORES',
      id: 4,
      columns: [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38],
      rows: [],
    },
    upperLingual: {
      title: 'LINGUALES',
      id: 3,
      columns: [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38],
      rows: [],
    },
  };

  ngOnInit(): void {
    this.initializeTables();
    this.getPeriodontogram();
    this.getRole();
  }

  getRole(){
    this.token = this.userService.getToken() ?? "";
    this.tokenData = this.userService.getTokenDataUser(this.token);
    this.role = this.tokenData.role[0].authority;
  }

  store(): void {
    switch (this.state) {
      case 'create':
        this.sendDataPeriodontogram();
        break;
      case 'update':
        break;
      case 'read-latest':
        this.nextMatTab.emit();
        break;
      case 'read':
        this.nextMatTab.emit();
        break;
    }
  }

  getPeriodontogram() {
    this.apiService
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_PERIODONTOGRAM_ID}/${this.patientId}/form-section/${this.formSectionId}`,
        data: {},
      })
      .subscribe({
        next: (response) => {
          this.periodontogram = response;
          this.id = this.periodontogram.id || 0;
          this.notes = this.periodontogram.notes;
          this.loadPeriodontogramData(this.periodontogram);
          this.enabledButton = true;
        },
        error: (error) => {
          return;
        },
      });
  }

  // Inicializa las filas de las tablas
  initializeTables(): void {
    Object.keys(this.tab).forEach((key) => {
      const tableKey = key as keyof TabStructure;
      this.tab[tableKey].rows = this.generateRows(this.tab[tableKey].columns);
    });
  }

  generateRows(columns: number[]): Row[] {
    return this.signSymbols.map((symbol) => ({
      label: '',
      values: Array(columns.length * 3).fill(null), // Inicializar con null
      symbol,
    }));
  }

  loadPeriodontogramData(periodontogram: PatientEvaluation): void {
    // Recorrer cada tabla en el frontend
    Object.keys(this.tab).forEach((key) => {
      const tableKey = key as keyof TabStructure;
      const table = this.tab[tableKey];

      // Obtener la superficie correspondiente a esta tabla
      const surface = this.surfaceNameMapping[table.title];

      // Recorrer cada diente en la tabla del frontend
      table.columns.forEach((toothId, columnIndex) => {
        // Buscar la evaluación del diente en los datos del backend usando el id único
        const toothEvaluation = periodontogram.toothEvaluations.find(
          (evaluation) => {
            // Verificar si el idTooth coincide y si la evaluación tiene la superficie correcta
            return (
              evaluation.idTooth === toothId.toString() &&
              evaluation.surfaceEvaluations.some(
                (surfaceEval) => surfaceEval.surface.trim().toUpperCase() === surface.trim().toUpperCase()
              )
            );
          }
        );

        if (toothEvaluation) {
          // Buscar la evaluación de la superficie correspondiente a esta tabla
          const surfaceEvaluation = toothEvaluation.surfaceEvaluations.find(
            (evaluation) => evaluation.surface.trim().toUpperCase() === surface.trim().toUpperCase()
          );

          if (surfaceEvaluation) {
            // Cargar la movilidad (M. D.)
            const mdRow = table.rows.find((row) => row.symbol === 'M. D.');
            if (mdRow) {
              mdRow.values[columnIndex] = toothEvaluation.mobility || null;
            }

            // Definir el orden de las posiciones (MESIAL, CENTRAL, DISTAL)
            const positions = ['MESIAL', 'CENTRAL', 'DISTAL'];

            // Cargar P. B. y N. I.
            const pbRow = table.rows.find((row) => row.symbol === 'P. B.');
            const niRow = table.rows.find((row) => row.symbol === 'N. I.');

            positions.forEach((position, positionIndex) => {
              const measurement = surfaceEvaluation.surfaceMeasurements.find(
                (m) => m.toothPosition.trim().toUpperCase() === position.trim().toUpperCase()
              );

              if (pbRow) {
                pbRow.values[columnIndex * 3 + positionIndex] = measurement?.pocketDepth || null;
              }
              if (niRow) {
                niRow.values[columnIndex * 3 + positionIndex] = measurement?.lesionLevel || null;
              }
            });

            // Cargar SANGRA, PLACA, CALCULO
            const sangraRow = table.rows.find((row) => row.symbol === 'SANGRA');
            const placaRow = table.rows.find((row) => row.symbol === 'PLACA');
            const calculoRow = table.rows.find((row) => row.symbol === 'CALCULO');

            positions.forEach((position, positionIndex) => {
              const measurement = surfaceEvaluation.surfaceMeasurements.find(
                (m) => m.toothPosition.trim().toUpperCase() === position.trim().toUpperCase()
              );

              if (sangraRow) {
                sangraRow.values[columnIndex * 3 + positionIndex] = measurement?.bleeding || false;
              }
              if (placaRow) {
                placaRow.values[columnIndex * 3 + positionIndex] = measurement?.plaque || false;
              }
              if (calculoRow) {
                calculoRow.values[columnIndex * 3 + positionIndex] = measurement?.calculus || false;
              }
            });
          } else {
            // Inicializar valores con null o un valor predeterminado
            const mdRow = table.rows.find((row) => row.symbol === 'M. D.');
            if (mdRow) {
              mdRow.values[columnIndex] = null;
            }

            const pbRow = table.rows.find((row) => row.symbol === 'P. B.');
            const niRow = table.rows.find((row) => row.symbol === 'N. I.');

            const sangraRow = table.rows.find((row) => row.symbol === 'SANGRA');
            const placaRow = table.rows.find((row) => row.symbol === 'PLACA');
            const calculoRow = table.rows.find((row) => row.symbol === 'CALCULO');

            const positions = ['MESIAL', 'CENTRAL', 'DISTAL'];
            positions.forEach((position, positionIndex) => {
              if (pbRow) {
                pbRow.values[columnIndex * 3 + positionIndex] = null;
              }
              if (niRow) {
                niRow.values[columnIndex * 3 + positionIndex] = null;
              }
              if (sangraRow) {
                sangraRow.values[columnIndex * 3 + positionIndex] = false;
              }
              if (placaRow) {
                placaRow.values[columnIndex * 3 + positionIndex] = false;
              }
              if (calculoRow) {
                calculoRow.values[columnIndex * 3 + positionIndex] = false;
              }
            });
          }
        }
      });
    });
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
      if (inputValue.length > 1) {
        inputElement.value = inputValue.substring(0, 1);
        return;
      }

      // Validar que el valor esté entre 1 y 15
      const numericValue = parseInt(inputValue, 10);
      if (isNaN(numericValue)) {
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
    if (this.isPeriodontogramEmpty()) {
      this.toastr.warning(Messages.NO_DATA_TO_SEND);
      return;
    }
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
          this.toastr.success(Messages.SUCCESS_INSERT_PERIODONTOGRAM);
          this.nextMatTab.emit();
        },
        error: (error) => {
          this.toastr.error(Messages.BAD_DATA);
          this.toastr.error(error);
        },
      });
  }

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
      plaqueIndex: this.plaqueIndex,
      bleedingIndex: this.bleedingIndex,
      notes: this.notes,
      toothEvaluations,
      formSection: "GENERAL_CLINICAL_HISTORY",
      idQuestion: this.idQuestion,
      idPatientMedicalRecord: this.idMedicalRecordPatient
    };

    return data;
  }

  isPeriodontogramEmpty(): boolean {
    for (const tableKey of this.getTableKeys()) {
      const table = this.tab[tableKey];

      for (const row of table.rows) {
        if (row.values.some((value: number | boolean | null) => value !== null && value !== false)) {
          return false;
        }
      }
    }
      return true;
  }

  previousTab() {
    this.previousMatTab.emit();
  }

  nextTab() {
    this.nextMatTab.emit();
  }
}
