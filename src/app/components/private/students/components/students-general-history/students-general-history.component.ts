import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { HistoryPersonalDataComponent } from "./history-personal-data/history-personal-data.component";
import { HistoryVitalSignsComponent } from "./history-vital-signs/history-vital-signs.component";
import { HistoryFacialExamComponent } from "./history-facial-exam/history-facial-exam.component";
import { HistoryFamilyHistoryComponent } from "./history-family-history/history-family-history.component";
import { NoPathologicalPersonalHistoryComponent } from "./no-pathological-personal-history/no-pathological-personal-history.component";

@Component({
    selector: 'app-students-general-history',
    standalone: true,
    templateUrl: './students-general-history.component.html',
    styleUrl: './students-general-history.component.scss',
    imports: [MatTabsModule, HistoryPersonalDataComponent, HistoryVitalSignsComponent, HistoryFacialExamComponent, HistoryFamilyHistoryComponent, NoPathologicalPersonalHistoryComponent]
})
export class StudentsGeneralHistoryComponent {}
