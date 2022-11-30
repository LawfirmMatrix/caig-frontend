import {Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs';

@Component({
  selector: 'lib-sidenav-stack',
  templateUrl: './sidenav-stack.component.html',
  styleUrls: ['./sidenav-stack.component.scss']
})
export class SidenavStackComponent<T> implements OnInit {
  @Input() public sidenavClosed!: () => void;
  @Input() public sidenavClosing!: () => void;
  @Input() public sidenavSaved!: (data: T) => void;

  @ViewChild('container', { read: ElementRef }) public container!: ElementRef;
  @ViewChild('sidenav', { read: ElementRef }) public sidenav!: ElementRef;

  public opened = false;
  public isHandset$ = this.bp.observe(Breakpoints.Handset).pipe(map(({matches}) => matches));

  constructor(private bp: BreakpointObserver) { }

  ngOnInit(): void {
    setTimeout(() => this.opened = true);
  }

  public open(): void {
    this.opened = true;
    this.container.nativeElement.style.transform = 'translateX(0)';
  }

  public defer(): void {
    const width = this.sidenav.nativeElement.offsetWidth;
    this.container.nativeElement.style.transform = 'translateX(-' + width + 'px)';
  }

  // public save(sidenav: MatSidenav): void {
  //   sidenav.close();
  //   this.sidenavSaved([] as any);
  // }

  public createContent(): void {
    console.log('create component');
  }
}
