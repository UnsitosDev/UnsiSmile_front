import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ICondition } from '@mean/models';
import { ToothConditionsConstants } from '@mean/utils';

@Component({
  selector: 'app-symbol-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <div class="symbol-dialog">
      <h2 mat-dialog-title>Seleccionar Símbolo</h2>
      
      <mat-dialog-content>
        <mat-form-field class="search-field">
          <mat-label>Buscar símbolo</mat-label>
          <input matInput [(ngModel)]="searchTerm" (ngModelChange)="filterSymbols()">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <div class="symbols-container">
          <!-- Condiciones Normales -->
          <div class="symbol-section">
            <h3>Código normal</h3>
            <div class="symbols-grid">
              @for (symbol of getNormalSymbols(); track symbol.idCondition) {
                <div 
                  class="symbol-item" 
                  [class.selected]="isSelected(symbol)"
                  (click)="selectAndClose(symbol)"
                >
                  <div class="symbol-icon">
                    <svg width="30" height="35" viewBox="0 0 30 35">
                      <!-- Representación del diente con cinco caras -->
                      <polygon stroke="black" points="1,1 7,9 21,9 28,1" fill="#EAEDEA" stroke-width="0.5"/>
                      <polygon stroke="black" points="21,9 21,25 28,33 28,1" fill="#EAEDEA" stroke-width="0.5"/>
                      <polygon stroke="black" points="21,25 28,33 1,33 7,25" fill="#EAEDEA" stroke-width="0.5"/>
                      <polygon stroke="black" points="1,1 1,33 7,25 7,9" fill="#EAEDEA" stroke-width="0.5"/>
                      <polygon stroke="black" points="7,9 21,9 21,25 7,25" fill="#EAEDEA" stroke-width="0.5"/>
                      
                      @switch (symbol.condition) {
                        @case (ToothConditionsConstants.DIENTE_OBTURADO) {
                          <polygon points="7,9 21,9 21,25 7,25" fill="#1919e6" opacity="0.6"/>
                        }
                        @case (ToothConditionsConstants.DIENTE_CON_CORONA) {
                          <polygon points="1,1 28,1 28,33 1,33" fill="#1919e6" opacity="0.6"/>
                        }
                        @case (ToothConditionsConstants.MANTENEDOR_DE_ESPACIO_CON_CORONA) {
                          <polygon points="1,1 28,1 28,33 1,33" fill="#1919e6" opacity="0.3"/>
                          <line x1="0" y1="28" x2="29" y2="28" stroke="black" stroke-width="2" opacity="0.6"/>
                          <line x1="20" y1="17" x2="29" y2="17" stroke="black" stroke-width="2" opacity="0.6"/>
                          <line x1="0" y1="6" x2="29" y2="6" stroke="black" stroke-width="2" opacity="0.6"/>
                        }
                        @case (ToothConditionsConstants.MANTENEDOR_DE_ESPACIO_CON_BANDA) {
                          <line x1="0" y1="28" x2="29" y2="28" stroke="black" stroke-width="2" opacity="0.6"/>
                          <line x1="20" y1="17" x2="29" y2="17" stroke="black" stroke-width="2" opacity="0.6"/>
                          <line x1="0" y1="6" x2="29" y2="6" stroke="black" stroke-width="2" opacity="0.6"/>
                        }
                      }
                    </svg>
                    <div class="tooth-symbols-below">
                      @if (symbol.condition === ToothConditionsConstants.PROTESIS_REMOVIBLE) {
                        <img src="../../../../../../assets/svg/protesis_removible.svg"/>
                      }
                      @if (symbol.condition === ToothConditionsConstants.PUENTE) {
                        <img src="../../../../../../assets/svg/puente.svg"/>
                      }
                      @if (symbol.condition === ToothConditionsConstants.DIENTE_PARCIALMENTE_ERUPCIONADO) {
                        <img src="../../../../../../assets/svg/erupcion.svg"/>
                      }
                    </div>
                  </div>
                  <div class="symbol-name">{{ symbol.condition }}</div>
                </div>
              }
            </div>
          </div>

          <!-- Condiciones Anormales -->
          <div class="symbol-section">
            <h3>Código anormal</h3>
            <div class="symbols-grid">
              @for (symbol of getAbnormalSymbols(); track symbol.idCondition) {
                <div 
                  class="symbol-item" 
                  [class.selected]="isSelected(symbol)"
                  (click)="selectAndClose(symbol)"
                >
                  <div class="symbol-icon abnormal">
                    <svg width="30" height="35" viewBox="0 0 30 35">
                      <!-- Representación del diente con cinco caras -->
                      <polygon stroke="black" points="1,1 7,9 21,9 28,1" fill="#EAEDEA" stroke-width="0.5"/>
                      <polygon stroke="black" points="21,9 21,25 28,33 28,1" fill="#EAEDEA" stroke-width="0.5"/>
                      <polygon stroke="black" points="21,25 28,33 1,33 7,25" fill="#EAEDEA" stroke-width="0.5"/>
                      <polygon stroke="black" points="1,1 1,33 7,25 7,9" fill="#EAEDEA" stroke-width="0.5"/>
                      <polygon stroke="black" points="7,9 21,9 21,25 7,25" fill="#EAEDEA" stroke-width="0.5"/>
                      
                      @switch (symbol.condition) {
                        @case (ToothConditionsConstants.DIENTE_CARIADO) {
                          <polygon points="7,9 21,9 21,25 7,25" fill="red" opacity="0.6"/>
                        }
                        @case (ToothConditionsConstants.DIENTE_EXTRAIDO) {
                          <polygon points="15,5 0,30 30,30" fill="#e74c3c"/>
                        }
                        @case (ToothConditionsConstants.DIENTE_CON_FRACTURA) {
                          <line x1="21" y1="9" x2="28" y2="33" stroke="red" stroke-width="2" stroke-dasharray="4"/>
                        }
                        @case (ToothConditionsConstants.DIENTE_OBTURADO_CON_CARIES) {
                          <polygon points="7,9 21,9 21,25 7,25" fill="#1919e6" opacity="0.8" stroke="red" stroke-width="2"/>
                        }
                      }
                    </svg>
                    <div class="tooth-symbols-below">
                      @if (symbol.condition === ToothConditionsConstants.DIENTE_CON_FLUOROSIS) {
                        <img src="../../../../../../assets/svg/fluorosis.svg"/>
                      }
                      @if (symbol.condition === ToothConditionsConstants.RESTO_RADICULAR) {
                        <img src="../../../../../../assets/svg/resto_radicular.svg"/>
                      }
                      @if (symbol.condition === ToothConditionsConstants.FISTULA) {
                        <img src="../../../../../../assets/svg/fistula.svg"/>
                      }
                      @if (symbol.condition === ToothConditionsConstants.DIENTE_CON_HIPOPLASIA) {
                        <img src="../../../../../../assets/svg/hipoplasia.svg"/>
                      }
                      @if (symbol.condition === ToothConditionsConstants.DIENTE_EN_MAL_POSICION_DERECHA) {
                        <img src="../../../../../../assets/svg/flecha derecha.svg"/>
                      }
                      @if (symbol.condition === ToothConditionsConstants.DIENTE_EN_MAL_POSICION_IZQUIERDA) {
                        <img src="../../../../../../assets/svg/flecha izquierda.svg"/>
                      }
                      @if (symbol.condition === ToothConditionsConstants.ENDODONCIA) {
                        <img src="../../../../../../assets/svg/endodoncia.svg"/>
                      }
                    </div>
                  </div>
                  <div class="symbol-name">{{ symbol.condition }}</div>
                </div>
              }
            </div>
          </div>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">Cancelar</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .symbol-dialog {
      padding: 20px;
      max-width: 800px;
    }

    .search-field {
      width: 100%;
      margin-bottom: 20px;
    }

    .symbols-container {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .symbol-section {
      h3 {
        color: var(--on-secondary);
        margin-bottom: 1rem;
      }
    }

    .symbols-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 16px;
      max-height: 400px;
      overflow-y: auto;
    }

    .symbol-item {
      padding: 16px;
      border: 1px solid #ddd;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      align-items: center;

      &:hover {
        background-color: #f5f5f5;
        transform: translateY(-2px);
      }

      &.selected {
        background-color: #e3f2fd;
        border-color: #2196f3;
      }
    }

    .symbol-icon {
      width: 40px;
      height: 40px;
      margin-bottom: 8px;
      position: relative;
    }

    .symbol-name {
      font-weight: 500;
      margin-top: 8px;
      text-align: center;
      font-size: 0.9em;
      color: var(--on-secondary);
    }

    .tooth-symbols-below {
      position: absolute;
      top: 40px;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      text-align: center;
      display: flex;
      justify-content: center;
      gap: 4px;

      img {
        width: 20px;
        height: 20px;
      }
    }
  `]
})
export class SymbolDialogComponent implements OnInit {
  symbols: ICondition[] = [];
  filteredSymbols: ICondition[] = [];
  searchTerm: string = '';
  selectedSymbol: ICondition | null = null;
  ToothConditionsConstants = ToothConditionsConstants;

  constructor(
    public dialogRef: MatDialogRef<SymbolDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { symbols: ICondition[], currentSymbol: ICondition | null }
  ) {
    this.symbols = data.symbols;
    this.selectedSymbol = data.currentSymbol;
    this.filteredSymbols = [...this.symbols];
  }

  ngOnInit(): void {
    this.filterSymbols();
  }

  getNormalSymbols(): ICondition[] {
    const normalConditions = [
      ToothConditionsConstants.DIENTE_PARCIALMENTE_ERUPCIONADO,
      ToothConditionsConstants.DIENTE_OBTURADO,
      ToothConditionsConstants.DIENTE_CON_CORONA,
      ToothConditionsConstants.MANTENEDOR_DE_ESPACIO_CON_CORONA,
      ToothConditionsConstants.MANTENEDOR_DE_ESPACIO_CON_BANDA,
      ToothConditionsConstants.PROTESIS_REMOVIBLE,
      ToothConditionsConstants.PUENTE
    ];
    return this.filteredSymbols.filter(symbol => normalConditions.includes(symbol.condition));
  }

  getAbnormalSymbols(): ICondition[] {
    const abnormalConditions = [
      ToothConditionsConstants.DIENTE_CARIADO,
      ToothConditionsConstants.DIENTE_EN_MAL_POSICION_IZQUIERDA,
      ToothConditionsConstants.DIENTE_EN_MAL_POSICION_DERECHA,
      ToothConditionsConstants.DIENTE_CON_FRACTURA,
      ToothConditionsConstants.FISTULA,
      ToothConditionsConstants.DIENTE_CON_FLUOROSIS,
      ToothConditionsConstants.DIENTE_CON_HIPOPLASIA,
      ToothConditionsConstants.DIENTE_OBTURADO_CON_CARIES,
      ToothConditionsConstants.RESTO_RADICULAR,
      ToothConditionsConstants.DIENTE_EXTRAIDO,
      ToothConditionsConstants.ENDODONCIA
    ];
    return this.filteredSymbols.filter(symbol => abnormalConditions.includes(symbol.condition));
  }

  filterSymbols(): void {
    if (!this.searchTerm) {
      this.filteredSymbols = [...this.symbols];
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    this.filteredSymbols = this.symbols.filter(symbol => 
      symbol.condition.toLowerCase().includes(searchLower) ||
      symbol.description.toLowerCase().includes(searchLower)
    );
  }

  selectAndClose(symbol: ICondition): void {
    this.selectedSymbol = symbol;
    this.dialogRef.close(symbol);
  }

  isSelected(symbol: ICondition): boolean {
    return this.selectedSymbol?.idCondition === symbol.idCondition;
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 