import { vitalSignRequest } from '../../../../../models/shared/patients/vitalSigns/vitalSign';

import { HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-history-vital-signs',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule
],
  templateUrl: './history-vital-signs.component.html',
  styleUrl: './history-vital-signs.component.scss',
})
export class HistoryVitalSignsComponent implements OnInit {
  vitalSings = false;
  private apiService = inject(ApiService);
  item: any;

  constructor() {}

  ngOnInit(): void {}

  idVitalSigns: number = 0;
  weight: number = 0;
  height: number = 0;
  temperature: number = 0;
  heartRate: number = 0;
  respiratoryRate: number = 0;
  bloodPressure: number = 0;
  oxygenSaturation: number = 0;
  glucose: number = 0;
  pulse: number = 0;
  postVitalSigns() {
    const vitalSigns = {
      idVitalSigns: this.idVitalSigns,
      weight: this.weight,
      height: this.height,
      temperature: this.temperature,
      heartRate: this.heartRate,
      respiratoryRate: this.respiratoryRate,
      bloodPressure: this.bloodPressure,
      oxygenSaturation: this.oxygenSaturation,
      glucose: this.glucose,
      pulse: this.pulse,
    };

    this.emitirEvento();
    this.irSiguienteTab();

    console.log(vitalSigns);
    this.apiService
      .postService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.POST_VITAL_SIGNS}`,
        data: vitalSigns,
      })
      .subscribe({
        next: (response) => {
          console.log('post');
        },
        error: (error) => {
          console.error('Error en la autenticación:', error);
        },
      });
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
