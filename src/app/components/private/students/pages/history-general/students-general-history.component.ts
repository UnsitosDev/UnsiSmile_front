import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';

import { HistoryPersonalDataComponent } from '../../components/form-personal-data/history-personal-data.component';
import { HistoryVitalSignsComponent } from '../../components/form-history-vital-signs/history-vital-signs.component';
//import { HistoryFacialExamComponent } from './history-facial-exam/history-facial-exam.component';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentsOdontogramComponent } from '../../components/odontogram/students-odontogram.component';
import { HistoryFacialExamComponent } from '../../components/form-history-facial-exam/history-facial-exam.component';
import { HistoryFamilyHistoryComponent } from '../../components/form-history-family-history/history-family-history.component';
import { HistoryInitialBagComponent } from '../../components/form-history-initial-bag/history-initial-bag.component';
import { HistoryMultidiciplinaryEvaluationComponent } from '../../components/form-history-multidiciplinary-evaluation/history-multidiciplinary-evaluation.component';
import { NoPathologicalPersonalHistoryComponent } from '../../components/form-no-pathological-personal-history/no-pathological-personal-history.component';
import { PathologicalPersonalHistoryComponent } from '../../components/form-pathological-personal-history/pathological-personal-history.component';
import { StudentsPatientDetailComponent } from '../../components/form-patient-detail/students-patient-detail.component';

@Component({
  selector: 'app-students-general-history',
  standalone: true,
  templateUrl: './students-general-history.component.html',
  styleUrl: './students-general-history.component.scss',
  imports: [
    MatTabsModule,
    HistoryPersonalDataComponent,
    HistoryVitalSignsComponent,
    HistoryFacialExamComponent,
    HistoryFamilyHistoryComponent,
    NoPathologicalPersonalHistoryComponent,
    PathologicalPersonalHistoryComponent,
    StudentsOdontogramComponent,
    HistoryInitialBagComponent,
    HistoryMultidiciplinaryEvaluationComponent,
    MatDialogModule,
    MatTabsModule,
    MatDialogModule,
    StudentsPatientDetailComponent
],
})
export class StudentsGeneralHistoryComponent implements OnInit {
  public id!: number;
  vitalSigns = true;
  facialExam = true;
  atecedentesHeredofamiliares = true;
  antecedentesPersonalesNoPatologicos = true;
  antecedentesPersonalesPatologicos = true;
  ontogramaInicial = true;
  ontogramaFinal = true;
  medicionDeBolsasInicial = true;
  evaluacion = true;

  facialExamEvent(evento: boolean) {
    this.facialExam = evento;
    this.irSiguienteTab();
  }

  vitalSignsEvent(evento: boolean) {
    this.vitalSigns = evento;
  }

  atecedentesHeredofamiliaresEvent(evento: boolean) {
    this.atecedentesHeredofamiliares = evento;
  }

  antecedentesPersonalesNoPatologicosEvent(evento: boolean) {
    this.antecedentesPersonalesNoPatologicos = evento;
  }

  antecedentesPersonalesPatologicosEvent(evento: boolean) {
    this.antecedentesPersonalesPatologicos = evento;
  }

  ontogramaInicialEvent(evento: boolean) {
    this.ontogramaInicial = evento;
  }

  ontogramaFinalEvent(evento: boolean) {
    this.ontogramaFinal = evento;
  }

  medicionDeBolsasIniciallEvent(evento: boolean) {
    this.medicionDeBolsasInicial = evento;
  }

  evaluacionEvent(evento: boolean) {
    this.evaluacion = evento;
  }

  recibirTab(evento: number) {
    console.log('pagina recibida', evento);
    this.irSiguienteTab();
  }

  nextpage: boolean = true;
  constructor(private router: ActivatedRoute) {}

  ngOnInit(): void {
    this.router.params.subscribe((params) => {
      this.id = params['id'];

      console.log('id del paciente: ', this.id);
    });
  }

  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
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
}
