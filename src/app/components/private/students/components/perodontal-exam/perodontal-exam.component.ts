import { Component, EventEmitter, Output } from '@angular/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-perodontal-exam',
  standalone: true,
  imports: [MatCheckboxModule, MatButtonModule],
  templateUrl: './perodontal-exam.component.html',
  styleUrl: './perodontal-exam.component.scss'
})
export class PerodontalExamComponent {
  
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
