import {of} from 'rxjs';

export const yesOrNo$ = of([{value: true, name: 'Yes'}, {value: false, name: 'No'}]);
