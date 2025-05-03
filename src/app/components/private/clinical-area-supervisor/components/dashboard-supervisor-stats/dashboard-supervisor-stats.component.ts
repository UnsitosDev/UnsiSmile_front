import { HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { ToastrService } from 'ngx-toastr';
import { SupervisorDashboard } from 'src/app/models/dashboards/admin-dashboard';
import { DashboardCardComponent } from 'src/app/shared/components/dashbordad-card/dashbordad-card.component';

@Component({
  selector: 'app-dashboard-supervisor-stats',
  standalone: true,
  imports: [DashboardCardComponent],
  templateUrl: './dashboard-supervisor-stats.component.html',
  styleUrl: './dashboard-supervisor-stats.component.scss'
})
export class DashboardSupervisorStatsComponent {
 private apiService = inject(ApiService);
  private toastr = inject(ToastrService);
  stats!: SupervisorDashboard;
  loading = true;

  nationalityIcons: { [key: string]: string } = {
    Española: '🇪🇸',
    Mexicana: '🇲🇽',
    Canadiense: '🇨🇦',
    Estadounidense: '🇺🇸',
    Francesa: '🇫🇷',
  };

  ngOnInit(): void {
    this.getStats();
  }

  getStats() {
    this.apiService
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_SUPERVISOR_DASHBOARD}`,
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
