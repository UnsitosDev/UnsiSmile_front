import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {
  private adminDataSubject = new BehaviorSubject<any>(null);
  adminData$ = this.adminDataSubject.asObservable();

  setAdminData(data: any) {
    this.adminDataSubject.next(data);
  }
}
