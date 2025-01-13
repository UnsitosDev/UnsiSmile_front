import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AlertModel } from '@mean/models';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-alert',
  template: '', 
  standalone: true
})
export class AlertComponent implements OnChanges {
  @Input() singleMessage: string = '';
  @Input() severity: string = AlertModel.AlertSeverity.ERROR;
  @Input() open = false;
  @Input() life: number = 2000;
  @Input() multipleMessages: { severity: string; summary: string; detail: string; life?: number }[] = [];
  @Output() eventCloseToast = new EventEmitter();

  constructor(private toastr: ToastrService) {}

  ngOnChanges(changes: SimpleChanges): void {
    const openWhenMessageNotChanged = changes['open']?.currentValue && changes['singleMessage'] === undefined;
    const openWhenMessageChanged = changes['open']?.currentValue && 
      (changes['singleMessage']?.currentValue !== changes['singleMessage']?.previousValue);

    if (openWhenMessageChanged || openWhenMessageNotChanged) {
      this.showToast();
    }
  }

  private showToast() {
    if (this.multipleMessages.length > 0) {
      this.multipleMessages.forEach(msg => {
        this.showSingleToast(msg.severity, msg.detail, msg.summary);
      });
    } else {
      this.showSingleToast(this.severity, this.singleMessage);
    }
  }

  private showSingleToast(severity: string, message: string, title?: string) {
    switch (severity) {
      case AlertModel.AlertSeverity.SUCCESS:
        this.toastr.success(message, title || 'Éxito');
        break;
      case AlertModel.AlertSeverity.ERROR:
        this.toastr.error(message, title || 'Error');
        break;
      case AlertModel.AlertSeverity.INFO:
        this.toastr.info(message, title || 'Información');
        break;
      case AlertModel.AlertSeverity.WARN:
        this.toastr.warning(message, title || 'Advertencia');
        break;
    }
    this.eventCloseToast.emit();
  }
}