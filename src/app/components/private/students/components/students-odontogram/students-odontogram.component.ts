import { Component, EventEmitter, Output } from '@angular/core';
import { StudentsToothComponent } from '../students-tooth/students-tooth.component';

import { OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { store } from '@mean/services';
import { ICondition, ITooth } from 'src/app/models/shared/odontogram';
import { OdontogramData } from 'src/app/services/odontogram-data.service';
import { StudentsToolbarComponent } from '../students-odontogram-toolbar/students-toolbar.component';
import { ToothConditionsConstants } from 'src/app/utils/ToothConditions.constant';
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
  //define la estructura de una arcada (odontograma)
  arcadaAdulto = store.adultArcade;
  arcadaInfantil = store.childrenArcade;

  data = store;

  toolbar!: { options: ICondition[] }; // Utiliza el servicio para obtener los datos

  marked!: ICondition;
  value = 0;

  constructor() {}

  private odontogramData = inject(OdontogramData);

  ngOnInit() {
    this.odontogramData.getToothCondition().subscribe((options) => {
      console.log('options: ', options);
      this.toolbar = { options: options };
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
  setFace(event: {faceId: number, index: number, data: ITooth}) {
    const { index, data } = event;

    //se verifica que el la condicion se inserte a nivel del diente o de las caras
    if(this.isNotAFaceCondition(this.marked)){
      data.conditions?.push(this.marked);
    }else{
      data.faces[index].conditions?.push(this.marked);
    }

    if(this.marked.condition === ToothConditionsConstants.PUENTE){
      data.faces[index].conditions?.push(this.marked);
    }


    console.log("checking marked: ", this.marked, " data:  ", data);
  }

  isNotAFaceCondition(condition: ICondition): Boolean{
    const normalConditions = [
      ToothConditionsConstants.DIENTE_EN_MAL_POSICION_DERECHA,
      ToothConditionsConstants.DIENTE_EN_MAL_POSICION_IZQUIERDA,
      ToothConditionsConstants.PUENTE,
      ToothConditionsConstants.PROTESIS_REMOVIBLE,
      ToothConditionsConstants.DIENTE_CON_FLUOROSIS,
      ToothConditionsConstants.DIENTE_CON_HIPOPLASIA
    ];
    return normalConditions.includes(condition.condition);
  }

  sendData() {
    this.emitirEvento();
    this.irSiguienteTab();
  }

  @Output() eventoEmitido = new EventEmitter<boolean>();
  pageNumber: number = 1;
  emitirEvento() {
    this.eventoEmitido.emit(false);
    console.log(false);
  }
  @Output() cambiarTab = new EventEmitter<number>();
  irSiguienteTab() {
    this.cambiarTab.emit(0);
  }
  store() {
    console.log(this.data);
  }
}
