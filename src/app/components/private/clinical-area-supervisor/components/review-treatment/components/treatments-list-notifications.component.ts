import { Component, inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TreatmentsListWsService } from '../service/treatment-list.service';

@Component({
  template: '',
  standalone: true,
})
export abstract class treatmentsListNotifications implements OnDestroy {
  private treatmentListSubscription?: Subscription;
  protected treatmentListWsService = inject(TreatmentsListWsService);

  protected connectToTreatmentDetailsList(
    proffesorId: string
  ): void {
    this.treatmentListSubscription = this.treatmentListWsService
      .listenToTreatmentDetailsListUpdates(proffesorId)
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
    this.treatmentListSubscription?.unsubscribe();
  }
}
