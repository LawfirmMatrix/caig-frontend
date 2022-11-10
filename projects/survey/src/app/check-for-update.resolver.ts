import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {ServiceWorkerService} from "./service-worker.service";

@Injectable({providedIn: 'root'})
export class CheckForUpdateResolver implements Resolve<any> {
  constructor(private swService: ServiceWorkerService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.swService.initialize();
  }
}
