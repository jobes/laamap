import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VarioWidgetSettingsComponent } from './vario-widget-settings.component';

describe('VarioWidgetSettingsComponent', () => {
  let component: VarioWidgetSettingsComponent;
  let fixture: ComponentFixture<VarioWidgetSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VarioWidgetSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VarioWidgetSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
