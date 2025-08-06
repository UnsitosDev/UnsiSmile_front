import { HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ApiService } from 'src/app/shared/services';
import { UriConstants } from '@mean/utils';
import { ToastrService } from 'ngx-toastr';
import { ProfessorDashboard} from 'src/app/shared/models/dashboards/admin-dashboard';
import { DashboardCardComponent } from 'src/app/shared/components/dashbordad-card/dashbordad-card.component';

@Component({
  selector: 'app-dashboard-professor-stats',
  standalone: true,
  imports: [DashboardCardComponent],
  templateUrl: './dashboard-professor-stats.component.html',
  styleUrl: './dashboard-professor-stats.component.scss'
})
export class DashboardProfessorStatsComponent {
private apiService = inject(ApiService);
  private toastr = inject(ToastrService);
  stats!: ProfessorDashboard;
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
        url: `${UriConstants.GET_PROFESSORS_DASHBOARD}`,
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