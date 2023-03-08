import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

import { MapService } from '../../../services/map/map.service';
import { SpeedMeterWidgetComponent } from './speed-meter-widget.component';

describe('SpeedMeterWidgetComponent', () => {
  let component: SpeedMeterWidgetComponent;
  let fixture: ComponentFixture<SpeedMeterWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpeedMeterWidgetComponent],
      providers: [
        provideMockStore({}),
        { provide: MapService, useValue: { geolocation$: of(null) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SpeedMeterWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
