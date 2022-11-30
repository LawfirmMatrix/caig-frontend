import {Injectable, ComponentRef} from '@angular/core';
import {Observable, noop} from 'rxjs';
import {SidenavStackComponent} from './component/sidenav-stack.component';
import {Overlay} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';

@Injectable()
export class SidenavStackService {
  private sidenavs: ComponentRef<SidenavStackComponent<any>>[] = [];

  constructor(private overlay: Overlay) { }

  public open<T>(config: SidenavStackSettings<T>): Observable<T | void> {
    const overlayRef = this.overlay.create({width: '100%', height: '100%'});
    const portal = new ComponentPortal(SidenavStackComponent<T>);
    const sidenavRef = overlayRef.attach(portal);

    sidenavRef.instance.sidenavClosing = () => this.popSidenav();
    sidenavRef.instance.sidenavClosed = () => {
      sidenavRef.destroy();
      overlayRef.detach();
    };
    sidenavRef.instance.sidenavSaved = noop;

    const sidenav$ = new Observable<T | void>((subscriber) => {
      sidenavRef.instance.sidenavClosed = () => {
        sidenavRef.destroy();
        overlayRef.detach();
        subscriber.error();
      };
      sidenavRef.instance.sidenavSaved = (data) => {
        subscriber.next(data);
        subscriber.complete();
      };
    });

    this.pushSidenav(sidenavRef);

    return sidenav$;
  }

  public closeLast(): void {
    if (this.sidenavs.length) {
      this.sidenavs[this.sidenavs.length - 1].instance.close();
    }
  }

  public closeAll(): void {
    this.sidenavs = this.sidenavs.reverse();
    this.sidenavs.forEach((sidenavRef) => sidenavRef.instance.close());
  }

  private popSidenav(): void {
    this.sidenavs.pop();
    if (this.sidenavs.length) {
      this.sidenavs[this.sidenavs.length - 1].instance.open();
    }
  }

  private pushSidenav(sidenavRef: ComponentRef<SidenavStackComponent<any>>): void {
    if (this.sidenavs.length) {
      this.sidenavs[this.sidenavs.length - 1].instance.defer();
    }
    this.sidenavs.push(sidenavRef);
  }
}

export interface SidenavStackSettings<T> {

}
