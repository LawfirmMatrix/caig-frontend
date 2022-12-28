import {Injectable} from '@angular/core';
import {Observable, tap, catchError, throwError, of, switchMap, merge} from 'rxjs';
import {Overlay} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {LoadingOverlayComponent} from '../components/loading-overlay/loading-overlay.component';
import {map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class LoadingService {
  private overlayRef = this.overlay.create();
  private portal = new ComponentPortal(LoadingOverlayComponent);
  public isLoading$ = merge(this.overlayRef.attachments(), this.overlayRef.detachments()).pipe(
    map(() => this.overlayRef.hasAttached()),
  );
  constructor(private overlay: Overlay) { }
  public load<T>(obs$: Observable<T>): Observable<T> {
    return of(null).pipe(
      tap(() => this.attach()),
      switchMap(() => obs$),
      tap(() => this.detach()),
      catchError((err) => {
        this.detach()
        return throwError(err);
      }),
    );
  }
  public attach(): void {
    if (!this.overlayRef.hasAttached()) {
      this.overlayRef.attach(this.portal);
    }
  }
  public detach(): void {
    this.overlayRef.detach();
  }
}
