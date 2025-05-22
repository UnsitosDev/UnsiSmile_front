import { HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { ToastrService } from 'ngx-toastr';
import { AdminDashboard } from 'src/app/models/dashboards/admin-dashboard';
import { DashboardCardComponent } from 'src/app/shared/components/dashbordad-card/dashbordad-card.component';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartType } from 'chart.js';

interface Nationality {
  name: string;
  count: number;
}

@Component({
  selector: 'app-dashboard-admin-stats-component',
  standalone: true,
  imports: [DashboardCardComponent, BaseChartDirective],
  templateUrl: './dashboard-admin-stats-component.component.html',
  styleUrl: './dashboard-admin-stats-component.component.scss',
})
export class DashboardAdminStatsComponent {
  private apiService = inject(ApiService);
  private toastr = inject(ToastrService);
  stats!: AdminDashboard;
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

  public lineChartData: ChartData<'bar' | 'line', number[], string> = {
    labels: ['Profesores', 'Alumnos', 'Administradores', 'Encargados de clínica'],
    datasets: [
      {
        label: 'Usuarios',
        data: [50, 380, 10, 40],
        backgroundColor: 'rgba(32, 55, 114, 0.84)',
        borderColor: 'rgb(7, 40, 112)',
        borderWidth: 1,
        type: 'bar'
      }
    ]

  };

  public lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  public lineChartType: ChartType = 'line';

}
