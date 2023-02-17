import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { RainViewerService } from './rain-viewer.service';

describe('RainViewerService', () => {
  let service: RainViewerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({})],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(RainViewerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
