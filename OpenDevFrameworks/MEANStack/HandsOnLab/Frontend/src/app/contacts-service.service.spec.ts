import { TestBed, inject } from '@angular/core/testing';

import { ContactsServiceService } from './contacts-service.service';

describe('ContactsServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContactsServiceService]
    });
  });

  it('should ...', inject([ContactsServiceService], (service: ContactsServiceService) => {
    expect(service).toBeTruthy();
  }));
});
