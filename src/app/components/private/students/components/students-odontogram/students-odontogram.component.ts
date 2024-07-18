import { tooth, IArcada } from './../../../../../models/shared/store';
import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { toothOptions } from '@mean/models';
import { ApiService, store } from '@mean/services';
import { OdontogramData } from 'src/app/services/odontogram-data.service';
import { dentalCodeResponse } from '../students-general-history/models/dentalCode/dentalCode';
import { toothConditionResponse } from '../students-general-history/models/toothCondition/toothCondition';
import { StudentsToolbarComponent } from '../students-odontogram-toolbar/students-toolbar.component';
import { StudentsToothComponent } from '../students-tooth/students-tooth.component';

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
    MatButtonModule,
  ],
  templateUrl: './students-odontogram.component.html',
  styleUrl: './students-odontogram.component.scss',
})
export class StudentsOdontogramComponent implements OnInit {
  
  //define la estructura de una arcada (odontograma)
  arcada: IArcada = store.arcada;

  data = store;

  toolbar!: { opcoes: toothOptions[] }; // Utiliza el servicio para obtener los datos
  
  marked: { selecionado: string; cor: string; all: any, idCondition: number } = {
    selecionado: '',
    cor: '',
    all: '',
    idCondition:0
  };
  value = 0;

  constructor() {}

  private dentalCodeService = inject(ApiService<dentalCodeResponse>);
  private tootConditionService = inject(ApiService<toothConditionResponse>);
  private odontogramData = inject(OdontogramData);

  ngOnInit() {
    this.odontogramData.getToothCondition().subscribe(options => {
      console.log(options);
      this.toolbar ={opcoes: options} 
    });

    this.odontogramData.getDentalCodesOfAdults().subscribe(dentalCodes => {
      console.log("ADentalCodes ", dentalCodes);
      this.arcada.adulto = dentalCodes;
    });

    this.odontogramData.getDentalCodesOfChilds().subscribe(dentalCodes => {
      console.log("iDentalCodes", dentalCodes)
      this.arcada.infantil = dentalCodes;
    });
  }


  /**
   * Función invocada cuando cambia el valor del odontograma.
   * @param event Evento del cambio.
   * @param value Nuevo valor del odontograma.
   */
  handleChange(event: any, value: number) {
    this.value = value;
  }

  paintAll: string = '';

  /**
   * Función invocada cuando se realiza una acción en un diente del odontograma.
   * @param cor Color del diente seleccionado.
   * @param nome Nombre del diente seleccionado.
   * @param all Información adicional sobre el diente seleccionado.
   */
  handleAction(cor: string, nome: string, all: string, idCondition: number): void {
    this.marked = { selecionado: nome, cor: cor, all : all , idCondition: idCondition};
    this.paintAll = all;
  }

  /**
   * Función para cambiar el estado de un diente (marcado/desmarcado).
   * @param data Información del diente.
   */
  toggleTooth(data: any) {
    data.status = !data.status;
  }

  /**
   * Función para configurar la cara del estudiante según el diente seleccionado.
   * @param event Información del evento que contiene el ID del diente, su índice y los datos del estudiante.
   */
  setFace(event: any) {
    const {  index, data } = event;
    const acao = this.marked.cor;
    data.faces[index].estado = acao;
    data.faces[index].idCondition = this.marked.idCondition;
    const color = this.marked.cor;
  }

  store() {
    console.log(this.data);
  }
}
