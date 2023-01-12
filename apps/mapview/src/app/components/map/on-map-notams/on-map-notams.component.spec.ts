import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapService } from '@maplibre/ngx-maplibre-gl';
import { NotamsService } from '../../../services/notams/notams.service';

import { OnMapNotamsComponent } from './on-map-notams.component';

describe('OnMapNotamsComponent', () => {
  let component: OnMapNotamsComponent;
  let fixture: ComponentFixture<OnMapNotamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OnMapNotamsComponent],
      providers: [
        {
          provide: NotamsService,
          useValue: {},
        },
        {
          provide: MapService,
          useValue: {},
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(OnMapNotamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
