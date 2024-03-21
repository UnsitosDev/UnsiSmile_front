import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Accion } from 'src/app/models/tabla/tabla-columna';

@Component({
  selector: 'app-tabla-data',
  standalone: true,
  imports: [],
  templateUrl: './tabla-data.component.html',
  styleUrl: './tabla-data.component.scss'
})
export class TablaDataComponent {

  
  title = '';
  columnas: string[] = [];
  dataSource: any = [];


  @Input() set titulo(title: any) {
    this.title = title;
  }

  @Input() set columns(columns: string[]) {
    this.columnas = columns;
  }

  @Input() set data(data: any) {
    this.dataSource = data;
  }

  // Que data va a fluir?, añadir el Json y las interfaces, ya ahí añadir el action
  // Implementar el Accion

  @Output() action: EventEmitter<Accion> = new EventEmitter();

  onAction(accion: string, row?: any) {
    this.action.emit({ accion: accion, fila: row });
  }


}
