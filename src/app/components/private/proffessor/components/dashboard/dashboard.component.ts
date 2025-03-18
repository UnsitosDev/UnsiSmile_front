import { Component } from '@angular/core';

import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUserMd } from '@fortawesome/free-solid-svg-icons'; // Ícono de doctor

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FontAwesomeModule],
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
