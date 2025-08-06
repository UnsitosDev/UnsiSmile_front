import { Component } from '@angular/core';
import { MedicalRecordBaseComponent } from '../medical-record-base-component/medical-record-base-component.component';
import { EMedicalRecords } from 'src/app/shared/models';
import { MatInputModule } from '@angular/material/input';
import { TabFormComponent } from 'src/app/shared/components/tab-form/tab-form.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { TabViewModule } from 'primeng/tabview';
import { TabFormUpdateComponent } from 'src/app/shared/components/tab-form-update/tab-form-update.component';
import { HeaderHistoryClinicComponent } from '../../../components/header-history-clinic/header-history-clinic.component';

@Component({
  selector: 'app-endodontic-medical-record',
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
  templateUrl: './endodontic-medical-record.component.html',
  styleUrl: './endodontic-medical-record.component.scss'
})
export class EndodonticMedicalRecordComponent extends MedicalRecordBaseComponent {
  constructor() {
    super();
  }

  protected getMedicalRecordType(): EMedicalRecords {
    return EMedicalRecords.ENDODONCIA;
  }
}
