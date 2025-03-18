import { HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { ToastrService } from 'ngx-toastr';
import { StudentDashboard } from 'src/app/models/dashboards/student-dashboard';
import { DashboardCardComponent } from 'src/app/shared/components/dashbordad-card/dashbordad-card.component';
@Component({
  selector: 'app-dashboard-student-stats-component',
  standalone: true,
  imports: [DashboardCardComponent],
  templateUrl: './dashboard-student-stats-component.component.html',
  styleUrl: './dashboard-student-stats-component.component.scss',
})
export class DashboardStudentStatsComponentComponent {
  private apiService = inject(ApiService);
  private toastr = inject(ToastrService);
  stats!: StudentDashboard;
  loading = true;

  ngOnInit(): void {
    this.getStats();
  }

  getStats() {
    this.apiService
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_STUDENT_DASHBOARD}`,
        data: {},
      })
      .subscribe({
        next: (response) => {
          this.stats = response;
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          this.toastr.error(error, 'Error');
        },
      });
  }
}
