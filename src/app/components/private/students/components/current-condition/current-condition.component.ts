import { Component, EventEmitter, Output } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-current-condition',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, MatButtonModule],
  templateUrl: './current-condition.component.html',
  styleUrl: './current-condition.component.scss'
})
export class CurrentConditionComponent {
  
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
