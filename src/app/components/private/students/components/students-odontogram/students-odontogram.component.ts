import { MatTabsModule } from '@angular/material/tabs';
import { Component } from '@angular/core';
import { StudentsToothComponent } from '../students-tooth/students-tooth.component';
import { NgFor, NgIf } from '@angular/common';
import { StudentsToolbarComponent } from '../students-odontogram-toolbar/students-toolbar.component';
import { store } from '@mean/services';

@Component({
  selector: 'app-students-odontogram',
  standalone: true,
  imports: [
    StudentsToothComponent,
    NgIf,
    NgFor,
    StudentsToolbarComponent,
    StudentsToolbarComponent,
    MatTabsModule,
  ],
  templateUrl: './students-odontogram.component.html',
  styleUrl: './students-odontogram.component.scss',
})
export class StudentsOdontogramComponent {
  arcada = {
    adulto: store.arcada.adulto, // Utiliza el servicio para obtener los datos
    infantil: store.arcada.infantil, // Utiliza el servicio para obtener los datos
  };

  data = store;

  toolbar: { opcoes: any } = { opcoes: store.toolbar.opcoes }; // Utiliza el servicio para obtener los datos
  marked: { selecionado: string; cor: string } = { selecionado: '', cor: '' };
  value = 0;

  constructor() {} // Inyecta el servicio en el constructor

  handleChange(event: any, value: number) {
    this.value = value;
  }

  handleAction(cor: string, nome: string): void {
    this.marked = { selecionado: nome, cor };
  }

  toggleTooth(data: any) {
    data.status = !data.status;
  }

  setFace(event: any) {
    const { faceId, index, data } = event;
    const acao = this.marked.cor;
    data.faces[index].estado = acao;
  }
}
