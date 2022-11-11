import { TestBed } from '@angular/core/testing';

import { SurveyDataService } from './survey-data.service';

describe('SurveyService', () => {
  let service: SurveyDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SurveyDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
