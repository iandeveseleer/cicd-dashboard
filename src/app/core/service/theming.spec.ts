import {TestBed} from '@angular/core/testing';

import {ThemingService} from './theming';

describe('Theming', () => {
  let service: ThemingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
