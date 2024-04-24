import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-students-toolbar',
  standalone: true,
  imports: [NgFor],
  templateUrl: './students-toolbar.component.html',
  styleUrl: './students-toolbar.component.scss',
})
export class StudentsToolbarComponent {
  @Input() toolbar: any;
  @Output() handleAction = new EventEmitter<any>();

  constructor() {}

  /**
   * Función invocada cuando se hace clic en un botón de la barra de herramientas.
   * Emite un evento handleAction con información sobre el botón clickeado.
   * @param item Objeto que representa el botón clickeado.
   */
  onButtonClicked(item: any): void {
    // Se emite un evento handleAction con información sobre el botón clickeado.
    this.handleAction.emit({cor: item.cor, nome: item.nome, icon: item.icon, all: item.all,});

    // Se imprime información del botón en la consola.
    //console.log('item:', item);
  }
}
