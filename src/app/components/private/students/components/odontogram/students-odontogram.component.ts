import { Component, EventEmitter, Input, Output, input } from '@angular/core';
import { StudentsToothComponent } from '../tooth/students-tooth.component';

import { OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { store } from '@mean/services';
import {
  ICondition,
  IFace,
  IOdontogram,
  ITooth,
} from 'src/app/models/shared/odontogram';
import { OdontogramData } from 'src/app/services/odontogram-data.service';
import { ToothConditionsConstants } from 'src/app/utils/ToothConditions.constant';
import { StudentsToolbarComponent } from '../toolbar-odontogram/students-toolbar.component';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-students-odontogram',
  standalone: true,
  imports: [
    StudentsToothComponent,
    StudentsToolbarComponent,
    MatTabsModule,
    MatButtonModule,
  ],
  templateUrl: './students-odontogram.component.html',
  styleUrl: './students-odontogram.component.scss',
})
export class StudentsOdontogramComponent implements OnInit {
  @Input({required : true}) patientId: number = 0;
  @Input({required : true}) odontogramType: "INITIAL_ODONTOGRAM" | "FINAL_ODONTOGRAM" = "INITIAL_ODONTOGRAM";

  //define la estructura de una arcada (odontograma)
  adultArcade = store.adultArcade;
  childrenArcade = store.childrenArcade;
  odontogram: IOdontogram = { tooths: [] }; //to insert
  options!: ICondition[];
  faces!: IFace[];

  data = store;

  toolbar!: { options: ICondition[] }; // Utiliza el servicio para obtener los datos

  marked!: ICondition;
  value = 0;

  constructor() {}

  private odontogramData = inject(OdontogramData);

  ngOnInit() {
    this.toolbar = { options: [] };
  
    forkJoin({
      toothConditions: this.odontogramData.getToothCondition(),
      toothFaceConditions: this.odontogramData.getToothFaceCondition()
    }).subscribe({
      next: ({ toothConditions, toothFaceConditions }) => {
        this.toolbar.options = [...toothConditions, ...toothFaceConditions];
        this.options = [...toothConditions, ...toothFaceConditions];
      },
      error: (err) => {
        console.error('Error al obtener datos:', err);
      }
    });
  }
  

  /**
   * Función invocada cuando cambia el valor del odontograma.
   * @param event Evento del cambio.
   * @param value Nuevo valor del odontograma.
   */
  handleChange(event: any, value: number) {
    this.value = value;
  }

  /**
   * Función invocada cuando se realiza una acción en un diente del odontograma.
   * @param cor Color del diente seleccionado.
   * @param nome Nombre del diente seleccionado.
   * @param all Información adicional sobre el diente seleccionado.
   */
  handleAction(event: any): void {
    const { description, condition, idCondition } = event;
    this.marked = {
      idCondition: idCondition,
      condition: condition,
      description: description,
    };
  }

  /**
   * Función para cambiar el estado de un diente (marcado/desmarcado).
   * @param data Información del diente.
   */
  toggleTooth(data: any) {
    data.status = !data.status;
  }

  /**
   * Función para configurar la cara del estudiante según el diente seleccionado.
   * @param event Información del evento que contiene información del diente
   */
  setFace(event: { faceId: string; index: number; tooth: ITooth }) {
    const { index, tooth, faceId } = event;

    //se verifica que el la condicion se inserte a nivel del diente o de las caras
    if (this.isNotAFaceCondition(this.marked)) {
      tooth.conditions?.push(this.marked);
      this.addConditionToTooth(tooth.idTooth, this.marked.idCondition);
    } else {
      tooth.faces[index].conditions?.push(this.marked);
      this.addConditionToFace(tooth.idTooth, faceId, this.marked.idCondition);
    }

    if (this.marked.condition === ToothConditionsConstants.PUENTE) {
      this.addConditionToFace(tooth.idTooth, faceId, this.marked.idCondition);
      tooth.faces[index].conditions?.push(this.marked);
    }

    console.log('emiting faces data: ', this.odontogram);
  }

  isNotAFaceCondition(condition: ICondition): Boolean {
    const normalConditions = [
      ToothConditionsConstants.DIENTE_EN_MAL_POSICION_DERECHA,
      ToothConditionsConstants.DIENTE_EN_MAL_POSICION_IZQUIERDA,
      ToothConditionsConstants.PUENTE,
      ToothConditionsConstants.PROTESIS_REMOVIBLE,
      ToothConditionsConstants.DIENTE_CON_FLUOROSIS,
      ToothConditionsConstants.DIENTE_CON_HIPOPLASIA,
      ToothConditionsConstants.FISTULA,
    ];
    return normalConditions.includes(condition.condition);
  }

  @Output() nextTabEventEmitted = new EventEmitter<boolean>();
  emitNextTabEvent() {
      this.nextTabEventEmitted.emit(false);
  }
  
  @Output() nextMatTab = new EventEmitter<number>();
  nextTab() {
    this.nextMatTab.emit(0);
  }
  store() {
    this.nextTab();
    this.emitNextTabEvent();
  }

  addConditionToTooth(toothId: number, conditionId: number) {
    // Buscar el diente correspondiente
    let tooth = this.odontogram.tooths.find((t) => t.idTooth === toothId);

    // Si el diente no existe, lo creamos
    if (!tooth) {
      tooth = { idTooth: toothId, conditions: [], faces: [], status: true };
      this.odontogram.tooths.push(tooth);
      console.log(`Tooth with id ${toothId} created`);
    }

    // Verificar si la condición ya está presente en el diente
    const existingCondition = tooth.conditions?.find(
      (c) => c.idCondition === conditionId
    );

    if (!existingCondition) {
      const condition = this.options.find((c) => c.idCondition === conditionId);
      if (condition) {
        tooth.conditions.push(condition); // Agregar condición al diente
      }
    } else {
      console.log('Condition already exists in the tooth');
    }
  }

  addConditionToFace(toothId: number, faceId: string, conditionId: number) {
    // Buscar el diente correspondiente
    let tooth = this.odontogram.tooths.find((t) => t.idTooth === toothId);

    // Si el diente no existe, lo creamos
    if (!tooth) {
      tooth = { idTooth: toothId, conditions: [], faces: [], status: true };
      this.odontogram.tooths.push(tooth);
      console.log(`Tooth with id ${toothId} created`);
    }

    // Buscar la cara correspondiente en el diente
    let face = tooth.faces.find((f) => f.idFace === faceId);

    // Si la cara no existe, la creamos
    if (!face) {
      face = { idFace: faceId };
      tooth.faces.push({ ...face, conditions: [] });
      face = tooth.faces.find((f) => f.idFace === faceId); // Actualizar la referencia a la nueva cara
    }

    // Verificar si la condición ya está presente en la cara
    const existingCondition = face?.conditions?.find(
      (c) => c.idCondition === conditionId
    );

    if (!existingCondition) {
      // Obtener el catálogo de condiciones del backend
      this.odontogramData.getToothCondition().subscribe((options) => {
        const condition = options.find((c) => c.idCondition === conditionId);
        if (condition) {
          // Inicializar la lista de condiciones si es undefined
          face!.conditions = face!.conditions || [];
          face!.conditions.push(condition); // Agregar la condición a la cara
        }
      });
    } else {
      console.log('Condition already exists in the face');
    }
  }
}
