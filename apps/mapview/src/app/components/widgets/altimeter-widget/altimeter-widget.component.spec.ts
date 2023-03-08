import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltimeterWidgetComponent } from './altimeter-widget.component';

describe('AltimeterWidgetComponent', () => {
  let component: AltimeterWidgetComponent;
  let fixture: ComponentFixture<AltimeterWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AltimeterWidgetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AltimeterWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
