import { Component, EventEmitter, Output } from '@angular/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-pathological-history',
  standalone: true,
  imports: [MatCheckboxModule, MatButtonModule],
  templateUrl: './pathological-history.component.html',
  styleUrl: './pathological-history.component.scss'
})
export class PathologicalHistoryComponent {

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
