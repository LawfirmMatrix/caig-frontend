import {Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs';
import {MatSidenav} from '@angular/material/sidenav';

@Component({
  selector: 'lib-sidenav-stack',
  templateUrl: './sidenav-stack.component.html',
  styleUrls: ['./sidenav-stack.component.scss']
})
export class SidenavStackComponent<T> implements OnInit {
  @Input() public sidenavClosed!: () => void;
  @Input() public sidenavClosing!: () => void;
  @Input() public sidenavSaved!: (data: T) => void;

  @ViewChild('container', { read: ElementRef }) public containerEl!: ElementRef;
  @ViewChild('sidenav', { read: ElementRef }) public sidenavEl!: ElementRef;
  @ViewChild(MatSidenav, { static: true }) public sidenav!: MatSidenav;

  public isHandset$ = this.bp.observe(Breakpoints.Handset).pipe(map(({matches}) => matches));

  constructor(private bp: BreakpointObserver) { }

  public ngOnInit(): void {
    setTimeout(() => this.sidenav.open('program'));
  }

  public open(): void {
    this.containerEl.nativeElement.style.transform = 'translateX(0)';
  }

  public close(): void {
    this.containerEl.nativeElement.style.transform = 'translateX(0)';
    this.sidenav.close();
  }

  public defer(): void {
    const width = this.sidenavEl.nativeElement.offsetWidth;
    this.containerEl.nativeElement.style.transform = 'translateX(-' + width + 'px)';
  }

  // public save(sidenav: MatSidenav): void {
  //   sidenav.close();
  //   this.sidenavSaved([] as any);
  // }

  public createContent(): void {
    console.log('create component');
  }
}
