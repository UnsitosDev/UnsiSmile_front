import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { TabViewModule } from 'primeng/tabview';

// Componentes
import { TabFormComponent } from 'src/app/shared/components/tab-form/tab-form.component';

// Servicios

// Modelos
import { EMedicalRecords } from 'src/app/shared/models';
import { TabFormUpdateComponent } from '../../../../../../shared/components/tab-form-update/tab-form-update.component';
import { FluorosisComponent } from '../../../components/fluorosis/fluorosis.component';
import { HeaderHistoryClinicComponent } from '../../../components/header-history-clinic/header-history-clinic.component';
import { ProfilaxisComponent } from '../../../components/profilaxis/profilaxis.component';
import { MedicalRecordBaseComponent } from '../medical-record-base-component/medical-record-base-component.component';

@Component({
  selector: 'app-preventive-dentistry-public-health',
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
    ProfilaxisComponent,
    HeaderHistoryClinicComponent,
    FluorosisComponent,
  ],
  templateUrl: './preventive-dentistry-public-health.component.html',
  styleUrl: './preventive-dentistry-public-health.component.scss',
})
export class PreventiveDentistryPublicHealthComponent extends MedicalRecordBaseComponent {
  constructor() {
    super();
  }

  protected getMedicalRecordType(): EMedicalRecords {
    return EMedicalRecords.ODONTOLOGIA_PREVENTIVA;
  }
}
