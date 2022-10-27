import {animate, animateChild, group, query, style, transition, trigger} from '@angular/animations';

const options = {optional: true};

export const fader =
  trigger('routeAnimations', [
    transition('* <=> *', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: 1,
        })
      ], options),
      query(':enter', [style({ opacity: 0 })], options),
      query(':leave', animateChild(), options),
      group([
        query(':leave', [
          animate('300ms ease-out', style({ opacity: 0 }))
        ], options),
        query(':enter', [
          animate('300ms ease-out', style({ opacity: 1 }))
        ], options)
      ]),
      query(':enter', animateChild(), options),
    ]),
  ]);
