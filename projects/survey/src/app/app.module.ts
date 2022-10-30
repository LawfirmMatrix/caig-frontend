import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {AppMaterialModule} from './app-material.module';
import {NotificationsModule} from 'notifications';
import {MockApiModule} from 'mock-api';
import {mockApiServices} from './mock-api';
import {HttpClientModule} from '@angular/common/http';
import {SurveyModule} from './survey/survey.module';
import {CoreModule} from './core/core.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerImmediately'
    }),
    NotificationsModule.forRoot(),
    MockApiModule.forRoot(mockApiServices),
    HttpClientModule,
    SurveyModule,
    CoreModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
