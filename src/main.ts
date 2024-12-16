import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import routes from './app/app.routing.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthInterceptor } from './app/core';
import { LoadingInterceptor } from './app/services/loadingInterceptor.service';


bootstrapApplication(
  AppComponent,
  {providers:[
    importProvidersFrom(BrowserModule),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi(), withInterceptors([AuthInterceptor, LoadingInterceptor])),
    provideRouter(routes), provideAnimationsAsync(), provideAnimationsAsync('noop'),
  ]},
  )
  .catch(err => console.error(err));
