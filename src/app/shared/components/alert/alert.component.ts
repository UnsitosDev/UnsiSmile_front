import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { AlertModel } from '@mean/models';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { StyleClass } from 'primeng/styleclass';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {ToastModule} from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  providers: [MessageService],
  standalone: true,
  imports: [
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    MessagesModule,
    DialogModule,
    AlertComponent
]
  
})
export class AlertComponent implements OnChanges {
  @Input() singleMessage: string = '';
  @Input() severity: string = AlertModel.AlertSeverity.ERROR;
  @Input() open = false;
  @Input() life: number = 2000; // Duración por defecto de 5 segundos
  @Input() multipleMessages: { severity: string; summary: string; detail: string; life?: number }[] = [];
  @Output() eventCloseToast = new EventEmitter();
  constructor(
    private messageService: MessageService,
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    const openWhenMessageNotChanged = changes['open']?.currentValue && changes['singleMessage'] === undefined;
    const openWhenMessageChanged = changes['open']?.currentValue && (changes['singleMessage']?.currentValue !== changes['singleMessage']?.previousValue);
    if (openWhenMessageChanged  || openWhenMessageNotChanged) {
      this.openToast();
    }
  }

  private getIconForSeverity(severity: string): string {
    switch (severity) {
      case AlertModel.AlertSeverity.SUCCESS:
        return 'pi pi-check-circle';
      case AlertModel.AlertSeverity.ERROR:
        return 'pi pi-info-circle';
      case AlertModel.AlertSeverity.INFO:
        return 'pi pi-info-circle';
      case AlertModel.AlertSeverity.WARN:
        return 'pi pi-exclamation-triangle';
      default:
        return 'pi pi-info-circle';
    }
  }

  private getSummaryForSeverity(severity: string): string {
    switch (severity) {
      case AlertModel.AlertSeverity.SUCCESS:
        return AlertModel.AlertMessage.SUCCESS;
      case AlertModel.AlertSeverity.ERROR:
        return AlertModel.AlertMessage.ERROR;
      case AlertModel.AlertSeverity.INFO:
        return AlertModel.AlertMessage.INFO;
      case AlertModel.AlertSeverity.WARN:
        return AlertModel.AlertMessage.WARN;
      default:
        return AlertModel.AlertMessage.INFO;
    }
  }

  private openToast() {
    if (this.multipleMessages.length > 0) {
      this.multipleMessages.forEach(msg => {
        this.messageService.add({
          key: 'mainToast',
          severity: msg.severity,
          summary: msg.summary || this.getSummaryForSeverity(msg.severity),
          detail: msg.detail,
          life: msg.life || this.life,
          styleClass: 'p-toast-enter',
          icon: this.getIconForSeverity(msg.severity)
        });
      });
    } else {
      this.messageService.add({
        key: 'mainToast',
        severity: this.severity,
        summary: this.getSummaryForSeverity(this.severity),
        detail: this.singleMessage,
        life: this.life,
        styleClass: 'p-toast-enter',
        icon: this.getIconForSeverity(this.severity)
      });
    }
  }

  @HostListener('mouseover')
  onMouseOver() {
    const toastElement = document.querySelector('.p-toast-message');
    if (toastElement) {
      toastElement.classList.add('p-toast-leave');
    }
  }

}