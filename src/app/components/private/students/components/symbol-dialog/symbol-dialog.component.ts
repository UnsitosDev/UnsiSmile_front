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
  templateUrl: './symbol-dialog.component.html',
  styleUrls: ['./symbol-dialog.component.scss']
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