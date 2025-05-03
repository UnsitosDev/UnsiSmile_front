import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app/app.component';
import routes from './app/app.routing.routes';
import { AuthInterceptor } from './app/core';
import { LoadingInterceptor } from './app/core/interceptors/loading.interceptor';
import { RefreshTokenInterceptor } from './app/core/interceptors/refresh-token.interceptor';

bootstrapApplication(
  AppComponent,
  {providers:[
    importProvidersFrom(BrowserModule, ToastrModule.forRoot({
      timeOut: 3000,
      progressBar: true,
      closeButton: true,
      positionClass: 'toast-top-right',
      preventDuplicates: false,    // permitir duplicados
      enableHtml: true,
      tapToDismiss: true,
      maxOpened: 0,        // sin límite de notificaciones
      autoDismiss: false,  // No cerrar automáticamente cuando se abre una nueva
      newestOnTop: false,  // Las nuevas aparecerán abajo
      messageClass: 'toast-message',
      easing: 'ease-in',
      easeTime: 300 // tiempo de animación
    })),  
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi(), withInterceptors([AuthInterceptor, LoadingInterceptor, RefreshTokenInterceptor])),
    provideRouter(routes), provideAnimationsAsync(), provideAnimationsAsync('noop'),
  ]},
)
.catch(err => console.error(err));
