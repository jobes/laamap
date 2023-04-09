import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { TrackingWidgetSettingsComponent } from './tracking-widget-settings.component';

describe('TrackingWidgetSettingsComponent', () => {
  let component: TrackingWidgetSettingsComponent;
  let fixture: ComponentFixture<TrackingWidgetSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrackingWidgetSettingsComponent],
      providers: [provideMockStore({})],
    }).compileComponents();

    fixture = TestBed.createComponent(TrackingWidgetSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
