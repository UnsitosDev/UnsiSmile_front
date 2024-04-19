import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-students-toolbar',
  standalone: true,
  imports: [
    NgFor
  ],
  templateUrl: './students-toolbar.component.html',
  styleUrl: './students-toolbar.component.scss'
})
export class StudentsToolbarComponent {
  @Input() toolbar: any;
  @Output() handleAction = new EventEmitter<any>();

  constructor() {}

  // No es necesario especificar "render" en Angular, ya que Angular maneja la actualización del DOM.

//   onButtonClicked(item: any): void {
//     this.handleAction.emit({ cor: item.cor, nome: item.nome, icon: item.icon, all:item.all });
//     console.log('item:', item);
// } 

onButtonClicked(item: any): void {
  if (item.all && item.all === true) {
    // Emitir un evento para indicar que se debe pintar todo el diente
    this.handleAction.emit({ all: true });
  } else {
    // Emitir un evento con los datos de la opción seleccionada
    this.handleAction.emit({ cor: item.cor, nome: item.nome, icon: item.icon, all: false });
  }
  console.log('item:', item);
}



}
