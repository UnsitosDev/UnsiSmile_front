export namespace AlertModel {
  /**
    @param open: boolean;
    @param singleMessage: string;
    @param severity: string;
  */
  export class AlertaClass {
    open: boolean;
    singleMessage: string;
    severity: string;
    icon?: string;
    constructor(
      openp: boolean, singleMessagep: string,
      severityp = AlertSeverity.ERROR,
      iconp?: string
    ) {
      this.open = openp;
      this.singleMessage = singleMessagep;
      this.severity = severityp;
      this.icon = iconp;
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
