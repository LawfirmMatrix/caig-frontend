import {Injectable, ComponentRef, ApplicationRef, createComponent, EmbeddedViewRef} from '@angular/core';
import {Observable} from 'rxjs';
import {SidenavStackComponent} from './component/sidenav-stack.component';

@Injectable()
export class SidenavStackService {
  private sidenavs: ComponentRef<SidenavStackComponent<any>>[] = [];

  constructor(private appRef: ApplicationRef) { }

  public open<T>(config: SidenavStackSettings<T>): Observable<T | void> {
    console.log(config);

    const sidenavRef: ComponentRef<SidenavStackComponent<T>> =
      createComponent(SidenavStackComponent, {environmentInjector: this.appRef.injector});

    const sidenav$ = new Observable<T | void>((subscriber) => {
      sidenavRef.instance.sidenavClosing = () => {
        sidenavRef.destroy();
        subscriber.error();
      };
      sidenavRef.instance.sidenavClosed = () => this.popSidenav();
      sidenavRef.instance.sidenavSaved = (data) => {
        subscriber.next(data);
        subscriber.complete();
      };
    });

    this.pushSidenav(sidenavRef);

    return sidenav$;
  }

  private popSidenav(): void {
    this.sidenavs.pop();
    if (this.sidenavs.length) {
      this.sidenavs[this.sidenavs.length - 1].instance.opened = true;
    }
  }

  private pushSidenav(sidenavRef: ComponentRef<SidenavStackComponent<any>>): void {
    if (this.sidenavs.length) {
      this.sidenavs[this.sidenavs.length - 1].instance.defer();
    }
    this.sidenavs.push(sidenavRef);
    console.log(this.sidenavs);
  }
}

export interface SidenavStackSettings<T> {

}
