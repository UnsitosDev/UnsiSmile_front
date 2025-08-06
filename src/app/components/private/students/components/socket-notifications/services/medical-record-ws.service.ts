import { Injectable } from '@angular/core';
import { WebSocketService } from 'src/app/shared/services';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MedicalRecordWsService {
  constructor(private wsService: WebSocketService) {}

  /**
   * Retorna un observable de notificaciones para un expediente médico y paciente
   */
  public listenToMedicalRecordUpdates(
    medicalRecordId: string,
    patientId: string
  ): Observable<any> {
    const topic = `/topic/medical-record/${medicalRecordId}/patient-id/${patientId}`;
    return this.wsService.register(topic);
  }

  /**
   * Envía una actualización a un expediente (opcional, si necesitas publicar)
   */
  public sendMedicalRecordUpdate<T>(
    destinationPath: string,
    data: T
  ): void {
    this.wsService.send(destinationPath, data);
  }
}
