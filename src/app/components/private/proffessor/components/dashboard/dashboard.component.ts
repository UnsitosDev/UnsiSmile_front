import { Component, OnInit, inject } from '@angular/core';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUserMd } from '@fortawesome/free-solid-svg-icons'; // Ícono de doctor
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { AdminResponse } from 'src/app/models/shared/admin/admin.model';
import {
  studentResponse,
  studentUserResponse,
} from 'src/app/shared/interfaces/student/student';
import { DashboardAdminStatsComponent } from '../../../admins/components/dashboard-admin-stats-component/dashboard-admin-stats-component.component';
import { ProfessorResponse } from 'src/app/models/shared/professor/professor.model';
import { DashboardProfessorClinicalComponent } from "../../../clinical-area-supervisor/components/dashboard/dashboard.component";
import { DashboardProfessorStatsComponent } from "../dashboard-professor-stats/dashboard-professor-stats.component";
//import { DashboardAdminStatsComponent } from '../dashboard-admin-stats-component/dashboard-admin-stats-component.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FontAwesomeModule, DashboardProfessorStatsComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})  
export class DashboardComponent implements OnInit {
  constructor(library: FaIconLibrary) {
    library.addIcons(faUserMd);
  }

  private userService = inject(ApiService<studentResponse, {}>);
  user!: ProfessorResponse;
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
}
