import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MapService } from '@maplibre/ngx-maplibre-gl';
import { provideMockStore } from '@ngrx/store/testing';

import { NotamsService } from '../../../services/notams/notams.service';
import { getTranslocoModule } from '../../../shared/transloco-testing.module';
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
        { provide: MatDialog, useValue: {} },
        provideMockStore({}),
      ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MatSnackBarModule, getTranslocoModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(OnMapNotamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
