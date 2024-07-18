import { Component, ViewChild } from '@angular/core';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
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
  vitalSigns = true;
  interrogation = true;
  perodontalExam = true;
  explorationOral = true;
  treatmentplan = true;
  periodonticEvaluation = true;




  vitalSignsEvent(evento: boolean) {
    this.vitalSigns = evento;
  }

  interrogationEvent(evento: boolean) {
    this.interrogation = evento;
  }

  perodontalExamEvent(evento: boolean) {
    this.perodontalExam = evento;
  }

  treatmentplanEvent(evento: boolean) {
    this.treatmentplan = evento;
  }

  periodonticEvaluationEvent(evento: boolean) {
    this.periodonticEvaluation = evento;
  }

  explorationOralEvent(evento: boolean) {
    this.explorationOral = evento;
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
