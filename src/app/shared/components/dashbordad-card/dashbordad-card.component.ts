import { Component, Input } from '@angular/core';
import { NgClass, CommonModule } from '@angular/common';

interface Nationality {
  name: string;
  count: number;
  icon?: string;
}

@Component({
  selector: 'app-dashboard-card',
  standalone: true,
  imports: [NgClass, CommonModule],
  templateUrl: './dashbordad-card.component.html',
  styleUrl: './dashbordad-card.component.scss'
})
export class DashboardCardComponent {
  
  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() cardType: 'numeric' | 'text' | 'list' = 'numeric';
  @Input() value?: number | string;
  @Input() content?: string;
  @Input() listItems: Nationality[] = [];
  @Input() colorBar?: string;
  @Input() backgroundClass: string = 'bg';
  @Input() containerClass: string = '';
  @Input() valueClass: string = 'text-blue-600';

}
