import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aditional-cards-student',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './aditional-cards-student.component.html',
  styleUrl: './aditional-cards-student.component.scss'
})
export class AditionalCardsStudentComponent {
  cards: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('/assets/data/card-data-student.json').subscribe(data => {
      this.cards = data;
    });
  }
}
