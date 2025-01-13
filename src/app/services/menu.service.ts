import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private routeSource = new BehaviorSubject<string>(''); // Almacena la ruta seleccionada
  public currentRoute$ = this.routeSource.asObservable(); // Observable para suscripción

  constructor() { }

  emitRoute(route: string) {
    this.routeSource.next(route); // Actualiza la ruta seleccionada
  }

  resetRoute() {
    this.routeSource.next(''); // Reinicia la ruta
  }
}
