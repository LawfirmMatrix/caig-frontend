import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ConfigListComponent} from './components/config-list/config-list.component';
import {CustomSettingsComponent} from './components/custom-settings/custom-settings.component';
import {ConfigurationsComponent} from './components/configurations/configurations.component';

export const configsList: Routes = [
  {
    path: 'custom-settings',
    component: CustomSettingsComponent,
    data: { disabled: true },
  },
  {
    path: 'employee-statuses',
    component: CustomSettingsComponent,
    data: { disabled: true },
  },
  {
    path: 'employee-tags',
    component: CustomSettingsComponent,
    data: { disabled: true },
  },
  {
    path: 'event-groups',
    component: CustomSettingsComponent,
    data: { disabled: true },
  },
  {
    path: 'event-types',
    component: CustomSettingsComponent,
    data: { disabled: true },
  },
  {
    path: 'state-rates',
    component: CustomSettingsComponent,
    data: { disabled: true },
  },
  {
    path: 'fed-rates',
    component: CustomSettingsComponent,
    data: { disabled: true },
  },
  {
    path: 'confirmation-methods',
    component: CustomSettingsComponent,
    data: { disabled: true },
  },
  {
    path: 'surveys',
    component: CustomSettingsComponent,
    data: { disabled: true },
  },
];

const routes: Routes = [
  {
    path: '',
    component: ConfigurationsComponent,
    children: [
      { path: '', component: ConfigListComponent },
      ...configsList,
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationsRoutingModule { }
