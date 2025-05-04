import { Injectable, OnDestroy } from '@angular/core';
import { UriConstants } from '@mean/utils';
import { Client, StompSubscription } from '@stomp/stompjs';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import * as SockJS from 'sockjs-client';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService implements OnDestroy {
  private stompClient!: Client;
  private isConnected = false;
  private connectionPromise!: Promise<void>;
  private token: string;

  // Mapa para almacenar los Subjects por tópico
  private topicSubjects = new Map<string, Subject<any>>();
  // Contador de referencias por tópico
  private topicRefCount = new Map<string, number>();
  // Mapa para almacenar las suscripciones STOMP por tópico
  private stompSubscriptions = new Map<string, StompSubscription>();

  // URL base y endpoint para SockJS
  private readonly url = `${UriConstants.HOST}/notifications`;

  // Estado de la conexión observable (boolean)
  public notificationsStatus = new BehaviorSubject<boolean>(false);

  constructor(private authService: AuthService) {
    this.token = this.authService.getToken() ?? '';
  }

  /**
   * Inicializa la conexión si aún no se ha establecido
   */
  private initializeConnection(): void {
    if (this.stompClient && this.stompClient.connected) {
      return;
    }

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
   * Registra un componente (o cliente) para un tópico específico.
   * Incrementa el contador de referencias y si es la primera vez, suscribe el cliente STOMP.
   * Devuelve un Observable compartido para ese tópico.
   */
  public register<T = any>(topic: string): Observable<T> {
    // Se inicializa la conexión bajo demanda
    if (!this.stompClient || !this.stompClient.connected) {
      this.initializeConnection();
    }

    // Si no existe un Subject para el tópico, se crea y se suscribe al STOMP una vez conectado.
    if (!this.topicSubjects.has(topic)) {
      this.topicSubjects.set(topic, new Subject<T>());
      this.topicRefCount.set(topic, 0);

      this.connectionPromise.then(() => {
        const subscription = this.stompClient.subscribe(topic, (message) => {
          try {
            const parsedMessage = JSON.parse(message.body);
            this.topicSubjects.get(topic)!.next(parsedMessage);
          } catch (error) {
            this.topicSubjects.get(topic)!.error(error);
          }
        });
        this.stompSubscriptions.set(topic, subscription);
      });
    }

    // Incrementa el contador del tópico
    const count = this.topicRefCount.get(topic) || 0;
    this.topicRefCount.set(topic, count + 1);

    // Devuelve el Observable y, al finalizar la suscripción, se reduce el contador; 
    // si no quedan suscriptores, se limpia la suscripción STOMP y el Subject.
    return this.topicSubjects.get(topic)!.asObservable().pipe(
      finalize(() => {
        let currentCount = this.topicRefCount.get(topic) || 0;
        currentCount--;
        if (currentCount <= 0) {
          // Cancelar la suscripción STOMP y limpiar el Subject
          if (this.stompSubscriptions.has(topic)) {
            this.stompSubscriptions.get(topic)!.unsubscribe();
            this.stompSubscriptions.delete(topic);
          }
          this.topicRefCount.delete(topic);
          this.topicSubjects.get(topic)!.complete();
          this.topicSubjects.delete(topic);
        } else {
          this.topicRefCount.set(topic, currentCount);
        }
      })
    );
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
   * Desconecta el cliente STOMP y actualiza el estado.
   */
  public disconnect(): void {
    if (this.stompClient && this.stompClient.connected) {
      console.info('[WebSocketService] Desconectando');
      this.stompClient.deactivate();
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

  ngOnDestroy(): void {
    // Limpieza de todos los Subjects y suscripciones STOMP
    this.topicSubjects.forEach((subject) => subject.complete());
    this.topicSubjects.clear();
    this.topicRefCount.clear();
    this.stompSubscriptions.forEach((sub) => sub.unsubscribe());
    this.stompSubscriptions.clear();

    // Desconecta el cliente STOMP
    this.disconnect();
  }
}
