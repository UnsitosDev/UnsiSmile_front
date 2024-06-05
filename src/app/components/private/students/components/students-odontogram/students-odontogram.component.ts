import { MatTabsModule } from '@angular/material/tabs';
import { Component, EventEmitter, Output } from '@angular/core';
import { StudentsToothComponent } from '../students-tooth/students-tooth.component';
import { NgFor, NgIf } from '@angular/common';
import { StudentsToolbarComponent } from '../students-odontogram-toolbar/students-toolbar.component';
import { store } from '@mean/services';
import { MatButtonModule } from '@angular/material/button';
import { all } from 'axios';

@Component({
  selector: 'app-students-odontogram',
  standalone: true,
  imports: [
    StudentsToothComponent,
    NgIf,
    NgFor,
    StudentsToolbarComponent,
    StudentsToolbarComponent,
    MatTabsModule,
    MatButtonModule,
  ],
  templateUrl: './students-odontogram.component.html',
  styleUrl: './students-odontogram.component.scss',
})
export class StudentsOdontogramComponent {
  arcada = {
    adulto: store.arcada.adulto, // Utiliza el servicio para obtener los datos
    infantil: store.arcada.infantil, // Utiliza el servicio para obtener los datos
  };

  data = store;

  toolbar: { opcoes: any } = { opcoes: store.toolbar.opcoes }; // Utiliza el servicio para obtener los datos
  marked: { selecionado: string; cor: string; all: any } = {
    selecionado: '',
    cor: '',
    all: '',
  };
  value = 0;

  constructor() {} // Inyecta el servicio en el constructor

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
  handleAction(cor: string, nome: string, all: string): void {
    this.marked = { selecionado: nome, cor, all };
    //console.log('marked', this.marked);
    this.paintAll = all;
    //console.log('all', this.paintAll);
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
    const { faceId, index, data } = event;
    const acao = this.marked.cor;
    data.faces[index].estado = acao;
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
}
