import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavStackComponent } from './sidenav-stack.component';

describe('SidenavStackComponent', () => {
  let component: SidenavStackComponent<any>;
  let fixture: ComponentFixture<SidenavStackComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidenavStackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidenavStackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
