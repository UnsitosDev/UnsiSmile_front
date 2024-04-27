import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { HistoryIdComponent } from './history-id/history-id.component';
import { HistoryVitalSingsComponent } from './history-vital-sings/history-vital-sings.component';
import { HistoryInterrogationComponent } from './history-interrogation/history-interrogation.component';
import { HistoryPerodontalExamComponent } from './history-perodontal-exam/history-perodontal-exam.component';
import { HistoryExplorationOralComponent } from './history-exploration-oral/history-exploration-oral.component';
import { HistoryTreatmentPlanComponent } from './history-treatment-plan/history-treatment-plan.component';
import { ReceiptComponent } from './receipt/receipt.component';
import { TeethImageComponent } from './teeth-image/teeth-image.component';

@Component({
  selector: 'app-students-periodontics-history',
  standalone: true,
  imports: [HistoryIdComponent,MatTabsModule,
    HistoryVitalSingsComponent, HistoryInterrogationComponent
    ,HistoryPerodontalExamComponent,HistoryExplorationOralComponent,
    HistoryTreatmentPlanComponent,ReceiptComponent, TeethImageComponent
  ],
  templateUrl: './students-periodontics-history.component.html',
  styleUrl: './students-periodontics-history.component.scss'
})
export class StudentsPeriodonticsHistoryComponent {

}
