import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'location'})
export class LocationPipe implements PipeTransform {
  transform(location: string | undefined, parse: 'city' | 'state'): any {
    if (!location) {
      return '';
    }
    const split = location.split(',');
    return parse === 'city' ? split[0] : split[1];
  }
}
