import { Component, EventEmitter, Output } from '@angular/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-family-history',
  standalone: true,
  imports: [MatButtonModule,MatCheckboxModule],
  templateUrl: './family-history.component.html',
  styleUrl: './family-history.component.scss'
})
export class FamilyHistoryComponent {
  
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
