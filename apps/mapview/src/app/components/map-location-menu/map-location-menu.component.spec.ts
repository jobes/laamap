import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { provideMockStore } from '@ngrx/store/testing';

import { MapHelperFunctionsService } from '../../services/map-helper-functions/map-helper-functions.service';
import { getTranslocoModule } from '../../transloco-testing.module';
import { MapLocationMenuComponent } from './map-location-menu.component';

describe('MapLocationMenuComponent', () => {
  let component: MapLocationMenuComponent;
  let fixture: ComponentFixture<MapLocationMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, MatListModule, getTranslocoModule()],
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
      declarations: [MapLocationMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MapLocationMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
