import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VsTreeViewerComponent } from './vs-tree-viewer.component';

describe('VsTreeViewerComponent', () => {
  let component: VsTreeViewerComponent<any>;
  let fixture: ComponentFixture<VsTreeViewerComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VsTreeViewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VsTreeViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
