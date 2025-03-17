import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { OpenAipService } from './open-aip.service';

describe('OpenAipService', () => {
  let service: OpenAipService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: APP_BASE_HREF, useValue: 'assetsUrl' }],
    });
    service = TestBed.inject(OpenAipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
