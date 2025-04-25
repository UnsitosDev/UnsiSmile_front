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

  ngOnInit(): void {
    this.routeParams();
  }

  routeParams() {
    this.route.params.subscribe((params) => {
      this.patientUuid = params[PATIENT_UUID];
    });
  }

}
