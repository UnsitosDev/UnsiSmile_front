import { Component, ViewChild } from '@angular/core';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
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
  vitalSigns = true;
  interrogation = true;
  familyHistory = true;
  currentCondition = true;
  treatmentplan = true;
  identificationFile = true;




  vitalSignsEvent(evento: boolean) {
    this.vitalSigns = evento;
  }

  interrogationEvent(evento: boolean) {
    this.interrogation = evento;
  }

  familyHistoryEvent(evento: boolean) {
    this.familyHistory = evento;
  }

  treatmentplanEvent(evento: boolean) {
    this.treatmentplan = evento;
  }

  identificationFileEvent(evento: boolean) {
    this.identificationFile = evento;
  }

  currentConditionEvent(evento: boolean) {
    this.currentCondition = evento;
  }


  recibirTab(evento: number) {
    console.log('pagina recibida', evento);
    this.irSiguienteTab();
  }


  @ViewChild(MatTabGroup) tabGroup?: MatTabGroup;

  ngAfterViewInit() {
    this.tabGroup = this.tabGroup;
  }

  irSiguienteTab() {
    if (this.tabGroup) {
      this.tabGroup.selectedIndex = (this.tabGroup.selectedIndex ?? 0) + 1;
      console.log('tab', this.tabGroup.selectedIndex);
    }
  }
  nextpage: boolean = true;

}
