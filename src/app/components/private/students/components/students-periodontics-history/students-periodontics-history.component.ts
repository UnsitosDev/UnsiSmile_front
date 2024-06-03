import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ReceiptComponent } from './receipt/receipt.component';
import { TeethImageComponent } from './teeth-image/teeth-image.component';
import { ExplorationOralComponent } from './exploration-oral/exploration-oral.component';
import { IdentificationFileComponent } from './identification-file/identification-file.component';
import { InterrogationComponent } from './interrogation/interrogation.component';
import { PerodontalExamComponent } from './perodontal-exam/perodontal-exam.component';
import { TreatmentPlanComponent } from './treatment-plan/treatment-plan.component';
import { VitalSingsComponent } from './vital-sings/vital-sings.component';

@Component({
  selector: 'app-students-periodontics-history',
  standalone: true,
  imports: [MatTabsModule,ReceiptComponent, TeethImageComponent,ExplorationOralComponent,
    IdentificationFileComponent,InterrogationComponent, PerodontalExamComponent, TreatmentPlanComponent,
    VitalSingsComponent],
  templateUrl: './students-periodontics-history.component.html',
  styleUrl: './students-periodontics-history.component.scss'
})
export class StudentsPeriodonticsHistoryComponent {

}
