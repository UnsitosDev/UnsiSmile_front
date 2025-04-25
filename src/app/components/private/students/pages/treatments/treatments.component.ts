import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { CardPatientDataComponent } from "../../components/card-patient-data/card-patient-data.component";
import { cardGuardian, cardPatient } from 'src/app/models/shared/patients/cardPatient';
import { ActivatedRoute } from '@angular/router';

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
  public patientData!: cardPatient;
  public guardianData: cardGuardian | null = null;

  ngOnInit(): void {
    this.routeParams();
  }

  routeParams() {
    this.route.params.subscribe((params) => {
      this.patientUuid = params['patientID'];
    });
  }

}
