import {NgModule} from '@angular/core';
import {ConfigurationsMaterialModule} from './configurations-material.module';
import {ConfigurationsRoutingModule} from './configurations-routing.module';
import {SharedModule} from '../shared/shared.module';
import {ConfigListComponent} from './components/config-list/config-list.component';
import {CustomSettingsComponent} from './components/custom-settings/custom-settings.component';
import {ConfigurationsComponent} from './components/configurations/configurations.component';

@NgModule({
  imports: [
    ConfigurationsMaterialModule,
    ConfigurationsRoutingModule,
    SharedModule,
  ],
  declarations: [
    ConfigurationsComponent,
    ConfigListComponent,
    CustomSettingsComponent,
  ],
})
export class ConfigurationsModule { }
