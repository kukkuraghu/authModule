/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AuthServices } from './auth-services.service';

describe('AuthServicesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthServices]
    });
  });

  it('should ...', inject([AuthServices], (service: AuthServices) => {
    expect(service).toBeTruthy();
  }));
});
