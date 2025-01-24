import { TestBed } from '@angular/core/testing';

import { HemocentroService } from './hemocentro.service';

describe('HemocentroService', () => {
  let service: HemocentroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HemocentroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
