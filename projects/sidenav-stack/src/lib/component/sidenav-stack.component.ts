import {Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';

@Component({
  selector: 'lib-sidenav-stack',
  templateUrl: './sidenav-stack.component.html',
  styleUrls: ['./sidenav-stack.component.scss']
})
export class SidenavStackComponent<T> implements OnInit {
  @Input() public sidenavClosing!: () => void;
  @Input() public sidenavClosed!: () => void;
  @Input() public sidenavSaved!: (data: T) => void;

  @ViewChild('background', { read: ElementRef }) public background!: ElementRef;
  @ViewChild('aside', { read: ElementRef }) public aside!: ElementRef;

  public opened = true;

  constructor() { }

  ngOnInit(): void {
    // setTimeout(() => this.opened = true);
  }

  public defer(): void {
    const width = this.aside.nativeElement.offsetWidth;
    this.background.nativeElement.style.transform = 'translateX(-' + width + 'px)';
  }
}
