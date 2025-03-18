import { HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { ToastrService } from 'ngx-toastr';
import { AdminDashboard } from 'src/app/models/dashboards/admin-dashboard';
import { DashboardCardComponent } from 'src/app/shared/components/dashbordad-card/dashbordad-card.component';

interface Nationality {
  name: string;
  count: number;
}

@Component({
  selector: 'app-dashboard-admin-stats-component',
  standalone: true,
  imports: [DashboardCardComponent],
  templateUrl: './dashboard-admin-stats-component.component.html',
  styleUrl: './dashboard-admin-stats-component.component.scss',
})
export class DashboardAdminStatsComponent {
  private apiService = inject(ApiService);
  private toastr = inject(ToastrService);
  stats!: AdminDashboard;
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
        url: `${UriConstants.GET_ADMIN_DASHBOARD}`,
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

  getNationalities(): Nationality[] {
    if (!this.stats?.patientsByNationality) {
      return [];
    }
    return Object.entries(this.stats.patientsByNationality).map(
      ([name, count]) => ({
        name,
        count,
      })
    );
  }
}
