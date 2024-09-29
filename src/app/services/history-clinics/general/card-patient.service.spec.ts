import { TestBed } from '@angular/core/testing';

import { CardPatientService } from './card-patient.service';

describe('CardPatientService', () => {
  let service: CardPatientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardPatientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
