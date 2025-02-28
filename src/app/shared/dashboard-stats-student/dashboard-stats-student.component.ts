import { Component, inject, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard-stats-student',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './dashboard-stats-student.component.html',
  styleUrl: './dashboard-stats-student.component.scss'
})
export class DashboardStatsStudentComponent implements OnInit {
  private apiService = inject(ApiService);
  private toastr = inject(ToastrService);
  stats!: any;

  ngOnInit(): void {
      this.getStats();
  }

  getStats() {
    this.apiService
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_DASHBOARD_STATS}`,
        data: {},
      })
      .subscribe({
        next: (response) => {
          this.toastr.success('ok');
          console.log(response);
        },
        error: (error) => {
          this.toastr.error(error, 'Error');
        },
      });
  }
}
