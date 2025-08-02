import { Component } from '@angular/core';
import { MedicalRecordListComponent } from '../../components/medical-record-list/medical-record-list.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-medical-record-list-container',
  standalone: true,
  imports: [MedicalRecordListComponent],
  templateUrl: './medical-record.component.html'
})
export class MedicalRecordListContainerComponent {
  idPatient: string = '';

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.idPatient = params['idPatient'];
    });
  }
}
