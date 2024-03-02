// event.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private isSidebarHiddenSubject = new BehaviorSubject<boolean>(false);
  sidebarToggle$: Observable<boolean> = this.isSidebarHiddenSubject.asObservable();

  getSidebarState(): boolean {
    return this.isSidebarHiddenSubject.value;
  }

  toggleSidebar() {
    const currentState = this.isSidebarHiddenSubject.value;
    this.isSidebarHiddenSubject.next(!currentState);
  }
}
