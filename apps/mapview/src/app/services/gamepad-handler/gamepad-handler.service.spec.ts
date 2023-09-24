import { TestBed } from '@angular/core/testing';

import { GamepadHandlerService } from './gamepad-handler.service';

describe('GamepadHandlerService', () => {
  let service: GamepadHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GamepadHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
