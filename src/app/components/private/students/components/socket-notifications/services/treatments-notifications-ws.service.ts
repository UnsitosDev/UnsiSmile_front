import { Injectable } from "@angular/core";
import { WebSocketService } from "src/app/shared/services";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class TreatmentsWsService {
  constructor(private wsService: WebSocketService) {}

    /**
   * Retorna un observable de notificaciones para los detalles de un tratamiento
   */
    public listenToTreatmentDetailsUpdates(
        treatmentDetailId: string,
        patientId: string
      ): Observable<any> {
        const topic = `/topic/treatment-detail/${treatmentDetailId}/patient-id/${patientId}`;
        return this.wsService.register(topic);
      }

}