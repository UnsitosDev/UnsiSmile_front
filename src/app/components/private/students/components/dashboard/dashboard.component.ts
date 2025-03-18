import { Component } from '@angular/core';

import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { faUserMd } from '@fortawesome/free-solid-svg-icons'; // Ícono de doctor
import { DashboardStudentStatsComponentComponent } from '../dashboard-student-stats-component/dashboard-student-stats-component.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FontAwesomeModule, DashboardStudentStatsComponentComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'], // Corrige styleUrl a styleUrls
})
export class DashboardComponent {
  constructor(library: FaIconLibrary) {
    library.addIcons(faUserMd);
  }
}
