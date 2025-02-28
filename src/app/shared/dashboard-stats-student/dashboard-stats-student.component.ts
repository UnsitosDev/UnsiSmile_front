import { Component, inject, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { ToastrService } from 'ngx-toastr';
import { Dashboard } from 'src/app/models/shared/students';

@Component({
  selector: 'app-dashboard-stats-student',
  standalone: true,
  templateUrl: './dashboard-stats-student.component.html',
  styleUrl: './dashboard-stats-student.component.scss',
})
export class DashboardStatsStudentComponent implements OnInit {
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

  // Objeto de íconos por nacionalidad
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
          this.toastr.success('Datos cargados correctamente');
          this.stats = response;
          this.loading = false;
          console.log(this.stats);
        },
        error: (error) => {
          this.toastr.error(error, 'Error');
          this.loading = false;
        },
      });
  }

  // Método para obtener las nacionalidades
  getNationalities(): string[] {
    return Object.keys(this.stats?.data?.patientsByNationality || {});
  }
}