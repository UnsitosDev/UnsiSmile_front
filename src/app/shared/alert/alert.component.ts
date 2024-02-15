import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { AlertModel } from '@mean/models';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {ToastModule} from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
  providers: [MessageService],
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
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

  private openToast() {
      this.messageService.add(
        {
          severity: this.severity,
          summary: this.severity === AlertModel.AlertSeverity.ERROR ? AlertModel.AlertMessage.ERROR :  AlertModel.AlertMessage.SUCCESS,
          detail: this.singleMessage
        }
      );
  }

}