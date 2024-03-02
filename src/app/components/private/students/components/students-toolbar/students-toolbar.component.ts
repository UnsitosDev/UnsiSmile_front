import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-students-toolbar',
  standalone: true,
  imports: [
    NgFor
  ],
  templateUrl: './students-toolbar.component.html',
  styleUrl: './students-toolbar.component.css'
})
export class StudentsToolbarComponent {
  @Input() toolbar: any;
  @Output() handleAction = new EventEmitter<any>();

  constructor() {}

  // No es necesario especificar "render" en Angular, ya que Angular maneja la actualización del DOM.

  onButtonClicked(item: any): void {
    this.handleAction.emit({ cor: item.cor, nome: item.nome });
  }
}
