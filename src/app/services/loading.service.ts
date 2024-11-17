// loading.service.ts
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',  // Esto lo hace disponible globalmente en la aplicación
})
export class LoadingService {
  isloading= signal<boolean>(true)


  show(): void {
    this.isloading.set(true);
  }

  hide(): void {
    this.isloading.set(false);
  }
}