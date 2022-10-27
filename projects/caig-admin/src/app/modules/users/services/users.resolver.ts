import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {first, tap} from 'rxjs/operators';
import {UserEntityService} from './user-entity.service';

@Injectable()
export class UsersResolver implements Resolve<any> {
  constructor(private userService: UserEntityService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.userService.loaded$
      .pipe(
        first(),
        tap((loaded) => {
          if (!loaded) {
            this.userService.getAll();
          }
        })
      );
  }
}
