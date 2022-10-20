import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

@Injectable({providedIn: 'root'})
export class MultipleLocationsGuard implements CanActivate {
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // @TODO:
    // Return true if survey has multiple locations
    // Otherwise redirect to only survey location at /survey/:id
    console.log('Multiple Locations', route.paramMap);
    return true;
  }
}
