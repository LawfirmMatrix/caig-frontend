import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {SettlementEntityService} from './settlement-entity.service';
import {switchMap, map} from 'rxjs/operators';
import {Settlement} from '../../../models/settlement.model';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class SingleSettlementResolver implements Resolve<Settlement | undefined> {
  constructor(private dataService: SettlementEntityService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Settlement | undefined> {
    const settlementId = route.params['id'];
    return this.dataService.loaded$.pipe(
      switchMap((loaded) => {
        if (loaded) {
          return this.dataService.entityMap$.pipe(
            map((em) => em[settlementId])
          );
        }
        return this.dataService.getByKey(settlementId);
      })
    )
  }
}
