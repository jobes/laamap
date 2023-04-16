import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationWidgetComponent } from './navigation-widget.component';

describe('NavigationWidgetComponent', () => {
  let component: NavigationWidgetComponent;
  let fixture: ComponentFixture<NavigationWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavigationWidgetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
