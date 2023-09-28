import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {BaseComponent} from './shared/base/base.component'
import { HttpClientModule } from '@angular/common/http';
import { SharedHeaderModule, SharedFooterModule, SharedAlertModule } from '@mean/shared';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BaseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    SharedHeaderModule, 
    SharedFooterModule,
    SharedAlertModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
