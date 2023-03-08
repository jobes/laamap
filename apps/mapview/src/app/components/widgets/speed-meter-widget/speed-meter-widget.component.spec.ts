import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedMeterWidgetComponent } from './speed-meter-widget.component';

describe('SpeedMeterWidgetComponent', () => {
  let component: SpeedMeterWidgetComponent;
  let fixture: ComponentFixture<SpeedMeterWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpeedMeterWidgetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpeedMeterWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
