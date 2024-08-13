import { toothConditionRequest } from './../students-general-history/models/toothCondition/toothCondition';
import { ToothConditionsConstants } from './../../../../../utils/ToothConditions.constant';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICondition } from 'src/app/models/shared/odontogram';
import { Toolbar } from 'src/app/models/shared/tool-bar-options.model';

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

  ToothConditionsConstants = ToothConditionsConstants 

  selectSymbol(symbol: ICondition) {
    this.handleAction.emit(symbol);
    console.log(symbol);
  }

  isNormalCondition(condition: string): boolean {
    const normalConditions = [
      ToothConditionsConstants.DIENTE_PARCIALMENTE_ERUPCIONADO,
      ToothConditionsConstants.DIENTE_OBTURADO,
      ToothConditionsConstants.DIENTE_CON_CORONA,
      ToothConditionsConstants.MANTENEDOR_DE_ESPACIO_CON_CORONA,
      ToothConditionsConstants.MANTENEDOR_DE_ESPACIO_CON_BANDA,
      ToothConditionsConstants.PROTESIS_REMOVIBLE,
      ToothConditionsConstants.PUENTE
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
      ToothConditionsConstants.DIENTE_OBTURADO_CON_CARIES
    ];
    return abnormalConditions.includes(condition);
  }
}
