import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { CardPatientDataComponent } from "../../components/card-patient-data/card-patient-data.component";
import { ActivatedRoute } from '@angular/router';
import { PATIENT_UUID } from 'src/app/models/shared/route.params.model';

@Component({
  selector: 'app-treatments',
  standalone: true,
  imports: [MatTabsModule, MatCardModule, CardPatientDataComponent],
  templateUrl: './treatments.component.html',
  styleUrl: './treatments.component.scss'
})
export class TreatmentsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  public patientUuid!: string;
  private medicalRecordLoaded = false;
  private isLoading = false;
  medicalRecordData: any = null;

  ngOnInit(): void {
    this.routeParams();
  }

  routeParams() {
    this.route.params.subscribe((params) => {
      this.patientUuid = params[PATIENT_UUID];
    });
  }

  onTabChanged(event: any) {
    if (event.index === 1) {
      if (!this.medicalRecordLoaded) {
        this.getMedicalRecordGeneral();
      }
    }
  }

  getMedicalRecordGeneral() {
    if (this.medicalRecordLoaded) {
      return;
    }

    this.isLoading = true;

    // Simulación de petición HTTP 
    setTimeout(() => {
      // petición HTTP simulada

      this.medicalRecordData = { /* datos simulados */ };
      this.medicalRecordLoaded = true;
      this.isLoading = false;
      console.log('Datos obtenidos:', this.medicalRecordData);
    }, 1500);
  }

}
