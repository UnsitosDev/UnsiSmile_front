import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-dashboard-stats',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './dashboard-stats.component.html',
  styleUrl: './dashboard-stats.component.scss'
})
export class DashboardStatsComponent {
  stats: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('/assets/data/dashboard-stats.json').subscribe(data => {
      this.stats = data;
    });
  }
}
