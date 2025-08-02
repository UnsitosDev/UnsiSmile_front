import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { TabViewModule } from 'primeng/tabview';

// Componentes
import { TabFormComponent } from 'src/app/shared/components/tab-form/tab-form.component';
import { CardPatientDataComponent } from '../../../components/card-patient-data/card-patient-data.component';

// Servicios

// Modelos
import { EMedicalRecords } from 'src/app/models/history-clinic/medical-record.models';
import { TabFormUpdateComponent } from '../../../../../../shared/components/tab-form-update/tab-form-update.component';
import { HeaderHistoryClinicComponent } from '../../../components/header-history-clinic/header-history-clinic.component';
import { MedicalRecordBaseComponent } from '../medical-record-base-component/medical-record-base-component.component';

@Component({
  selector: 'app-oral-prosthesis',
  standalone: true,
  imports: [
    MatInputModule,
    TabFormComponent,
    MatTabsModule,
    MatDialogModule,
    MatTabsModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    TabViewModule,
    TabFormUpdateComponent,
    HeaderHistoryClinicComponent,
  ],
  templateUrl: './oral-prosthesis.component.html',
  styleUrl: './oral-prosthesis.component.scss',
})
export class OralProsthesisComponent extends MedicalRecordBaseComponent {
  constructor(
  ) {
    super();
  }

  protected getMedicalRecordType(): EMedicalRecords {
    return EMedicalRecords.PROTESIS_BUCAL;
  }
}