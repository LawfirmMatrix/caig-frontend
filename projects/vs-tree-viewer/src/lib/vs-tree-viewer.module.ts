import { NgModule } from '@angular/core';
import { VsTreeViewerComponent } from './components/vs-tree-viewer/vs-tree-viewer.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import {PipesModule} from 'pipes';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [
    VsTreeViewerComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ScrollingModule,
    MatButtonModule,
    MatIconModule,
    PipesModule,
  ],
  exports: [
    VsTreeViewerComponent,
  ]
})
export class VsTreeViewerModule { }
