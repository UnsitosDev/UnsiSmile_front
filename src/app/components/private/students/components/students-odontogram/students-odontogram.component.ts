import { Component, EventEmitter, Output } from '@angular/core';
import { StudentsToothComponent } from '../students-tooth/students-tooth.component';
import { IArcada } from './../../../../../models/shared/store';

import { OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { store } from '@mean/services';
import { ICondition } from 'src/app/models/shared/odontogram';
import { OdontogramData } from 'src/app/services/odontogram-data.service';
import { StudentsToolbarComponent } from '../students-odontogram-toolbar/students-toolbar.component';
@Component({
  selector: 'app-students-odontogram',
  standalone: true,
  imports: [
    StudentsToothComponent,
    StudentsToolbarComponent,
    MatTabsModule,
    MatButtonModule
],
  templateUrl: './students-odontogram.component.html',
  styleUrl: './students-odontogram.component.scss',
})
export class StudentsOdontogramComponent implements OnInit {
  
  //define la estructura de una arcada (odontograma)
  arcada: IArcada = store.arcada;

  data = store;

  toolbar!: { options: ICondition[] }; // Utiliza el servicio para obtener los datos
  
  marked: { selecionado: string; cor: string, idCondition: number } = {
    selecionado: '',
    cor: '',
    idCondition:0
  };
  value = 0;

  constructor() {}

  private odontogramData = inject(OdontogramData);

  ngOnInit() {
    this.odontogramData.getToothCondition().subscribe(options => {
      console.log("options: ",options);
      this.toolbar ={options: options} 
    });

    this.odontogramData.getDentalCodesOfAdults().subscribe(dentalCodes => {
      console.log("ADentalCodes ", dentalCodes);
      this.arcada.adulto = dentalCodes;
    });

    this.odontogramData.getDentalCodesOfChilds().subscribe(dentalCodes => {
      console.log("iDentalCodes", dentalCodes)
      this.arcada.infantil = dentalCodes;
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

  paintAll: string = '';

  /**
   * Función invocada cuando se realiza una acción en un diente del odontograma.
   * @param cor Color del diente seleccionado.
   * @param nome Nombre del diente seleccionado.
   * @param all Información adicional sobre el diente seleccionado.
   */
  handleAction(event: any): void {
    const {  nome, cor, idCondition } = event;
    this.marked = { selecionado: nome, cor: cor , idCondition: idCondition};
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
   * @param event Información del evento que contiene el ID del diente, su índice y los datos del estudiante.
   */
  setFace(event: any) {
    const {  index, data } = event;
    const acao = this.marked.cor;
    data.faces[index].estado = acao;
    data.faces[index].idCondition = this.marked.idCondition;
    const color = this.marked.cor;
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
