import { Component, inject, OnDestroy } from "@angular/core";
import { MedicalRecordWsService } from "@mean/students";
import { Subscription } from "rxjs";

@Component({
  template: '',
  standalone: true
})
export abstract class MedicalRecordsNotifications implements OnDestroy {
    private subscription?: Subscription;
    protected medicalRecordWsService = inject(MedicalRecordWsService)

    constructor() {}
  
    /**
     * Conecta al tópico de WebSocket y maneja los mensajes recibidos.
     */
    protected connectToNotifications(
      medicalRecordId: string,
      patientId: string
    ): void {
      this.subscription = this.medicalRecordWsService
        .listenToMedicalRecordUpdates(medicalRecordId, patientId)
        .subscribe({
          next: (message) => this.onMedicalRecordNotification(),
          error: (err) => console.error('[WebSocket Error]', err),
        });
    }
  
    /**
     * Método que las subclases deben implementar para manejar los mensajes recibidos.
     */
    protected abstract onMedicalRecordNotification(): void;
  
    ngOnDestroy(): void {
      this.subscription?.unsubscribe();
    }
  }