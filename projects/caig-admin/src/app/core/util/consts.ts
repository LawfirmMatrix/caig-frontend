import {of} from 'rxjs';
import {SidenavComponentMenuItem} from 'sidenav-stack';

export const yesOrNo$ = of([{value: true, name: 'Yes'}, {value: false, name: 'No'}]);

export const saveMenuButton = (callback: () => void, disabled?: boolean): SidenavComponentMenuItem => ({
  name: 'Save',
  color: 'primary',
  callback,
  disabled,
});
