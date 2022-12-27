import { APP_BASE_HREF } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { PushModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { OpenAipService } from '../../../services/open-aip/open-aip.service';

import { OnMapAirSpacesComponent } from './on-map-air-spaces.component';

describe('OnMapAirSpacesComponent', () => {
  let component: OnMapAirSpacesComponent;
  let fixture: ComponentFixture<OnMapAirSpacesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OnMapAirSpacesComponent],
      providers: [
        {
          provide: OpenAipService,
          useValue: { getAirSPaces$: () => of({}) },
        },
        { provide: MatDialog, useValue: {} },
        { provide: APP_BASE_HREF, useValue: '/' },
        provideMockStore({}),
      ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [PushModule],
    }).compileComponents();

    fixture = TestBed.createComponent(OnMapAirSpacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
