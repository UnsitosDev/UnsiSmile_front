import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ExplorationOralCavityComponent } from './exploration-oral-cavity/exploration-oral-cavity.component';
import { IdentificationFileComponent } from './identification-file/identification-file.component';
import { InterrogationComponent } from './interrogation/interrogation.component';
import { PathologicalHistoryComponent } from './pathological-history/pathological-history.component';
import { VitalSingsComponent } from './vital-sings/vital-sings.component';

@Component({
  selector: 'app-students-dental-operation',
  standalone: true,
  imports: [ExplorationOralCavityComponent, IdentificationFileComponent, InterrogationComponent
    ,PathologicalHistoryComponent,VitalSingsComponent,MatTabsModule],
  templateUrl: './students-dental-operation.component.html',
  styleUrl: './students-dental-operation.component.scss'
})
export class StudentsDentalOperationComponent {

}
