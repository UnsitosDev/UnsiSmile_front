import { Injectable } from '@angular/core';
import { Client, Message, StompSubscription } from '@stomp/stompjs';
import { BehaviorSubject, Subject } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { AuthService } from './auth.service';
import { UriConstants } from '@mean/utils';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient!: Client;
  private isConnected = false;
  private connectionPromise!: Promise<void>;
  private token: string;

  // Punto base del host y endpoint STOMP
  private readonly host = 'http://localhost:8082';
  private readonly socketEndpoint = '/unsismile/api/v1/notifications';

  // Estado de la conexión observable
  public notificationsStatus = new BehaviorSubject<boolean>(false);

  constructor(private authService: AuthService) {
    this.token = this.authService.getToken() ?? '';
    this.initializeConnection();
  }

  /**
   * Inicializa la conexión STOMP sobre SockJS con logging y manejo de errores.
   */
  private initializeConnection(): void {
    // Preparar la promesa de conexión
    this.connectionPromise = new Promise((resolve, reject) => {
      const url = `${this.host}${this.socketEndpoint}`;
      console.debug(`[WebSocketService] Inicializando conexión a ${url}`);

      this.stompClient = new Client({
        webSocketFactory: () => new SockJS(url),
        connectHeaders: {
          Authorization: `Bearer ${this.token}`
        },
        reconnectDelay: 5000,
        debug: (msg: string) => console.debug(`[STOMP] ${msg}`),

        onConnect: () => {
          console.info('[WebSocketService] Conexión STOMP establecida');
          this.isConnected = true;
          this.notificationsStatus.next(true);
          resolve();
        },

        onStompError: (frame) => {
          console.error('[WebSocketService] Error STOMP:', frame);
          this.notificationsStatus.next(false);
          reject(frame);
        },

        onWebSocketClose: (evt) => {
          console.warn('[WebSocketService] WebSocket cerrado:', evt);
          this.isConnected = false;
          this.notificationsStatus.next(false);
        }
      });

      // Activar la conexión
      this.stompClient.activate();
    });
  }

  /**
   * Suscribe al estudiante a su cola de feedback privado.
   */
  public subscribeToFeedback(): Subject<Message> {
    const subject = new Subject<Message>();

    this.connectionPromise
      .then(() => {
        console.debug('[WebSocketService] Suscribiéndose a /user/queue/review-feedback');
        this.stompClient.subscribe('/user/queue/review-feedback', (msg) => subject.next(msg));
      })
      .catch((err) => console.error('[WebSocketService] No fue posible suscribirse a feedback:', err));

    return subject;
  }

  /**
   * Suscribe a cualquier tópico público bajo /topic.
   */
  public subscribe(topic: string): Promise<Subject<Message>> {
    return this.connectionPromise.then(() => {
      console.debug(`[WebSocketService] Suscribiéndose a /topic${topic}`);
      const subject = new Subject<Message>();
      const subscription: StompSubscription = this.stompClient.subscribe(`/topic${topic}`, (message) => {
        subject.next(message);
      });

      subject.subscribe({ complete: () => subscription.unsubscribe() });
      return subject;
    }).catch(err => {
      console.error(`[WebSocketService] Error al suscribirse a /topic${topic}:`, err);
      throw err;
    });
  }

  /**
   * Publica un mensaje al servidor con autenticación JWT.
   */
  public send<T>(destination: string, body: T): void {
    if (!this.isConnected) {
      console.error('[WebSocketService] Imposible enviar, WebSocket no está conectado');
      throw new Error('Conexión WebSocket no establecida');
    }

    try {
      console.debug(`[WebSocketService] Publicando en /unsismile${destination}`, body);
      this.stompClient.publish({
        destination: `/unsismile${destination}`,
        body: JSON.stringify(body),
        headers: { Authorization: `Bearer ${this.token}` }
      });
    } catch (err) {
      console.error('[WebSocketService] Error al publicar mensaje:', err);
      throw err;
    }
  }

  /**
   * Cierra la conexión STOMP y actualiza el estado.
   */
  public disconnect(): void {
    if (this.stompClient && this.isConnected) {
      console.info('[WebSocketService] Desconectando WebSocket');
      this.stompClient.deactivate();
      this.isConnected = false;
      this.notificationsStatus.next(false);
    } else {
      console.warn('[WebSocketService] Disconnect llamado sin conexión activa');
    }
  }

  /**
   * Actualiza el token JWT y reinicia la conexión.
   */
  public updateToken(newToken: string): void {
    console.info('[WebSocketService] Actualizando token y reiniciando conexión');
    this.token = newToken;
    this.disconnect();
    this.initializeConnection();
  }
}
