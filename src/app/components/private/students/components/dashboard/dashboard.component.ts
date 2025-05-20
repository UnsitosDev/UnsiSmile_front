import { Component, OnInit, inject } from '@angular/core';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUserMd } from '@fortawesome/free-solid-svg-icons';
import { DashboardStudentStatsComponentComponent } from '../dashboard-student-stats-component/dashboard-student-stats-component.component';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { WelcomeMessageService } from 'src/app/services/welcome-message.service';
import { LoadingComponent } from '@mean/shared';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FontAwesomeModule, DashboardStudentStatsComponentComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private userService = inject(ApiService<any, {}>);
  private welcomeMessageService = inject(WelcomeMessageService);
  welcomeMessage: string = 'Bienvenido a UnsiSmile';

  constructor(library: FaIconLibrary) {
    library.addIcons(faUserMd);
  }

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
          if (data?.person?.gender?.idGender) {
            this.welcomeMessage = this.welcomeMessageService.getWelcomeMessage(data.person.gender.idGender);
          }
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
        },
      });
  }
}
