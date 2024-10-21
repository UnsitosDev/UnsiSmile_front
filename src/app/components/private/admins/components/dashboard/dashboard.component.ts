import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faUserMd } from '@fortawesome/free-solid-svg-icons'; // Ícono de doctor
import { DashboardStatsComponent } from 'src/app/shared/dashboard-stats/dashboard-stats.component';
import { AdditionalCardsComponent } from 'src/app/shared/additional-cards/additional-cards.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule,DashboardStatsComponent, AdditionalCardsComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'] // Corrige styleUrl a styleUrls
})
export class DashboardComponent {
  constructor(library: FaIconLibrary) {
    library.addIcons(faUserMd);
  }

  cards = [
    { title: 'Pacientes', icon: 'fas fa-user-injured', color: 'bg-blue-500' },
    { title: 'Reportes', icon: 'fas fa-file-alt', color: 'bg-green-500' },
    { title: 'Citas', icon: 'fas fa-calendar-alt', color: 'bg-yellow-500' },
    { title: 'Actividades', icon: 'fas fa-bolt', color: 'bg-purple-500' },
  ];


}
