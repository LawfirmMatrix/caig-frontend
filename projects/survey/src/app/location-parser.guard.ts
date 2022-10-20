import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

@Injectable({providedIn: 'root'})
export class LocationParserGuard implements CanActivate {
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // @TODO:
    // Always return false and redirect
    // Check surveys for matching location found in route param
    // Redirect to found survey at /survey/:id
    // Otherwise redirect to /locations


    console.log('Location Parser', route.paramMap);
    return true;
  }
}
