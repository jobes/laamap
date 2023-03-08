import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltitudeWidgetSettingsComponent } from './altitude-widget-settings.component';

describe('AltitudeWidgetSettingsComponent', () => {
  let component: AltitudeWidgetSettingsComponent;
  let fixture: ComponentFixture<AltitudeWidgetSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AltitudeWidgetSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AltitudeWidgetSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
