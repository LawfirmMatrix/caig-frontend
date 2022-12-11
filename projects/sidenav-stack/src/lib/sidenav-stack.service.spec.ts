import { TestBed } from '@angular/core/testing';

import { SidenavStackService } from './sidenav-stack.service';

describe('SidenavStackService', () => {
  let service: SidenavStackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidenavStackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
