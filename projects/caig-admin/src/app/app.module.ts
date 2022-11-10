import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {AppRoutingModule, loginRoute} from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {HttpClientModule} from '@angular/common/http';
import {AuthModule} from './auth/auth.module';
import {reducers, metaReducers} from './store/reducers';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {EntityDataModule} from '@ngrx/data';
import {MsalModule} from '@azure/msal-angular';
import {QuillModule} from 'ngx-quill';
import {msalClient, guardConfig, interceptorConfig} from './msal.config';
import {NotificationsModule} from 'notifications';
import {CoreModule} from './core/core.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

const entityDispatcherOptions = {
  optimisticDelete: false,
  optimisticAdd: false,
  optimisticSaveEntities: false,
  optimisticUpdate: false,
  optimisticUpsert: false,
};

const runtimeChecks = {
  strictStateImmutability: true,
  strictActionImmutability: true,
  strictActionSerializability: false, // @TODO - set to false so that ngrx effects restart on error
  strictStateSerializability: true,
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    CoreModule.forRoot(),
    NotificationsModule.forRoot(),
    AuthModule.forRoot(loginRoute),
    StoreModule.forRoot(reducers, { metaReducers, runtimeChecks }),
    EffectsModule.forRoot([]),
    EntityDataModule.forRoot({
      entityMetadata: {
        Employee: { entityDispatcherOptions, sortComparer: (a, b) => a.id - b.id },
        User: { entityDispatcherOptions, sortComparer: (a, b) => a.username - b.username },
        Survey: { entityDispatcherOptions, sortComparer: (a, b) => a.name - b.name },
        Respondent: { entityDispatcherOptions, sortComparer: (a, b) => a.name - b.name },
      }
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerImmediately'
    }),
    MsalModule.forRoot(msalClient, guardConfig, interceptorConfig),
    QuillModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
