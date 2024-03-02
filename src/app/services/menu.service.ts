// menu.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private sidebarState = new BehaviorSubject<boolean>(false);
  sidebarState$ = this.sidebarState.asObservable();

  toggleSidebar(state: boolean) {
    this.sidebarState.next(state);
  }
}
