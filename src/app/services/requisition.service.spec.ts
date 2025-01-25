import { TestBed } from '@angular/core/testing';

import { RequisitionService } from './requisition.service';

describe('RequisitionService', () => {
  let service: RequisitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequisitionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
