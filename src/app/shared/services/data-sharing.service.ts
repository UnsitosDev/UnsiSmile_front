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

  // Agregar el BehaviorSubject para datos de pacientes
  private patientDataSubject = new BehaviorSubject<any>(null);
  patientData$ = this.patientDataSubject.asObservable();

  // Agregar el método para establecer datos de pacientes
  setPatientData(data: any) {
    this.patientDataSubject.next(data);
  }

  private areaDataSubject = new BehaviorSubject<any>(null);
  areaData$ = this.areaDataSubject.asObservable();

  setAreaData(data: any) {
    this.areaDataSubject.next(data);
  }
}
