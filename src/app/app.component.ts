import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { LoadingComponent } from './models/shared/loading/loading.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    RouterModule,LoadingComponent
  ]
})
export class AppComponent implements OnInit {
  title = 'odonto_front';

  ngOnInit(): void {
    initFlowbite();


  }
}