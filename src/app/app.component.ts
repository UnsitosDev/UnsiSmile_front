import { Component } from '@angular/core';
import routes from './app.routing.routes';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './components';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    RouterModule,
    LoginComponent
  ]
})
export class AppComponent {
  title = 'odonto_front';
}
