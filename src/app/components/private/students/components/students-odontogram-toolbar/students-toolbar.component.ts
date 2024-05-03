import { toothOptions, uiTooth } from './../../../../../models/shared/store';
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
  onButtonClicked(item: toothOptions): void {
    // Se emite un evento handleAction con información sobre el botón clickeado.
    this.handleAction.emit({cor: item.uiTooth.cor, nome: item.nome, icon: item.uiTooth.icon, all: item.uiTooth.all, idCondition: item.idCondition});
  }
}
