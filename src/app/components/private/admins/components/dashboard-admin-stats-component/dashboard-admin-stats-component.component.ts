import { HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ApiService } from 'src/app/shared/services';
import { UriConstants } from '@mean/utils';
import { ToastrService } from 'ngx-toastr';
import { DashboardCardComponent } from 'src/app/shared/components/dashbordad-card/dashbordad-card.component';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartType } from 'chart.js';
import { MatListModule } from "@angular/material/list";
import { StatisticsResponse } from 'src/app/shared/models';

interface Nationality {
  name: string;
  count: number;
}

interface TreatmentConfig {
  key: keyof StatisticsResponse['treatments'];
  label: string;
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

  private treatmentConfig: TreatmentConfig[] = [
    { key: 'resins', label: 'Resinas' },
    { key: 'prophylaxis', label: 'Profilaxis' },
    { key: 'fluorosis', label: 'Fluorosis' },
    { key: 'pitAndFissureSealers', label: 'Selladores de fosetas y fisuras' },
    { key: 'extractions', label: 'Extracciones' },
    { key: 'removableProsthesis', label: 'Prótesis removible' },
    { key: 'prosthesisRemovable', label: 'Prótesis removible (alt)' },
    { key: 'prosthodontics', label: 'Prostodoncia' },
    { key: 'rootCanals', label: 'Endodoncia' },
    { key: 'scrapedAndSmoothed', label: 'Raspado y alisado' },
    { key: 'closedAndOpen', label: 'Cerrado y abierto' },
    { key: 'distalWedges', label: 'Cuña distal' },
    { key: 'pulpotomyAndCrowns', label: 'Pulpotomía y corona' },
    { key: 'pulpectomyAndCrowns', label: 'Pulpectomía y corona' }
  ];

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
          this.initChart();
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

  getTreatmentsList(): Array<{ label: string; value: number }> {
    if (!this.stats?.treatments) return [];

    return this.treatmentConfig.map(treatment => ({
      label: treatment.label,
      value: this.stats.treatments[treatment.key] || 0
    }));
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
        const treatments = this.getTreatmentsList();
        labels = treatments.map(t => t.label);
        data = treatments.map(t => t.value);
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