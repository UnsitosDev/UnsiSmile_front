import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { CurrentConditionComponent } from './current-condition/current-condition.component';
import { FamilyHistoryComponent } from './family-history/family-history.component';
import { IdentificationFileComponent } from './identification-file/identification-file.component';
import { InterrogationDivicesSystemsComponent } from './interrogation-divices-systems/interrogation-divices-systems.component';
import { VitalSingsComponent } from './vital-sings/vital-sings.component';

@Component({
  selector: 'app-students-oral-surgery-history',
  standalone: true,
  imports: [MatTabsModule, CurrentConditionComponent, FamilyHistoryComponent,IdentificationFileComponent
    ,InterrogationDivicesSystemsComponent,VitalSingsComponent],
  templateUrl: './students-oral-surgery-history.component.html',
  styleUrl: './students-oral-surgery-history.component.scss'
})
export class StudentsOralSurgeryHistoryComponent {

}
