import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { LoadingComponent } from './models/shared/loading/loading.component';
import { ThemeService } from './services/theme.service';

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
  
  constructor(private themeService: ThemeService) {} // Inyecta el servicio de temas

  ngOnInit(): void {
    initFlowbite();
    this.themeService.loadTheme(); // Cargar el tema guardado o aplicar el tema por defecto
  }
}
