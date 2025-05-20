import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICondition } from 'src/app/models/shared/odontogram/odontogram';
import { Toolbar } from 'src/app/models/shared/tool-bar-options.model';
import { ToothConditionsConstants } from './../../../../../utils/ToothConditions.constant';

@Component({
  selector: 'app-students-toolbar',
  standalone: true,
  imports: [],
  templateUrl: './students-toolbar.component.html',
  styleUrl: './students-toolbar.component.scss',
})
export class StudentsToolbarComponent {
  @Input() toolbar!: Toolbar;
  @Output() handleAction = new EventEmitter<ICondition>();
  @Input({ required: true }) state!:
    | 'create'
    | 'update'
    | 'read'
    | 'read-latest';
  @Input() marked!: ICondition;

  ToothConditionsConstants = ToothConditionsConstants;

  isSymbolSelected(symbol: ICondition): boolean {
    return this.marked?.condition === symbol.condition;
  }

  selectSymbol(symbol: ICondition): void {
    if (this.state === 'read') {
      return;
    }

    this.handleAction.emit({
      description: symbol.description,
      condition: symbol.condition,
      idCondition: symbol.idCondition,
      selected: false,
    });
  }

  isNormalCondition(condition: string): boolean {
    const normalConditions = [
      ToothConditionsConstants.DIENTE_PARCIALMENTE_ERUPCIONADO,
      ToothConditionsConstants.DIENTE_OBTURADO,
      ToothConditionsConstants.DIENTE_CON_CORONA,
      ToothConditionsConstants.MANTENEDOR_DE_ESPACIO_CON_CORONA,
      ToothConditionsConstants.MANTENEDOR_DE_ESPACIO_CON_BANDA,
      ToothConditionsConstants.PROTESIS_REMOVIBLE,
      ToothConditionsConstants.PUENTE,
      ToothConditionsConstants.DIENTE_NO_PRESENTE
    ];
    return normalConditions.includes(condition);
  }

  isAbnormalCondition(condition: string): boolean {
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
    ];
    return abnormalConditions.includes(condition);
  }
}
