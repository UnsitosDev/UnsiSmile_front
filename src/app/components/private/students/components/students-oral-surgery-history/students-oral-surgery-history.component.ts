import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { HistoryIdentificationFileComponent } from './history-identification-file/history-identification-file.component';
import { HistoryVitalSingsComponent } from './history-vital-sings/history-vital-sings.component';
import { HistoryFamilyHistoryComponent } from './history-family-history/history-family-history.component';
import { HistoryInterrogationDivicesSystemsComponent } from './history-interrogation-divices-systems/history-interrogation-divices-systems.component';
import { HistoryCurrentConditionComponent } from './history-current-condition/history-current-condition.component';

@Component({
  selector: 'app-students-oral-surgery-history',
  standalone: true,
  imports: [MatTabsModule, HistoryIdentificationFileComponent, HistoryVitalSingsComponent,
    HistoryFamilyHistoryComponent,HistoryInterrogationDivicesSystemsComponent,HistoryCurrentConditionComponent],
  templateUrl: './students-oral-surgery-history.component.html',
  styleUrl: './students-oral-surgery-history.component.scss'
})
export class StudentsOralSurgeryHistoryComponent {

}
