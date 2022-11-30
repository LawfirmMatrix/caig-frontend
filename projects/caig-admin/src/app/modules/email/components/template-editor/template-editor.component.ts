import {Component, Output, EventEmitter, OnInit} from '@angular/core';
import {SidenavComponent, SidenavComponentMessage} from 'sidenav-stack';

@Component({
  selector: 'app-template-editor',
  templateUrl: './template-editor.component.html',
  styleUrls: ['./template-editor.component.scss']
})
export class TemplateEditorComponent implements SidenavComponent, OnInit {
  @Output() public controlMsg = new EventEmitter<SidenavComponentMessage>();

  constructor() {
  }

  ngOnInit() {
    console.log(this);
  }
}
