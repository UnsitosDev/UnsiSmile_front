import { Injectable } from '@angular/core';
import { UriConstants } from '@mean/utils';
import { Client, Message, StompSubscription } from '@stomp/stompjs';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private stompClient!: Client;
  private isConnected = false;
  private connectionPromise!: Promise<void>;
  private token: string;

  // URL base y endpoint para SockJS
  private readonly url = `${UriConstants.HOST}/notifications`;

  // Estado de la conexión observable (boolean)
  public notificationsStatus = new BehaviorSubject<boolean>(false);

  constructor(private authService: AuthService) {
    this.token = this.authService.getToken() ?? '';
    this.initializeConnection();
  }

  /**
   * Inicializa STOMP sobre SockJS.
   */
  private initializeConnection(): void {
    this.connectionPromise = new Promise((resolve, reject) => {
      console.debug('[WebSocketService] Conectando a', this.url);
      this.stompClient = new Client({
        webSocketFactory: () => new SockJS(this.url),
        connectHeaders: { Authorization: `Bearer ${this.token}` },
        reconnectDelay: 5000,
        debug: (msg) => console.debug('[STOMP]', msg),

        onConnect: () => {
          console.info('[WebSocketService] Conectado');
          this.isConnected = true;
          this.notificationsStatus.next(true);
          resolve();
        },

        onStompError: (frame) => {
          console.error('[WebSocketService] STOMP Error:', frame);
          this.notificationsStatus.next(false);
          reject(frame);
        },

        onWebSocketClose: (event) => {
          console.warn('[WebSocketService] Cierre WebSocket:', event);
          this.isConnected = false;
          this.notificationsStatus.next(false);
        },
      });

      this.stompClient.activate();
    });
  }

  /**
   * Suscribe al canal de feedback privado del usuario.
   * @returns Promise que resuelve en un Observable de mensajes parseados.
   */
  public subscribeToFeedback<T = any>(): Promise<Observable<T>> {
    return this.connectionPromise.then(() => {
      const subject = new Subject<T>();
      console.debug(
        '[WebSocketService] Suscribiendo a /user/queue/review-feedback'
      );
      this.stompClient.subscribe(
        '/user/queue/review-feedback',
        (msg: Message) => {
          try {
            subject.next(JSON.parse(msg.body) as T);
          } catch (err) {
            console.error('[WebSocketService] Error parseando feedback:', err);
          }
        }
      );
      return subject.asObservable();
    });
  }

  /**
   * Suscribe a un tópico público bajo /topic.
   * @param topic Ruta (sin el prefijo /topic)
   */
  public subscribe<T = any>(topic: string): Promise<Observable<T>> {
    return this.connectionPromise.then(() => {
      const subject = new Subject<T>();
      const dest = `/topic${topic}`;
      console.debug(`[WebSocketService] Suscribiendo a ${dest}`);
      const subscription: StompSubscription = this.stompClient.subscribe(
        dest,
        (msg: Message) => {
          try {
            subject.next(JSON.parse(msg.body) as T);
          } catch (err) {
            console.error('[WebSocketService] Error parseando mensaje:', err);
          }
        }
      );
      subject.subscribe({ complete: () => subscription.unsubscribe() });
      return subject.asObservable();
    });
  }

  /**
   * Publica un mensaje al servidor.
   * @param destination Ruta relativa (con /)
   */
  public send<T>(destination: string, body: T): void {
    if (!this.isConnected) {
      throw new Error('WebSocket no conectado');
    }
    const dest = `/unsismile/api/v1${destination}`;
    console.debug(`[WebSocketService] Publicando en ${dest}`, body);
    this.stompClient.publish({
      destination: dest,
      body: JSON.stringify(body),
      headers: { Authorization: `Bearer ${this.token}` },
    });
  }

  /**
   * Cierra la conexión WebSocket.
   */
  public disconnect(): void {
    if (this.isConnected) {
      console.info('[WebSocketService] Desconectando');
      this.stompClient.deactivate();
      this.isConnected = false;
      this.notificationsStatus.next(false);
    }
  }

  /**
   * Actualiza el token y reconecta.
   */
  public updateToken(newToken: string): void {
    this.token = newToken;
    this.disconnect();
    this.initializeConnection();
  }

  /**
   * Observable del estado de conexión.
   */
  public getConnectionStatus(): Observable<boolean> {
    return this.notificationsStatus.asObservable();
  }
}
