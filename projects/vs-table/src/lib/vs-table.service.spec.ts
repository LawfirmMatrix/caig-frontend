import { TestBed } from '@angular/core/testing';

import { VsTableService } from './vs-table.service';

describe('VsTableService', () => {
  let service: VsTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VsTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
