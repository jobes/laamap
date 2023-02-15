import { APP_BASE_HREF } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { PushModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

import { OpenAipService } from '../../../services/open-aip/open-aip.service';
import { OnMapAirportComponent } from './on-map-airport.component';

describe('OnMapAirportComponent', () => {
  let component: OnMapAirportComponent;
  let fixture: ComponentFixture<OnMapAirportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OnMapAirportComponent],
      providers: [
        {
          provide: OpenAipService,
          useValue: { getAirports$: () => of({}) },
        },
        { provide: MatDialog, useValue: {} },
        { provide: APP_BASE_HREF, useValue: '/' },
        provideMockStore({}),
      ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [PushModule],
    }).compileComponents();

    fixture = TestBed.createComponent(OnMapAirportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
