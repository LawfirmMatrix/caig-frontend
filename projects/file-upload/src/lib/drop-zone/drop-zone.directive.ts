import {Directive, HostListener, Output, EventEmitter, ElementRef, OnInit, Renderer2} from '@angular/core';

@Directive({
  selector: '[dropZone]',
})
export class DropZoneDirective implements OnInit {
  @Output() public dropped = new EventEmitter<FileList>();
  @Output() public hovered = new EventEmitter<boolean>();
  @HostListener('drop', ['$event'])
  public onDrop($event: any) {
    $event.preventDefault();
    this.dropped.emit($event.dataTransfer.files);
    this.hovered.emit(false);
    this.renderer.setStyle(this.elRef.nativeElement, 'border', '2px dashed #f16624');
  }
  @HostListener('dragover', ['$event'])
  public onDragOver($event: any) {
    $event.preventDefault();
    this.hovered.emit(true);
    this.renderer.setStyle(this.elRef.nativeElement, 'border', '3px solid #f16624');
  }
  @HostListener('dragleave', ['$event'])
  public onDragLeave($event: any) {
    $event.preventDefault();
    this.hovered.emit(false);
    this.renderer.setStyle(this.elRef.nativeElement, 'border', '2px dashed #f16624');
  }
  constructor(private elRef: ElementRef, private renderer: Renderer2) { }
  public ngOnInit() {
    this.renderer.addClass(this.elRef.nativeElement, 'drop-zone');
    this.renderer.setStyle(this.elRef.nativeElement, 'font-weight', 200);
    this.renderer.setStyle(this.elRef.nativeElement, 'border', '2px dashed #f16624');
    this.renderer.setStyle(this.elRef.nativeElement, 'border-radius', '5px');
    this.renderer.setStyle(this.elRef.nativeElement, 'background', 'rgba(100,100,100,0.3)');
  }
}
