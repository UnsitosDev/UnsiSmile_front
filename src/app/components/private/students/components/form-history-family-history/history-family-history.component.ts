import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { ApiService, AuthService } from '@mean/services';
import { HttpHeaders } from '@angular/common/http';
import { UriConstants } from '@mean/utils';
import { MatInputModule } from '@angular/material/input';
import { hereditaryFamilyHistoryQuestionRequest } from 'src/app/models/models-students/hereditaryFamilyHistoryQuestion/hereditaryFamilyHistoryQuestion';

@Component({
  selector: 'app-history-family-history',
  standalone: true,
  imports: [MatCheckboxModule, MatButtonModule, MatInputModule],
  templateUrl: './history-family-history.component.html',
  styleUrl: './history-family-history.component.scss',
})
export class HistoryFamilyHistoryComponent implements OnInit {
  private apiService = inject(ApiService<hereditaryFamilyHistoryQuestionRequest>);

  ngOnInit(): void {
    this.endExamFacial();
  }

  questionData: hereditaryFamilyHistoryQuestionRequest[] = [];
  endExamFacial() {
    this.apiService
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_HEREDITARY_FAMILY_HISTORY_QUESTION}`,
        data: {},
      })
      .subscribe({
        next: (response) => {
          this.questionData = response;
          console.log('QUESTION', this.questionData)
        },
        error: (error) => {
          console.error('Error en la autenticación:', error);
        },
      });
  }


  sendData() {
    this.nextTab();
    this,this.emitNextTabEvent();
  }

  @Output() nextTabEventEmitted = new EventEmitter<boolean>();
  emitNextTabEvent() {
      this.nextTabEventEmitted.emit(false);
  }
  
  @Output() nextMatTab = new EventEmitter<number>();
  nextTab() {
    this.nextMatTab.emit(0);
  }
}
