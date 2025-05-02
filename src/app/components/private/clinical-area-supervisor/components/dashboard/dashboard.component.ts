import { Component, OnInit, inject } from '@angular/core';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { faUserMd } from '@fortawesome/free-solid-svg-icons'; // Ícono de doctor
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { AdminResponse } from 'src/app/models/shared/admin/admin.model';
import {
  studentResponse,
  studentUserResponse,
} from 'src/app/shared/interfaces/student/student';
import { WelcomeMessageService } from 'src/app/services/welcome-message.service';
import { DashboardSupervisorStatsComponent } from '../dashboard-supervisor-stats/dashboard-supervisor-stats.component';
@Component({
  selector: 'app-dashboard-professor-clinical',
  standalone: true,
  imports: [FontAwesomeModule,DashboardSupervisorStatsComponent ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})  
export class DashboardProfessorClinicalComponent implements OnInit {
  constructor(library: FaIconLibrary) {
    library.addIcons(faUserMd);
  }

  private userService = inject(ApiService<studentResponse, {}>);
  private welcomeMessageService = inject(WelcomeMessageService);
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
    if (this.user?.person?.gender?.idGender) {
      this.welcomeMessage = this.welcomeMessageService.getWelcomeMessage(this.user.person.gender.idGender);
    }
  }
}
