import { HttpHeaders } from '@angular/common/http';
import { ApiService } from './../../../../../../services/api.service';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UriConstants } from '@mean/utils';
import { closedQuestionPathologicalAntecedentsRequest } from '../models/closedQuestionPathologicalAntecedents/closedQuestionPathologicalAntecedents';
import { openQuestionPathologicalAntecedentsRequest } from '../models/openQuestionPathologicalAntecedents/openQuestionPathologicalAntecedents';

@Component({
  selector: 'app-pathological-personal-history',
  standalone: true,
  imports: [MatCheckboxModule, MatButtonModule],
  templateUrl: './pathological-personal-history.component.html',
  styleUrl: './pathological-personal-history.component.scss'
})
export class PathologicalPersonalHistoryComponent implements OnInit {

  private apiService = inject(ApiService<closedQuestionPathologicalAntecedentsRequest>);

  constructor(){}

  ngOnInit(): void {
    this.getPathologicalPersonHistory();
    this.getQuestionsPathologicalPersonHistory();
  }

  questionsPathologicalPersonData: closedQuestionPathologicalAntecedentsRequest[]=[];
  getPathologicalPersonHistory(){
    this.apiService
      .getListService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_CLOSED_QUESTION_PATHOLOGICAL_ANTECEDENTS}`,
        data: {},
      })
      .subscribe({
        next: (response) => {
          this.questionsPathologicalPersonData = response;
          // console.log(this.questionsPathologicalPersonData);
        },
        error: (error) => {
          console.error('Error en la autenticación:', error);
        },
      });
   }

   getOpenQuestionsPhatologicalData: openQuestionPathologicalAntecedentsRequest [] = [];
   getQuestionsPathologicalPersonHistory(){
    this.apiService
      .getListService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_PATHOLOGICAL_ANTECEDENTS}`,
        data: {},
      })
      .subscribe({
        next: (response) => {
          this.getOpenQuestionsPhatologicalData = response;
          // console.log(this.getOpenQuestionsPhatologicalData);
        },
        error: (error) => {
          console.error('Error en la autenticación:', error);
        },
      });
   }
}
