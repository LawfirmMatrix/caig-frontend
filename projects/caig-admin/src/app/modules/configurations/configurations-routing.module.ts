import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ConfigListComponent} from './components/config-list/config-list.component';
import {CustomSettingsComponent} from './components/custom-settings/custom-settings.component';

export const configsList: Routes = [
  {
    path: 'custom-settings',
    component: CustomSettingsComponent,
    data: { animation: 'custom-settings' },
  },
  {
    path: 'employee-statuses',
    component: CustomSettingsComponent,
    data: { animation: 'employee-statuses' },
  },
  {
    path: 'employee-tags',
    component: CustomSettingsComponent,
    data: { animation: 'employee-tags' },
  },
  {
    path: 'event-groups',
    component: CustomSettingsComponent,
    data: { animation: 'event-groups' },
  },
  {
    path: 'event-types',
    component: CustomSettingsComponent,
    data: { animation: 'event-types' },
  },
  {
    path: 'state-rates',
    component: CustomSettingsComponent,
    data: { animation: 'state-rates' },
  },
  {
    path: 'fed-rates',
    component: CustomSettingsComponent,
    data: { animation: 'fed-rates' },
  },
  {
    path: 'confirmation-methods',
    component: CustomSettingsComponent,
    data: { animation: 'confirmation-methods' },
  },
  {
    path: 'surveys',
    component: CustomSettingsComponent,
    data: { animation: 'surveys' },
  },
];

const routes: Routes = [
  { path: '', component: ConfigListComponent },
  ...configsList,
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationsRoutingModule { }
