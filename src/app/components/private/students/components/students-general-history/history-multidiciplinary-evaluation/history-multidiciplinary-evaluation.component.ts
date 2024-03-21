import { Component } from '@angular/core';
import { InputField, bucalExam, funcionalAnalysis, inputs, medicalConsultation, patientPosture, radiographicAnalisys, studyLab, studyModels } from './models/inputs';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-history-multidiciplinary-evaluation',
  standalone: true,
  imports: [MatIconModule, MatInputModule,MatFormFieldModule, MatButtonModule ],
  templateUrl: './history-multidiciplinary-evaluation.component.html',
  styleUrl: './history-multidiciplinary-evaluation.component.scss'
})
export class HistoryMultidiciplinaryEvaluationComponent {
  formFields: InputField[] = inputs;
  funcionalAnalysis: InputField[] = funcionalAnalysis;
  patientPosture: InputField[] = patientPosture;
  bucalExam: InputField[] = bucalExam;
  studyModels: InputField[] = studyModels;
  studyLab: InputField[] = studyLab;
  medicalConsultation: InputField[] = medicalConsultation;
  radiographicAnalisys: InputField[]= radiographicAnalisys;
}
