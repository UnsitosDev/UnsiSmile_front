import { NgFor } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
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
    NgFor,
    MatButtonModule,
    ReactiveFormsModule 
  ],
  templateUrl: './history-vital-signs.component.html',
  styleUrl: './history-vital-signs.component.scss'
})
export class HistoryVitalSignsComponent {
  // Formulario
  formVitalSigns: FormGroup;
  private apiService = inject(ApiService);

  constructor(
    private fb: FormBuilder
  ){
    this.formVitalSigns = this.fb.group({
      idVitalSigns: [0],
      weight:[],
      height:[],
      temperature:[],
      heartRate:[],
      respiratoryRate:[],
      bloodPressure:[],
      oxygenSaturation:[],
      glucose:[],
      pulse:[]
    })
  }

  postVitalSigns() {

    const vitalSigns = {
      idVitalSigns: this.formVitalSigns.get('idVitalSigns')?.value,
      weight: this.formVitalSigns.get('weight')?.value,
      height: this.formVitalSigns.get('height')?.value,
      temperature: this.formVitalSigns.get('temperature')?.value,
      heartRate: this.formVitalSigns.get('heartRate')?.value,
      respiratoryRate: this.formVitalSigns.get('respiratoryRate')?.value,
      bloodPressure: this.formVitalSigns.get('bloodPressure')?.value,
      oxygenSaturation: this.formVitalSigns.get('oxygenSaturation')?.value,
      glucose: this.formVitalSigns.get('glucose')?.value,
      pulse: this.formVitalSigns.get('pulse')?.value
    };

    console.log(vitalSigns);

    // this.apiService
    //   .postService({
    //     headers: new HttpHeaders({
    //       'Content-Type': 'application/json',
    //     }),
    //     url: `${UriConstants.POST_VITAL_SIGNS}`,
    //     data: {},
    //   })
    //   .subscribe({
    //     next: (response) => {


    //     },
    //     error: (error) => {
    //       console.error('Error en la autenticación:', error);
    //     },
    //   });
  }


}
