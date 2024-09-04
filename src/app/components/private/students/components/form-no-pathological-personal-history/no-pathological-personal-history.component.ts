import { Component, EventEmitter, Output } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-no-pathological-personal-history',
  standalone: true,
  imports: [MatCheckboxModule, MatButtonModule, MatInputModule, MatFormFieldModule, FormsModule],
  templateUrl: './no-pathological-personal-history.component.html',
  styleUrl: './no-pathological-personal-history.component.scss',
})
export class NoPathologicalPersonalHistoryComponent {
  sendData() {
    this.emitirEvento();
    this.irSiguienteTab();
  }

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
}
