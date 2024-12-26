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
    constructor(
      openp: boolean, singleMessagep: string,
      severityp = AlertSeverity.ERROR
    ) {
      this.open = openp;
      this.singleMessage = singleMessagep;
      this.severity = severityp;
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

}
