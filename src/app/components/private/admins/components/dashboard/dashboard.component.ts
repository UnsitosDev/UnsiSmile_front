import { Component, OnInit, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faUserMd } from '@fortawesome/free-solid-svg-icons'; // Ícono de doctor
import { DashboardStatsComponent } from 'src/app/shared/dashboard-stats/dashboard-stats.component';
import { AdditionalCardsComponent } from 'src/app/shared/components/additional-cards/additional-cards.component';
import { ApiService } from '@mean/services';
import { studentResponse, studentUserResponse } from 'src/app/shared/interfaces/student/student';
import { AdminResponse } from 'src/app/models/shared/admin/admin.model';
import { UriConstants } from '@mean/utils';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FontAwesomeModule, DashboardStatsComponent, AdditionalCardsComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'] // Corrige styleUrl a styleUrls
})
export class DashboardComponent implements OnInit {
  constructor(library: FaIconLibrary) {
    library.addIcons(faUserMd);
  }

  private userService = inject(ApiService<studentResponse, {}>);
  user!: studentUserResponse | AdminResponse;
  welcomeMessage: string = 'Bienvenido a UnsiSmile';

  ngOnInit() {
    this.fetchUserData();
  }

  fetchUserData() {
    this.userService
      .getService({
        url: `${UriConstants.GET_USER_INFO}`,
      })
      .subscribe({
        next: (data) => {
          this.user = data;
          this.setWelcomeMessage();
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
        },
      });
  }

  setWelcomeMessage() {
   switch (this.user.person.gender.idGender) {
      case 1:
        this.welcomeMessage = 'Bienvenido a UnsiSmile';
        break;
      case 2:
        this.welcomeMessage = 'Bienvenida a UnsiSmile';
        break;
      case 99:
        this.welcomeMessage = 'Bienvenide a UnsiSmile';
        break;
    }
  }

  cards = [
    { title: 'Pacientes', icon: 'fas fa-user-injured', color: 'bg-blue-500' },
    { title: 'Reportes', icon: 'fas fa-file-alt', color: 'bg-green-500' },
    { title: 'Citas', icon: 'fas fa-calendar-alt', color: 'bg-yellow-500' },
    { title: 'Actividades', icon: 'fas fa-bolt', color: 'bg-purple-500' },
  ];
}
