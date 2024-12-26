import { Component, inject } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {
  private readonly spinnerSvc = inject(LoadingService);
  isLoading= this.spinnerSvc.isloading;
}