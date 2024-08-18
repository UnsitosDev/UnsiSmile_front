import { Component, ViewChild } from '@angular/core';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { ExplorationOralCavityComponent } from '../../../components/form-exploration-oral-cavity/exploration-oral-cavity.component';
import { IdentificationFileComponent } from '../../../components/form-identification-file/identification-file.component';
import { InterrogationComponent } from '../../../components/form-interrogation/interrogation.component';
import { PathologicalHistoryComponent } from '../../../components/form-pathological-history/pathological-history.component';
import { VitalSingsComponent } from '../../../components/form-vital-sings/vital-sings.component';

@Component({
  selector: 'app-students-dental-operation',
  standalone: true,
  imports: [ExplorationOralCavityComponent, IdentificationFileComponent, InterrogationComponent
    ,PathologicalHistoryComponent,VitalSingsComponent,MatTabsModule],
  templateUrl: './students-dental-operation.component.html',
  styleUrl: './students-dental-operation.component.scss'
})
export class StudentsDentalOperationComponent {

  vitalSigns = true;
  interrogation = true;
  pathologicalHistory = true;
  currentCondition = true;
  explorationOral= true;
  identificationFile = true;




  vitalSignsEvent(evento: boolean) {
    this.vitalSigns = evento;
  }

  interrogationEvent(evento: boolean) {
    this.interrogation = evento;
  }

  pathologicalHistoryEvent(evento: boolean) {
    this.pathologicalHistory = evento;
  }

  explorationOralEvent(evento: boolean) {
    this.explorationOral = evento;
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
