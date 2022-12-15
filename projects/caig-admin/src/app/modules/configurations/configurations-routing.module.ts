import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ConfigListComponent} from './components/config-list/config-list.component';
import {CustomSettingsComponent} from './components/custom-settings/custom-settings.component';
import {ConfigurationsComponent} from './components/configurations/configurations.component';

export const configsList: Routes = [
  {
    path: 'custom-settings',
    component: CustomSettingsComponent,
    data: { animation: 'custom-settings', disabled: true },
  },
  {
    path: 'employee-statuses',
    component: CustomSettingsComponent,
    data: { animation: 'employee-statuses', disabled: true },
  },
  {
    path: 'employee-tags',
    component: CustomSettingsComponent,
    data: { animation: 'employee-tags', disabled: true },
  },
  {
    path: 'event-groups',
    component: CustomSettingsComponent,
    data: { animation: 'event-groups', disabled: true },
  },
  {
    path: 'event-types',
    component: CustomSettingsComponent,
    data: { animation: 'event-types', disabled: true },
  },
  {
    path: 'state-rates',
    component: CustomSettingsComponent,
    data: { animation: 'state-rates', disabled: true },
  },
  {
    path: 'fed-rates',
    component: CustomSettingsComponent,
    data: { animation: 'fed-rates', disabled: true },
  },
  {
    path: 'confirmation-methods',
    component: CustomSettingsComponent,
    data: { animation: 'confirmation-methods', disabled: true },
  },
  {
    path: 'surveys',
    component: CustomSettingsComponent,
    data: { animation: 'surveys', disabled: true },
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
