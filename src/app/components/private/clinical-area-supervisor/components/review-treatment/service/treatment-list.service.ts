import { Injectable } from "@angular/core";
import { WebSocketService } from "src/app/shared/services";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class TreatmentsListWsService {
  constructor(private wsService: WebSocketService) {}

    /**
   * Retorna un observable de notificaciones para los detalles de un tratamiento
   */
    public listenToTreatmentDetailsListUpdates(
        professorId: string
      ): Observable<any> {
        const topic = `/topic/treatments/professor/${professorId}`;
        return this.wsService.register(topic);
      }

}