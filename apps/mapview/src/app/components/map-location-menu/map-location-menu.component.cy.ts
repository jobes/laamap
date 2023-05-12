import { TestBed } from '@angular/core/testing';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { provideMockStore } from '@ngrx/store/testing';

import { MapHelperFunctionsService } from '../../services/map-helper-functions/map-helper-functions.service';
import { MapLocationMenuComponent } from './map-location-menu.component';

describe(MapLocationMenuComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(MapLocationMenuComponent, {
      add: {
        imports: [],
        providers: [
          { provide: MatBottomSheetRef, useValue: {} },
          {
            provide: MAT_BOTTOM_SHEET_DATA,
            useValue: {
              lngLat: {
                lat: 0,
                lng: 0,
              },
            },
          },
          { provide: MapHelperFunctionsService, useValue: {} },
          provideMockStore({}),
        ],
      },
    });
  });

  it('renders', () => {
    cy.mount(MapLocationMenuComponent);
  });
});
