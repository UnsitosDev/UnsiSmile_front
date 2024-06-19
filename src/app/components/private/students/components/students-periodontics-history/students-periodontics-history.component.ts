import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ExplorationOralComponent } from './exploration-oral/exploration-oral.component';
import { IdentificationFileComponent } from './identification-file/identification-file.component';
import { InterrogationComponent } from './interrogation/interrogation.component';
import { PerodontalExamComponent } from './perodontal-exam/perodontal-exam.component';
import { TreatmentPlanComponent } from './treatment-plan/treatment-plan.component';
import { VitalSingsComponent } from './vital-sings/vital-sings.component';
import { EvaluacionPerodonciaComponent } from './periodontic-evaluation/periodontic-evaluation.component';

@Component({
  selector: 'app-students-periodontics-history',
  standalone: true,
  imports: [MatTabsModule,ExplorationOralComponent,
    IdentificationFileComponent,InterrogationComponent, PerodontalExamComponent, TreatmentPlanComponent,
    VitalSingsComponent,EvaluacionPerodonciaComponent],
  templateUrl: './students-periodontics-history.component.html',
  styleUrl: './students-periodontics-history.component.scss'
})
export class StudentsPeriodonticsHistoryComponent {

}
