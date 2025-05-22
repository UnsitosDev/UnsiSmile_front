import {HttpHeaders} from '@angular/common/http';
import {Component, inject} from '@angular/core';
import {ApiService} from '@mean/services';
import {UriConstants} from '@mean/utils';
import {ToastrService} from 'ngx-toastr';
import {DashboardCardComponent} from 'src/app/shared/components/dashbordad-card/dashbordad-card.component';
import {BaseChartDirective} from 'ng2-charts';
import {ChartData, ChartType} from 'chart.js';
import {MatListModule} from "@angular/material/list";
import {StatisticsResponse} from "../../../../../models/dashboards/admin-dashboard";

interface Nationality {
  name: string;
  count: number;
}

interface TreatmentItem {
  key: string;
  name: string;
  count: number;
}

@Component({
  selector: 'app-dashboard-admin-stats-component',
  standalone: true,
  imports: [DashboardCardComponent, BaseChartDirective, MatListModule],
  templateUrl: './dashboard-admin-stats-component.component.html',
  styleUrl: './dashboard-admin-stats-component.component.scss',
})
export class DashboardAdminStatsComponent {
  private apiService = inject(ApiService);
  private toastr = inject(ToastrService);
  stats!: StatisticsResponse;
  loading = true;
  activeChart: 'users' | 'patients' | 'treatments' = 'users';

  // Datos estáticos para los gráficos
  public chartData = {
    users: {
      labels: ['Profesores', 'Alumnos', 'Administradores', 'Encargados de clínica'],
      data: [50, 380, 10, 40],
      label: 'Usuarios'
    },
    patients: {
      labels: ['Mexico', 'Argentina', 'Peru', 'Guatemala'],
      data: [120, 80, 50, 30],
      label: 'Pacientes'
    },
    treatments: {
      labels: ['Profilaxis', 'Resinas', 'Fluorosis', 'Exodoncias'],
      data: [60, 120, 40, 80],
      label: 'Tratamientos'
    }
  };

  public currentChartData: ChartData<'bar' | 'line', number[], string> = {
    labels: this.chartData.users.labels,
    datasets: [{
      label: this.chartData.users.label,
      data: this.chartData.users.data,
      backgroundColor: 'rgba(32, 55, 114, 0.84)',
      borderColor: 'rgb(7, 40, 112)',
      borderWidth: 1,
      type: 'bar'
    }]
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

  ngOnInit(): void {
    this.getStats();
    this.initChart();
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
          console.log(this.stats);
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
      ([name, count]) => ({ name, count })
    );
  }

  switchChart(chartType: 'users' | 'patients' | 'treatments'): void {
    this.activeChart = chartType;
    this.updateChart();
  }

  private initChart(): void {
    this.updateChart();
  }

  private updateChart(): void {
    const data = this.chartData[this.activeChart];

    this.currentChartData = {
      labels: data.labels,
      datasets: [{
        label: data.label,
        data: data.data,
        backgroundColor: 'rgba(32, 55, 114, 0.84)',
        borderColor: 'rgb(7, 40, 112)',
        borderWidth: 1,
        type: 'bar'
      }]
    };
  }
}
