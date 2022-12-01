import {Injectable} from '@angular/core';
import {Observable, tap, catchError, throwError} from 'rxjs';
import {Overlay} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {LoadingOverlayComponent} from '../components/loading-overlay/loading-overlay.component';

@Injectable({providedIn: 'root'})
export class LoadingService {
  private overlayRef = this.overlay.create();
  private portal = new ComponentPortal(LoadingOverlayComponent);
  constructor(private overlay: Overlay) { }
  public load<T>(obs$: Observable<T>): Observable<T> {
    this.attach();
    return obs$.pipe(
      tap(() => this.detach()),
      catchError((err) => {
        this.detach()
        return throwError(err);
      })
    )
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
