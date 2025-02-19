import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-dashboard-stats-student',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './dashboard-stats-student.component.html',
  styleUrl: './dashboard-stats-student.component.scss'
})
export class DashboardStatsStudentComponent {
  stats: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('/assets/data/dashboard-stats-student.json').subscribe(data => {
      this.stats = data;
    });
  }
}
