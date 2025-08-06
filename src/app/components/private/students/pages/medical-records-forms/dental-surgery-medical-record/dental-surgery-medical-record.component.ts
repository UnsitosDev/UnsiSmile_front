import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { EMedicalRecords } from 'src/app/shared/models';
import { TabViewModule } from 'primeng/tabview';
import { TabFormUpdateComponent } from 'src/app/shared/components/tab-form-update/tab-form-update.component';
import { TabFormComponent } from 'src/app/shared/components/tab-form/tab-form.component';
import { HeaderHistoryClinicComponent } from '../../../components/header-history-clinic/header-history-clinic.component';
import { MedicalRecordBaseComponent } from '../medical-record-base-component/medical-record-base-component.component';

@Component({
  selector: 'app-dental-surgery-medical-record',
  standalone: true,
  imports: [
    MatInputModule,
    TabFormComponent,
    MatTabsModule,
    MatDialogModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    TabViewModule,
    TabFormUpdateComponent,
    HeaderHistoryClinicComponent,
  ], 
  templateUrl: './dental-surgery-medical-record.component.html',
  styleUrl: './dental-surgery-medical-record.component.scss'
})
export class DentalSurgeryMedicalRecordComponent extends MedicalRecordBaseComponent {
  constructor() {
    super();
  }

  protected getMedicalRecordType(): EMedicalRecords {
    return EMedicalRecords.OPERATORIA_DENTAL;
  }
}
