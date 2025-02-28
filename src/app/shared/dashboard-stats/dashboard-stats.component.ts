import { Component, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '@mean/services';
import { ToastrService } from 'ngx-toastr';
import { UriConstants } from '@mean/utils';
import { Dashboard } from 'src/app/models/shared/students';


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
  stats: Dashboard = {
    data: {
      patientsWithDisability: 0,
      patientsRegisteredLastMonth: 0,
      patients: 0,
      patientsByNationality: {},
    },
  };
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
        url: `${UriConstants.GET_DASHBOARD_STATS}`,
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

  getNationalities(): string[] {
    return Object.keys(this.stats?.data?.patientsByNationality || {});
  }
}
