import { Component } from '@angular/core';
import { ApiService } from 'src/app/shared/services';
import { AlertModel, ApiModel } from 'src/app/shared/models';
import { lastValueFrom } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { UriConstants } from '@mean/utils';
interface KeyParams {
  [key: string]: any;
}

@Component({
  template: '',
  standalone: true
})
export class BaseComponent<
  GET = {},
  POST = {},
  PUT = {},
  PATCH = {},
  DELETE = {}
> {
  /** Parámetros del servicio  */
  private paramsValue: KeyParams = {};
  params = {
    get: this.paramsValue,
    post: this.paramsValue,
  };
  loading = false;
  alertConfig = new AlertModel.AlertaClass(
    false,
    'Ha ocurrido un error',
    AlertModel.AlertSeverity.ERROR
  );

  alertDuration = 2000; // Duración por defecto de 2 segundos

  public formGroup: FormGroup = new FormGroup({});
  host = UriConstants.HOST;

  constructor(
    protected readonly apiService: ApiService<GET, POST, PUT, PATCH, DELETE>
  ) {}

  public getService(payload: ApiModel.ReqParams) {
    this.loading = true;
    const params = {
      url: payload.url,
      data: payload.data ? payload.data : {},
    };
    return this.apiService.getService(params);
  }

  public create(payload: ApiModel.ReqParams) {
    return this.createService(payload).subscribe({
      next: () => {
        this.openAlert();
      },

      error: (err) => {
        this.alertConfiguration('ERROR', err);
        this.openAlert();
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  public createService(payload: ApiModel.ReqParams) {
    this.loading = true;
    const params = {
      url: payload.url,
      data: payload.data,
      params: payload.params,
    };
    return this.apiService.postService(params);
  }

  public read(payload: ApiModel.ReqParams) {
    return this.getService(payload).subscribe({
      next: () => {},
      error: () => {
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  public delete(payload: ApiModel.ReqParams) {
    this.loading = true;
    const params = {
      url: payload.url,
      data: payload.data ? payload.data : {},
    };

    return this.apiService.deleteService(params).subscribe({
      next: () => {
        this.openAlert();
      },
      error: (err) => {
        this.alertConfiguration('ERROR', err);
        this.openAlert();
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  public async searchAsync(payload: ApiModel.ReqParams) {
    const request = {
      params: payload.params,
      url: payload.url,
    };
    return lastValueFrom(this.apiService.getService(request));
  }

  public async searchArrAsync(payload: ApiModel.ReqParams) {
    const request = {
      params: payload.params,
      url: payload.url,
    };
    return lastValueFrom(this.apiService.getListService(request));
  }

  public alertConfiguration(severity: 'ERROR' | 'SUCCESS', msg: string) {
    this.alertConfig.severity = AlertModel.AlertSeverity[severity];
    this.alertConfig.singleMessage = msg;
  }

  public openAlert(duration: number = this.alertDuration) {
    this.alertConfig.open = true;
    setTimeout(() => {
      this.closeAlert();
    }, duration);
  }

  public closeAlert() {
    this.alertConfig.open = false;
  }

  resetForm() {
    this.formGroup.reset();
  }

  isFormValid(): boolean {
    if (this.formGroup.invalid) {
      for (const control in this.formGroup.controls) {
        this.formGroup.controls[control].markAsDirty();
        this.formGroup.controls[control].markAsTouched();
      }
      return false;
    }
    return true;
  }

  trackByFn(index: number) {
    return index;
  }
}
