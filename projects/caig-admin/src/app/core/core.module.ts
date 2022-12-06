import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {SettlementIdInterceptor} from './services/settlement-id.interceptor';
import {DecryptionInterceptor} from './services/decryption.interceptor';
import {AssignUserComponent} from './components/assign-user/assign-user.component';
import {DynamicFormModule} from 'dynamic-form';
import {HttpUrlGenerator} from '@ngrx/data';
import {StoreUrlGenerator} from './services/store-url-generator';
import {ThemeSwitcherComponent} from './components/theme-switcher/theme-switcher.component';
import {NavigationComponent} from './components/navigation/navigation.component';
import {CoreMaterialModule} from './core-material.module';
import {RouterModule} from '@angular/router';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {coreReducer} from './store/reducers';
import {CoreEffects} from './store/effects/core.effects';
import {UserMenuComponent} from './components/user-menu/user-menu.component';
import {FileUploadModule} from 'file-upload';
import {AttachFilesComponent} from './components/attach-files/attach-files.component';
import {VsTableModule} from 'vs-table';
import {ViewAttachedFilesComponent} from './components/view-attached-files/view-attached-files.component';
import {AddEventComponent} from './components/add-event/add-event.component';
import {HomeComponent} from './components/home/home.component';
import {EnumsModule} from '../enums/enums.module';
import {ChangePasswordComponent} from './components/change-password/change-password.component';
import {PasswordRequirementsComponent} from './components/change-password/password-requirements.component';
import {SharedModule} from '../modules/shared/shared.module';
import {TokenInterceptor} from '../auth/services/interceptors/token.interceptor';
import {NavMenuService} from './components/navigation/nav-menu.service';
import {usersReducer} from '../modules/users/store/reducers';
import {UserEffects} from '../modules/users/store/effects/user.effects';
import {TimePipe} from './pipes/time.pipe';
import {WhatsNewComponent} from './components/whats-new/whats-new.component';
import {UpdateTimerComponent} from './components/update-timer/update-timer.component';
import {SharedComponentsModule} from 'shared-components';
import {PortalSelectionComponent} from './components/portal-selection/portal-selection.component';
import {LoadingOverlayComponent} from './components/loading-overlay/loading-overlay.component';
import {FormDialogComponent} from './components/form-dialog/form-dialog.component';
import {OfflineStatusComponent} from './components/offline-status/offline-status.component';

@NgModule({
  imports: [
    SharedModule,
    CoreMaterialModule,
    RouterModule,
    DynamicFormModule,
    FileUploadModule,
    VsTableModule,
    EnumsModule,
    StoreModule.forFeature('core', coreReducer),
    EffectsModule.forFeature([CoreEffects]),
    StoreModule.forFeature('users', usersReducer),
    EffectsModule.forFeature([UserEffects]),
    SharedComponentsModule,
  ],
  declarations: [
    AssignUserComponent,
    ThemeSwitcherComponent,
    NavigationComponent,
    UserMenuComponent,
    AttachFilesComponent,
    ViewAttachedFilesComponent,
    AddEventComponent,
    HomeComponent,
    ChangePasswordComponent,
    PasswordRequirementsComponent,
    TimePipe,
    WhatsNewComponent,
    UpdateTimerComponent,
    PortalSelectionComponent,
    LoadingOverlayComponent,
    FormDialogComponent,
    OfflineStatusComponent,
  ],
  exports: [OfflineStatusComponent],
  providers: [ NavMenuService ],
})
export class CoreModule {
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: SettlementIdInterceptor,
          multi: true,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: DecryptionInterceptor,
          multi: true,
        },
        {
          provide: HttpUrlGenerator,
          useClass: StoreUrlGenerator,
        }
      ],
    }
  }
  constructor(@Optional() @SkipSelf() parentModule?: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule has already been loaded. Import this module in the AppModule only.');
    }
  }
}
