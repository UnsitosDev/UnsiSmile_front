import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { HistoryPersonalDataComponent } from "./history-personal-data/history-personal-data.component";
import { HistoryVitalSignsComponent } from "./history-vital-signs/history-vital-signs.component";

@Component({
    selector: 'app-students-general-history',
    standalone: true,
    templateUrl: './students-general-history.component.html',
    styleUrl: './students-general-history.component.scss',
    imports: [MatTabsModule, HistoryPersonalDataComponent, HistoryVitalSignsComponent]
})
export class StudentsGeneralHistoryComponent {}
