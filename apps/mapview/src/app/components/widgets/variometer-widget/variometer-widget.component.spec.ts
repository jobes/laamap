import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariometerWidgetComponent } from './variometer-widget.component';

describe('VariometerWidgetComponent', () => {
  let component: VariometerWidgetComponent;
  let fixture: ComponentFixture<VariometerWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VariometerWidgetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VariometerWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
