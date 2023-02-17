import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import maplibregl from 'maplibre-gl';

import { getTranslocoModule } from '../../shared/transloco-testing.module';
import { MapService } from './map.service';

describe('MapService', () => {
  let service: MapService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [getTranslocoModule(), MatDialogModule],
    });
    const mockMapOn = jest.fn();
    jest
      .spyOn(maplibregl, 'Map')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .mockImplementation(() => {
        return {
          on: mockMapOn,
        };
      });

    service = TestBed.inject(MapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
