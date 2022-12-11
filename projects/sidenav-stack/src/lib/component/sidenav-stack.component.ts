import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  OnDestroy,
  ComponentRef,
  ViewContainerRef
} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map, Observable, ReplaySubject, filter, startWith} from 'rxjs';
import {MatSidenav} from '@angular/material/sidenav';
import {
  SidenavStackContent,
  SidenavComponent,
  SidenavComponentMessage,
  SidenavComponentMenuItem, ProcessingMessage, MenuMessage, TitleMessage, CloseMessage
} from '../sidenav-stack.service';
import {trigger, transition, style, animate, state} from '@angular/animations';

@Component({
  selector: 'lib-sidenav-stack',
  templateUrl: './sidenav-stack.component.html',
  styleUrls: ['./sidenav-stack.component.scss'],
  animations: [
    trigger('state', [
      state('void, hidden', style({ opacity: 0 })),
      state('visible', style({ opacity: 1 })),
      transition('* <=> *', animate('300ms ease')),
    ])
  ]
})
export class SidenavStackComponent<T> implements OnInit, OnDestroy {
  @Input() public sidenavClosed!: () => void;
  @Input() public sidenavClosing!: () => void;
  @Input() public sidenavSaved!: (data: T) => void;
  @Input() public title!: string;
  @Input() public content!: SidenavStackContent;

  @ViewChild('container', { read: ElementRef }) public containerEl!: ElementRef;
  @ViewChild('sidenav', { read: ElementRef }) public sidenavEl!: ElementRef;
  @ViewChild(MatSidenav, { static: true }) public sidenav!: MatSidenav;
  @ViewChild('content', { read: ViewContainerRef }) public contentView!: ViewContainerRef;

  private controller$ = new ReplaySubject<SidenavComponentMessage>();

  public contentRef: ComponentRef<SidenavComponent> | undefined;
  public sidenavWidth$ = this.bp.observe(Breakpoints.Handset).pipe(
    map(({matches}) => matches ? 100 : 75)
  );
  public title$!: Observable<string>;
  public menu$: Observable<SidenavComponentMenuItem[]> = this.controller$.pipe(
    filter((msg): msg is MenuMessage => msg instanceof MenuMessage),
    map((msg) => msg.menu),
  );
  public isProcessing$: Observable<boolean> = this.controller$.pipe(
    filter((msg): msg is ProcessingMessage => msg instanceof ProcessingMessage),
    map((msg) => msg.isProcessing),
  );

  constructor(private bp: BreakpointObserver) { }

  public ngOnInit(): void {
    setTimeout(() => this.sidenav.open('program'));

    this.title$ = this.controller$.pipe(
      filter((msg): msg is TitleMessage => msg instanceof TitleMessage),
      map((msg) => msg.title),
      startWith(this.title),
    );

    this.controller$.pipe(
      filter((msg): msg is CloseMessage<T> => msg instanceof CloseMessage),
      map((msg) => msg.saveResult),
    )
      .subscribe((data) => {
        this.sidenavSaved(data);
        this.close();
      });
  }

  public ngOnDestroy() {
    this.contentRef?.destroy();
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

  public createContent(): void {
    this.contentRef = this.contentView.createComponent(this.content.component);
    Object.assign(this.contentRef.instance, this.content.locals);
    this.contentRef.instance.controlMsg
      .subscribe((msg) => this.controller$.next(msg));
  }
}
