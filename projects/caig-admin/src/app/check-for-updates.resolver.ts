import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {ServiceWorkerService} from './core/services/service-worker.service';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class CheckForUpdatesResolver implements Resolve<any> {
  constructor(private swService: ServiceWorkerService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.swService.initialize();
  }
}
