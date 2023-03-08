import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedWidgetSettingsComponent } from './speed-widget-settings.component';

describe('SpeedWidgetSettingsComponent', () => {
  let component: SpeedWidgetSettingsComponent;
  let fixture: ComponentFixture<SpeedWidgetSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpeedWidgetSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpeedWidgetSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
