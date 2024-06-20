import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-treatment-plan',
  standalone: true,
  imports: [],
  templateUrl: './treatment-plan.component.html',
  styleUrl: './treatment-plan.component.scss'
})
export class TreatmentPlanComponent {
  
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
