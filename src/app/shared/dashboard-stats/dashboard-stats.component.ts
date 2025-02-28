import { Component, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '@mean/services';
import { ToastrService } from 'ngx-toastr';
import { UriConstants } from '@mean/utils';


@Component({
  selector: 'app-dashboard-stats',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './dashboard-stats.component.html',
  styleUrl: './dashboard-stats.component.scss'
})
export class DashboardStatsComponent {
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
