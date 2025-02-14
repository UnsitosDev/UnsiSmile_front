import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-additional-cards',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './additional-cards.component.html',
  styleUrl: './additional-cards.component.scss'
})
export class AdditionalCardsComponent {
  cards: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('/assets/data/card-data.json').subscribe(data => {
      this.cards = data;
    });
  }
}