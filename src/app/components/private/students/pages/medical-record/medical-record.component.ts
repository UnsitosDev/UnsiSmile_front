import { Component } from '@angular/core';
import { MedicalRecordListComponent } from './medical-record-list/medical-record-list.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-medical-record',
  standalone: true,
  imports: [MedicalRecordListComponent],
  templateUrl: './medical-record.component.html',
  styleUrl: './medical-record.component.scss'
})
export class MedicalRecordComponent {
  idPatient: string = '';

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.idPatient = params['idPatient'];
    });
  }
}
