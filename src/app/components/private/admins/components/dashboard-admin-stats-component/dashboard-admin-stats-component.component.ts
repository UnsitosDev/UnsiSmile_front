import { HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { ToastrService } from 'ngx-toastr';
import { DashboardCardComponent } from 'src/app/shared/components/dashbordad-card/dashbordad-card.component';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartType } from 'chart.js';
import { MatListModule } from "@angular/material/list";
import { StatisticsResponse } from '@mean/models';
interface Nationality {
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

  // Opciones del gráfico (compartidas)
  public chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  public currentChartData: ChartData<'bar' | 'line', number[], string> = {
    labels: [],
    datasets: [{
      label: '',
      data: [],
      backgroundColor: 'rgba(32, 55, 114, 0.84)',
      borderColor: 'rgb(7, 40, 112)',
      borderWidth: 1,
      type: 'bar'
    }]
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
          this.initChart(); // Inicializar gráfico después de tener los datos
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
    if (!this.stats) return;

    let labels: string[] = [];
    let data: number[] = [];
    let label = '';

    switch (this.activeChart) {
      case 'users':
        labels = ['Profesores', 'Alumnos', 'Administradores', 'Encargados de clínica'];
        data = [this.stats.totalProfessors, this.stats.totalStudents, 1, this.stats.totalProfessors];
        label = 'Usuarios';
        break;

      case 'patients':
        const nationalities = this.getNationalities();
        labels = nationalities.map(n => n.name);
        data = nationalities.map(n => n.count);
        label = 'Pacientes por nacionalidad';
        break;

      case 'treatments':
        labels = ['Profilaxis', 'Resinas', 'Fluorosis', 'Sellantes', 'Exodoncias', 'Prótesis removibles'];
        data = [
          this.stats.treatments.prophylaxis,
          this.stats.treatments.resins,
          this.stats.treatments.fluorosis,
          this.stats.treatments.pitAndFissureSealers,
          this.stats.treatments.extractions,
          this.stats.treatments.removableProsthesis
        ];
        label = 'Tratamientos realizados';
        break;
    }

    this.currentChartData = {
      labels: labels,
      datasets: [{
        label: label,
        data: data,
        backgroundColor: 'rgba(32, 55, 114, 0.84)',
        borderColor: 'rgb(7, 40, 112)',
        borderWidth: 1,
        type: 'bar'
      }]
    };
  }

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
