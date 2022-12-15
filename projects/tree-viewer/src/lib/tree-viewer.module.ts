import { NgModule } from '@angular/core';
import {TreeViewerComponent} from './components/tree-viewer/tree-viewer.component';
import {TreeViewerNodeComponent} from './components/tree-viewer-node/tree-viewer-node.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CommonModule} from '@angular/common';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {VisibleMenuPipe} from './pipes/visible-menu.pipe';
import {PipesModule} from 'pipes';

@NgModule({
  declarations: [
    TreeViewerComponent,
    TreeViewerNodeComponent,
    VisibleMenuPipe,
  ],
  imports: [
    FlexLayoutModule,
    CommonModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    PipesModule
  ],
  exports: [
    TreeViewerComponent
  ]
})
export class TreeViewerModule { }
