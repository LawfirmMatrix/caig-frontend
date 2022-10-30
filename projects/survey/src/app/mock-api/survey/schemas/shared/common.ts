import {of} from 'rxjs';

const yesOrNo = [{key: true, value: 'Yes'}, {key: false, value: 'No'}];

export const yesOrNo$ = of(yesOrNo);

export const uncertain = {key: '0', value: 'Uncertain'};

export const startBeforeDate$ = of([...yesOrNo, uncertain]);
