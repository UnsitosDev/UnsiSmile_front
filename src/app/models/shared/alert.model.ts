export namespace AlertModel {
  export interface ToastConfig {
    enableHtml: boolean;
    timeOut: number;
    progressBar: boolean;
    closeButton: boolean;
    positionClass: string;
  }

  export class AlertaClass {
    open: boolean;
    singleMessage: string;
    severity: string;
    icon?: string;

    constructor(
      openp: boolean,
      singleMessagep: string,
      severityp = AlertSeverity.ERROR,
      iconp?: string
    ) {
      this.open = openp;
      this.singleMessage = singleMessagep;
      this.severity = severityp;
      this.icon = iconp;
    }

    // Método para obtener el mensaje formateado con icono
    getFormattedMessage(): string {
      return this.icon 
        ? `<i class="fas ${this.icon}"></i> ${this.singleMessage}`
        : this.singleMessage;
    }

    // Método para obtener el título según la severidad
    getAlertTitle(): string {
      switch (this.severity) {
        case AlertSeverity.SUCCESS:
          return AlertMessage.SUCCESS;
        case AlertSeverity.ERROR:
          return AlertMessage.ERROR;
        case AlertSeverity.INFO:
          return AlertMessage.INFO;
        case AlertSeverity.WARN:
          return AlertMessage.WARN;
        default:
          return '';
      }
    }

    // Método para mostrar el toast
    showToast(toastr: any, config?: Partial<ToastConfig>): void {
      const defaultConfig: ToastConfig = {
        enableHtml: true,
        timeOut: 3000,
        progressBar: true,
        closeButton: true,
        positionClass: 'toast-top-right'
      };

      const finalConfig = { ...defaultConfig, ...config };
      const message = this.getFormattedMessage();
      const title = this.getAlertTitle();

      switch (this.severity) {
        case AlertSeverity.SUCCESS:
          toastr.success(message, title, finalConfig);
          break;
        case AlertSeverity.ERROR:
          toastr.error(message, title, finalConfig);
          break;
        case AlertSeverity.INFO:
          toastr.info(message, title, finalConfig);
          break;
        case AlertSeverity.WARN:
          toastr.warning(message, title, finalConfig);
          break;
      }
    }
  }

  export enum AlertSeverity {
    ERROR = 'error',
    SUCCESS = 'success',
    INFO = 'info',
    WARN = 'warn'
  }

  export enum AlertMessage {
    ERROR = 'Error',
    SUCCESS = 'Éxito',
    INFO = 'Información',
    WARN = 'Advertencia'
  }

  export enum AlertType {
    TOAST = 'TOAST'
  }

  export enum AlertIcon {
    EMAIL = 'fa-envelope',
    PASSWORD = 'fa-key',
    USER = 'fa-user',
    SUCCESS = 'fa-check-circle',
    ERROR = 'fa-exclamation-circle',
    INFO = 'fa-info-circle',
    WARNING = 'fa-exclamation-triangle'
  }
}