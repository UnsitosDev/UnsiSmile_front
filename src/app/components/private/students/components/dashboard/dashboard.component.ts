import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faUserMd } from '@fortawesome/free-solid-svg-icons'; // Ícono de doctor

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
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

  data = [
    { month: 'Ene', ventas: 4000 },
    { month: 'Feb', ventas: 3000 },
    { month: 'Mar', ventas: 5000 },
    { month: 'Abr', ventas: 4500 },
    { month: 'May', ventas: 6000 },
    { month: 'Jun', ventas: 5500 },
    { month: 'Jul', ventas: 7000 },
    { month: 'Ago', ventas: 6500 },
    { month: 'Sep', ventas: 8000 },
    { month: 'Oct', ventas: 7500 },
    { month: 'Nov', ventas: 9000 },
    { month: 'Dic', ventas: 10000 },
  ];
}
