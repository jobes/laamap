import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingWidgetComponent } from './tracking-widget.component';

describe('TrackingWidgetComponent', () => {
  let component: TrackingWidgetComponent;
  let fixture: ComponentFixture<TrackingWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrackingWidgetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TrackingWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
