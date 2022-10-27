import {NgModule} from '@angular/core';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {enumsReducer} from './store/reducers';
import {EnumsEffects} from './store/effects/enums.effects';
import {EnumsService} from './service/enums.service';

@NgModule({
  imports: [
    StoreModule.forFeature('enums', enumsReducer),
    EffectsModule.forFeature([EnumsEffects]),
  ],
  providers: [ EnumsService ],
})
export class EnumsModule { }
