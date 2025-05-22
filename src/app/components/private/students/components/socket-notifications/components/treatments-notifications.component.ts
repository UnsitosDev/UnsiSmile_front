import { TreatmentsWsService } from '@mean/students';
import { Component, inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  template: '',
  standalone: true,
})
export abstract class treatmentsNotifications implements OnDestroy {
  private treatmentSubscription?: Subscription;
  protected treatmentWsService = inject(TreatmentsWsService);

  protected connectToTreatmentDetails(
    treatmentDetailId: string,
    patientId: string
  ): void {
    this.treatmentSubscription = this.treatmentWsService
      .listenToTreatmentDetailsUpdates(treatmentDetailId, patientId)
      .subscribe({
        next: (message) => this.onTreatmentsNotification(),
        error: (err) => console.error('[WebSocket Error]', err),
      });
  }

  /**
   * Método que las subclases deben implementar para manejar los mensajes recibidos.
   */
  protected abstract onTreatmentsNotification(): void;

  ngOnDestroy(): void {
    this.treatmentSubscription?.unsubscribe();
  }
}
