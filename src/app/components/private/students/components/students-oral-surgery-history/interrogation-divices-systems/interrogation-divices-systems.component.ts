import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-interrogation-divices-systems',
  standalone: true,
  imports: [],
  templateUrl: './interrogation-divices-systems.component.html',
  styleUrl: './interrogation-divices-systems.component.scss'
})
export class InterrogationDivicesSystemsComponent {
  
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

  nextPage() {
    this.emitirEvento();
    this.irSiguienteTab();
  }

}
