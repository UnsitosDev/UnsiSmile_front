import { NgClass } from '@angular/common';
import { ConditionIconComponent } from '../../../../../shared/components/condition-icon/condition-icon.component';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ICondition, ITooth } from 'src/app/models/shared/odontogram/odontogram';
import { ToothConditionsConstants } from '@mean/utils';
import { SymbolDetailsDialogComponent } from '../odontogram/symbol-details-dialog/symbol-details-dialog.component';

export type State = 'read' | 'update' | 'create' | 'read-latest';

@Component({
  selector: 'app-students-tooth',
  standalone: true,
  imports: [
    NgClass,
    ConditionIconComponent
  ],
  templateUrl: './students-tooth.component.html',
  styleUrl: './students-tooth.component.scss',
})
export class StudentsToothComponent {
  @Input() data!: ITooth;
  @Input() index: number = 0;
  @Input() marked!: ICondition;
  @Input() toothConditions!: ICondition[];
  @Input({ required: true }) state: State = 'read';
  
  @Output() toggleTooth = new EventEmitter<ITooth>();
  @Output() deleteConditions = new EventEmitter<ITooth>();
  @Output() setFace = new EventEmitter<{faceId: string, index: number, tooth: ITooth}>();

  private dialog = inject(MatDialog);
  ToothConditionsConstant = ToothConditionsConstants;
  faceClicked = 0;

  onSymbolClick(condition: string, event: MouseEvent): void {
    event.stopPropagation();
    
    const isMobile = window.innerWidth < 600; // 600px es el breakpoint de Angular Material para móviles
    
    const dialogRef = this.dialog.open(SymbolDetailsDialogComponent, {
      width: isMobile ? '90vw' : '450px',
      maxWidth: '100vw',
      panelClass: 'symbol-details-dialog',
      autoFocus: false,
      data: {
        title: condition
      }
    });
  }


  /**
   * Función invocada cuando se hace clic en un diente.
   * @param data Información de los pacientes y sus dientes.
   * @param index Índice del diente actual.
   */
  clicked(data: ITooth, index: number, faceId: any, idCondition: number) {
    if (this.state === 'read' || this.hasProsthesisOrMissingTeeth()) {
      return;
    }

    // Se emite un evento para configurar la cara con la información del diente seleccionado.
    this.setFace.emit({faceId: data.faces[index].idFace, index: index, tooth: data});
    this.faceClicked = index
  }

  getFacePoints(faceIndex: number): string {
    switch (faceIndex) {
      case 0:
        return '1,1 7,9 21,9 28,1';
      case 1:
        return '21,9 21,25 28,33 28,1';
      case 2:
        return '21,25 28,33 1,33 7,25';
      case 3:
        return '1,1 1,33 7,25 7,9';
      case 4:
        return '7,9 21,9 21,25 7,25';
      default:
        return '';
    }
  }

  getFaceCirclePoints(faceIndex: number): { cx: number, cy: number, r: number } {
    switch (faceIndex) {
      case 0: // Cara superior
        return { cx: 14.5, cy: 5, r: 4 };
      case 1: // Cara derecha
        return { cx: 25, cy: 17, r: 4 };
      case 2: // Cara inferior
        return { cx: 14.5, cy: 29, r: 4 };
      case 3: // Cara izquierda
        return { cx: 4, cy: 17, r: 4 };
      case 4: // Cara central
        return { cx: 14.5, cy: 17, r: 4 };
      default:
        return { cx: 0, cy: 0, r: 0 };
    }
  }
  
  getFracturePoints(faceIndex: number): { x1: number, y1: number, x2: number, y2: number } {
    switch(faceIndex) {
      case 0:
        return { x1: 1, y1: 1, x2: 28, y2: 9 };
      case 1:
        return { x1: 21, y1: 9, x2: 28, y2: 33 };
      case 2:
        return { x1: 21, y1: 25, x2: 1, y2: 33 };
      case 3:
        return { x1: 1, y1: 1, x2: 7, y2: 25 };
      case 4:
        return { x1: 7, y1: 9, x2: 21, y2: 25 };
      default:
        return { x1: 0, y1: 0, x2: 0, y2: 0 };
    }
  }
  
  hasConditions(): boolean {
    return this.data.conditions.length > 0 || 
           this.data.faces.some(face => face.conditions && face.conditions.length > 0);
  }

  hasProsthesisOrMissingTeeth(): boolean {
    return this.data.conditions.some(condition => 
      condition.condition === ToothConditionsConstants.DIENTE_EXTRAIDO ||
      condition.condition === ToothConditionsConstants.DIENTE_NO_PRESENTE ||
      condition.condition === ToothConditionsConstants.PROTESIS_REMOVIBLE
    );
  }


  isNotPresent(conditions: ICondition[]): boolean {
    return !conditions.some(condition => condition.condition === ToothConditionsConstants.DIENTE_NO_PRESENTE);
  }

  /**
   * Obtiene las condiciones que deben mostrarse debajo del diente
   */
  getBelowToothConditions(): ICondition[] {
    // Condiciones que se muestran como íconos debajo del diente
    const belowToothConditions = [
      ToothConditionsConstants.FISTULA,
      ToothConditionsConstants.DIENTE_CON_FLUOROSIS,
      ToothConditionsConstants.DIENTE_CON_HIPOPLASIA,
      ToothConditionsConstants.RESTO_RADICULAR,
      ToothConditionsConstants.DIENTE_EN_MAL_POSICION_DERECHA,
      ToothConditionsConstants.DIENTE_EN_MAL_POSICION_IZQUIERDA,
      ToothConditionsConstants.DIENTE_PARCIALMENTE_ERUPCIONADO,
      ToothConditionsConstants.PROTESIS_REMOVIBLE,
      ToothConditionsConstants.PUENTE,
      ToothConditionsConstants.ENDODONCIA
    ] as string[];

    return this.data.conditions.filter(condition => 
      belowToothConditions.includes(condition.condition)
    );
  }
}
